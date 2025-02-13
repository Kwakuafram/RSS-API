require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');
const rssRoutes = require('./route/rssRoute');
const authRoute = require('./route/authRoute');
const { fetchAndStoreFeeds } = require('./services/rssService');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', rssRoutes);
app.use('/auth', authRoute);



cron.schedule('0 * * * *', async () => {
    console.log('Starting scheduled RSS feed fetch...');
    await fetchAndStoreFeeds();
    console.log('Scheduled RSS feed fetch complete.');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
