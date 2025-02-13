const express = require('express');
const { fetchAndStoreFeeds, getAllArticles, getArticlesByCategory } = require('../services/rssService');

const router = express.Router();

router.get('/fetch-rss', async (req, res) => {
    try {
        const result = await fetchAndStoreFeeds();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/articles', async (req, res) => {
    try {
        const articles = await getAllArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/articles/:category', async (req, res) => {
    try {
        const articles = await getArticlesByCategory(req.params.category);
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
