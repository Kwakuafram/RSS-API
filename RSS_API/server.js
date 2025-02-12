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

// Helper function to generate unique keys using SHA-256
const getUniqueKey = (title, link) =>
    crypto.createHash('sha256').update(title + link).digest('hex');

// ***************************************
// Rule-Based Keyword Matching for Categorization
// ***************************************

// Import keywords from a separate file
const categoryKeywords = require('./categoryKeywords');

// Function to categorize article content using keyword matching.
// Returns a string (e.g., "World", "Business", etc.).
function categorizeArticleRuleBased(content) {
    const lowerContent = content.toLowerCase();
    let maxScore = 0;
    let assignedCategory = "Other";
    
    // Iterate over each category in the imported keyword list
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

// Route: Fetch RSS Feeds, categorize each article, and store them by category.
// Each article is stored under: rss_articles/{Category}/articles/{uniqueKey}
app.get('/fetch-rss', async (req, res) => {
    try {
        const feedPromises = FEED_URLS.map(url =>
            parser.parseURL(url).catch(err => {
                logger.error(`Failed to fetch RSS feed from ${url}: ${err.message}`);
                return null;
            })
        );
        const feeds = (await Promise.all(feedPromises)).filter(feed => feed !== null);
        
        let batch = db.batch();
        let operationCount = 0;
        const MAX_BATCH_SIZE = 500;
        
        feeds.forEach(feed => {
            feed.items.forEach(item => {
                // Use available content (or fallback to title) for categorization
                const contentForCategorization = item.contentSnippet || item.content || item.title;
                const category = categorizeArticleRuleBased(contentForCategorization);
                const uniqueKey = getUniqueKey(item.title, item.link);
                // Save into a subcollection: rss_articles/{category}/articles
                const collectionRef = db.collection('rss_articles').doc(category).collection('articles');
                const docRef = collectionRef.doc(uniqueKey);
                batch.set(docRef, {
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    source: feed.title,
                    category: category,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                }, { merge: true });
                operationCount++;
                if (operationCount >= MAX_BATCH_SIZE) {
                    batch.commit();
                    batch = db.batch();
                    operationCount = 0;
                }
            });
        });
        if (operationCount > 0) {
            await batch.commit();
        }
        res.json({ message: 'RSS Feed Data stored successfully with categories in subcollections!' });
    } catch (error) {
        logger.error(`Error in /fetch-rss route: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch and store RSS feeds' });
    }
});

// Route: Retrieve all articles across categories using a collection group query.
app.get('/articles', async (req, res) => {
    try {
        const snapshot = await db.collectionGroup('articles').orderBy('createdAt', 'desc').get();
        const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(articles);
    } catch (error) {
        logger.error(`Error in /articles route: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve articles', details: error.message });
    }
});

// Route: Retrieve articles for a specific category.
// Example: GET /articles/Technology retrieves articles from rss_articles/Technology/articles
app.get('/articles/:category', async (req, res) => {
    try {
        let { category } = req.params;
        category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        const snapshot = await db.collection('rss_articles').doc(category).collection('articles')
            .orderBy('createdAt', 'desc').get();
        const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(articles);
    } catch (error) {
        logger.error(`Error retrieving articles for category ${req.params.category}: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve articles', details: error.message });
    }
});

// ***************************************
// Scheduled Task: Fetch RSS Feeds Every Hour
// ***************************************
cron.schedule('0 * * * *', async () => {
    try {
        console.log('Starting scheduled RSS feed fetch...');
        const feedPromises = FEED_URLS.map(url =>
            parser.parseURL(url).catch(err => {
                logger.error(`Failed to fetch RSS feed from ${url}: ${err.message}`);
                return null;
            })
        );
        const feeds = (await Promise.all(feedPromises)).filter(feed => feed !== null);
        
        let batch = db.batch();
        let operationCount = 0;
        const MAX_BATCH_SIZE = 500;
        
        feeds.forEach(feed => {
            feed.items.forEach(item => {
                const contentForCategorization = item.contentSnippet || item.content || item.title;
                const category = categorizeArticleRuleBased(contentForCategorization);
                const uniqueKey = getUniqueKey(item.title, item.link);
                const collectionRef = db.collection('rss_articles').doc(category).collection('articles');
                const docRef = collectionRef.doc(uniqueKey);
                batch.set(docRef, {
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    source: feed.title,
                    category: category,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                }, { merge: true });
                operationCount++;
                if (operationCount >= MAX_BATCH_SIZE) {
                    batch.commit();
                    batch = db.batch();
                    operationCount = 0;
                }
            });
        });
        if (operationCount > 0) {
            await batch.commit();
        }
        console.log('Scheduled RSS feed data fetched and stored successfully!');
    } catch (error) {
        logger.error(`Scheduled fetch error: ${error.message}`);
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
