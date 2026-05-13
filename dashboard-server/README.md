# Portfolio Dashboard - Setup Guide

## Overview
This is a local-first dashboard for managing Joel Kundu's portfolio website. The dashboard runs on your machine, allows you to configure all content, and then you can deploy the static site to Vercel.

## Installation

### 1. Install Node.js
If you don't have Node.js installed:
- Download from: https://nodejs.org/
- Choose the LTS version
- Install and restart your terminal

### 2. Install Dependencies
```bash
cd dashboard-server
npm install
```

### 3. Start the Dashboard
```bash
npm start
```

The dashboard will open at: **http://localhost:5001/dashboard/**

### 4. Login
Default password: `JOELKUNDU`

## Features

### Hero Section
- Edit name and tagline
- Manage laurels (add/remove)
- Theme color configuration

### About Section
- Edit header, tagline, and paragraph text
- Manage stats (number + text)

### Selected Works
- CRUD operations for projects
- IMDB URL import (auto-fetch cast, crew, etc.)
- Toggle visibility of project details

### Gallery
- Auto-populates from Selected Works
- Upload additional stills
- BTS (Behind The Scenes) management

### Services
- Show/hide services
- Reorder services
- Edit descriptions

### Contact
- Edit message text
- Update email
- Toggle location visibility

### Footer
- Edit tagline
- Manage social media links

## Configuration Files

All your content is stored in:
- `dashboard-server/config/site-config.json` - Main configuration
- `assets/images/` - Uploaded images

## Deployment to Vercel

### 1. Migrate from Netlify
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 2. Vercel Setup
1. Go to https://vercel.com
2. Import your GitHub repository
3. Build command: (leave default for static site)
4. Deploy!

## Development Workflow

1. **Make changes locally:**
   - Run `npm start` in `dashboard-server/`
   - Access dashboard at `http://localhost:3000/dashboard/`
   - Configure content
   - Save changes

2. **Preview changes:**
   - Open `index.html` in browser
   - Review all changes

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update portfolio content"
   git push
   ```

4. **Deploy to Vercel:**
   - Vercel auto-deploys on push to main branch
   - Or run `vercel --prod` manually

## Security Notes

- Dashboard is protected by password (client-side hashing)
- For production, consider:
  - Moving auth to server-side
  - Using environment variables for sensitive data
  - Enabling HTTPS

## Troubleshooting

### Port already in use
If port 3000 is already in use, edit `server.js` and change:
```javascript
const PORT = 3000; // Change to 3001 or any available port
```

### Images not uploading
Make sure the `uploads/` directory exists and has write permissions.

### Config not saving
Check that `dashboard-server/config/` directory exists and is writable.

## Next Steps

- [ ] Complete all dashboard sections
- [ ] Add IMDB integration (requires OMDB API key)
- [ ] Implement laurel bubble layout
- [ ] Add image optimization
- [ ] Create deployment automation
- [ ] Add backup/export functionality

## Support

For issues or questions, check the dashboard logs in the terminal where the server is running.
