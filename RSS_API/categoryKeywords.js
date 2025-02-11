// categoryKeywords.js

const categoryKeywords = {
    World: [
      "world", "global", "international", "diplomacy", "united", "nations", "geopolitics", "conflict", "war", "peace",
      "summit", "treaty", "alliance", "UN", "NATO", "border", "refugee", "immigration", "election", "government",
      "policy", "regime", "sovereignty", "negotiation", "globalism", "cooperation", "humanitarian", "crisis", "intervention", "dialogue",
      "arms", "sanction", "trade", "multinational", "resolution", "war crimes", "peacekeeping", "conflict resolution", "insurgency", "revolution",
      "protest", "demonstration", "insurgent", "extremism", "terrorism", "peace talks", "mediator", "ceasefire", "international law", "global policy",
      "security", "cross-border", "bilateral", "multilateral", "foreign policy", "world leaders", "head of state", "diplomatic", "minister", "embassy",
      "consulate", "alliance building", "foreign aid", "defense", "military", "treaty negotiation", "border dispute", "armistice", "geopolitical", "global governance",
      "regional cooperation", "international relations", "global crisis", "global security", "political unrest", "regime change", "leadership", "electoral", "international conference", "world order",
      "international dispute", "global trade", "economic sanctions", "foreign minister", "cross-cultural", "intergovernmental", "intercontinental", "global network", "transnational", "international cooperation",
      "global summit", "world forum", "political summit", "international summit", "strategic alliance", "diplomatic mission", "international mediation", "foreign relations", "global partnership", "international community"
    ],
    Business: [
      "market", "stocks", "economy", "business", "finance", "investment", "corporate", "entrepreneurship", "trade", "commerce",
      "industry", "startup", "venture", "capital", "revenue", "profit", "loss", "merger", "acquisition", "dividend",
      "share", "portfolio", "banking", "credit", "debt", "equity", "asset", "liability", "fiscal", "budget",
      "earnings", "growth", "innovation", "market share", "supply chain", "logistics", "production", "manufacturing", "retail", "wholesale",
      "consumer", "advertisement", "marketing", "sales", "strategy", "competition", "globalization", "export", "import", "e-commerce",
      "digital", "consulting", "management", "leadership", "negotiation", "pricing", "partnership", "scalability", "business plan", "forecasting",
      "analytics", "outsourcing", "supply", "demand", "profitability", "fiscal policy", "regulation", "compliance", "risk", "insurance",
      "venture capital", "angel investor", "private equity", "sustainability", "innovation management", "economic growth", "industrial", "commodity", "futures", "bonds",
      "trade deficit", "trade surplus", "market trend", "consumer behavior", "brand", "advertising", "public relations", "stakeholder", "shareholder", "corporate governance",
      "ethics", "business ethics", "diversification", "franchising", "licensing", "distribution", "retail strategy", "market analysis", "cash flow", "return on investment"
    ],
    Technology: [
      "tech", "software", "hardware", "innovation", "gadget", "computing", "AI", "artificial intelligence", "machine learning", "robotics",
      "blockchain", "cybersecurity", "cloud", "SaaS", "app", "application", "programming", "coding", "development", "internet",
      "IoT", "big data", "analytics", "automation", "digital", "data", "network", "algorithm", "API", "database",
      "open source", "mobile", "smartphone", "tablet", "wearable", "VR", "virtual reality", "AR", "augmented reality", "quantum computing",
      "encryption", "software engineering", "DevOps", "microservices", "container", "Docker", "Kubernetes", "serverless", "fintech", "e-commerce technology",
      "digital transformation", "virtual assistant", "chatbot", "automation tools", "programming language", "JavaScript", "Python", "Java", "C++", "C#",
      "Ruby", "PHP", "Go", "Swift", "Kotlin", "HTML", "CSS", "SQL", "NoSQL", "blockchain technology",
      "cryptocurrency", "Bitcoin", "Ethereum", "smart contract", "data science", "deep learning", "neural network", "computer vision", "natural language processing", "digital innovation",
      "tech startup", "tech ecosystem", "IoT devices", "wearable tech", "IT infrastructure", "augmented intelligence", "edge computing", "virtualization", "biometrics", "automation software",
      "SaaS platform", "PaaS", "IaaS", "digital platform", "user interface", "user experience", "tech trends", "information technology", "smart device", "tech disruption"
    ],
    Entertainment: [
      "movie", "music", "celebrity", "entertainment", "tv", "film", "cinema", "theater", "streaming", "video",
      "concert", "show", "series", "drama", "comedy", "documentary", "reality", "performance", "award", "festival",
      "actor", "actress", "director", "producer", "screenwriter", "script", "blockbuster", "animation", "cartoon", "sitcom",
      "web series", "digital media", "music video", "album", "single", "band", "orchestra", "DJ", "remix", "pop",
      "rock", "hip-hop", "rap", "country", "jazz", "classical", "indie", "entertainment news", "gossip", "reality TV",
      "talk show", "late night", "variety show", "comedy show", "drama series", "thriller", "romance", "action", "adventure", "fantasy",
      "science fiction", "animation film", "blockbuster film", "box office", "premiere", "trailer", "review", "rating", "critic", "podcast",
      "radio", "live performance", "backstage", "celebrity gossip", "paparazzi", "music festival", "stage", "choreography", "dance", "musical",
      "soundtrack", "Broadway", "play", "art", "visual effects", "CGI", "stunt", "scriptwriting", "voiceover", "cameo",
      "entertainment industry", "fanbase", "fandom", "viral", "streaming service", "subscription", "celebrity culture", "infotainment", "box set", "rerun"
    ],
    Sports: [
      "sports", "game", "tournament", "match", "athlete", "competition", "championship", "league", "season", "score",
      "coach", "team", "player", "win", "loss", "draw", "referee", "official", "training", "fitness",
      "workout", "exercise", "marathon", "sprint", "record", "scoreline", "penalty", "goal", "basket", "court",
      "field", "stadium", "arena", "club", "division", "ranking", "playoff", "finals", "quarterfinal", "semifinal",
      "world cup", "olympics", "medal", "gold", "silver", "bronze", "contest", "championship game", "matchday", "kickoff",
      "halftime", "overtime", "injury", "recovery", "sportsmanship", "record-breaker", "duel", "competitor", "training camp", "fitness training",
      "athleticism", "endurance", "agility", "strength", "technique", "strategy", "defense", "offense", "playmaker", "substitution",
      "lineup", "captain", "supporter", "fan", "cheering", "rally", "comeback", "upset", "performance", "skill",
      "drill", "warm-up", "match fixture", "exhibition", "practice", "tryout", "scoring", "net", "racquet", "sprinting",
      "running", "cycling", "swimming", "boxing", "wrestling", "martial arts", "referee whistle", "dribble", "fan chant", "tournament bracket"
    ],
    Science: [
      "science", "research", "study", "experiment", "discovery", "hypothesis", "theory", "laboratory", "physics", "chemistry",
      "biology", "geology", "astronomy", "mathematics", "statistics", "analysis", "data", "observation", "empirical", "scientific innovation",
      "methodology", "evidence", "variable", "control", "sample", "research paper", "peer review", "academic", "journal", "publication",
      "study design", "clinical trial", "hypothesis testing", "measurement", "simulation", "modeling", "computation", "theory development", "scientific method", "paradigm",
      "quantification", "phenomenon", "scientific law", "constant", "principle", "fundamental", "energy", "matter", "evolution", "genetics",
      "microbiology", "botany", "zoology", "ecology", "environmental science", "climatology", "meteorology", "oceanography", "paleontology", "quantum mechanics",
      "relativity", "particle physics", "atomic structure", "molecular biology", "biochemistry", "neuroscience", "psychology", "pharmacology", "immunology", "virology",
      "epidemiology", "biotechnology", "nanotechnology", "computational science", "informatics", "astrobiology", "spectroscopy", "crystallography", "thermodynamics", "kinetics",
      "electromagnetism", "fluid dynamics", "optics", "acoustics", "renewable energy", "sustainable science", "bioengineering", "genomics", "proteomics", "metabolomics",
      "systems biology", "ecological systems", "conservation", "space exploration", "exoplanet", "cosmology", "dark matter", "dark energy", "research breakthrough", "scientific advancement"
    ],
    Health: [
      "health", "medicine", "wellness", "medical", "fitness", "nutrition", "exercise", "therapy", "treatment", "disease",
      "diagnosis", "healthcare", "doctor", "physician", "nurse", "hospital", "clinic", "surgery", "recovery", "prevention",
      "vaccination", "immunization", "public health", "mental health", "psychology", "stress", "anxiety", "depression", "well-being", "holistic",
      "alternative medicine", "acupuncture", "chiropractic", "herbal", "homeopathy", "physiotherapy", "rehabilitation", "diet", "calorie", "obesity",
      "weight loss", "cardio", "endurance", "strength training", "gym", "fitness center", "personal training", "exercise routine", "sports medicine", "orthopedics",
      "pediatrics", "geriatrics", "oncology", "cardiology", "neurology", "endocrinology", "dermatology", "psychiatry", "dentistry", "vision",
      "optometry", "nutritionist", "dietician", "public health policy", "sanitation", "hygiene", "disease prevention", "health education", "medical research", "clinical trial",
      "pharmaceutical", "drug", "prescription", "antibiotic", "vaccine", "immunology", "chronic", "acute", "infection", "inflammation",
      "physical therapy", "wellness program", "health screening", "checkup", "prognosis", "treatment plan", "emergency", "urgent care", "laboratory test", "medical imaging",
      "ultrasound", "MRI", "CT scan", "blood test", "vital signs", "heart rate", "blood pressure", "cholesterol", "rehabilitation center", "wellness coach"
    ]
  };
  
  module.exports = categoryKeywords;
  