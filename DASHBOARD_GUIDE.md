# 🎬 Dashboard Setup & Usage Guide

## ✅ What's Been Built

A **local-first dashboard** that lets you manage all content for your portfolio website. The dashboard:

- ✅ Runs locally on your machine (`localhost:3000`)
- ✅ Has password-protected authentication
- ✅ Allows CRUD operations on all site content
- ✅ Automatically copies uploaded images to `assets/` folder for git
- ✅ Generates config files that can be committed and deployed
- ✅ Works completely offline after setup

## 🚀 Quick Start

### 1. Install Node.js (if not already installed)
```bash
# Check if installed
node --version

# If not installed, download from: https://nodejs.org/
# Choose the LTS version (Long Term Support)
```

### 2. Navigate to Dashboard Folder
```bash
cd /mnt/c/Users/kundu/Desktop/portfolio-sample/dashboard-server
```

### 3. Install Dependencies (First Time Only)
```bash
npm install
```

### 4. Start the Dashboard
```bash
npm start
```

### 5. Access the Dashboard
Open your browser and go to:
**http://localhost:3000/dashboard/**

**Password:** `JOELKUNDU`

## 📁 Project Structure

```
portfolio-sample/
├── dashboard-server/          # Dashboard application
│   ├── server.js             # Node.js/Express server
│   ├── index.html            # Dashboard UI
│   ├── package.json          # Dependencies
│   ├── start.sh              # Quick start script
│   └── config/               # Generated config files
│       └── site-config.json  # All your content
├── assets/                   # Site assets (auto-updated)
│   └── images/               # Images go here
├── index.html                # Main site (uses config)
└── style.css                 # Site styles
```

## 🔧 Features by Section

### Hero Section
- ✅ Edit name and tagline
- ✅ Add/remove laurels (uploads to `assets/images/`)
- ✅ Configure theme colors
- ⏳ Laurel bubble layout (pending implementation)

### About Section
- ✅ Edit header, tagline, paragraph
- ✅ Manage stats (number + text)
- ⏳ Add/remove/reorder stats

### Selected Works
- ⏳ CRUD operations for projects
- ⏳ IMDB URL import (needs OMDB API key)
- ⏳ Toggle visibility of details
- ⏳ Auto-extract cast, crew, location

### Showreel
- ⏳ Update Vimeo URL
- ⏳ Preview embed

### Gallery
- ⏳ Auto-populates from Selected Works
- ⏳ Upload additional stills
- ⏳ BTS tagging and collation

### Services
- ⏳ Show/hide services
- ⏳ Reorder services
- ⏳ Edit descriptions

### Contact
- ✅ Edit message text
- ✅ Update email
- ⏳ Toggle location visibility
- ⏳ Manage website link

### Footer
- ⏳ Edit tagline
- ⏳ Manage social media links
- ⏳ Add/remove/edit links

## 📸 Image Upload Workflow

When you upload an image (laurel, still, BTS, etc.):

1. **Upload via dashboard** → File saved to `dashboard-server/uploads/`
2. **Auto-copy** → File copied to `assets/images/`
3. **Config updated** → Path stored in `site-config.json`
4. **Ready for git** → Commit both config and images

```bash
# After uploading images/config changes:
git add .
git commit -m "Add new laurels and update config"
git push
```

## 🌐 Deployment to Vercel

### Step 1: Prepare for Deployment
```bash
# Make sure all changes are committed
git status

# Push to GitHub
git push
```

### Step 2: Setup Vercel
```bash
# Install Vercel CLI (first time only)
npm install -g vercel

# Login to Vercel
vercel login
```

### Step 3: Deploy
```bash
# Deploy to production
vercel --prod
```

Or use the Vercel web interface:
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Deploy"

### Step 4: Auto-Deploy
After initial setup, Vercel will automatically deploy when you push to main branch.

## 🔐 Security

### Current Implementation:
- Password authentication (bcrypt hashing)
- JWT tokens (24-hour expiry)
- Client-side protection

### For Production:
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS on Vercel
- [ ] Consider server-side auth for sensitive data
- [ ] Add rate limiting

## 🛠️ Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
pkill -f "node server.js"

# Or change port in server.js
const PORT = 3001; // Change to any available port
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Images Not Appearing
1. Check `assets/images/` folder exists
2. Verify file permissions
3. Check browser console for errors

### Config Not Saving
1. Ensure `dashboard-server/config/` directory exists
2. Check write permissions
3. Look for errors in server console

## 📋 Next Steps

### Immediate (You Should Do):
1. ✅ Test the dashboard locally
2. ⏳ Add your first laurel via dashboard
3. ⏳ Update hero section info
4. ⏳ Commit changes to git

### Next Development Phase:
1. Complete all dashboard sections
2. Implement laurel bubble layout
3. Add IMDB integration (get OMDB API key)
4. Create deployment automation script
5. Add backup/export functionality

### Get OMDB API Key (Optional):
If you want IMDB auto-import:
1. Go to https://www.omdbapi.com/apikey.aspx
2. Get free API key (1000 requests/day)
3. Add to `.env` file:
```
OMDB_API_KEY=your_key_here
```

## 📞 Support

If something breaks:
1. Check server console for errors
2. Look at browser console (F12)
3. Check `dashboard-server/config/site-config.json` for config issues
4. Restart the server

## 🎯 Testing Checklist

Before deploying to production:

- [ ] Login works
- [ ] Can upload images
- [ ] Images appear in `assets/images/`
- [ ] Config saves correctly
- [ ] All sections are editable
- [ ] Changes reflect on main site
- [ ] Git commits work
- [ ] Vercel deployment works

---

**Status:** ✅ Phase 1 Complete - Basic Dashboard Structure
**Branch:** `dashboard-dev`
**Next:** Complete remaining sections and test thoroughly
