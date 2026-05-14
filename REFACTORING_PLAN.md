# 🔧 REFACTORING PLAN & IMPLEMENTATION GUIDE

**Created:** May 14, 2026  
**Priority:** CRITICAL → LOW  
**Estimated Time:** 2-3 weeks for full implementation

---

## 📋 TABLE OF CONTENTS

1. [Critical Security Fixes](#critical-security-fixes)
2. [High Priority Security](#high-priority-security)
3. [Medium Priority](#medium-priority)
4. [Code Quality Improvements](#code-quality-improvements)
5. [Dead Code Removal](#dead-code-removal)
6. [Performance Optimizations](#performance-optimizations)
7. [Testing Checklist](#testing-checklist)

---

## 🚨 CRITICAL SECURITY FIXES

### 1. Move JWT Secret to Environment Variable

**Current Code (server.js:13):**
```javascript
const JWT_SECRET = 'joel-portfolio-secret-key-change-in-production';
```

**Fixed Code:**
```javascript
// server.js - Line 13
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-for-dev-only';

// Add .env file at root:
JWT_SECRET=your-super-secret-random-string-min-32-chars
```

**Steps:**
1. Create `.env` file in root directory
2. Generate secure random string: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Add to `.env`: `JWT_SECRET=<generated-string>`
4. Update `server.js` to use `process.env.JWT_SECRET`
5. Add `.env` to `.gitignore`
6. **DO NOT COMMIT .env FILE**

---

### 2. Move Password Hash to Environment Variable

**Current Code (server.js:139):**
```javascript
const PASSWORD_HASH = bcrypt.hashSync('JOELKUNDU', 10);
```

**Fixed Code:**
```javascript
// server.js - Line 139
const PASSWORD_HASH = process.env.PASSWORD_HASH || bcrypt.hashSync('JOELKUNDU', 10);

// Add to .env:
PASSWORD_HASH=$2a$10$your-actual-hash-here
```

**Steps:**
1. Generate hash: `node -e "console.log(require('bcryptjs').hashSync('JOELKUNDU', 10))"`
2. Add to `.env`: `PASSWORD_HASH=<generated-hash>`
3. Update `server.js`
4. **Change default password in production!**

---

### 3. Move API Keys to Environment Variables

**Current Code (server.js:293):**
```javascript
const OMDB_API_KEY = process.env.OMDB_API_KEY || 'YOUR_OMDB_API_KEY';
```

**Fixed Code:**
```javascript
// Already partially correct, but needs .env file
// Add to .env:
OMDB_API_KEY=your-actual-api-key-here
```

---

### 4. Fix eval() Usage in Pattern Editor

**Current Code (index.html:1203):**
```javascript
// Pattern equation uses new Function() - DANGEROUS
const fn = new Function('x', 'y', 'nx', 'ny', `return ${equation}`);
```

**Fixed Code (Option A - Strict Validation):**
```javascript
// Only allow safe math expressions
const SAFE_PATTERN = /^[\d\s\+\-\*\/\(\)\.xyn,]+$/;
if (!SAFE_PATTERN.test(equation)) {
  throw new Error('Invalid equation');
}
const fn = new Function('x', 'y', 'nx', 'ny', `return ${equation}`);
```

**Fixed Code (Option B - Math Parser - RECOMMENDED):**
```javascript
// Use mathjs library
npm install mathjs
const math = require('mathjs');

// Replace eval with:
try {
  const compiled = math.compile(equation);
  const result = compiled.evaluate({ x, y, nx, ny });
  return result;
} catch (error) {
  console.error('Invalid equation:', error);
  return 0;
}
```

---

## ⚠️ HIGH PRIORITY SECURITY

### 5. Add Input Sanitization

**Install:**
```bash
npm install express-validator
```

**Add Middleware (server.js):**
```javascript
const { body, param, query, validationResult } = require('express-validator');

// Add to login route
app.post('/api/login', [
  body('password').trim().notEmpty().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ... rest of code
});

// Add to config save
app.post('/api/config', [
  body().custom((value) => {
    // Validate config structure
    if (!value.hero || !value.about) {
      throw new Error('Invalid config structure');
    }
    return true;
  })
], (req, res) => {
  // ... rest of code
});
```

---

### 6. Add Rate Limiting

**Install:**
```bash
npm install express-rate-limit
```

**Add to server.js:**
```javascript
const rateLimit = require('express-rate-limit');

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

// API rate limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests
  message: 'Too many requests'
});

// Apply
app.post('/api/login', loginLimiter, (req, res) => { ... });
app.use('/api', apiLimiter);
```

---

### 7. Add Security Headers

**Install:**
```bash
npm install helmet
```

**Add to server.js:**
```javascript
const helmet = require('helmet');

// Add after app.use(cors())
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  }
}));
```

---

## 📊 MEDIUM PRIORITY

### 8. Remove Console Logs

**Replace with proper logging:**

```javascript
// Install logging library
npm install winston

// Create logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Replace console.log with logger.info
logger.info('Config loaded successfully');
logger.error('Error loading config:', error);
```

---

### 9. Add Proper Error Handling

**Current:**
```javascript
app.post('/api/build', authenticateToken, (req, res) => {
  try {
    // code
  } catch (error) {
    console.error('Build error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

**Improved:**
```javascript
app.post('/api/build', authenticateToken, async (req, res) => {
  try {
    logger.info('Build started');
    
    // Validate inputs
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Build logic here
    
    logger.info('Build completed successfully');
    res.json({ success: true, message: 'Build completed successfully' });
  } catch (error) {
    logger.error('Build failed:', { error: error.message, stack: error.stack });
    res.status(500).json({ 
      error: 'Build failed', 
      message: error.message 
    });
  }
});
```

---

## 🗑️ DEAD CODE REMOVAL

### 10. Remove All Commented Code

**Files with most dead code:**
- `dashboard-server/index.html` - 500+ lines
- `script.js` - 300+ lines

**Process:**
1. Search for all `//` comments
2. If it's commented code (not explanation), DELETE IT
3. Use git history if you need to reference old code
4. Keep ONLY explanatory comments

**Example:**
```javascript
// DELETE THIS:
// function oldFunction() {
//   console.log('old code');
// }

// KEEP THIS:
// Using arrow function for better 'this' binding
const newFunction = () => { ... };
```

---

## ⚡ PERFORMANCE OPTIMIZATIONS

### 11. Optimize Config Loading

**Current:** Loads entire config on every request  
**Improved:** Cache config, reload only on change

```javascript
// Config cache with file watcher
let configCache = null;
let configTimestamp = 0;

function getCachedConfig() {
  const stats = fs.statSync(CONFIG_FILE);
  
  // Only reload if file changed
  if (configCache && stats.mtimeMs <= configTimestamp) {
    return configCache;
  }
  
  configCache = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  configTimestamp = stats.mtimeMs;
  return configCache;
}
```

---

### 12. Optimize Image Uploads

**Current:** Copies file synchronously  
**Improved:** Use streams, add compression

```javascript
const sharp = require('sharp');

// Add image optimization
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const optimized = await sharp(req.file.path)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
    
    fs.writeFileSync(req.file.path, optimized);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## ✅ TESTING CHECKLIST

After implementing fixes, test:

### Security Tests
- [ ] JWT authentication works
- [ ] Invalid tokens are rejected
- [ ] Rate limiting works (try 6 login attempts)
- [ ] Input validation catches bad data
- [ ] No secrets in code (check .git history)

### Functionality Tests
- [ ] Dashboard login works
- [ ] Config saves correctly
- [ ] Image upload works
- [ ] Build process works
- [ ] Push to GitHub works
- [ ] Live site renders correctly

### Performance Tests
- [ ] Config loads in < 100ms
- [ ] Image upload < 2s for 5MB image
- [ ] No memory leaks (check with Chrome DevTools)
- [ ] No console errors

### Code Quality Tests
- [ ] No console.log in production
- [ ] No commented code
- [ ] All functions have error handling
- [ ] All user inputs validated

---

## 📅 IMPLEMENTATION TIMELINE

### Week 1: Critical Security
- [ ] Day 1: Move secrets to .env
- [ ] Day 2: Add input sanitization
- [ ] Day 3: Fix eval() usage
- [ ] Day 4: Add rate limiting
- [ ] Day 5: Add security headers
- [ ] Day 6-7: Test thoroughly

### Week 2: Code Quality
- [ ] Day 1-2: Remove dead code
- [ ] Day 3: Add proper logging
- [ ] Day 4: Add error handling
- [ ] Day 5: Performance optimizations
- [ ] Day 6: Documentation
- [ ] Day 7: Final testing

### Week 3: Polish & Deploy
- [ ] Day 1-3: User testing
- [ ] Day 4: Bug fixes
- [ ] Day 5: Final security audit
- [ ] Day 6: Deploy to production
- [ ] Day 7: Monitor and document

---

## 🎯 SUCCESS METRICS

After refactoring:

- **Security:** 0 critical/high issues
- **Code Quality:** No dead code, proper logging
- **Performance:** < 100ms config load, < 2s image upload
- **Maintainability:** Clear structure, documented
- **Testing:** 100% test coverage on critical paths

---

**Generated by:** Hermes Code Quality Analyzer  
**Next Audit:** After Week 1 implementation
