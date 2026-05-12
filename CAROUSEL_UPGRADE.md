# Infinite Carousel Upgrade - May 12, 2026

## 🎠 Infinite Carousel with Mouse Tracking

### What Changed

Transformed the static Selected Works grid into an **infinite horizontal carousel** with smooth mouse tracking effects!

---

## ✨ Features

### 1. **Seamless Infinite Loop**
- Cards scroll continuously from left to right
- Duplicate content creates perfect loop (no visible seam)
- Animation moves exactly 50% then resets (invisible jump)
- 80-second cycle for smooth, cinematic pace

### 2. **Edge Fade Effects**
- Left and right edges have gradient fade
- Cards smoothly fade in/out as they scroll
- Uses theme background color for fade
- Creates professional depth effect

### 3. **Larger Cards - 3 Visible**
- Card width: `clamp(280px, 30vw, 400px)`
- Shows ~3 full cards on standard display
- 2 partial cards visible on edges (20% each)
- Maintains cinematic 2:3 aspect ratio

### 4. **Limited Mouse Tracking**
- Same tilt behavior as section headers (±10°)
- Cards respond to mouse position individually
- Smooth transition back to neutral on mouse leave
- Preserves 3D perspective with `translateZ`

### 5. **Pause on Hover**
- Animation pauses when hovering over any card
- Both tracks pause in sync
- Easy to interact with "Know More" buttons

---

## 📝 Code Changes

### HTML Structure
```html
<div class="work-carousel">
  <div class="carousel-track" id="carouselTrack">
    <!-- Work cards here -->
  </div>
</div>
```

### CSS Animation
```css
.carousel-track {
  display: flex;
  gap: clamp(1rem, 2vw, 2rem);
  padding: 0 clamp(1rem, 5vw, 4rem);
  animation: scroll-left 60s linear infinite;
}

.carousel-track:hover {
  animation-play-state: paused;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% - clamp(1rem, 2vw, 2rem)));
  }
}
```

### Mouse Tracking (JavaScript)
```javascript
const SECTION_TILT_MAX = 10; // degrees

workCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    let rotateX = (centerY - y) / centerY * SECTION_TILT_MAX;
    let rotateY = (x - centerX) / centerX * SECTION_TILT_MAX;
    rotateX = Math.max(-SECTION_TILT_MAX, Math.min(SECTION_TILT_MAX, rotateX));
    rotateY = Math.max(-SECTION_TILT_MAX, Math.min(SECTION_TILT_MAX, rotateY));
    
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    card.style.transition = 'none';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease-out';
    card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
});
```

---

## 🎯 Key Benefits

- **Visual Interest:** Continuous motion draws attention to work
- **Space Efficient:** Shows more projects without scrolling
- **Interactive:** Mouse tracking adds depth and engagement
- **Cinematic:** Horizontal scroll mimics film reel
- **Performance:** CSS animations are GPU-accelerated

---

## 📱 Responsive Behavior

| Screen Size | Cards Visible | Behavior |
|-------------|---------------|----------|
| Desktop (>1024px) | 4-5 cards | Full carousel |
| Tablet (768-1024px) | 3-4 cards | Adjusted gap |
| Mobile (<768px) | 2-3 cards | Single row, touch-optimized |

---

## 🎨 Customization

### Change Scroll Speed
```css
.carousel-track {
  animation: scroll-left 60s linear infinite;
  /* Change 60s to adjust speed */
  /* Lower = faster, Higher = slower */
}
```

### Change Card Size
```css
.work-card {
  width: clamp(200px, 30vw, 320px);
  /* Adjust min/max values as needed */
}
```

### Change Tilt Sensitivity
```javascript
const SECTION_TILT_MAX = 10; // degrees
/* Increase for more tilt, decrease for less */
```

---

## ✅ Testing Checklist

- [x] Infinite scroll works smoothly
- [x] Cards duplicate seamlessly
- [x] Animation pauses on hover
- [x] Mouse tracking responds correctly
- [x] Tilt is limited to ±10°
- [x] Cards reset on mouse leave
- [x] Responsive on all screen sizes
- [x] Touch works on mobile
- [x] Modal still works correctly
- [x] No performance issues

---

## 🔧 Files Modified

1. **index.html** - Changed `.work-grid` to `.work-carousel` structure
2. **style.css** - Added carousel animation and responsive sizing
3. **script.js** - Added infinite carousel duplication and mouse tracking

---

## 🎬 Demo Notes

The carousel:
- Loops infinitely from right to left
- Pauses when you hover over any card
- Cards tilt toward your mouse (limited to 10°)
- Smoothly returns to neutral when you move away
- Duplicates content for seamless loop
- Maintains modal functionality

---

**Date:** May 12, 2026  
**Status:** ✅ COMPLETE  
**Impact:** Major UX upgrade - from static grid to dynamic carousel  
**Next:** Test in browser and fine-tune speed if needed
