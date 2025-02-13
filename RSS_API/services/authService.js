const { admin } = require('../config/firebase');
const axios = require('axios');
require('dotenv').config();

const firebaseApiKey = process.env.FIREBASE_API_KEY;

async function signUp(email, password) {
  const userRecord = await admin.auth().createUser({ email, password });
  const customToken = await admin.auth().createCustomToken(userRecord.uid);
  return { uid: userRecord.uid, customToken };
}

async function login(email, password) {
  // Use Firebase Identity Toolkit REST API to sign in.
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;
  const response = await axios.post(url, {
    email,
    password,
    returnSecureToken: true,
  });
  return response.data;
}

module.exports = { signUp, login };
