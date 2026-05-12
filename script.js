// ============================================
// CINEMATOGRAPHER PORTFOLIO - JOEL KUNDU
// ============================================

// Mobile detection - disable mouse tracking on mobile devices
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad on Safari
}

const isMobile = isMobileDevice();
console.log('Mobile device detected:', isMobile);

// Update year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// PASSWORD PROTECTION - SHA-256 HASH
// ============================================
const passwordOverlay = document.getElementById('passwordOverlay');
const passwordInput = document.getElementById('passwordInput');
const passwordSubmit = document.getElementById('passwordSubmit');
const passwordError = document.getElementById('passwordError');
const passwordContainer = document.querySelector('.password-container');

// SHA-256 hash of the password (JOELKUNDU)
const PASSWORD_HASH = '3eafffb953d3f55fb134b6854dea019bbb2f091f32faa7666c1871d5fc171fe7';

// SHA-256 hashing function
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Position password container on hero section
function positionPasswordOnHero() {
    const heroSection = document.querySelector('.hero');
    if (heroSection && passwordContainer) {
        const heroRect = heroSection.getBoundingClientRect();
        const heroCenterX = heroRect.left + heroRect.width / 2;
        const heroCenterY = heroRect.top + heroRect.height / 2;

        passwordContainer.style.position = 'fixed';
        passwordContainer.style.left = `${heroCenterX}px`;
        passwordContainer.style.top = `${heroCenterY}px`;
        passwordContainer.style.transform = 'translate(-50%, -50%)';
    }
}

// Auth storage keys and expiry
const AUTH_KEY = 'portfolio-auth';
const AUTH_TIMESTAMP_KEY = 'portfolio-auth-ts';
const AUTH_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in ms

// Clear stale auth from old localStorage-based versions
if (localStorage.getItem('portfolio-auth') === 'true') {
    localStorage.removeItem('portfolio-auth');
}

// Validate stored auth: must match hash AND not be expired
function isAuthValid() {
    const storedHash = sessionStorage.getItem(AUTH_KEY);
    const storedTs = sessionStorage.getItem(AUTH_TIMESTAMP_KEY);
    if (storedHash !== PASSWORD_HASH) return false;
    if (!storedTs) return false;
    if (Date.now() - parseInt(storedTs, 10) > AUTH_MAX_AGE) {
        // Expired — clear it
        sessionStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(AUTH_TIMESTAMP_KEY);
        return false;
    }
    return true;
}

// Check if already authenticated
if (isAuthValid()) {
    passwordOverlay.classList.add('hidden');
    document.body.style.overflow = '';
} else {
    // Lock scroll and position on hero
    document.body.style.overflow = 'hidden';
    positionPasswordOnHero();
}

// Reposition on window resize
window.addEventListener('resize', positionPasswordOnHero);

passwordSubmit.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});

async function checkPassword() {
    const password = passwordInput.value;
    const inputHash = await sha256(password);

    if (inputHash === PASSWORD_HASH) {
        sessionStorage.setItem(AUTH_KEY, inputHash);
        sessionStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
        passwordOverlay.classList.add('hidden');
        document.body.style.overflow = ''; // Unlock scroll
    } else {
        passwordError.classList.add('show');
        passwordInput.value = '';
        setTimeout(() => {
            passwordError.classList.remove('show');
        }, 3000);
    }
}

// ============================================
// THEME SWITCHING
// ============================================
const themeButtons = document.querySelectorAll('.theme-btn');
const htmlElement = document.documentElement;

// Available themes
const availableThemes = ['thriller', 'drama', 'horror', 'scifi', 'action'];

// Get random theme
function getRandomTheme() {
    const randomIndex = Math.floor(Math.random() * availableThemes.length);
    return availableThemes[randomIndex];
}

// Check for saved theme preference or get random
const savedTheme = localStorage.getItem('portfolio-theme');
const themeToUse = savedTheme || getRandomTheme();

// Set initial theme
function setTheme(theme) {
    // Remove all theme attributes
    htmlElement.removeAttribute('data-theme');
    
    // Set the new theme
    if (theme !== 'light') {
        htmlElement.setAttribute('data-theme', theme);
    }
    
    // Update active button
    themeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    // Save preference (so manual changes persist)
    localStorage.setItem('portfolio-theme', theme);
    
    console.log(`🎭 Theme: ${theme}`);
}

// Initialize with random theme on each load
setTheme(themeToUse);

// Theme button click handlers
themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        setTheme(theme);
    });
});

// ============================================
// DETECT REGION FOR FPS
// ============================================
function detectRegion() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fpsDisplay = document.getElementById('fpsDisplay');
    
    // PAL regions (Europe, most of Asia, Africa, Australia)
    const palTimezones = [
        'Europe/', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo',
        'Australia/', 'Africa/', 'America/Sao_Paulo'
    ];
    
    const isPAL = palTimezones.some(tz => timezone.includes(tz));
    fpsDisplay.textContent = isPAL ? '24' : '23.976';
}

detectRegion();

// ============================================
// TIMECODE
// ============================================
function updateTimecode() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const frames = String(Math.floor(now.getMilliseconds() / 41.67)).padStart(2, '0'); // ~24fps
    document.getElementById('timecode').textContent = `${hours}:${minutes}:${seconds}:${frames}`;
}

setInterval(updateTimecode, 42); // Update every ~42ms for 24fps
updateTimecode();

// ============================================
// RECORDING TIME
// ============================================
function updateRecTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('recTime').textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateRecTime, 1000);
updateRecTime();

// ============================================
// RANDOM HERO SLIDESHOW - DYNAMIC IMAGE SELECTION
// ============================================

// Generate all available stills from the catalogue
function getAllAvailableStills() {
    const stills = [];
    for (let i = 11; i <= 96; i++) {
        stills.push(`assets/images/Screenshot (${i}).png`);
    }
    return stills;
}

// Get or generate random hero images
function getHeroImages() {
    const STORAGE_KEY = 'portfolio-hero-images';
    const TIMESTAMP_KEY = 'portfolio-hero-timestamp';
    const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    
    const storedImages = localStorage.getItem(STORAGE_KEY);
    const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
    const now = Date.now();
    
    // Check if we have cached images that are still valid
    if (storedImages && storedTimestamp) {
        const timestamp = parseInt(storedTimestamp);
        if (now - timestamp < CACHE_DURATION) {
            return JSON.parse(storedImages);
        }
    }
    
    // Generate new random selection
    const allStills = getAllAvailableStills();
    const selectedImages = [];
    const usedIndices = new Set();
    
    // Select 6 random unique images
    while (selectedImages.length < 6 && usedIndices.size < allStills.length) {
        const randomIndex = Math.floor(Math.random() * allStills.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            selectedImages.push(allStills[randomIndex]);
        }
    }
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedImages));
    localStorage.setItem(TIMESTAMP_KEY, now.toString());
    
    return selectedImages;
}

// Populate hero slideshow with random images
function populateHeroSlideshow() {
    const heroSlideshow = document.getElementById('heroSlideshow');
    if (!heroSlideshow) return;
    
    const heroImages = getHeroImages();
    
    // Clear existing slides
    heroSlideshow.innerHTML = '';
    
    // Create new slides
    heroImages.forEach((imageSrc, index) => {
        const slide = document.createElement('div');
        slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = 'Cinematic Background';
        img.className = 'parallax-image';
        
        slide.appendChild(img);
        heroSlideshow.appendChild(slide);
    });
}

// Initialize hero slideshow on page load
populateHeroSlideshow();

// ============================================
// HERO SLIDESHOW - SLIDE ANIMATION
// ============================================
const heroSlideshow = document.getElementById('heroSlideshow');
let heroSlides = document.querySelectorAll('.hero-slide');
let currentHeroSlide = 0;

function cycleHeroSlide() {
    // Re-query slides in case they were dynamically updated
    heroSlides = document.querySelectorAll('.hero-slide');
    
    // Remove active class from current slide
    heroSlides[currentHeroSlide].classList.remove('active');
    heroSlides[currentHeroSlide].classList.add('prev');
    
    // Move to next slide
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    
    // Add active class to new slide
    heroSlides[currentHeroSlide].classList.remove('prev');
    heroSlides[currentHeroSlide].classList.add('active');
}

// Change hero slide every 8 seconds
setInterval(cycleHeroSlide, 8000);

// ============================================
// 3D MOUSE EFFECTS - PER-ELEMENT TRACKING
// ============================================
function init3DEffects() {
    // Skip all 3D effects on mobile devices
    if (isMobile) {
        console.log('Mobile device detected - skipping 3D mouse effects');
        return;
    }

    // Hero section - all elements react when mouse is in hero
    const heroSection = document.querySelector('.hero');
    const heroElements = document.querySelectorAll('.hero-text');
    
    // Hero logo tracking (separate from hero-text)
    const heroLogo = document.querySelector('.hero-logo img');
    
    heroSection.addEventListener('mousemove', (e) => {
        // Track hero text elements
        heroElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (centerY - y) / 30;
            const rotateY = (x - centerX) / 30;
            
            el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        // Track logo separately
        if (heroLogo) {
            const rect = heroLogo.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (centerY - y) / 30;
            const rotateY = (x - centerX) / 30;
            
            heroLogo.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        }
    });
    
    heroSection.addEventListener('mouseleave', () => {
        heroElements.forEach(el => {
            el.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
        if (heroLogo) {
            heroLogo.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
    });
    
  // About section - each tile tracks individually
  const aboutTiles = document.querySelectorAll('.about-stats .stat-card');
  
  aboutTiles.forEach(tile => {
  tile.addEventListener('mousemove', (e) => {
  const rect = tile.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (centerY - y) / 30;
  const rotateY = (x - centerX) / 30;
  
  tile.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  });
  
  tile.addEventListener('mouseleave', () => {
  tile.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
  });

  // Work section - each card tracks individually on hover
    const workCards = document.querySelectorAll('.work-card');

    workCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 30;
            const rotateY = (x - centerX) / 30;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
    
    // Gallery section - each item tracks individually
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (centerY - y) / 30;
            const rotateY = (x - centerX) / 30;
            
            item.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
    
    // Services section - cards track when mouse enters section, from each card's center perspective
    const servicesSection = document.querySelector('.services');
    const serviceCards = document.querySelectorAll('.service-card');

    servicesSection.addEventListener('mousemove', (e) => {
        serviceCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate mouse position relative to card center
            const x = e.clientX - rect.left - centerX;
            const y = e.clientY - rect.top - centerY;

            const rotateX = (y / 20) * -1; // Invert for natural tilt
            const rotateY = (x / 20);

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(40px)`;
        });
    });

    servicesSection.addEventListener('mouseleave', () => {
        serviceCards.forEach(card => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
    
// Showreel - frame reacts only on direct hover, disabled during video interaction
const reelSection = document.querySelector('.reel');
const reelFrame = document.querySelector('.reel-frame');
let reelTiltEnabled = true;
let iframeShield = null;

// Listen on the frame itself (not the section) so hover area matches the card
reelFrame.addEventListener('mouseenter', () => {
    if (reelTiltEnabled) {
        reelFrame.style.transition = 'none';
    }
});

reelFrame.addEventListener('mousemove', (e) => {
    if (!reelTiltEnabled) return;

    const rect = reelFrame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (centerY - y) / 30;
    const rotateY = (x - centerX) / 30;

    reelFrame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
});

// Single consolidated mouseleave handler
function handleReelMouseLeave() {
    if (reelTiltEnabled) {
        reelFrame.style.transition = 'var(--transition-normal)';
        reelFrame.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    } else {
        // User left while video was active — re-enable tilt + shield
        reelTiltEnabled = true;
        if (iframeShield) iframeShield.style.display = '';
        reelFrame.classList.remove('video-active');
        reelFrame.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    }
}

reelFrame.addEventListener('mouseleave', handleReelMouseLeave);

// Shield overlay: iframe steals mouse events, so we use a transparent
// div on top when tilt is active. Click removes it and disables tilt,
// giving full access to Vimeo controls (play, fullscreen, etc.)
const reelIframe = reelFrame.querySelector('iframe');
if (reelIframe) {
    iframeShield = document.createElement('div');
    iframeShield.className = 'reel-iframe-shield';
    iframeShield.style.cssText = `
        position: absolute;
        inset: 0;
        z-index: 2;
        cursor: pointer;
        border-radius: inherit;
    `;
    reelFrame.style.position = 'relative';
    reelFrame.appendChild(iframeShield);

    // Click: disable tilt, reveal iframe for direct interaction
    iframeShield.addEventListener('click', () => {
        reelTiltEnabled = false;
        iframeShield.style.display = 'none';
        reelFrame.style.transition = 'var(--transition-normal)';
        reelFrame.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(30px)`;
        reelFrame.style.borderColor = 'var(--color-accent)';
        reelFrame.classList.add('video-active');

        // Focus the iframe so Vimeo receives keyboard events
        reelIframe.contentWindow?.focus();
    });
}

}

// Initialize 3D effects when DOM is ready
document.addEventListener('DOMContentLoaded', init3DEffects);

// ============================================
// DRAGGABLE LOGO - SMOOTH SPRING ANIMATION
// ============================================
function initDraggableLogo() {
    const logoImg = document.querySelector('.hero-logo img');
    if (!logoImg) {
        console.log('Logo image not found');
        return;
    }

    console.log('Initializing draggable logo...');

    let isDragging = false;
    let startX, startY;
    let currentX = 0, currentY = 0;
    let velocityX = 0, velocityY = 0;
    let springAnimation = null;

    // Mouse events
    logoImg.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch events
    logoImg.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrag(e.touches[0]);
    });
    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
            drag(e.touches[0]);
        }
    });
    document.addEventListener('touchend', endDrag);

    function startDrag(e) {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        velocityX = 0;
        velocityY = 0;

        console.log('Started dragging');

        // Cancel any ongoing spring animation
        if (springAnimation) {
            cancelAnimationFrame(springAnimation);
            springAnimation = null;
        }
    }

    function drag(e) {
        if (!isDragging) return;

        const newX = e.clientX - startX;
        const newY = e.clientY - startY;
        
        // Calculate velocity for smooth throw
        velocityX = newX - currentX;
        velocityY = newY - currentY;

        currentX = newX;
        currentY = newY;

        // Apply the transform
        logoImg.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;

        console.log('Ended dragging, springing back...');

        // Spring back to original position
        springBack();
    }

    function springBack() {
        const springStrength = 0.1; // Softer spring
        const damping = 0.92; // Less damping for smoother decay

        function animate() {
            // Apply spring force
            const forceX = -currentX * springStrength;
            const forceY = -currentY * springStrength;

            // Add velocity from spring force
            velocityX += forceX;
            velocityY += forceY;

            // Apply damping
            velocityX *= damping;
            velocityY *= damping;

            // Update position
            currentX += velocityX;
            currentY += velocityY;

            logoImg.style.transform = `translate(${currentX}px, ${currentY}px)`;

            // Check if we're close enough to stop
            const isClose = Math.abs(currentX) < 0.5 && Math.abs(currentY) < 0.5;
            const isSlow = Math.abs(velocityX) < 0.5 && Math.abs(velocityY) < 0.5;

            if (isClose && isSlow) {
                currentX = 0;
                currentY = 0;
                velocityX = 0;
                velocityY = 0;
                logoImg.style.transform = 'translate(0px, 0px)';
                springAnimation = null;
                console.log('Logo returned to position');
            } else {
                springAnimation = requestAnimationFrame(animate);
            }
        }

        springAnimation = requestAnimationFrame(animate);
    }

    console.log('Draggable logo initialized');
}

// Initialize draggable logo when DOM is ready
document.addEventListener('DOMContentLoaded', initDraggableLogo);

// ============================================
// PARALLAX EFFECT - DISABLED ON MOBILE
// ============================================
const parallaxBg = document.querySelector('.hero-parallax-bg');
const parallaxImages = document.querySelectorAll('.parallax-image');

if (parallaxBg && parallaxImages.length > 0 && !isMobile) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        parallaxImages.forEach(img => {
            img.style.transform = `translateY(${rate}px)`;
        });
    });
    
    // Mouse parallax effect
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        parallaxImages.forEach(img => {
            img.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// ============================================
// PROJECT DATA
// ============================================
const projectData = {
    'e13m': {
        title: 'E13M',
        role: 'Director of Photography',
        synopsis: 'A father\'s self-erasure as an act of love',
        director: 'Joel Kundu',
        producer: 'Jane Smith',
        cinematographer: 'Joel Kundu',
        editor: 'Mike Johnson',
        location: 'London, Ontario',
        duration: '18 minutes',
        year: '2024',
        laurels: [
            'Official Selection - Toronto Film Festival',
            'Best Cinematography - London Film Fest',
            'Audience Award - Short Film Showcase'
        ],
        stills: [
            'assets/images/Screenshot (15).png',
            'assets/images/Screenshot (16).png',
            'assets/images/Screenshot (17).png',
            'assets/images/Screenshot (18).png',
            'assets/images/Screenshot (19).png',
            'assets/images/Screenshot (20).png'
        ],
        bts: [
            'assets/images/Screenshot (11).png',
            'assets/images/Screenshot (12).png',
            'assets/images/Screenshot (13).png',
            'assets/images/Screenshot (14).png'
        ]
    },
    'short2': {
        title: 'Untitled Short',
        role: 'Director',
        synopsis: 'Coming soon',
        director: 'Joel Kundu',
        producer: 'TBD',
        cinematographer: 'TBD',
        editor: 'TBD',
        location: 'TBD',
        duration: 'TBD',
        year: '2025',
        laurels: [],
        stills: [
            'assets/images/Screenshot (16).png',
            'assets/images/Screenshot (17).png',
            'assets/images/Screenshot (18).png'
        ],
        bts: []
    },
    'doc1': {
        title: 'Documentary Project',
        role: 'Cinematographer',
        synopsis: 'In development',
        director: 'TBD',
        producer: 'TBD',
        cinematographer: 'Joel Kundu',
        editor: 'TBD',
        location: 'TBD',
        duration: 'TBD',
        year: '2025',
        laurels: [],
        stills: [
            'assets/images/Screenshot (17).png',
            'assets/images/Screenshot (18).png',
            'assets/images/Screenshot (19).png'
        ],
        bts: []
    },
    'commercial1': {
        title: 'Commercial',
        role: 'DP/Director',
        synopsis: 'Brand storytelling',
        director: 'Joel Kundu',
        producer: 'Brand Team',
        cinematographer: 'Joel Kundu',
        editor: 'Post House',
        location: 'Toronto',
        duration: '30 seconds',
        year: '2024',
        laurels: [],
        stills: [
            'assets/images/Screenshot (18).png',
            'assets/images/Screenshot (19).png',
            'assets/images/Screenshot (20).png'
        ],
        bts: []
    }
};

// ============================================
// PROJECT DETAILS MODAL
// ============================================
const stillsModal = document.getElementById('stillsModal');
const modalClose = document.querySelector('.modal-close');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalLaurels = document.getElementById('modalLaurels');
const stillsGrid = document.getElementById('stillsGrid');
const btsGrid = document.getElementById('btsGrid');
const viewStillsButtons = document.querySelectorAll('.btn-view-stills');

// Open modal
viewStillsButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click
    const card = button.closest('.work-card');
    const projectId = card.dataset.project;
    
    loadProjectDetails(projectId);
    
    // Position modal over the work section
    const workSection = document.querySelector('.work');
    if (workSection) {
      const rect = workSection.getBoundingClientRect();
      stillsModal.style.position = 'fixed';
      stillsModal.style.top = `${rect.top}px`;
      stillsModal.style.left = `${rect.left}px`;
      stillsModal.style.right = `${window.innerWidth - rect.right}px`;
      stillsModal.style.bottom = `${window.innerHeight - rect.bottom}px`;
      stillsModal.style.width = `${rect.width}px`;
      stillsModal.style.height = `${rect.height}px`;
    }
    
    stillsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

// Load project details
function loadProjectDetails(projectId) {
    const project = projectData[projectId];
    
    if (!project) return;
    
    modalTitle.textContent = project.title;
    
    // Build meta info
    let metaHTML = '';
    const metaFields = [
        { label: 'Role', value: project.role },
        { label: 'Director', value: project.director },
        { label: 'Producer', value: project.producer },
        { label: 'Cinematographer', value: project.cinematographer },
        { label: 'Editor', value: project.editor },
        { label: 'Location', value: project.location },
        { label: 'Duration', value: project.duration },
        { label: 'Year', value: project.year }
    ];
    
    metaFields.forEach(field => {
        if (field.value && field.value !== 'TBD') {
            metaHTML += `<div class="meta-item"><strong>${field.label}:</strong> ${field.value}</div>`;
        }
    });
    
    modalMeta.innerHTML = metaHTML;
    
    // Load laurels
    if (project.laurels && project.laurels.length > 0) {
        modalLaurels.innerHTML = project.laurels.map(laurel => 
            `<div class="laurel-item">${laurel}</div>`
        ).join('');
    } else {
        modalLaurels.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">No laurels yet</p>';
    }
    
    // Load stills
    stillsGrid.innerHTML = '';
    if (project.stills && project.stills.length > 0) {
        project.stills.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `${project.title} still`;
            stillsGrid.appendChild(img);
        });
    } else {
        stillsGrid.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">No stills available</p>';
    }
    
    // Load BTS
    btsGrid.innerHTML = '';
    if (project.bts && project.bts.length > 0) {
        project.bts.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `${project.title} BTS`;
            btsGrid.appendChild(img);
        });
    } else {
        btsGrid.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">No BTS images available</p>';
    }
}

// Close modal
modalClose.addEventListener('click', () => {
    stillsModal.classList.remove('active');
    document.body.style.overflow = '';
});

stillsModal.addEventListener('click', (e) => {
    if (e.target === stillsModal) {
        stillsModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && stillsModal.classList.contains('active')) {
        stillsModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Reposition modal on window resize when modal is open
window.addEventListener('resize', () => {
  if (stillsModal.classList.contains('active')) {
    const workSection = document.querySelector('.work');
    if (workSection) {
      const rect = workSection.getBoundingClientRect();
      stillsModal.style.top = `${rect.top}px`;
      stillsModal.style.left = `${rect.left}px`;
      stillsModal.style.right = `${window.innerWidth - rect.right}px`;
      stillsModal.style.bottom = `${window.innerHeight - rect.bottom}px`;
      stillsModal.style.width = `${rect.width}px`;
      stillsModal.style.height = `${rect.height}px`;
    }
  }
});

// ============================================
// GALLERY SECTION
// ============================================
const galleryGrid = document.getElementById('galleryGrid');
const galleryFilters = document.querySelectorAll('.gallery-filters .filter-btn');

// All gallery images - includes all stills from assets/images folder
const allGalleryImages = [
    { src: 'assets/images/Screenshot (11).png', project: 'e13m' },
    { src: 'assets/images/Screenshot (12).png', project: 'e13m' },
    { src: 'assets/images/Screenshot (13).png', project: 'e13m' },
    { src: 'assets/images/Screenshot (14).png', project: 'e13m' },
    { src: 'assets/images/Screenshot (15).png', project: 'e13m' },
    { src: 'assets/images/Screenshot (16).png', project: 'short2' },
    { src: 'assets/images/Screenshot (17).png', project: 'doc1' },
    { src: 'assets/images/Screenshot (18).png', project: 'commercial1' },
    { src: 'assets/images/Screenshot (19).png', project: 'e13m' },
    { src: 'assets/images/Screenshot (20).png', project: 'e13m' },
    { src: 'assets/images/Screenshot (21).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (23).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (24).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (25).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (26).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (27).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (28).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (29).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (30).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (31).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (32).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (33).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (34).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (35).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (36).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (37).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (38).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (39).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (40).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (41).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (42).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (43).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (44).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (45).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (46).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (47).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (48).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (49).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (50).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (51).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (52).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (53).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (54).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (55).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (56).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (57).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (58).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (59).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (60).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (61).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (62).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (63).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (64).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (65).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (66).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (67).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (68).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (69).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (70).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (71).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (72).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (73).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (74).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (75).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (76).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (77).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (78).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (79).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (80).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (81).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (82).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (83).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (84).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (85).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (86).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (87).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (88).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (89).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (90).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (91).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (92).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (93).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (94).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (95).png', project: 'untagged' },
    { src: 'assets/images/Screenshot (96).png', project: 'untagged' }
];

// Initialize gallery
function initGallery(filter = 'all') {
  const filteredImages = filter === 'all' 
    ? allGalleryImages 
    : allGalleryImages.filter(img => img.project === filter);
  
  // Shuffle and take first 12 (for 4x3 grid)
    // Fisher-Yates shuffle (unbiased)
    const shuffled = [...filteredImages];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, 12);
  
// Fade out existing items first, then replace
const existingItems = galleryGrid.querySelectorAll('.gallery-item');

if (existingItems.length > 0) {
console.log('Fading out', existingItems.length, 'items');
// Ensure items are at full opacity before fading out
existingItems.forEach((item) => {
item.style.opacity = '1';
item.style.transform = 'scale(1)';
item.classList.remove('fade-in');
});

// Force reflow to ensure the browser recognizes the initial state
galleryGrid.offsetHeight;

// Now add fade-out class to trigger animation
existingItems.forEach((item) => {
item.classList.add('fade-out');
});

// Wait for fade-out to complete, then rebuild
setTimeout(() => {
console.log('Clearing grid and adding new items');
galleryGrid.innerHTML = '';
    addGalleryItems(selected);
}, 600); // Wait 600ms for fade-out (slightly more than 500ms animation)
} else {
 // No existing items, just add new ones
 addGalleryItems(selected);
 }
}

// Helper function to add gallery items with fade-in
function addGalleryItems(items) {
  items.forEach((imgData, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in retro-card';
    // Random offset for smooth transition
    const randomDelay = Math.random() * 0.5;
    item.style.animationDelay = `${randomDelay}s`;
    
    const img = document.createElement('img');
    img.src = imgData.src;
    img.alt = 'Gallery image';
    img.draggable = false;
    
    // Add hover effect: move toward gallery center
    item.addEventListener('mouseenter', () => {
      const galleryRect = galleryGrid.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      
      // Calculate gallery center
      const galleryCenterX = galleryRect.left + galleryRect.width / 2;
      const galleryCenterY = galleryRect.top + galleryRect.height / 2;
      
      // Calculate item center
      const itemCenterX = itemRect.left + itemRect.width / 2;
      const itemCenterY = itemRect.top + itemRect.height / 2;
      
      // Calculate direction to gallery center
      const deltaX = galleryCenterX - itemCenterX;
      const deltaY = galleryCenterY - itemCenterY;
      
      // Apply transform: scale up and move toward center
      const moveX = deltaX * 0.3; // Move 30% of the distance
      const moveY = deltaY * 0.3;
      
        item.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        img.style.transform = 'scale(1.1)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      img.style.transform = '';
    });
    
    // Click to view fullscreen
    item.addEventListener('click', () => {
      viewFullscreenImage(imgData.src, item);
    });
    
    item.appendChild(img);
    galleryGrid.appendChild(item);
  });
}

// View fullscreen image centered on gallery section
function viewFullscreenImage(src, clickedItem) {
  const gallerySection = document.querySelector('.gallery');
  
  if (!gallerySection) return;
  
  const galleryRect = gallerySection.getBoundingClientRect();
  
  // Create modal overlay
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  // Create image container centered on gallery
  const imgContainer = document.createElement('div');
  imgContainer.style.cssText = `
    position: relative;
    max-width: 90%;
    max-height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0.8);
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  `;
  
  const img = document.createElement('img');
  img.src = src;
  img.style.cssText = `
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: var(--radius-md);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  `;
  
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: -40px;
    right: -40px;
    width: 40px;
    height: 40px;
    background: var(--color-accent);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease, background 0.3s ease;
  `;
  
  const handleClose = () => {
    modal.style.opacity = '0';
    imgContainer.style.transform = 'scale(0.8)';
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  };
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.transform = 'rotate(90deg) scale(1.1)';
    closeBtn.style.background = '#ff4444';
  });
  
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.transform = 'rotate(0deg) scale(1)';
    closeBtn.style.background = 'var(--color-accent)';
  });
  
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleClose();
  });
  
  imgContainer.appendChild(img);
  imgContainer.appendChild(closeBtn);
  modal.appendChild(imgContainer);
  document.body.appendChild(modal);
  
  // Disable body scroll
  document.body.style.overflow = 'hidden';
  
  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      handleClose();
    }
  });
  
  // Close on escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      handleClose();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  // Animate in
  setTimeout(() => {
    modal.style.opacity = '1';
    imgContainer.style.transform = 'scale(1)';
  }, 10);
}

// Initialize gallery on load
initGallery();

// Gallery filter handlers
galleryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
        galleryFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        initGallery(filter);
    });
});

// Rotate gallery images every 15 seconds (paused when tab hidden)
let galleryInterval = setInterval(rotateGallery, 15000);

function rotateGallery() {
    const activeFilter = document.querySelector('.gallery-filters .filter-btn.active').dataset.filter;
    initGallery(activeFilter);
}

// Pause rotation when tab is hidden to save resources
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(galleryInterval);
        galleryInterval = null;
    } else if (!galleryInterval) {
        galleryInterval = setInterval(rotateGallery, 15000);
    }
});

// ============================================
// CONTACT FORM TOGGLE
// ============================================
const toggleBtns = document.querySelectorAll('.toggle-btn');
const generalForm = document.getElementById('generalForm');
const quoteForm = document.getElementById('quoteForm');

toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const formType = btn.dataset.form;
        
        if (formType === 'general') {
            generalForm.classList.remove('hidden');
            quoteForm.classList.add('hidden');
        } else {
            generalForm.classList.add('hidden');
            quoteForm.classList.remove('hidden');
        }
    });
});

// Form option selection
const formOptions = document.querySelectorAll('.form-option');
formOptions.forEach(option => {
    option.addEventListener('click', () => {
        option.classList.toggle('selected');
    });
});

// Add custom option — inline input instead of prompt()
const addOptionBtn = document.querySelector('.add-option-btn');
if (addOptionBtn) {
    addOptionBtn.addEventListener('click', () => {
        // If an inline input already exists, focus it instead of creating another
        const existingInput = addOptionBtn.parentNode.querySelector('.custom-option-input');
        if (existingInput) {
            existingInput.focus();
            return;
        }
        
        // Create inline input field
        const inputWrapper = document.createElement('span');
        inputWrapper.style.cssText = 'display: inline-flex; align-items: center; gap: 0.25rem;';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type service...';
        input.className = 'custom-option-input';
        input.style.cssText = 'padding: 0.4rem 0.75rem; background: var(--color-bg-tertiary); border: 1px solid var(--color-accent); border-radius: var(--radius-pill); font-size: 0.8rem; color: var(--color-text-primary); width: 140px; outline: none; font-family: var(--font-sans);';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.textContent = '+';
        confirmBtn.style.cssText = 'padding: 0.3rem 0.6rem; background: var(--color-accent); color: var(--color-bg-primary); border: none; border-radius: var(--radius-pill); font-size: 0.85rem; cursor: pointer; font-weight: bold;';
        
        function addCustomService() {
            const value = input.value.trim();
            if (!value) {
                inputWrapper.remove();
                return;
            }
            // Sanitize: strip any HTML tags
            const clean = value.replace(/<[^>]*>/g, '');
            if (!clean) {
                inputWrapper.remove();
                return;
            }
            
            const newOption = document.createElement('span');
            newOption.className = 'form-option selected';
            newOption.textContent = clean;
            newOption.dataset.value = clean.toLowerCase().replace(/\s+/g, '-');
            
            addOptionBtn.parentNode.insertBefore(newOption, addOptionBtn);
            
            newOption.addEventListener('click', () => {
                newOption.classList.toggle('selected');
            });
            
            inputWrapper.remove();
        }
        
        confirmBtn.addEventListener('click', addCustomService);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCustomService();
            } else if (e.key === 'Escape') {
                inputWrapper.remove();
            }
        });
        
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(confirmBtn);
        addOptionBtn.parentNode.insertBefore(inputWrapper, addOptionBtn);
        input.focus();
    });
}

// ============================================
// FORM SUBMISSION
// ============================================
const contactForms = document.querySelectorAll('form');

contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Collect selected service options
        const selectedOptions = form.querySelectorAll('.form-option.selected');
        if (selectedOptions.length > 0) {
            data.services = Array.from(selectedOptions).map(opt => opt.dataset.value);
        }
        
        // Log submission (replace with actual Formspree/backend endpoint)
        console.log('Form submitted:', data);
        
        // Show inline success message instead of alert()
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✓ Sent!';
        submitBtn.style.background = 'var(--color-success)';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
        
        // Reset form
        form.reset();
        
        // Reset selected options
        document.querySelectorAll('.form-option.selected').forEach(opt => {
            opt.classList.remove('selected');
        });
    });
});

// ============================================
// COFFEE EASTER EGG - GLOBAL
// ============================================
let coffeeClicks = 0;
let coffeeRainActive = false;

// Track clicks anywhere on the page
document.addEventListener('click', (e) => {
    // Ignore clicks on interactive elements
    if (e.target.closest('button, a, input, textarea, select')) {
        return;
    }

    coffeeClicks++;

    if (coffeeClicks >= 10 && !coffeeRainActive) {
        coffeeRainActive = true;
        triggerCoffeeRain();

        // Reset after animation
        setTimeout(() => {
            coffeeRainActive = false;
            coffeeClicks = 0;
        }, 5000);
    }
});

function triggerCoffeeRain() {
    const coffeeRain = document.getElementById('coffeeRain');
    const coffeeEmojis = ['☕', '🧋', '🥤', '🫖'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const cup = document.createElement('div');
            cup.className = 'coffee-cup';
            cup.textContent = coffeeEmojis[Math.floor(Math.random() * coffeeEmojis.length)];
            cup.style.left = Math.random() * 100 + '%';
            cup.style.animationDuration = (2 + Math.random() * 2) + 's';
            coffeeRain.appendChild(cup);

            // Remove after animation
            setTimeout(() => {
                cup.remove();
            }, 4000);
        }, i * 100);
    }
}

// ============================================
// IMAGE PROTECTION
// ============================================
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// Prevent drag
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// ============================================
// RESPONSIVE IMAGE HANDLING
// ============================================
function handleResponsiveImages() {
 if (window.innerWidth <= 768) {
 parallaxImages.forEach(img => {
 img.style.objectPosition = 'center center';
 img.style.height = '100%';
 });
 }
}

window.addEventListener('resize', handleResponsiveImages);
handleResponsiveImages();

// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    document.body.classList.add('animations-ready');
});

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio initialized successfully!');
  console.log('🎬 Joel Kundu - Cinematographer & Director');
  console.log('🎭 Theme:', savedTheme || themeToUse);
  console.log('🖱️ 3D effects enabled');
  console.log('🔒 Image protection enabled');
  console.log('🔐 Password protection enabled');
});
