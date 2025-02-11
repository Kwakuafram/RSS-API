require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Parser = require('rss-parser');
const admin = require('firebase-admin');
const cron = require('node-cron');
const crypto = require('crypto');
const winston = require('winston');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const db = admin.firestore();

const app = express();
const port = process.env.PORT || 5000;
const parser = new Parser();

// Define multiple RSS feed URLs
const FEED_URLS = [
    'https://sputnikglobe.com/export/rss2/archive/index.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://netflixtechblog.com/feed',
];

// Configure Winston logger
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'errors.log' }),
        new winston.transports.Console(),
    ],
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Helper function to generate unique keys for articles
const getUniqueKey = (title, link) =>
    crypto.createHash('md5').update(title + link).digest('hex');

// ***************************************
// Rule-Based Keyword Matching for Categorization
// ***************************************

// Define keywords for each category
const categoryKeywords = require('./categoryKeywords');


// Function to categorize article content using keyword matching.
// This returns the actual category name (as a string) that will be stored in Firestore.
function categorizeArticleRuleBased(content) {
    const lowerContent = content.toLowerCase();
    let maxScore = 0;
    let assignedCategory = "Other";
    
    // Iterate over each category
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      let score = 0;
      keywords.forEach(keyword => {
        if (lowerContent.includes(keyword.toLowerCase())) {
          score++;
        }
      });
      if (score > maxScore) {
        maxScore = score;
        assignedCategory = category;
      }
    }
    return assignedCategory;
  }
  

// ***************************************
// API Routes
// ***************************************

// API Route: Fetch Multiple RSS Feeds, Categorize, and Store in Firebase
app.get('/fetch-rss', async (req, res) => {
    try {
        const feedPromises = FEED_URLS.map((url) =>
            parser.parseURL(url).catch((err) => {
                // Log specific feed error and continue
                logger.error(`Failed to fetch RSS feed from ${url}: ${err.message}`);
                return null; // Return null for failed feeds
            })
        );

        const feeds = (await Promise.all(feedPromises)).filter((feed) => feed !== null);
        const batch = db.batch();
        const collectionRef = db.collection('rss_articles');

        feeds.forEach((feed) => {
            feed.items.forEach((item) => {
                // Use the best available content for categorization (fallback to title)
                const contentForCategorization = item.contentSnippet || item.content || item.title;
                const category = categorizeArticleRuleBased(contentForCategorization);
                const uniqueKey = getUniqueKey(item.title, item.link);
                const docRef = collectionRef.doc(uniqueKey); // Use unique key as document ID

                // The document now includes a "category" field with the actual category name.
                batch.set(
                    docRef,
                    {
                        title: item.title,
                        link: item.link,
                        pubDate: item.pubDate,
                        source: feed.title,
                        category: category,  // Category column storing the actual category name
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true } // Avoid overwriting existing documents
                );
            });
        });

        await batch.commit();
        res.json({ message: 'RSS Feed Data stored successfully with categories!' });
    } catch (error) {
        logger.error(`Error in /fetch-rss route: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch and store RSS feeds' });
    }
});

// API Route: Retrieve Stored Data
app.get('/articles', async (req, res) => {
    try {
        const snapshot = await db.collection('rss_articles').orderBy('createdAt', 'desc').get();
        const articles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.json(articles);
    } catch (error) {
        logger.error(`Error in /articles route: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve articles', details: error.message });
    }
});

app.get('/articles/technology', async (req, res) => {
    try {
      const snapshot = await db.collection('rss_articles')
        .where('category', '==', 'World')
        .orderBy('createdAt', 'desc')
        .get();
      
      const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(articles);
    } catch (error) {
      logger.error(`Error retrieving technology articles: ${error.message}`);
      res.status(500).json({ error: 'Failed to retrieve technology articles', details: error.message });
    }
  });
  

// ***************************************
// Scheduled Task: Fetch RSS Feeds Every Hour
// ***************************************

cron.schedule('0 * * * *', async () => {
    try {
        console.log('Starting scheduled RSS feed fetch...');
        const feedPromises = FEED_URLS.map((url) =>
            parser.parseURL(url).catch((err) => {
                logger.error(`Failed to fetch RSS feed from ${url}: ${err.message}`);
                return null;
            })
        );

        const feeds = (await Promise.all(feedPromises)).filter((feed) => feed !== null);
        const batch = db.batch();
        const collectionRef = db.collection('rss_articles');

        feeds.forEach((feed) => {
            feed.items.forEach((item) => {
                const contentForCategorization = item.contentSnippet || item.content || item.title;
                const category = categorizeArticleRuleBased(contentForCategorization);
                const uniqueKey = getUniqueKey(item.title, item.link);
                const docRef = collectionRef.doc(uniqueKey); // Use unique key as document ID

                batch.set(
                    docRef,
                    {
                        title: item.title,
                        link: item.link,
                        pubDate: item.pubDate,
                        source: feed.title,
                        category: category,  // Category field with the actual category name
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                );
            });
        });

        await batch.commit();
        console.log('Scheduled RSS feed data fetched and stored successfully!');
    } catch (error) {
        logger.error(`Scheduled fetch error: ${error.message}`);
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
