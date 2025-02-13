const express = require('express');
const { signUp, login } = require('../services/authService');

const router = express.Router();

// Signup Endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await signUp(email, password);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await login(email, password);
    res.json(data);
  } catch (error) {
    console.error('Login error details:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
