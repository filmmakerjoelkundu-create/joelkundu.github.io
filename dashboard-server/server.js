const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5001; // Changed to avoid conflicts with firecrawl (3002) and other services
const JWT_SECRET = 'joel-portfolio-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../'));
app.use('/dashboard', express.static(__dirname));

// Config file paths
const CONFIG_DIR = path.join(__dirname, 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'site-config.json');
const IMAGES_DIR = path.join(__dirname, '../assets/images');

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Load or create default config
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  
  // Default config
  return {
    hero: {
      name: 'Joel Kundu',
      tagline: 'Cinematographer & Director',
      themes: [
        {
          id: 'thriller',
          name: 'Thriller',
          colors: {
            bgPrimary: '#0a0a0a',
            bgSecondary: '#1a1a1a',
            bgTertiary: '#2a2a2a',
            textPrimary: '#ffffff',
            textSecondary: '#cccccc',
            accent: '#C4A35A',
            accentHover: '#d4b36a'
          }
        }
      ],
      laurels: []
    },
    about: {
      header: 'About Me',
      tagline: 'Visual storyteller behind the lens',
      paragraph: '',
      stats: [
        { number: '10+', text: 'Years Experience' },
        { number: '50+', text: 'Projects Completed' },
        { number: '15+', text: 'Awards Won' }
      ]
    },
    selectedWorks: [],
    showreel: {
      vimeoUrl: ''
    },
    gallery: {
      images: [],
      bts: []
    },
    services: [
      {
        id: '1',
        title: 'Cinematography',
        description: 'Director of Photography for feature films, documentaries, and commercials',
        visible: true
      },
      {
        id: '2',
        title: 'Directing',
        description: 'Creative direction for narrative and commercial projects',
        visible: true
      }
    ],
    contact: {
      message: '"Every project begins with a conversation. Whether you have a fully developed script or just a spark of an idea, I\'m here to help bring your vision to life. Let\'s discuss how we can collaborate to create something truly exceptional."',
      email: 'filmmaker.joelkundu@gmail.com',
      location: {
        text: 'London, Ontario, Canada',
        visible: true
      },
      website: {
        url: '',
        visible: false
      }
    },
    footer: {
      tagline: 'Capturing stories through the lens',
      socialLinks: []
    }
  };
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
}

// Initialize config
let siteConfig = loadConfig();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Simple password hash for dashboard access
const PASSWORD_HASH = bcrypt.hashSync('JOELKUNDU', 10);

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

// Routes
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  if (bcrypt.compareSync(password, PASSWORD_HASH)) {
    const token = jwt.verify(
      jwt.sign({ user: 'admin' }, JWT_SECRET, { expiresIn: '24h' }),
      JWT_SECRET
    );
    res.json({ token, success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/config', authenticateToken, (req, res) => {
  res.json(siteConfig);
});

app.post('/api/config', authenticateToken, (req, res) => {
  siteConfig = req.body;
  saveConfig(siteConfig);
  res.json({ success: true, config: siteConfig });
});

app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const uploadPath = path.join(__dirname, '../uploads', req.file.filename);
  const assetsPath = path.join(__dirname, '../assets/images', req.file.originalname);
  
  // Copy to assets folder for git
  fs.copyFileSync(uploadPath, assetsPath);
  
  res.json({
    success: true,
    originalName: req.file.originalname,
    filename: req.file.filename,
    path: `/assets/images/${req.file.originalname}`,
    assetsPath: `assets/images/${req.file.originalname}`
  });
});

// IMDB data fetch (using OMDB API)
app.get('/api/imdb', authenticateToken, async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'IMDB URL required' });
  }
  
  // Extract IMDB ID from URL
  const imdbIdMatch = url.match(/tt\d+/);
  if (!imdbIdMatch) {
    return res.status(400).json({ error: 'Invalid IMDB URL' });
  }
  
  const imdbId = imdbIdMatch[0];
  const OMDB_API_KEY = process.env.OMDB_API_KEY || 'YOUR_OMDB_API_KEY';
  
  try {
    const response = await axios.get(`http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch IMDB data' });
  }
});

app.listen(PORT, () => {
  console.log(`🎬 Dashboard server running at http://localhost:${PORT}/dashboard/`);
  console.log('📁 Config directory:', CONFIG_DIR);
});
