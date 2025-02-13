const categoryKeywords = require('../categoryKeywords');

function categorizeArticleRuleBased(content) {
  const lowerContent = content.toLowerCase();
  let maxScore = 0;
  let assignedCategory = "Other";

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

module.exports = categorizeArticleRuleBased;
