 RSS Feed API with AI Categorization

This project is a Node.js API that fetches articles from multiple RSS feeds, categorizes them using AI (via the OpenAI API), and stores the categorized articles in Firebase Firestore. It also provides RESTful endpoints to retrieve articles, including dynamic endpoints by category, and includes scheduled tasks to update the data periodically.

 Features

- Multi-Source RSS Feed Aggregation:  
  Fetches articles from several RSS feeds (configurable via Firestore or fallback defaults).

- AI-Based Article Categorization:  
  Uses OpenAI's GPT model to categorize articles into one of the predefined categories: World, Business, Technology, Entertainment, Sports, Science, and Health.

- Secure & Modular Configuration:  
  Loads sensitive credentials (e.g., Firebase service account and OpenAI API key) from environment variables.

- Firestore Integration with Batch Processing:  
  Stores articles in Firestore with batch chunking to handle Firestore’s 500-operation limit.

- Scheduled Updates:  
  Uses `node-cron` to periodically fetch new RSS feed data and update Firestore.

- Dynamic API Endpoints:  
  Provides endpoints to retrieve all articles or filter them by category.

- Enhanced Logging & Error Handling:  
  Implements Winston for logging and differentiates between transient and permanent errors.

 Prerequisites

- Node.js (v14 or later recommended)
- Firebase Project with Firestore enabled
- OpenAI API Key

 Installation

1. Clone the Repository:

   ```bash
   git clone https://github.com/Kwakuafram/RSS-API.git
   cd rss-feed-api


