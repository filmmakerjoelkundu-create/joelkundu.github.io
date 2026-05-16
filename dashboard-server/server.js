const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { createLogger } = require('./logger');

// Initialize logger
const logger = createLogger('Server', { level: 'debug' });

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = 'joel-portfolio-secret-key-change-in-production';

// Paths - defined before middleware so express.static can use them
const ROOT_DIR = path.join(__dirname, '..');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'site-config.json');
const IMAGES_DIR = path.join(ROOT_DIR, 'assets/images');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// Disable caching for development
app.use((req, res, next) => {
 res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
 res.setHeader('Pragma', 'no-cache');
 res.setHeader('Expires', '0');
 next();
});
app.use(express.static(ROOT_DIR));
app.use('/dashboard', express.static(__dirname));

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Load or create default config
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      logger.debug('Loading config from file');
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    logger.error('Error loading config:', { error: error.message });
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
try {
// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
fs.mkdirSync(CONFIG_DIR, { recursive: true });
}
// Write config with proper formatting
fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
logger.debug('Config saved to', CONFIG_FILE);
} catch (error) {
logger.error('Failed to save config:', { error: error.message });
throw error;
}
}

// Initialize config
let siteConfig = loadConfig();
console.log('[DEBUG] Config loaded. About header:', siteConfig?.about?.header, 'BG stills:', siteConfig?.hero?.backgroundStills?.length);
console.log('[DEBUG] CONFIG_FILE path:', CONFIG_FILE);

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
    const token = jwt.sign({ user: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/config', authenticateToken, (req, res) => {
console.log('[DEBUG GET /api/config] About header:', siteConfig?.about?.header, 'BG stills:', siteConfig?.hero?.backgroundStills?.length);
res.json(siteConfig);
});

app.post('/api/config', authenticateToken, (req, res) => {
try {
siteConfig = req.body;
saveConfig(siteConfig);
logger.info('Config saved successfully');
res.json({ success: true, config: siteConfig });
} catch (error) {
logger.error('Failed to save config:', { error: error.message, stack: error.stack });
res.status(500).json({ error: 'Failed to save config', details: error.message });
}
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
assetsPath: `/assets/images/${req.file.originalname}`
});
});

// Build endpoint - copies config and assets to live site
app.post('/api/build', authenticateToken, (req, res) => {
try {
  logger.info('Build process started');
  const rootDir = path.join(__dirname, '..');
  const liveConfigDir = path.join(rootDir, 'config');
  const liveConfigFile = path.join(liveConfigDir, 'site-config.json');

  // Ensure live config directory exists
  if (!fs.existsSync(liveConfigDir)) {
    logger.debug('Creating live config directory');
    fs.mkdirSync(liveConfigDir, { recursive: true });
  }

  // Copy config file
  const currentConfig = JSON.stringify(siteConfig, null, 2);
  fs.writeFileSync(liveConfigFile, currentConfig, 'utf8');
  logger.debug('Config file copied to live directory');

  // Copy uploads to assets if needed
  const uploadsDir = path.join(__dirname, '../uploads');
  const assetsDir = path.join(__dirname, '../assets/images');
  if (fs.existsSync(uploadsDir)) {
    const uploadFiles = fs.readdirSync(uploadsDir);
    let copiedCount = 0;
    uploadFiles.forEach(file => {
      const src = path.join(uploadsDir, file);
      const dest = path.join(assetsDir, file);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
        copiedCount++;
      }
    });
    if (copiedCount > 0) {
      logger.info(`Copied ${copiedCount} files to assets directory`);
    }
  }

  logger.info('Build completed successfully');
  res.json({ success: true, message: 'Build completed successfully' });
} catch (error) {
  logger.error('Build failed:', { error: error.message, stack: error.stack });
  res.status(500).json({ error: error.message });
}
});

// Git branch list endpoint
app.get('/api/branches', authenticateToken, (req, res) => {
const { exec } = require('child_process');
const rootDir = path.join(__dirname, '..');

exec('git branch', { cwd: rootDir }, (err, stdout) => {
if (err) {
logger.error('Git branch failed:', { error: err.message });
return res.status(500).json({ error: 'Git branch failed: ' + err.message });
}
const branches = stdout.split('\n').filter(b => b.trim()).map(b => b.trim());
res.json({ success: true, branches });
});
});

// Git add endpoint
app.post('/api/git/add', authenticateToken, (req, res) => {
const { exec } = require('child_process');
const rootDir = path.join(__dirname, '..');

exec('git add -A', { cwd: rootDir }, (err, stdout, stderr) => {
if (err) {
logger.error('Git add failed:', { error: err.message });
return res.status(500).json({ output: 'Error: ' + stderr });
}
res.json({ output: 'Staged all changes\\n' });
});
});

// Git commit endpoint
app.post('/api/git/commit', authenticateToken, (req, res) => {
const { exec } = require('child_process');
const rootDir = path.join(__dirname, '..');
const { message } = req.body;

if (!message) {
return res.status(400).json({ output: 'Error: Commit message required\\n' });
}

exec(`git commit -m "${message}"`, { cwd: rootDir }, (err, stdout, stderr) => {
if (err && !stderr.includes('nothing to commit')) {
logger.error('Git commit failed:', { error: stderr });
return res.status(500).json({ output: 'Error: ' + stderr });
}
res.json({ output: stderr || 'Committed successfully\\n' });
});
});

// Git push endpoint
app.post('/api/git/push', authenticateToken, (req, res) => {
const { exec } = require('child_process');
const rootDir = path.join(__dirname, '..');
const { branch } = req.body;

if (!branch) {
return res.status(400).json({ output: 'Error: Branch name required\\n' });
}

exec(`git push origin ${branch}`, { cwd: rootDir }, (err, stdout, stderr) => {
if (err) {
logger.error('Git push failed:', { error: stderr });
return res.status(500).json({ output: 'Error: ' + stderr });
}
logger.info('Successfully pushed to ' + branch);
res.json({ output: stdout || 'Pushed successfully\\n' });
});
});

// Old push endpoint - kept for backward compatibility but deprecated
// app.post('/api/push', ...) - REMOVED, use /api/git/push instead

// Push endpoint - commits and pushes to GitHub - DEPRECATED
// app.post('/api/push', authenticateToken, (req, res) => { ... });

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
  logger.info(`Dashboard server running at http://localhost:${PORT}/dashboard/`);
  logger.debug(`Config directory: ${CONFIG_DIR}`);
});
