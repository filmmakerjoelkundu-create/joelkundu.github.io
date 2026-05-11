# 🎬 Joel Kundu Portfolio - Update Complete!

## ✅ What's Been Done

### 🎨 Theme System
- **5 New Themes**: Thriller, Drama, Horror, Sci-Fi, Action
- **Retro Fonts**: Bebas Neue, DM Sans, Playfair Display, Cormorant Garamond
- **Theme Toggle**: Emoji-only buttons (no text labels)
- **Persistence**: Theme preference saved to localStorage

### 🖼️ Hero Section
- **Slideshow Background**: Cycles through images every 8 seconds
- **Layered 3D Scene**: BG slideshow → crosshairs → easter egg → content → timecode → viewfinder
- **Alexa Mini LF Viewfinder**: Accurate camera overlay with ISO, FPS, WB, F-STOP
- **Live Timecode**: Real-time 24fps timecode display
- **Clapperboard Easter Egg**: Click for fun filmmaking messages

### 🎯 About Section
- **Tile Background Headers**: Animated tile backgrounds on section headers
- **3D Layered Stats**: Stats cards with 3D hover effects
- **Coffee Easter Egg**: Click the coffee stat 5x for coffee rain! ☕
- **Responsive Padding**: Proper spacing between all sections

### 📐 Selected Works
- **Movie Poster Aspect Ratio**: 2:3 portrait orientation
- **"Know More" Buttons**: Updated from "View Stills"
- **3D Reactive Cards**: All cards respond to mouse position
- **No Filters**: Removed filter toggles as requested

### 🎬 Showreel
- **Clean Video Frame**: No overlay artifacts
- **3D Reactive**: Video frame responds to mouse (static when playing)

### 🖼️ Gallery Section (NEW)
- **Random Grid**: Random arrangement of images
- **Auto-Rotation**: Images transition every 5 seconds
- **Project Filters**: Filter by project (E13M, Short, Documentary, Commercial)
- **Fullscreen View**: Click images to view fullscreen
- **Image Protection**: No right-click or download

### 🛠️ Services
- **Professional Icons**: Updated from childish emojis
- **3D Layered**: Heading front, tiles floating back
- **Mouse Reactive**: All elements respond to mouse position

### 📞 Contact
- **Client Statement**: Conversion-focused message
- **Dual Forms**: General Enquiry + Request Quote
- **Quote Form Fields**: Project type, scope, services, budget, timeline
- **Custom Options**: Add your own service options

### 🦶 Footer
- **Solid Background**: Clean, professional look
- **Logo Integration**: Your logo prominently displayed
- **Platform Links**: Vimeo, Instagram, LinkedIn with icons

### 🎯 Project Details Modal
- **Gaussian Blur BG**: Blurs main site when open
- **Full Metadata**: Director, producer, cinematographer, editor, location, duration, year
- **Laurels Section**: Festival selections and awards
- **Dual Galleries**: Stills (top) + BTS (bottom)
- **All Fields Optional**: Only show what you want

### 📊 Dashboard
- **Project Gallery**: Visual overview of all projects
- **Add/Edit Projects**: Full form with all metadata
- **Statistics**: Total projects, stills, laurels
- **Delete Functionality**: Remove projects easily

### 🔒 Protection
- **No Right-Click**: Prevents image download
- **No Drag**: Prevents dragging images
- **Selection Disabled**: Text selection protected

### 📱 Responsive Design
- **Mobile First**: Works on phones, tablets, laptops, TVs
- **Touch Friendly**: All interactions work on touch devices
- **Adaptive Layout**: Grids adjust to screen size

## 📁 What You Need to Do

### 1. Add Your Images
Create these folders and add your images:

```
assets/
├── hero-slideshow/          # Hero background images
│   ├── img1.jpg
│   ├── img2.jpg
│   └── img3.jpg
├── posters/                # Movie posters (2:3 aspect ratio)
│   ├── e13m-poster.jpg
│   ├── short2-poster.jpg
│   └── ...
├── stills/                 # Project stills
│   ├── e13m/
│   │   ├── still1.jpg
│   │   └── still2.jpg
│   └── short2/
│       └── ...
└── bts/                   # Behind the scenes
    ├── e13m/
    │   ├── bts1.jpg
    │   └── bts2.jpg
    └── ...
```

### 2. Update Project Data
Edit `script.js` to update the `projectData` object with your real projects:

```javascript
const projectData = {
    'your-project-id': {
        title: 'Your Project Title',
        role: 'Director of Photography',
        synopsis: 'Your project description',
        director: 'Director Name',
        producer: 'Producer Name',
        cinematographer: 'Your Name',
        editor: 'Editor Name',
        location: 'Location',
        duration: 'Duration',
        year: '2024',
        laurels: [
            'Official Selection - Festival Name',
            'Best Cinematography - Award Name'
        ],
        stills: [
            'assets/stills/your-project/still1.jpg',
            'assets/stills/your-project/still2.jpg'
        ],
        bts: [
            'assets/bts/your-project/bts1.jpg',
            'assets/bts/your-project/bts2.jpg'
        ]
    }
};
```

### 3. Update Contact Forms
Replace `YOUR_FORM_ID` and `YOUR_QUOTE_FORM_ID` in `index.html` with your Formspree IDs:

```html
<form id="generalForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
<form id="quoteForm" action="https://formspree.io/f/YOUR_QUOTE_FORM_ID" method="POST">
```

### 4. Update Vimeo Embed
Replace the Vimeo video ID in `index.html`:

```html
<iframe src="https://player.vimeo.com/video/YOUR_VIDEO_ID?h=2a3b4c5d6e&title=0&byline=0&portrait=0">
```

### 5. Test Everything
- Open `index.html` in your browser
- Test all 5 themes
- Test easter eggs (clapperboard, coffee)
- Test all modals and forms
- Test on different screen sizes
- Test on mobile devices

## 🎯 Easter Eggs

### Clapperboard 🎬
- Click the clapperboard in the hero section
- Shows random filmmaking messages
- Animates on each click

### Coffee Rain ☕
- Click the "Coffee Consumed" stat 5 times
- Coffee cups fall from the top of the screen
- Resets after 5 seconds

## 🚀 Deployment

### Option 1: Netlify (Recommended)
1. Push to GitHub
2. Connect to Netlify
3. Set build command: `none`
4. Set publish directory: `/`
5. Add custom domain if desired

### Option 2: GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repo settings
3. Select main branch
4. Your site is live!

## 📝 Notes

- All images should be optimized (WebP, max quality 80)
- Keep total initial load under 3MB
- Video should be under 5MB for hero
- Use Squoosh.app for image optimization
- Use Handbrake for video optimization

## 🎨 Customization

### Change Colors
Edit `style.css` theme variables:

```css
[data-theme="thriller"] {
    --color-bg-primary: #000510;
    --color-accent: #00bcd4;
    /* ... */
}
```

### Change Fonts
Edit font imports in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap">
```

### Add More Themes
Add new theme in `style.css` and button in `index.html`

## 🆘 Troubleshooting

### Images Not Showing
- Check file paths are correct
- Ensure images are in the right folders
- Check file names match exactly

### Theme Not Saving
- Check browser localStorage is enabled
- Try clearing browser cache

### Forms Not Working
- Verify Formspree IDs are correct
- Check Formspree account is active

### 3D Effects Not Working
- Check JavaScript is loaded
- Verify no console errors
- Check browser supports CSS 3D transforms

## 📞 Support

If you need help:
1. Check browser console for errors
2. Verify all file paths are correct
3. Test in different browsers
4. Check internet connection (for fonts)

---

**Made with ❤️ for Joel Kundu**

*Last Updated: May 10, 2026*
