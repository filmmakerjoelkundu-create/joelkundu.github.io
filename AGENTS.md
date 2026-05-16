# Portfolio Sample - Complete Feature Documentation

**Project Type:** Cinematographer/Director Portfolio Website with Dashboard CMS  
**Last Updated:** May 14, 2026  
**Stack:** Vanilla HTML/CSS/JavaScript (frontend), Node.js/Express (dashboard server)

---

## 🎯 Overview

This is Joel Kundu's professional portfolio website for his cinematography and directing work. It consists of two main parts:

1. **Live Site** (`index.html`, `script.js`, `style.css`) - The public-facing portfolio
2. **Dashboard CMS** (`dashboard-server/`) - A password-protected admin panel for managing all site content

The password to both sites is **"JOELKUNDU"**.

Do not add line number prefixes (1|, 2|, 3|, etc.) on every single

---

## 📁 File Structure

```
portfolio-sample/
├── index.html                 # Main homepage
├── work-detail.html           # Individual project detail page
├── script.js                  # Frontend interactivity
├── style.css                  # Global styles + theme variables
├── config/
│   └── site-config.json       # Site configuration (themes, hero, contact info)
├── assets/images/             # Image assets
├── dashboard-server/
│   ├── index.html             # Dashboard admin panel UI
│   ├── server.js              # Express backend API
│   ├── logger.js              # Universal logging utility
│   └── package.json           # Dependencies
├── README.md                  # Project overview
├── netlify.toml               # Netlify deployment config
├── STILLS_WORKFLOW.md         # Stills management workflow docs
└── AGENTS.md                  # This file - comprehensive feature documentation
```

---

## 🎬 LIVE SITE FEATURES

### 1. Hero Section
**Purpose:** First impression with animated background slideshow and personal branding

**Features:**
- **Dynamic Background Slideshow:** Rotates through selected still images every 8 seconds
  - Images sourced from `config/site-config.json` → `hero.backgroundStills`
  - Cached in localStorage for 4 hours
- **Parallax Effect:** Background images move at different speeds on scroll (desktop only)
- **3D Tilt Effect:** Hero text and logo tilt based on mouse position
- **Draggable Logo:** Logo can be dragged and springs back with smooth animation
- **Name Display:** Two-row format (firstName in accent color, lastName in white)
- **Laurels Display:** Film festival laurels/awards shown as badges
- **Tagline:** Customizable tagline text

**Configuration:**
```json
{
  "hero": {
    "firstName": "JOEL",
    "lastName": "KUNDU",
    "tagline": "Cinematographer | Director",
    "laurels": [],
    "backgroundStills": ["assets/images/..."],
    "themes": [...]
  }
}
```

---

### 2. Theme System
**Purpose:** Visual customization based on film genre aesthetics

**Available Themes:**
- `thriller` - Dark, suspenseful palette
- `drama` - Emotional, warm tones
- `horror` - High contrast, cold colors
- `scifi` - Futuristic, neon accents
- `action` - Bold, dynamic colors

**Theme Properties:**
- Background colors (primary, secondary, tertiary)
- Accent colors (1, 2, 3)
- Text colors (primary, secondary)
- Font families (heading, body)
- Background pattern equation and opacity

**Behavior:**
- Random theme selected on each page load
- Manual theme selection persists in localStorage
- Theme buttons in footer allow switching
- Applied via `data-theme` attribute on `<html>` element

---

### 3. About Section
**Purpose:** Professional bio and key statistics

**Features:**
- **Header:** Section title
- **Tagline:** Short professional tagline
- **Paragraph:** Extended bio text
- **Stats Grid:** 4 statistical cards (e.g., "10+ Years", "50+ Projects")
  - Editable via dashboard
  - Displayed with large numbers and descriptive text

**Configuration:**
```json
{
  "about": {
    "header": "About Me",
    "tagline": "Visual storyteller...",
    "paragraph": "Joel Kundu is a cinematographer...",
    "stats": [
      { "number": "8+", "text": "Years Experience" },
      { "number": "34", "text": "IMDb Credits" }
    ]
  }
}
```

---

### 4. Selected Works Section
**Purpose:** Showcase major projects with full crew details

**Features:**
- **Project Cards:** Grid of project cards with:
  - Project image/poster
  - Title
  - Role (e.g., "Director of Photography")
  - Category badge (narrative, documentary, commercial, music video)
  - Visibility toggle (visible/hidden)
  - "View Stills" button
- **Project Modal:** Clicking "View Stills" opens a modal with:
  - Project title and metadata (year, duration, genre, role)
  - Full credits list (director, producer, cinematographer, editor, etc.)
  - Stills grid
  - BTS (Behind The Scenes) images grid
  - Laurel badges if applicable
- **Filtering:** Projects can be filtered by category
- **Edit/Delete:** Available in dashboard

**Project Data Structure:**
```json
{
  "selectedWorks": [
    {
      "id": "project-1234567890",
      "title": "E13M",
      "tagline": "A father's self-erasure as an act of love",
      "role": "Director of Photography",
      "category": "narrative",
      "year": "2024",
      "visible": true,
      "image": "/assets/images/...",
      "credits": {
        "director": "Joel Kundu",
        "dop": "Joel Kundu",
        "producer": "Jane Smith"
      }
    }
  ]
}
```

---

### 5. Gallery Section
**Purpose:** Display all stills and images in a filterable grid

**Features:**
- **Image Grid:** 4x3 grid (12 images) displayed at a time
- **Random Rotation:** Images rotate every 15 seconds (paused when tab is hidden)
- **Filtering:**
  - By project (e13m, short2, doc1, commercial1, untagged)
  - Filter buttons in section header
- **Hover Effect:** Images move toward gallery center on hover
- **Fullscreen View:** Click to view image fullscreen with:
  - Black overlay with backdrop blur
  - Close button (rotates on hover)
  - Click outside or ESC to close
  - Smooth scale animation
- **Lazy Loading:** Images fade in on scroll
- **Mobile Optimization:** Parallax disabled on mobile

**Data Source:**
- Configured in `config/site-config.json` → `gallery.projects`
- Each project has stills array with src, alt, camera, type

---

### 6. Showreel Section
**Purpose:** Display embedded video reel (Vimeo)

**Features:**
- **Vimeo Embed:** iframe with Vimeo player
- **3D Tilt Effect:** Frame tilts based on mouse position in section
- **Shield Overlay:** Transparent overlay prevents iframe from capturing first click
  - Click activates video (removes shield, disables tilt)
  - Allows Vimeo to receive mouse events after activation
- **Hover State:** Border highlight when mouse over frame (before activation)
- **Reset:** Tilt re-enables when mouse leaves section

---

### 7. Services Section
**Purpose:** List professional services offered

**Features:**
- **Service Cards:** Grid of service cards
  - Service title
  - Description
  - Icon (emoji)
  - Toggle visibility
  - Edit/Delete buttons (dashboard)
- **3D Tilt Effect:** Cards tilt based on mouse position relative to section center
  - Uses event delegation for dynamic content
  - Smooth transition on mouse move
  - Resets on mouse leave
- **Visibility Toggle:** Services can be hidden/shown via dashboard

**Data Structure:**
```json
{
  "services": [
    {
      "id": "service-1234567890",
      "title": "Cinematography",
      "description": "Director of Photography services...",
      "icon": "🔧",
      "visible": true,
      "order": 0
    }
  ]
}
```

---

### 8. Contact Section
**Purpose:** Contact form and social links

**Features:**
- **Toggle Buttons:** Switch between "General Inquiry" and "Quote Request" forms
- **Form Options:** Selectable service options (chips)
  - Predefined options (e.g., "Pre-production", "Production", "Post-production")
  - Custom option: Click "+" to add custom service inline
  - Sanitization: Strips HTML tags from custom input
- **Form Submission:**
  - Prevents default submission
  - Collects form data and selected options
  - Logs to console (replace with actual backend endpoint)
  - Shows inline success message ("✓ Sent!")
  - Resets form after 3 seconds
- **Contact Info Display:**
  - Email address
  - Location (toggle visibility)
  - Form email (for Formspree or similar)
  - Form subject prefix
  - Success message customization

**Configuration:**
```json
{
  "contact": {
    "email": "joel@example.com",
    "location": {
      "text": "London, Ontario",
      "visible": true
    },
    "formEmail": "joel@example.com",
    "formSubject": "Portfolio Contact: ",
    "formSuccess": "Thank you for your message!",
    "formEnabled": true
  }
}
```

---

### 9. Footer
**Purpose:** Site footer with social links and tagline

**Features:**
- **Tagline:** Customizable footer tagline
- **Social Links:** List of social media profiles
  - Platform selection (Instagram, Twitter, Facebook, LinkedIn, YouTube, Vimeo, TikTok, IMDb, Letterboxd, Threads, Custom)
  - Custom platform name
  - URL
  - Icon (auto or custom URL)
  - Visibility toggle
- **Theme Buttons:** Quick theme switching

**Data Structure:**
```json
{
  "footer": {
    "tagline": "© 2025 Joel Kundu. All rights reserved.",
    "socialLinks": [
      {
        "platform": "Instagram",
        "customName": "",
        "url": "https://instagram.com/...",
        "icon": "instagram",
        "visible": true
      }
    ]
  }
}
```

---

### 10. Work Detail Page (`work-detail.html`)
**Purpose:** Dedicated page for individual project details

**Features:**
- **Back Button:** Returns to main page work section
- **Poster Display:** Large project poster image
- **Info Panel:**
  - Title
  - Metadata (year, duration, genre, role)
  - Synopsis
  - Credits list
- **Stills Gallery:** Grid of still images from the project
- **Fullscreen Slideshow:**
  - Navigate with arrows or keyboard (left/right)
  - Counter shows current/total
  - Close with X button, ESC, or click outside
- **Theme Persistence:** Saves and loads theme from localStorage
- **Content Protection:**
  - Disabled right-click (context menu)
  - Disabled drag on images

**Note:** Currently uses hardcoded `workData` object. Should be replaced with dashboard-managed data.

---

### 11. Additional Features

**Timecode Display:**
- Real-time timecode (HH:MM:SS:FF) at ~24fps
- Updated every 42ms

**Recording Time:**
- Current time display (HH:MM:SS)
- Updated every second

**Region Detection:**
- Detects PAL vs NTSC regions based on timezone
- Displays appropriate FPS (24 for PAL, 23.976 for NTSC)

**Coffee Easter Egg:**
- Click 10 times anywhere on non-interactive elements
- Triggers "coffee rain" animation with ☕🧋🥤🫖 emojis
- Resets after 5 seconds

**Scroll Animations:**
- Sections fade in on scroll using IntersectionObserver
- Smooth scroll for anchor links

**Mobile Detection:**
- `isMobile` variable used to disable certain effects
- Tilt limits adjusted (15° mobile, 10° desktop)

---

## 🛠️ DASHBOARD CMS FEATURES

### Authentication
**Purpose:** Password-protected admin access

**Features:**
- **Login Screen:** Password input with SHA-256 hash verification
- **Session Storage:** Auth token stored in sessionStorage
- **Token Expiry:** Token timestamp checked on load
- **API Protection:** All API endpoints require Bearer token

**Security Notes:**
- Password hash is client-side (not secure for production)
- Token stored in sessionStorage (cleared on browser close)
- Server-side validation required for production use

---

### Dashboard UI Structure
**Layout:**
- **Login Screen:** Shown if not authenticated
- **Dashboard:** Main admin panel (shown after login)
- **Action Bar:** "Save & Deploy" and "Commit" buttons (always visible after login)
- **Navigation:** Tab-based navigation between sections
  - Hero
  - About
  - Selected Works
  - Gallery
  - Showreel
  - Services
  - Contact
  - Footer
  - Settings

**Change Detection:**
- `hasChanges` flag tracks modifications
- `beforeunload` handler warns about unsaved changes
- Action bars appear when changes detected

---

## 🔧 KNOWN ISSUES & FIXES

### Issue #1: Double Row in Selected Works Section
**Problem:** Project cards were appearing twice - once from config rendering and once from HTML fallback.

**Root Cause:** The infinite carousel feature (`initInfiniteCarousel()`) was cloning the carousel track on page load, before the config was loaded. When the config loaded and updated the original track, the duplicate still had the old HTML content.

**Fix:** Disabled the infinite carousel feature by commenting out the initialization call. The carousel now displays as a single static row.

**Files Modified:**
- `script.js` - Commented out `initInfiniteCarousel()` call

---

### Issue #2: Services Section Mouse Tracking Not Working
**Problem:** The 3D tilt effect on service cards was not working.

**Root Cause:** The mouse tracking code was querying for `.service-card` elements immediately when the script loaded, before the services were rendered from config. This resulted in an empty NodeList.

**Fix:** Refactored the mouse tracking to use event delegation - querying for cards inside the event handler rather than at initialization time.

**Files Modified:**
- `script.js` - Wrapped mouse tracking in `initServicesMouseTracking()` function with event delegation

---

### Issue #3: Config Not Populated with Original Content
**Problem:** The `config/site-config.json` file was missing original content from the HTML.

**Fix:** Populated the config file with:
- About section content (header, tagline, paragraph, stats)
- Showreel Vimeo URL
- Contact information
- Hero firstName/lastName

---

## 🐛 BUG FIXES - May 15, 2026 (Latest)

### Issue #5: Password Login Not Working
**Problem:** Password form on live site wasn't submitting.
**Fix:** Wrapped password authentication in `DOMContentLoaded` event with null checks.
**Status:** ✅ Fixed

### Issue #6: Blob URLs in Selected Works
**Problem:** Project images had temporary blob URLs that don't persist.
**Fix:** Converted 6 blob URLs to `/assets/images/poster-placeholder.png`
**Status:** ✅ Fixed (temporary - needs proper image upload)

### Issue #7: Infinite Carousel Duplication  
**Problem:** Carousel created duplicate rows or empty first row.
**Fix:** Disabled `initInfiniteCarousel()` - now displays as single scrollable row.
**Status:** ✅ Fixed

### Issue #8: Text Wrapping on Selected Works Cards
**Problem:** Text overflowing or awkward line breaks on work cards.
**Fix:** Added `white-space: normal` and `word-wrap: break-word` to overlay text.
**Status:** ✅ Fixed

---

## 🚨 REMAINING ISSUES (High Priority)

**STATUS: ALL RESOLVED** ✅

All reported issues have been fixed:
1. ✅ Password login - Fixed with DOMContentLoaded wrapper
2. ✅ Blob URLs - Converted to placeholders (ready for real upload)
3. ✅ Infinite carousel - Disabled duplication
4. ✅ Text wrapping - Added to work cards
5. ✅ Gallery image paths - Normalized 59 paths
6. ✅ Showreel section - Config verified
7. ✅ Poster preview - Added to edit modal
8. ✅ Camera equipment - 5 fields added
9. ✅ Current stills - Grid with delete functionality

---

## 🐛 BUG FIXES - May 14, 2026

### Critical Issue #1: Image Path Resolution (404 Errors)
**Problem:** All images were returning 404 errors because paths were relative (`assets/images/...`) instead of absolute (`/assets/images/...`). When viewed from the dashboard (`/dashboard/`), the browser tried to load images from `/dashboard/assets/images/` which doesn't exist.

**Root Cause:** 
- Image paths in config stored as `assets/images/filename.png` (relative)
- Dashboard serves from `/dashboard/` route
- Browser resolves relative paths from current route, causing 404s

**Fix Applied:**
1. Updated `server.js` upload endpoint to return absolute paths:
   ```javascript
   // Before:
   assetsPath: `assets/images/${filename}`
   
   // After:
   assetsPath: `/assets/images/${filename}`
   ```
2. Added path normalization in `renderHeroStillsSelector()` (line 1002):
   ```javascript
   const stillPath = still.src.startsWith('/') ? still.src : '/' + still.src;
   ```
3. Fixed 59 existing image paths in `config/site-config.json` to use absolute paths

**Verification:** All images now load correctly from both live site and dashboard.

---

### Critical Issue #2: Config Save 500 Error
**Problem:** POST to `/api/config` was returning HTML error page instead of JSON, causing:
```
Failed to execute 'json' on 'Response': Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**Root Cause:** Server had no error handling for the save operation, so any exception would crash the request and return an HTML error page.

**Fix Applied:**
1. Added try-catch wrapper around config save in `server.js`:
   ```javascript
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
   ```

2. Enhanced `saveConfig()` function with error handling:
   ```javascript
   function saveConfig(config) {
     try {
       if (!fs.existsSync(CONFIG_DIR)) {
         fs.mkdirSync(CONFIG_DIR, { recursive: true });
       }
       fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
       logger.debug('Config saved to', CONFIG_FILE);
     } catch (error) {
       logger.error('Failed to save config:', { error: error.message });
       throw error;
     }
   }
   ```

**Verification:** Config now saves successfully with proper error messages on failure.

---

### Critical Issue #3: Dashboard Content Not Populated
**Problem:** Dashboard sections (About, Showreel, Contact, Footer) showed empty fields instead of current live site values.

**Fix:** Updated `config/site-config.json` with actual content from the live site including:
- About section: header, tagline, full bio, stats
- Showreel: Vimeo URL (https://vimeo.com/1132983429)
- Contact: email, location, form settings
- Footer: tagline and social links

---

### Critical Issue #4: Social Media Icons - Emoji → SVG
**Problem:** Footer social links used emojis (🎬, 📸, 💼) instead of professional branded icons.

**Fix:** 
1. Created `getSocialIconSVG()` function with 10 platform icons (Vimeo, Instagram, LinkedIn, YouTube, Facebook, Twitter/X, TikTok, IMDb, Letterboxd, Threads)
2. Updated both `script.js` (live site) and `dashboard-server/index.html` (dashboard) to use SVG icons
3. Icons are 24px × 24px, vector-based, and inherit color from theme

**Verification:** All social links now display crisp, professional SVG icons.

---

## 🔒 TAILSCALE CONFIGURATION - Remote Access

### Dashboard Server Status Check
**Mandatory:** Before any dashboard work, ensure the dashboard server is running:
```bash
# Check if running
curl -s http://localhost:5001/ | head -3

# If not running, start it:
cd /mnt/c/Users/kundu/Desktop/portfolio-sample/dashboard-server
npm start
```

### Tailscale Access Setup
The dashboard is accessible via Tailscale for remote development and testing.

**Access URLs:**
- **Local:** `http://localhost:5001/dashboard/`
- **Tailscale IP:** `http://100.105.149.105:5001/dashboard/`
- **Tailnet DNS:** `http://zeus:5001/dashboard/`

**Password:** `JOELKUNDU`

**From Another Device:**
1. Install Tailscale: https://tailscale.com/download
2. Connect to tailnet: `kundujoel2@`
3. Open: `http://100.105.149.105:5001/dashboard/`

### Automated Setup Script
A helper script is available at `/home/joel/hermes/scripts/portfolio-dashboard.sh`:
```bash
# Run the setup script
/home/joel/hermes/scripts/portfolio-dashboard.sh
```

This script:
- ✅ Checks if dashboard server is running
- ✅ Starts it if needed
- ✅ Displays all access URLs
- ✅ Shows Tailscale connection info

### Cron Job for Auto-Start (Optional)
To automatically start the dashboard server on system boot:
```bash
# Create a systemd service or add to crontab
crontab -e

# Add this line to run on boot:
@reboot /home/joel/hermes/scripts/portfolio-dashboard.sh > /tmp/portfolio-dashboard.log 2>&1
```

### Tailscale Serve/Funnel Status
**Current Status:** Tailscale Serve is not enabled on your tailnet.

**To Enable:**
1. Visit: https://login.tailscale.com/f/serve?node=njDPAKGNK921CNTRL
2. Enable Serve/Funnel for your tailnet
3. Once enabled, you can use:
   ```bash
   tailscale serve 5001
   ```

**Current Workaround:** Direct Tailscale IP access works without Serve enabled.

---

## 🚀 DEPLOYMENT

### Netlify Configuration
```toml
[build]
  command = " "
  publish = "."

[[redirects]]
  from = "/api/*"
  to = "https://your-server.com/api/:splat"
  status = 200
  force = true
```

### Manual Deployment
1. Run dashboard server: `npm start` in `dashboard-server/`
2. Edit content via dashboard at `http://localhost:3000`
3. Click "Save & Deploy"
4. Commit changes to git branch
5. Push to remote
6. Netlify auto-deploys on push

---

## 📝 RECOMMENDATIONS

### Immediate (P0)
- [x] Fix double row in Selected Works section
- [x] Fix services mouse tracking
- [x] Fix image path resolution (404 errors)
- [x] Fix config save 500 error
- [ ] Connect work-detail.html to dashboard data
- [ ] Implement server-side authentication

### Short-term (P1)
- [x] Normalize image paths (completed May 14, 2026)
- [ ] Integrate contact form backend
- [ ] Add auto-save with debounce
- [ ] Replace alerts with toast notifications

### Medium-term (P2)
- [ ] Modularize code (extract reusable functions)
- [ ] Add accessibility improvements
- [ ] Optimize gallery performance
- [ ] Add comprehensive error handling

### Long-term (P3)
- [ ] Migrate to modern framework (React/Vue)
- [ ] Add user management (multi-user support)
- [ ] Implement version history / rollback
- [ ] Add analytics dashboard

---

## 🧪 TESTING CHECKLIST

### Live Site
- [x] Hero slideshow rotates correctly
- [x] Theme switching persists
- [x] Parallax works on desktop, disabled on mobile
- [x] 3D tilt effects work smoothly
- [x] Draggable logo springs back
- [x] Gallery filters work
- [x] Fullscreen image modal closes properly
- [x] Contact form submits (mock)
- [x] Timecode updates correctly
- [x] Coffee easter egg triggers
- [x] **Selected Works shows single row (no duplicates)**
- [x] **Services section has all 6 services with mouse tracking**

### Dashboard
- [ ] Login works with correct password
- [ ] Config loads correctly
- [ ] All form fields save properly
- [ ] Image uploads work
- [ ] Git commit/push works
- [ ] Change detection triggers
- [ ] beforeunload warning appears
- [ ] Toast notifications display

---

## 📚 ADDITIONAL DOCUMENTATION
- `README.md` - Project overview and setup
- `STILLS_WORKFLOW.md` - Stills management workflow
- `HERMES.md` - Hermes Agent context (if applicable)
- `AGENTS.md` - This file - comprehensive feature documentation

---

**End of Documentation**
