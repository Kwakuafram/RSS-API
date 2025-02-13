const Parser = require('rss-parser');
const { db, admin } = require('../config/firebase');
const logger = require('../config/logger');
const getUniqueKey = require('../utils/generateKey');
const categorizeArticleRuleBased = require('../utils/categorize');

const parser = new Parser();
const FEED_URLS = [
    'https://sputnikglobe.com/export/rss2/archive/index.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://netflixtechblog.com/feed',
];

async function fetchAndStoreFeeds() {
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
                    category,
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
        return { message: 'RSS Feed Data stored successfully with categories in subcollections!' };
    } catch (error) {
        logger.error(`Error in fetchAndStoreFeeds: ${error.message}`);
        throw new Error('Failed to fetch and store RSS feeds');
    }
}

async function getAllArticles() {
    try {
        const snapshot = await db.collectionGroup('articles').orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        logger.error(`Error in getAllArticles: ${error.message}`);
        throw new Error('Failed to retrieve articles');
    }
}

async function getArticlesByCategory(category) {
    try {
        category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        const snapshot = await db.collection('rss_articles').doc(category).collection('articles')
            .orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        logger.error(`Error retrieving articles for category ${category}: ${error.message}`);
        throw new Error('Failed to retrieve articles');
    }
}

module.exports = { fetchAndStoreFeeds, getAllArticles, getArticlesByCategory };
