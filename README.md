# Joel Kundu Portfolio - Sample Site

This is a high-end, cinema-focused portfolio template designed for Joel Kundu (cinematographer/director). 

## 📁 Folder Structure
```
/assets
  /video      - Hero background video (MP4/WebM, <5MB, muted, looped)
  /images
    portrait.jpg          - Professional headshot/on-set portrait
    thumbs/
      e13m-thumb.jpg      - Thumbnail for E13M (16:9 or 2:1)
      project2-thumb.jpg  - etc.
      project3-thumb.jpg
      ...
index.html
style.css
script.js
```

## ✅ Items Needed From You

### 1. **Media Assets**
   - **Hero Video**: 5-10 second looped clip from your best work (E13M, DP reel, etc.)
     - Format: MP4 (H.264) or WebM
     - Max size: 5MB (optimize via Handbrake or Squoosh)
     - Must be **muted** (will autoplay muted)
   - **Portrait Image**: High-quality headshot or candid on-set photo
     - Suggested: Warm lighting, charcoal backdrop (per your Visual Approach v2)
     - Format: JPG or WebP
   - **Project Stills**: 3-5 high-quality stills per project (for modals/gallery)
     - Format: JPG or WebP (optimize for web)
   - **Thumbnails**: One representative still per project (for grid)
     - Aspect ratio: 16:9 or 2:1 (cinematic)
     - Size: ~300-500KB each
   - **Reel Video**: Your showreel (60-90 sec)
     - Host on Vimeo (free) or YouTube (unlisted)
     - Get embed code (we'll replace the Vimeo iframe src)

### 2. **Content Details**
   - **About Section Bio**: 
     - Creative bio (your film philosophy, VSchool, SYDHT shorts)
     - Academic bio (OHSM grad, how safety informs your work)
   - **Project Information** (for each work card):
     - Title (e.g., "E13M")
     - Your role(s) (DP, Director, etc.)
     - Brief synopsis (2-3 sentences highlighting theme/symbolism)
     - Credits (if desired)
     - Festival/awards (if any)
   - **Reel Note**: Custom text (or keep default: "Full-resolution reel available upon request...")
   - **Contact Info**: 
     - Preferred email (for mailto link)
     - Or use Formspree (free) - get form ID from [formspree.io](https://formspree.io/)

### 3. **Customizations (Optional)**
   - **Color Tweaks**: Adjust `--accent`, `--bg-dark`, etc. in `style.css` if you want different tones
   - **Fonts**: Currently using Cormorant Garamond + Inter (Google Fonts) - change in `<head>` if desired
   - **Additional Sections**: 
     - Awards/Festivals
     - Testimonials
     - Blog/Thoughts
     - Equipment list

## 🚀 Next Steps
1. Replace placeholder files in `/assets` with your actual media
2. Update `index.html`:
   - Hero video src
   - Portrait image src
   - Work card images, links, titles, roles
   - Reel iframe src (Vimeo/YouTube embed)
   - Form action URL (Formspree) or keep mailto
   - Project detail pages (create `project-e13m.html` etc. or use modals)
3. Test locally by opening `index.html` in browser
4. Deploy to Netlify (free):
   - Push this folder to GitHub repo
   - Connect repo to [Netlify](https://app.netlify.com/)
   - Set build command: `none`, publish directory: `/`
   - Add custom domain (e.g., joelkundu.com) if desired

## 💡 Pro Tips
- Optimize all images with [Squoosh.app](https://squoosh.app/) (WebP, max quality 80)
- For video: Use Handbrake -> Fast 1080p30, constant quality 22-24, WebM/H.264
- Thumbnails: Export from DaVinci/Premiere at 1200px width, sharpen slightly
- Keep the site fast: Aim for <3MB total initial load (excluding embedded video from Vimeo/YouTube)

---

**Questions?** I'm here to help refine any section, troubleshoot, or add features (like a modal gallery instead of separate pages). Just ask!

Let's make this portfolio as compelling as your work. 🎬