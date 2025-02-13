const crypto = require('crypto');

function generateKey(title, link) {
  return crypto.createHash('sha256').update(title + link).digest('hex');
}

module.exports = generateKey;
