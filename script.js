// ============================================
// CINEMATOGRAPHER PORTFOLIO - JOEL KUNDU
// ============================================

// Logger will be initialized after logger.js loads
let clientLogger;

// ============================================
// BASE PATH - Handles GitHub Pages subdirectory
// ============================================
// Auto-detect: GitHub Pages project sites serve from /<repo-name>/
// Local/Netlify serves from /
const BASE_PATH = (function() {
	const path = window.location.pathname;
	// If path contains a subdirectory (e.g., /joelkundu.github.io/), extract it
	const match = path.match(/^(\/[^/]+\/)/);
	if (match && match[1] !== '/') {
		return match[1].replace(/\/$/, ''); // Remove trailing slash
	}
	return ''; // Root deployment (local, Netlify, custom domain)
})();

// Resolve any absolute path through BASE_PATH
function resolvePath(path) {
	if (!path) return path;
	// Already a full URL (http/https) — leave it
	if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) return path;
	// Absolute path: prepend base
	if (path.startsWith('/')) return BASE_PATH + path;
	// Relative path: leave as-is
	return path;
}

// Initialize logger when logger.js is available
function initializeLogger() {
  if (typeof createLogger === 'function') {
    clientLogger = createLogger('Portfolio', { 
      level: window.location.hostname === 'localhost' ? 'debug' : 'error'
    });
    clientLogger.info('Logger initialized');
  } else {
    // Fallback if logger not loaded
    clientLogger = {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    };
  }
}

// Auto-initialize
initializeLogger();

// ============================================
// CONFIG LOADING - Fetch from dashboard-generated config
// ============================================
let siteConfig = null;

async function loadSiteConfig() {
try {
const configUrl = resolvePath('/config/site-config.json') + '?t=' + Date.now();
clientLogger.debug('Fetching config from:', configUrl);
const response = await fetch(configUrl);
clientLogger.debug('Config response status:', response.status, response.ok);
if (!response.ok) throw new Error('Config not found: ' + response.status);
siteConfig = await response.json();
clientLogger.debug('Config loaded successfully, selectedWorks:', siteConfig.selectedWorks?.length || 0);
updateHeroFromConfig();
return true;
} catch (error) {
clientLogger.error('Config fetch failed:', error.message);
clientLogger.warn('Using fallback config (config file not found or invalid)');
siteConfig = getFallbackConfig();
updateHeroFromConfig();
return false;
}
}

function getFallbackConfig() {
return {
hero: {
firstName: 'JOEL',
lastName: 'KUNDU',
tagline: 'Cinematographer & Director',
backgroundStills: [],
themes: [{
id: 'thriller',
name: 'Thriller',
colors: {
bgPrimary: '#0a0a0a',
textPrimary: '#ffffff',
accent: '#C4A35A'
}
}]
},
about: {
header: 'About Me',
tagline: 'Visual storyteller behind the lens',
paragraph: '',
stats: []
},
selectedWorks: [],
gallery: { projects: [], knownCameras: [] },
contact: {
email: 'filmmaker.joelkundu@gmail.com',
location: { text: 'London, Ontario, Canada', visible: true }
},
footer: {
tagline: 'Capturing stories through the lens',
socialLinks: []
}
};
}

// ============================================
// UPDATE ALL SECTIONS FROM CONFIG
// ============================================
function updateHeroFromConfig() {
if (!siteConfig?.hero) return;

// Update first name and last name (2 rows)
const firstNameEl = document.querySelector('.hero .first-name');
const lastNameEl = document.querySelector('.hero .last-name');
const taglineEl = document.querySelector('.hero .tagline');

if (firstNameEl) firstNameEl.textContent = siteConfig.hero.firstName || 'JOEL';
if (lastNameEl) lastNameEl.textContent = siteConfig.hero.lastName || 'Kundu';
if (taglineEl) taglineEl.textContent = siteConfig.hero.tagline || 'Cinematographer & Director';

// Update laurels
updateHeroLaurels();

// Re-populate hero slideshow now that config is loaded
populateHeroSlideshow();

// Populate gallery from config
populateGalleryFromConfig();

clientLogger.debug('Hero section updated from config');

// Update all sections
updateAbout();
updateSelectedWorks();
// Note: updateGallery() removed — gallery is handled by populateGalleryFromConfig() + initGallery()
updateContact();
updateFooter();
updateServices();
updateShowreel();

// Expose to window for debugging
window.initInfiniteCarousel = initInfiniteCarousel;
window.openProjectModal = openProjectModal;

// Initialize carousel
initInfiniteCarousel();
initCarouselMouseTracking();

clientLogger.debug('All sections updated from config');
}

// Render Hero Laurels
function updateHeroLaurels() {
if (!siteConfig?.hero?.laurels) return;

const container = document.getElementById('heroLaurelsContainer');
if (!container) return;

container.innerHTML = '';

siteConfig.hero.laurels.forEach((laurel, index) => {
const laurelEl = document.createElement('div');
laurelEl.className = 'hero-laurel-bubble';
laurelEl.style.cssText = `
position: absolute;
width: 80px;
height: 80px;
border-radius: 50%;
overflow: hidden;
cursor: pointer;
box-shadow: 0 4px 15px rgba(0,0,0,0.2);
animation: float 3s ease-in-out infinite;
`;
laurelEl.innerHTML = `<img src="${laurel.image}" alt="${laurel.alt || 'Laurel'}" style="width: 100%; height: 100%; object-fit: cover;">`;

// Random position within container
const randomX = Math.random() * 60; // 0-60% to keep them in bounds
const randomY = Math.random() * 60;
laurelEl.style.left = `${randomX}%`;
laurelEl.style.top = `${randomY}%`;
laurelEl.style.animationDelay = `${index * 0.5}s`;

container.appendChild(laurelEl);
});

clientLogger.debug('Hero laurels updated');
}

// Render About section from config
function updateAbout() {
if (!siteConfig?.about) return;

const aboutHeader = document.querySelector('.about h2');
const aboutTagline = document.querySelector('.about .section-header p');
const aboutTextContainer = document.querySelector('.about .about-text');
const aboutStats = document.querySelector('.about-stats');

if (aboutHeader) aboutHeader.textContent = siteConfig.about.header || 'About Me';
if (aboutTagline) aboutTagline.textContent = siteConfig.about.tagline || 'Visual storyteller behind the lens';

// Update about paragraph - render HTML directly (rich text from dashboard)
if (aboutTextContainer && siteConfig.about.paragraph) {
aboutTextContainer.innerHTML = siteConfig.about.paragraph;
}

// Update stats from config
if (aboutStats && siteConfig.about.stats?.length > 0) {
aboutStats.innerHTML = '';
siteConfig.about.stats.forEach(stat => {
const div = document.createElement('div');
div.className = 'stat stat-card retro-card';
div.innerHTML = `
<h3>${stat.number}</h3>
<p>${stat.text}</p>
`;
aboutStats.appendChild(div);
});
}
}

// Render Selected Works from config
function updateSelectedWorks() {
const carouselTrack = document.getElementById('carouselTrack');
if (!carouselTrack || !siteConfig?.selectedWorks) return;

// Clear existing cards (keep fallback if no config)
if (siteConfig.selectedWorks.length > 0) {
carouselTrack.innerHTML = '';

siteConfig.selectedWorks.forEach((project, index) => {
if (project.visible === false) return; // Skip hidden projects

const card = document.createElement('div');
card.className = 'work-card retro-card';
card.dataset.category = project.category || 'narrative';
card.dataset.projectId = project.id || `project-${index}`; // Store project ID

// Get first still from project or use placeholder
let imageUrl = 'assets/images/placeholder.png';
if (project.image && project.image.includes('placeholder')) {
// Use first still if poster is placeholder
imageUrl = resolvePath(project.stills?.[0]?.src || 'assets/images/placeholder.png');
} else if (project.image) {
imageUrl = resolvePath(project.image);
} else if (project.stills?.[0]?.src) {
imageUrl = resolvePath(project.stills[0].src);
}

// Build crew display - only show filled fields
const crewDisplay = [];
if (project.credits?.director) crewDisplay.push(`Director: ${project.credits.director}`);
if (project.credits?.dop) crewDisplay.push(`DOP: ${project.credits.dop}`);
if (project.credits?.producer) crewDisplay.push(`Producer: ${project.credits.producer}`);

card.innerHTML = `
<div class="work-image">
<img src="${imageUrl}" alt="${project.title || 'Project'}">
<div class="work-overlay">
<h3>${project.title || 'Untitled'}</h3>
<button class="btn-view-stills retro-btn">Know More</button>
</div>
</div>
<div class="work-info">
<h3>${project.title || 'Untitled'}</h3>
${crewDisplay.length > 0 ? `<small style="color: #86868b;">${crewDisplay.join(' • ')}</small>` : ''}
</div>
`;
carouselTrack.appendChild(card);
});

// Event listeners will be initialized by initInfiniteCarousel()
}

// Initialize "Know More" button click handlers
function initViewStillsButtons() {
const viewStillsButtons = document.querySelectorAll('.btn-view-stills');

viewStillsButtons.forEach(button => {
// Remove existing listeners to prevent duplicates
button.replaceWith(button.cloneNode(true));
});

// Add fresh listeners
document.querySelectorAll('.btn-view-stills').forEach(button => {
button.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const card = button.closest('.work-card');
const projectId = card.dataset.projectId; // Use projectId instead of project

loadProjectDetails(projectId);

// Position modal relative to Selected Works section
const workSection = document.querySelector('.work');
if (workSection) {
const rect = workSection.getBoundingClientRect();
const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

stillsModal.style.position = 'fixed';
stillsModal.style.top = `${rect.top + scrollTop}px`;
stillsModal.style.left = `${rect.left}px`;
stillsModal.style.width = `${rect.width}px`;
stillsModal.style.height = `${rect.height}px`;
}

stillsModal.classList.add('active');
});
});
}
}

// ============================================
function updateContact() {
if (!siteConfig?.contact) return;

const emailEl = document.querySelector('.contact-email');
const locationEl = document.querySelector('.contact-location');
const locationItem = locationEl?.closest('.contact-item');
const clientStatement = document.querySelector('.client-statement p');

if (emailEl) {
emailEl.textContent = siteConfig.contact.email || '';
emailEl.href = `mailto:${siteConfig.contact.email || ''}`;
}
if (locationEl) {
locationEl.textContent = siteConfig.contact.location?.text || '';
if (locationItem) {
locationItem.style.display = siteConfig.contact.location?.visible ? '' : 'none';
}
}
if (clientStatement && siteConfig.contact.message) {
clientStatement.textContent = siteConfig.contact.message;
}
}

// Render Footer
function updateFooter() {
if (!siteConfig?.footer) return;

const taglineEl = document.querySelector('.footer-tagline');
if (taglineEl) taglineEl.textContent = siteConfig.footer.tagline || '';

// Render social links
const socialList = document.querySelector('.social-links');
if (socialList && siteConfig.footer.socialLinks) {
socialList.innerHTML = '';
siteConfig.footer.socialLinks.forEach(link => {
if (link.visible !== false && link.url) {
const a = document.createElement('a');
a.href = link.url;
a.target = '_blank';
a.rel = 'noopener';
a.className = 'social-link';
const iconSVG = getSocialIconSVG(link.platform || link.icon);
a.innerHTML = `${iconSVG}<span>${link.platform || link.customName || 'Link'}</span>`;
socialList.appendChild(a);
}
});
}
}

// Get SVG icon for social platform
function getSocialIconSVG(platform) {
const icons = {
'vimeo': '<svg class="social-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.948 8.003c-.118-.786-.51-1.355-1.175-1.707-.666-.352-1.559-.47-2.68-.353-1.117.118-2.079.588-2.886 1.412-.803.818-1.205 1.845-1.205 3.08 0 1.234.411 2.318 1.234 3.25.823.93 1.864 1.395 3.122 1.395 1.258 0 2.289-.49 3.093-1.47.803-.98 1.205-2.176 1.205-3.59 0-1.425-.235-2.689-.705-4.017ZM5.69 17.478c.392 1.51 1.057 2.698 1.998 3.565.94.867 2.079 1.307 3.416 1.307 1.337 0 2.474-.44 3.415-1.307.941-.867 1.606-2.055 1.998-3.565.391-1.51.587-3.151.587-4.923 0-1.771-.196-3.412-.587-4.922-.392-1.51-1.057-2.699-1.998-3.566C13.578.6 12.441.16 11.104.16c-1.337 0-2.474.44-3.415 1.307-.941.867-1.606 2.056-1.998 3.566C5.299 6.545 5.103 8.186 5.103 9.957c0 1.772.196 3.413.587 4.923Z"/></svg>',
'instagram': '<svg class="social-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.667.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/></svg>',
'linkedin': '<svg class="social-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.474-.9 1.637-1.85 3.374-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/></svg>',
'youtube': '<svg class="social-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/></svg>',
'facebook': '<svg class="social-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v3.129H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z"/></svg>',
'twitter': '<svg class="social-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
'tiktok': '<svg class="social-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.08-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.75-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.53-2.25-.35-3.02.46-.38.41-.64.94-.71 1.5-.14 1.21.24 2.47 1.07 3.37.83.9 2.12 1.31 3.33 1.07 1.21-.24 2.26-1.1 2.72-2.23.27-.65.35-1.37.33-2.07.01-4.5 0-9.01 0-13.51z"/></svg>',
'imdb': '<svg class="social-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 13.5c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5v-6c0-.83.67-1.5 1.5-1.5h3zm6 0c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5v-6c0-.83.67-1.5 1.5-1.5h3zm6 0c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5v-6c0-.83.67-1.5 1.5-1.5h3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>',
'letterboxd': '<svg class="social-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 3.5C2.5 3.5 6.5 2 12 2s10 1.5 10 1.5v17s-4 1.5-10 1.5S2 20.5 2 20.5V3.5zm2 2.5v12c1.5.5 4 1 7.5 1s6-.5 7.5-1V6c-1.5-.5-4-1-7.5-1s-6 .5-7.5 1z"/></svg>',
'threads': '<svg class="social-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8 0-2.109.827-4.023 2.172-5.458.736.982 2.034 1.663 3.486 1.663 2.063 0 3.75-1.5 4.125-3.469C15.336 5.25 16.636 4.5 18 4.5c.344 0 .68.047 1 .133V12c0 4.411-3.589 8-8 8zm0-16c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z"/></svg>'
};
const key = (platform || '').toString().toLowerCase().replace(/\s+/g, '');
return icons[key] || icons['vimeo'];
}

// Render Services
function updateServices() {
const servicesSection = document.querySelector('.services-list');
if (!servicesSection || !siteConfig?.service) return;

if (siteConfig.services.length > 0) {
servicesSection.innerHTML = '';
siteConfig.services.forEach(service => {
if (service.visible !== false) {
const div = document.createElement('div');
div.className = 'service-card retro-card';
div.innerHTML = `
<div class="service-icon">${service.icon || '🔧'}</div>
<h3>${service.title}</h3>
<p>${service.description}</p>
`;
servicesSection.appendChild(div);
}
});

// Re-initialize tilt effect after rendering
initServicesTilt();
}
}

// Initialize 3D tilt effect for service cards
function initServicesTilt() {
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
card.addEventListener('mousemove', (e) => {
	const rect = card.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	
	const centerX = rect.width / 2;
	const centerY = rect.height / 2;
	
	const rotateX = (y - centerY) / 10;
	const rotateY = (centerX - x) / 10;
	
	card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
});

card.addEventListener('mouseleave', () => {
	card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
});
});
}

// Render Showreel
function updateShowreel() {
const showreelContainer = document.getElementById('showreelContainer');
if (!showreelContainer || !siteConfig?.showreel) return;

const vimeoUrl = siteConfig.showreel.vimeoUrl || siteConfig.showreel.url;
if (vimeoUrl) {
const vimeoId = vimeoUrl.match(/video\/(\d+)/)?.[1] || vimeoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
if (vimeoId) {
showreelContainer.innerHTML = `<div class="reel-frame">
<iframe src="https://player.vimeo.com/video/${vimeoId}" frameborder="0" allowfullscreen style="width: 100%; height: 100%;"></iframe>
</div>`;

// Initialize showreel tilt effect
initShowreelTilt();
}
}
}

// Initialize 3D tilt effect for showreel
function initShowreelTilt() {
const reelFrame = document.querySelector('.reel-frame');
if (!reelFrame) return;

let isVideoActive = false;

reelFrame.addEventListener('mousemove', (e) => {
if (isVideoActive) return;

const rect = reelFrame.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

const centerX = rect.width / 2;
const centerY = rect.height / 2;

const rotateX = (y - centerY) / 20;
const rotateY = (centerX - x) / 20;

reelFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
});

reelFrame.addEventListener('mouseleave', () => {
if (isVideoActive) return;
reelFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
});

// Click to activate video
reelFrame.addEventListener('click', () => {
isVideoActive = true;
reelFrame.classList.add('video-active');
reelFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
});
}
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad on Safari
}

const isMobile = isMobileDevice();
clientLogger.debug(`Mobile device detected: ${isMobile}`);

// Update year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// PASSWORD PROTECTION - SHA-256 HASH
// ============================================
// PASSWORD PROTECTION - SHA-256 HASH
// ============================================

// SHA-256 hash of the password (JOELKUNDU)
const PASSWORD_HASH = '3eafffb953d3f55fb134b6854dea019bbb2f091f32faa7666c1871d5fc171fe7';

async function sha256(message) {
const msgBuffer = new TextEncoder().encode(message);
const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
return hashHex;
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

// Password protection — DISABLED for development
// To re-enable, uncomment the DOMContentLoaded listener below
document.addEventListener('DOMContentLoaded', () => {
const passwordOverlay = document.getElementById('passwordOverlay');
if (passwordOverlay) passwordOverlay.classList.add('hidden');
document.body.style.overflow = '';
});

/* ORIGINAL PASSWORD CODE — DISABLED
document.addEventListener('DOMContentLoaded', () => {
const passwordOverlay = document.getElementById('passwordOverlay');
const passwordInput = document.getElementById('passwordInput');
const passwordSubmit = document.getElementById('passwordSubmit');
const passwordError = document.getElementById('passwordError');
const passwordContainer = document.querySelector('.password-container');

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

if (isAuthValid()) {
if (passwordOverlay) passwordOverlay.classList.add('hidden');
document.body.style.overflow = '';
} else {
document.body.style.overflow = 'hidden';
positionPasswordOnHero();
}

window.addEventListener('resize', positionPasswordOnHero);

if (passwordSubmit) {
passwordSubmit.addEventListener('click', checkPassword);
}

if (passwordInput) {
passwordInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') checkPassword();
});
}

async function checkPassword() {
const password = passwordInput.value;
const inputHash = await sha256(password);

if (inputHash === PASSWORD_HASH) {
	sessionStorage.setItem(AUTH_KEY, inputHash);
	sessionStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
	if (passwordOverlay) passwordOverlay.classList.add('hidden');
	if (passwordError) passwordError.classList.remove('show');
	document.body.style.overflow = '';
} else {
	if (passwordError) passwordError.classList.add('show');
	passwordInput.value = '';
}
}
});
END ORIGINAL PASSWORD CODE */

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
    
    clientLogger.info(`Theme: ${theme}`);
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

// Hero images now loaded exclusively from siteConfig.hero.backgroundStills

// Get or generate random hero images
function getHeroImages() {
const STORAGE_KEY = 'portfolio-hero-images';
const TIMESTAMP_KEY = 'portfolio-hero-timestamp';
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

const storedImages = localStorage.getItem(STORAGE_KEY);
const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
const now = Date.now();

// Check if config has selected background stills
if (siteConfig?.hero?.backgroundStills && siteConfig.hero.backgroundStills.length > 0) {
// Use the user-selected stills from dashboard
const selectedCount = Math.min(10, siteConfig.hero.backgroundStills.length);
const shuffled = [...siteConfig.hero.backgroundStills].sort(() => Math.random() - 0.5);
const selectedImages = shuffled.slice(0, selectedCount);

// Store in localStorage
localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedImages));
localStorage.setItem(TIMESTAMP_KEY, now.toString());

return selectedImages;
}

// Config not loaded yet — try localStorage cache
if (storedImages) {
try {
    const parsed = JSON.parse(storedImages);
    if (Array.isArray(parsed) && parsed.length > 0) {
    const age = now - parseInt(storedTimestamp || '0');
    if (age < CACHE_DURATION) {
        console.log('Using cached hero images while waiting for config');
        return parsed;
    }
    }
} catch (e) {
    console.warn('Failed to parse cached hero images:', e);
}
}

// No fallback - return empty array if config not loaded and no cache
console.warn('No hero background stills in config or cache');
return [];
}

// Populate hero slideshow with random images
function populateHeroSlideshow() {
 const heroSlideshow = document.getElementById('heroSlideshow');
 if (!heroSlideshow) return;
 
 const heroImages = getHeroImages();
 
 // Clear existing slides
 heroSlideshow.innerHTML = '';
 
 // Reset slide index when rebuilding
 currentHeroSlide = 0;
 
 // Create new slides
 heroImages.forEach((imageSrc, index) => {
 const slide = document.createElement('div');
 slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
 
 const img = document.createElement('img');
 img.src = resolvePath(imageSrc);
 img.alt = 'Cinematic Background';
 img.className = 'parallax-image';
 
 slide.appendChild(img);
heroSlideshow.appendChild(slide);
});

// Update the global heroSlides reference
heroSlides = document.querySelectorAll('.hero-slide');

// Start cycling if we have multiple slides and no interval yet
if (heroSlides.length > 1 && !window._heroSlideInterval) {
window._heroSlideInterval = setInterval(cycleHeroSlide, 8000);
}
}

// Hero slideshow is initialized from updateHeroFromConfig() after config loads

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
// Old hero slideshow - DISABLED (using config-based version now)
// setInterval(cycleHeroSlide, 8000);

// ============================================
// 3D MOUSE EFFECTS - PER-ELEMENT TRACKING
// ============================================
function init3DEffects() {
 // Mobile: 15 degrees max tilt, Desktop: 10 degrees max tilt  
 clientLogger.debug(`Tilt limit: ${isMobile ? 15 : 10}°`);

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
    
// Section headers - tilt with parallax depth layers

// ============================================
// ============================================
// SHOWREEL TILT EFFECT
// ============================================
window.addEventListener('load', () => {
  const reelSection = document.querySelector('.reel');
  const reelFrame = document.querySelector('.reel-frame');
  
  if (!reelSection || !reelFrame) return;
  
  setTimeout(() => {
    const rect = reelFrame.getBoundingClientRect();
    console.log('🎬 Showreel initialized:', rect.width, 'x', rect.height);
    
    let isVideoPlaying = false;
    
    function isMouseOverFrame(e) {
      const r = reelFrame.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      return x >= 0 && x <= r.width && y >= 0 && y <= r.height;
    }
    
    function applyTilt(e, shouldTilt) {
      if (!shouldTilt) {
        reelFrame.style.transition = 'var(--transition-normal)';
        reelFrame.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(30px)';
        return;
      }
      const r = reelFrame.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rotateX = (r.height/2 - y) / 30;
      const rotateY = (x - r.width/2) / 30;
      reelFrame.style.transition = 'none';
      reelFrame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
    }
    
    reelSection.addEventListener('mousemove', (e) => {
      if (isVideoPlaying) { applyTilt(e, false); return; }
      if (isMouseOverFrame(e)) { applyTilt(e, false); return; }
      applyTilt(e, true);
    });
    
    reelSection.addEventListener('mouseleave', () => {
      applyTilt(null, false);
    });
    
    const iframe = reelFrame.querySelector('iframe');
    if (iframe) {
      const shield = document.createElement('div');
      shield.style.cssText = 'position:absolute;inset:0;z-index:2;cursor:pointer;';
      reelFrame.appendChild(shield);
      shield.addEventListener('click', () => {
        isVideoPlaying = true;
        shield.style.display = 'none';
        applyTilt(null, false);
      });
    }
  }, 500);
});
// Section headers - tilt with parallax depth layers
// Track mouse from the parent section (entire area), apply tilt to the header
const sectionHeaders = document.querySelectorAll('.section-header');
const SECTION_TILT_MAX = isMobile ? 15 : 10; // Mobile: 15°, Desktop: 10°

sectionHeaders.forEach(header => {
    // Find the closest parent <section> for tracking area
    const parentSection = header.closest('section');
    if (!parentSection) return;

    parentSection.addEventListener('mousemove', (e) => {
        const rect = header.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate tilt, clamp to ±10°
        let rotateX = (centerY - y) / centerY * SECTION_TILT_MAX;
        let rotateY = (x - centerX) / centerX * SECTION_TILT_MAX;
        rotateX = Math.max(-SECTION_TILT_MAX, Math.min(SECTION_TILT_MAX, rotateX));
        rotateY = Math.max(-SECTION_TILT_MAX, Math.min(SECTION_TILT_MAX, rotateY));

        // Apply tilt to the header container (children maintain their Z offsets)
        header.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        header.style.transition = 'none';
    });

    parentSection.addEventListener('mouseleave', () => {
        header.style.transition = 'transform 0.5s ease-out';
        header.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
});

}

// Initialize 3D effects when DOM is ready
document.addEventListener('DOMContentLoaded', init3DEffects);

// ============================================
// DRAGGABLE LOGO - SMOOTH SPRING ANIMATION
// ============================================
function initDraggableLogo() {
    const logoImg = document.querySelector('.hero-logo img');
    if (!logoImg) {
        clientLogger.warn('Logo image not found');
        return;
    }

    clientLogger.debug('Initializing draggable logo...');

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

        clientLogger.debug('Started dragging');

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

        clientLogger.debug('Springing back...');

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
                clientLogger.debug('Logo returned to position');
            } else {
                springAnimation = requestAnimationFrame(animate);
            }
        }

        springAnimation = requestAnimationFrame(animate);
    }

    clientLogger.debug('Draggable logo initialized');
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
// PROJECT DATA - Now loaded from siteConfig.selectedWorks
// ============================================


// ============================================
// PROJECT DETAILS MODAL
// ============================================
// Initialize modal variables after DOM is ready
let stillsModal, modalClose, modalTitle, modalMeta, modalLaurels, stillsGrid, btsGrid;

function initModal() {
stillsModal = document.getElementById('stillsModal');
modalClose = document.querySelector('.modal-close');
modalTitle = document.getElementById('modalTitle');
modalMeta = document.getElementById('modalMeta');
modalLaurels = document.getElementById('modalLaurels');
stillsGrid = document.getElementById('stillsGrid');
btsGrid = document.getElementById('btsGrid');

// Initialize modal event listeners after elements are defined
initModalEventListeners();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initModal);
} else {
initModal();
}

// Button click handlers are managed by initViewStillsButtons() which is called
// from updateSelectedWorks() after dynamic cards are created

// Load project details
function loadProjectDetails(projectId) {
// Find project from siteConfig.selectedWorks by ID
const project = siteConfig?.selectedWorks?.find(p => p.id === projectId);

if (!project) {
clientLogger.warn(`Project not found: ${projectId}`);
return;
}

modalTitle.textContent = project.title;

// Find matching gallery project using explicit galleryProjectId link
const galleryProjectId = project.galleryProjectId;
const galleryProject = galleryProjectId 
? siteConfig.gallery?.projects?.find(p => p.id === galleryProjectId)
: null;
 
 // Build meta info with all credits
 let metaHTML = '';
 const credits = project.credits || {};
 
 // Basic info
 const basicFields = [
 { label: 'Role', value: project.role },
 { label: 'Year', value: project.year },
 { label: 'Category', value: project.category }
 ];
 
 basicFields.forEach(field => {
 if (field.value && field.value !== 'TBD') {
 metaHTML += `<div class="meta-item"><strong>${field.label}:</strong> ${field.value}</div>`;
 }
 });
 
 // Credits
 const creditFields = [
 { label: 'Director', value: credits.director },
 { label: 'Producer', value: credits.producer },
 { label: 'Cinematographer', value: credits.dop || credits.cinematographer },
 { label: 'Editor', value: credits.editor },
 { label: 'Production Designer', value: credits.productionDesigner || credits.pd },
 { label: 'Assistant Director', value: credits.assistantDirector || credits.ad },
 { label: 'Writer', value: credits.writer },
 { label: 'Composer', value: credits.composer },
 { label: 'Sound Designer', value: credits.soundDesigner || credits.sound },
 { label: 'Colorist', value: credits.colorist },
 { label: 'VFX Supervisor', value: credits.vfxSupervisor || credits.vfx },
 { label: 'Costume Designer', value: credits.costumeDesigner || credits.costume },
 { label: 'Makeup', value: credits.makeup },
 { label: 'Gaffer', value: credits.gaffer },
 { label: 'Key Grip', value: credits.keyGrip }
 ];
 
 creditFields.forEach(field => {
 if (field.value && field.value !== 'TBD' && field.value !== '') {
 metaHTML += `<div class="meta-item"><strong>${field.label}:</strong> ${field.value}</div>`;
 }
 });
 
 // Camera equipment from project.camera object
 if (project.camera) {
 const cameraFields = [
 { label: 'Camera Body', value: project.camera.body },
 { label: 'Lens', value: project.camera.lens },
 { label: 'Film Stock', value: project.camera.filmStock },
 { label: 'Aspect Ratio', value: project.camera.aspectRatio },
 { label: 'Special Equipment', value: project.camera.specialEquipment }
 ];
 
 cameraFields.forEach(field => {
 if (field.value && field.value !== '' && field.value !== 'TBD') {
 metaHTML += `<div class="meta-item"><strong>${field.label}:</strong> ${field.value}</div>`;
 }
 });
 }
 
 modalMeta.innerHTML = metaHTML;
 
 // Load stills from gallery project
 stillsGrid.innerHTML = '';
 if (galleryProject && galleryProject.stills && galleryProject.stills.length > 0) {
 // Filter for stills type (not BTS)
 const stills = galleryProject.stills.filter(s => s.type === 'still' || !s.type);
 if (stills.length > 0) {
 stills.forEach(still => {
 const img = document.createElement('img');
 // Ensure path starts with /
 img.src = resolvePath(still.src.startsWith('/') ? still.src : '/' + still.src);
 img.alt = still.alt || `${project.title} still`;
 img.style.cursor = 'pointer';
 img.addEventListener('click', () => viewFullscreenImage(still.src, img));
 stillsGrid.appendChild(img);
 });
 } else {
 stillsGrid.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">No stills available</p>';
 }
 } else {
 stillsGrid.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">No stills available</p>';
 }
 
 // Load BTS from gallery project
 btsGrid.innerHTML = '';
 if (galleryProject && galleryProject.stills && galleryProject.stills.length > 0) {
 const bts = galleryProject.stills.filter(s => s.type === 'bts');
 if (bts.length > 0) {
 bts.forEach(still => {
 const img = document.createElement('img');
 img.src = resolvePath(still.src.startsWith('/') ? still.src : '/' + still.src);
 img.alt = still.alt || `${project.title} BTS`;
 img.style.cursor = 'pointer';
 img.addEventListener('click', () => viewFullscreenImage(still.src, img));
 btsGrid.appendChild(img);
 });
 } else {
 btsGrid.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">No BTS images available</p>';
 }
 } else {
 btsGrid.innerHTML = '<p style="color: var(--color-text-secondary); font-style: italic;">No BTS images available</p>';
 }
}

// Close modal - initialized in initModal()
function initModalEventListeners() {
if (!modalClose || !stillsModal) {
clientLogger.warn('Modal elements not initialized');
return;
}

modalClose.addEventListener('click', () => {
stillsModal.classList.remove('active');
});

stillsModal.addEventListener('click', (e) => {
if (e.target === stillsModal) {
stillsModal.classList.remove('active');
}
});

// Close on escape key
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && stillsModal.classList.contains('active')) {
stillsModal.classList.remove('active');
}
});
}

// Reposition modal on window resize when modal is open
window.addEventListener('resize', () => {
 if (stillsModal.classList.contains('active')) {
 const workSection = document.querySelector('.work');
 if (workSection) {
 const rect = workSection.getBoundingClientRect();
 const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
 
 stillsModal.style.top = `${rect.top + scrollTop}px`;
 stillsModal.style.left = `${rect.left}px`;
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

// Gallery will be populated from config
let allGalleryImages = [];

// Populate gallery from siteConfig when available
function populateGalleryFromConfig() {
if (!siteConfig?.gallery?.projects) {
clientLogger.warn('No gallery projects in config');
return;
}

allGalleryImages = [];

siteConfig.gallery.projects.forEach(proj => {
const projectName = proj.name || 'untagged';
const projectKey = projectName.toLowerCase().replace(/[^a-z0-9]/g, '');

if (proj.stills) {
proj.stills.forEach(still => {
	allGalleryImages.push({
	src: resolvePath(still.src.startsWith('/') ? still.src : '/' + still.src),
	project: projectKey,
	projectName: projectName // Keep original name for debugging
	});
});
}
});

clientLogger.debug(`Populated ${allGalleryImages.length} gallery images from config`);
clientLogger.debug('Gallery projects:', [...new Set(allGalleryImages.map(img => img.project))]);
}

// Gallery state
let currentFilter = 'all';

// Initialize gallery - OPTIMIZED version
function initGallery(filter = 'all') {
 const galleryGrid = document.getElementById('galleryGrid');
 if (!galleryGrid) {
 clientLogger.warn('Gallery grid not found');
 return;
 }
 
 clientLogger.debug('initGallery called with filter:', filter, 'total images:', allGalleryImages.length);
 
 // Filter images
 let filteredImages = allGalleryImages;
 if (filter !== 'all') {
 filteredImages = allGalleryImages.filter(img => img.project === filter);
 clientLogger.debug('Filtered to', filteredImages.length, 'images for project:', filter);
 }
 
 // If no images match, show all (fallback)
 if (filteredImages.length === 0) {
 clientLogger.warn('No images found for filter:', filter, '- showing all');
 filteredImages = allGalleryImages;
 }
 
 // For "all" filter: shuffle and take first 12
 // For specific project: show ALL images in original order (no shuffle, no limit)
 let selected = filteredImages;
 if (filter === 'all') {
 // Shuffle for "all projects" view
 const shuffled = [...filteredImages];
 for (let i = shuffled.length - 1; i > 0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
 [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
 }
 selected = shuffled.slice(0, 12);
 clientLogger.debug('All Projects: showing', selected.length, 'random images');
 } else {
 clientLogger.debug('Project filter: showing ALL', selected.length, 'images in order');
 }
 
 // Clear and rebuild with fade animation
 const existingItems = galleryGrid.querySelectorAll('.gallery-item');
 
 if (existingItems.length > 0) {
 // Fade out existing items quickly
 existingItems.forEach((item) => {
 item.style.opacity = '0';
 item.style.transform = 'scale(0.95)';
 });
 
 // Wait for fade out, then rebuild
 setTimeout(() => {
 galleryGrid.innerHTML = '';
 addGalleryItems(selected);
 }, 150); // Quick 150ms fade
 } else {
 // No existing items, just add new ones
 addGalleryItems(selected);
 }
 
 // Update current filter state
 currentFilter = filter;
}

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
 const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
 
 // Get the clicked item's position for scaling animation
 const itemRect = clickedItem.getBoundingClientRect();
 const centerX = itemRect.left + itemRect.width / 2;
 const centerY = itemRect.top + itemRect.height / 2 + scrollTop;
 
 // Create modal overlay (fullscreen)
 const modal = document.createElement('div');
 modal.style.cssText = `
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background: rgba(0, 0, 0, 0.9);
 backdrop-filter: blur(10px);
 z-index: 100000;
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 cursor: pointer;
 opacity: 0;
 transition: opacity 0.3s ease;
 `;
 
 // Create image container - starts at clicked position, animates to horizontal center
 const imgContainer = document.createElement('div');
 imgContainer.style.cssText = `
 position: fixed;
 top: ${centerY}px;
 left: ${centerX}px;
 width: 90%;
 max-width: 1200px;
 display: flex;
 align-items: center;
 justify-content: center;
 /* Start at clicked position */
 transform: translate(-50%, -50%) scale(0.1);
 transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
 `;
 
 const img = document.createElement('img');
 img.src = src;
 img.style.cssText = `
 width: 115%; /* 15% bigger */
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
 // Return to clicked position and scale down
 imgContainer.style.left = `${centerX}px`;
 imgContainer.style.transform = 'translate(-50%, -50%) scale(0.1)';
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
 
 // Don't disable body scroll - keep it unlocked
 
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
 
 // Animate in - scale up and move to horizontal center (keep same vertical position)
 setTimeout(() => {
 modal.style.opacity = '1';
 // Move to horizontal center of viewport, keep same vertical position
 imgContainer.style.left = '50%';
 imgContainer.style.transform = 'translate(-50%, -50%) scale(1)';
 }, 10);
}

// Gallery filter handlers - immediate response on click
galleryFilters.forEach(btn => {
 btn.addEventListener('click', () => {
 galleryFilters.forEach(b => b.classList.remove('active'));
 btn.classList.add('active');
 
 const filter = btn.dataset.filter;
 initGallery(filter);
 });
});

// Rotate gallery images every 15 seconds (paused when tab hidden)
let galleryInterval = setInterval(() => {
 // Only rotate if on "all" filter, otherwise keep project order
 if (currentFilter === 'all') {
 initGallery('all');
 }
}, 15000);

// Pause rotation when tab is hidden to save resources
document.addEventListener('visibilitychange', () => {
 if (document.hidden) {
 clearInterval(galleryInterval);
 galleryInterval = null;
 } else if (!galleryInterval) {
 galleryInterval = setInterval(() => {
 if (currentFilter === 'all') {
 initGallery('all');
 }
 }, 15000);
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
        clientLogger.debug('Form submitted');
        
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
// INFINITE CAROUSEL — Seamless CSS Animation
// Right-to-left auto-scroll, smooth infinite loop
// ============================================
let carouselAutoScrollInterval;
let carouselCurrentPosition = 0;
let carouselIsPaused = false;
let carouselSpeed = 0.5; // pixels per frame (right-to-left)

function initInfiniteCarousel() {
  const carouselTrack = document.getElementById('carouselTrack');
  if (!carouselTrack) return;
  
  const carouselContainer = document.querySelector('.work-carousel');
  if (!carouselContainer) return;
  
  // Get original cards
  const originalCards = Array.from(carouselTrack.querySelectorAll('.work-card'));
  if (originalCards.length === 0) return;
  
  // Create navigation arrows
  createNavArrows(carouselContainer);
  
  // Create 7 copies for seamless loop
  for (let i = 0; i < 7; i++) {
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.dataset.copy = 'true';
      carouselTrack.appendChild(clone);
    });
  }
  
  // Attach event listeners to ALL cards
  attachCardListeners();
  
  // Start smooth auto-scroll (right-to-left)
  startSmoothAutoScroll();
  
  // Pause on hover
  carouselContainer.addEventListener('mouseenter', () => {
    carouselIsPaused = true;
  });
  
  carouselContainer.addEventListener('mouseleave', () => {
    carouselIsPaused = false;
  });
}

function createNavArrows(container) {
  if (container.querySelector('.carousel-nav-arrows')) return;
  
  const arrows = document.createElement('div');
  arrows.className = 'carousel-nav-arrows';
  arrows.innerHTML = `
    <button class="carousel-arrow carousel-arrow-left" aria-label="Previous">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <button class="carousel-arrow carousel-arrow-right" aria-label="Next">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  `;
  container.appendChild(arrows);
  
  arrows.querySelector('.carousel-arrow-left').addEventListener('click', () => nudgeCarousel(-1));
  arrows.querySelector('.carousel-arrow-right').addEventListener('click', () => nudgeCarousel(1));
}

function attachCardListeners() {
 const allCards = document.querySelectorAll('.work-card');
 allCards.forEach(card => {
 // Remove old listeners by cloning
 const newCard = card.cloneNode(true);
 card.parentNode.replaceChild(newCard, card);
 
 // Add fresh listeners
 const viewBtn = newCard.querySelector('.btn-view-stills');
 if (viewBtn) {
 viewBtn.addEventListener('click', (e) => {
 e.preventDefault();
 e.stopPropagation();
 const projectId = newCard.dataset.projectId;
 const project = siteConfig.selectedWorks.find(p => p.id === projectId);
 if (project) {
 openProjectModal(project);
 }
 });
 }
 });
}

function nudgeCarousel(direction) {
  // Arrow click: jump by one card width
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  const cardWidth = 320;
  carouselCurrentPosition += cardWidth * direction;
  track.style.transform = `translateX(${carouselCurrentPosition}px)`;
}

// Smooth requestAnimationFrame auto-scroll (right-to-left)
let carouselRAF = null;

function startSmoothAutoScroll() {
  stopSmoothAutoScroll();
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  
  // Measure one set of original cards width for seamless reset
  const originalSetWidth = track.scrollWidth / 8; // 1 original + 7 copies = 8 sets
  
  function animate() {
    if (!carouselIsPaused) {
      carouselCurrentPosition -= carouselSpeed; // Negative = right-to-left
      
      // Seamless reset: when we've scrolled past one full set of originals,
      // jump back by one set width — invisible because the cloned cards are identical
      if (Math.abs(carouselCurrentPosition) >= originalSetWidth) {
        carouselCurrentPosition += originalSetWidth;
        track.style.transition = 'none';
        track.style.transform = `translateX(${carouselCurrentPosition}px)`;
        // Force reflow to apply the no-transition state
        track.offsetHeight;
        // Restore transition on next frame
        requestAnimationFrame(() => {
          track.style.transition = '';
        });
      } else {
        track.style.transform = `translateX(${carouselCurrentPosition}px)`;
      }
    }
    carouselRAF = requestAnimationFrame(animate);
  }
  carouselRAF = requestAnimationFrame(animate);
}

function stopSmoothAutoScroll() {
  if (carouselRAF) {
    cancelAnimationFrame(carouselRAF);
    carouselRAF = null;
  }
}

// ============================================
// PROJECT MODAL — CINEMATIC EDITORIAL
// Design: RunwayML dark UI + Apple premium whitespace
// Interface invisible, photography dominant
// ============================================
function openProjectModal(project) {
  // GUARD: Prevent multiple modals stacking
  const existingModal = document.querySelector('.project-modal');
  if (existingModal) return;

  // Get gallery project for stills
  const galleryProject = siteConfig.gallery?.projects?.find(p => p.name === project.title);
  const stills = galleryProject?.stills || [];
  const productionStills = stills.filter(s => s.type === 'still' || !s.type);
  const btsStills = stills.filter(s => s.type === 'bts');
  let currentGalleryImages = stills; // Track currently displayed images for fullscreen nav
  
  const modal = document.createElement('div');
  modal.className = 'project-modal';

  // Backdrop — deep cinematic dark, blur for depth
 modal.style.cssText = `
 position: fixed;
 top: 0;
 left: 0;
 width: 100vw;
 height: 100vh;
 background: rgba(0, 0, 0, 0.92);
 backdrop-filter: blur(20px);
 -webkit-backdrop-filter: blur(20px);
 z-index: 100000;
 display: flex;
 align-items: flex-start;
 justify-content: center;
 opacity: 0;
 transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
 padding: 2rem;
 overflow-y: auto;
 overscroll-behavior: contain;
 `;
  
  // Content container — Apple's centered precision, RunwayML's dark surface
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    display: grid;
    grid-template-columns: 38% 1fr;
    gap: 2.5rem;
    max-width: 1200px;
    width: 100%;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-bg-tertiary, rgba(255,255,255,0.06));
    border-radius: 8px;
    padding: 2.5rem;
    position: relative;
    margin-top: 1rem;
  `;
  
  // ---- LEFT COLUMN — Poster (cinematic, zero shadow) ----
  const posterColumn = document.createElement('div');
  posterColumn.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  `;
  
  const posterImg = document.createElement('img');
  posterImg.src = resolvePath(project.image || '/assets/images/placeholder.png');
  posterImg.alt = project.title || 'Project poster';
  posterImg.style.cssText = `
    width: 100%;
    height: auto;
    border-radius: 6px;
    display: block;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  posterImg.addEventListener('mouseenter', () => posterImg.style.transform = 'scale(1.015)');
  posterImg.addEventListener('mouseleave', () => posterImg.style.transform = 'scale(1)');
  posterColumn.appendChild(posterImg);
  
  // ---- RIGHT COLUMN — Info (editorial typography) ----
  const infoColumn = document.createElement('div');
  infoColumn.style.cssText = `
    display: flex;
    flex-direction: column;
    min-width: 0;
  `;
  
  // Close button — subtle, Apple-style translucent
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.setAttribute('aria-label', 'Close modal');
  closeBtn.style.cssText = `
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-text-secondary);
    border: none;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = 'rgba(255, 255, 255, 0.15)';
    closeBtn.style.color = 'var(--color-text-primary)';
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'rgba(255, 255, 255, 0.08)';
    closeBtn.style.color = 'var(--color-text-secondary)';
  });
  closeBtn.addEventListener('click', closeModal);
  infoColumn.appendChild(closeBtn);
  
  // Title — tight, editorial, film-title presence
  const title = document.createElement('h1');
  title.textContent = project.title || 'Untitled';
  title.style.cssText = `
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.5px;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary);
  `;
  infoColumn.appendChild(title);
  
  // Tagline — accent color, italic, editorial
  if (project.tagline) {
    const tagline = document.createElement('p');
    tagline.textContent = project.tagline;
    tagline.style.cssText = `
      font-size: 1.05rem;
      color: var(--color-accent);
      margin: 0 0 1.25rem 0;
      font-style: italic;
      line-height: 1.4;
    `;
    infoColumn.appendChild(tagline);
  }
  
  // Metadata — uppercase labels, RunwayML editorial style
  const metaRow = document.createElement('div');
  metaRow.style.cssText = `
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  `;
  
  const metaItems = [];
  if (project.year) metaItems.push({ label: 'YEAR', value: project.year });
  if (project.category) metaItems.push({ label: 'GENRE', value: project.category.toUpperCase() });
  if (project.duration) metaItems.push({ label: 'DURATION', value: project.duration });
  if (project.role) metaItems.push({ label: 'ROLE', value: project.role });
  
  metaItems.forEach(item => {
    const badge = document.createElement('div');
    badge.style.cssText = `
      padding: 0.4rem 0.75rem;
      background: transparent;
      border: 1px solid var(--color-bg-tertiary, rgba(255,255,255,0.08));
      border-radius: 4px;
      text-align: center;
    `;
    const label = document.createElement('div');
    label.textContent = item.label;
    label.style.cssText = `
      font-size: 0.65rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--color-text-secondary);
      margin-bottom: 0.15rem;
    `;
    const value = document.createElement('div');
    value.textContent = item.value;
    value.style.cssText = `
      font-size: 0.85rem;
      font-weight: 400;
      color: var(--color-text-primary);
      line-height: 1.2;
    `;
    badge.appendChild(label);
    badge.appendChild(value);
    metaRow.appendChild(badge);
  });
  
  infoColumn.appendChild(metaRow);
  
  // Divider — subtle, editorial
  const divider1 = document.createElement('div');
  divider1.style.cssText = `
    height: 1px;
    background: var(--color-bg-tertiary, rgba(255,255,255,0.06));
    margin-bottom: 1.25rem;
  `;
  infoColumn.appendChild(divider1);
  
  // Synopsis
  if (project.synopsis) {
    const synopsisSection = document.createElement('div');
    synopsisSection.style.cssText = `margin-bottom: 1.25rem;`;
    
    const synopsisTitle = document.createElement('h3');
    synopsisTitle.textContent = 'SYNOPSIS';
    synopsisTitle.style.cssText = `
      font-size: 0.7rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 0.5rem 0;
      color: var(--color-text-secondary);
    `;
    synopsisSection.appendChild(synopsisTitle);
    
    const synopsisText = document.createElement('p');
    synopsisText.textContent = project.synopsis;
    synopsisText.style.cssText = `
      color: var(--color-text-primary);
      line-height: 1.55;
      margin: 0;
      font-size: 0.92rem;
    `;
    synopsisSection.appendChild(synopsisText);
    infoColumn.appendChild(synopsisSection);
  }
  
  // Crew — two-column grid, role/value pairs
  if (project.credits) {
    const crewSection = document.createElement('div');
    crewSection.style.cssText = `margin-bottom: 1.25rem;`;
    
    const crewTitle = document.createElement('h3');
    crewTitle.textContent = 'CREW';
    crewTitle.style.cssText = `
      font-size: 0.7rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 0.6rem 0;
      color: var(--color-text-secondary);
    `;
    crewSection.appendChild(crewTitle);
    
    const crewList = document.createElement('div');
    crewList.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.35rem 1.5rem;
    `;
    
    const creditMap = {
      director: 'Director',
      dop: 'Cinematographer',
      producer: 'Producer',
      writer: 'Writer',
      editor: 'Editor',
      colorist: 'Colorist',
      productionDesigner: 'Prod. Designer',
      assistantDirector: '1st AD',
      soundDesigner: 'Sound Designer',
      composer: 'Composer'
    };
    
    Object.entries(creditMap).forEach(([key, label]) => {
      if (project.credits[key]) {
        const row = document.createElement('div');
        row.style.cssText = `display: flex; gap: 0.5rem; align-items: baseline;`;
        
        const roleEl = document.createElement('span');
        roleEl.textContent = label;
        roleEl.style.cssText = `
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          min-width: 90px;
          flex-shrink: 0;
        `;
        
        const nameEl = document.createElement('span');
        nameEl.textContent = project.credits[key];
        nameEl.style.cssText = `
          font-size: 0.85rem;
          color: var(--color-text-primary);
          font-weight: 500;
        `;
        
        row.appendChild(roleEl);
        row.appendChild(nameEl);
        crewList.appendChild(row);
      }
    });
    
    crewSection.appendChild(crewList);
    infoColumn.appendChild(crewSection);
  }
  
  // Camera specs
  if (project.camera) {
    const cameraSection = document.createElement('div');
    cameraSection.style.cssText = `margin-bottom: 1.25rem;`;
    
    const cameraTitle = document.createElement('h3');
    cameraTitle.textContent = 'CAMERA';
    cameraTitle.style.cssText = `
      font-size: 0.7rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 0.6rem 0;
      color: var(--color-text-secondary);
    `;
    cameraSection.appendChild(cameraTitle);
    
    const cameraList = document.createElement('div');
    cameraList.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.35rem 1.5rem;
    `;
    
    const cameraMap = {
      body: 'Body',
      lens: 'Lens',
      aspectRatio: 'Aspect Ratio'
    };
    
    Object.entries(cameraMap).forEach(([key, label]) => {
      if (project.camera[key]) {
        const row = document.createElement('div');
        row.style.cssText = `display: flex; gap: 0.5rem; align-items: baseline;`;
        
        const specEl = document.createElement('span');
        specEl.textContent = label;
        specEl.style.cssText = `
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          min-width: 90px;
          flex-shrink: 0;
        `;
        
        const valEl = document.createElement('span');
        valEl.textContent = project.camera[key];
        valEl.style.cssText = `
          font-size: 0.85rem;
          color: var(--color-text-primary);
          font-weight: 500;
        `;
        
        row.appendChild(specEl);
        row.appendChild(valEl);
        cameraList.appendChild(row);
      }
    });
    
    cameraSection.appendChild(cameraList);
    infoColumn.appendChild(cameraSection);
  }
  
  // Action buttons — Apple pill style
  const hasTrailer = project.trailerUrl;
  const hasImdb = project.imdbUrl;
  
  if (hasTrailer || hasImdb) {
    const actionRow = document.createElement('div');
    actionRow.style.cssText = `
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
      padding-top: 1rem;
    `;
    
    if (hasTrailer) {
      const trailerBtn = document.createElement('a');
      trailerBtn.href = project.trailerUrl;
      trailerBtn.target = '_blank';
      trailerBtn.textContent = '▶ Watch Trailer';
      trailerBtn.style.cssText = `
        padding: 0.5rem 1.25rem;
        background: var(--color-accent);
        color: var(--color-bg-primary);
        border-radius: 980px;
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
        letter-spacing: -0.2px;
        transition: opacity 0.2s;
      `;
      trailerBtn.addEventListener('mouseenter', () => trailerBtn.style.opacity = '0.85');
      trailerBtn.addEventListener('mouseleave', () => trailerBtn.style.opacity = '1');
      actionRow.appendChild(trailerBtn);
    }
    
    if (hasImdb) {
      const imdbBtn = document.createElement('a');
      imdbBtn.href = project.imdbUrl;
      imdbBtn.target = '_blank';
      imdbBtn.textContent = 'IMDb →';
      imdbBtn.style.cssText = `
        padding: 0.5rem 1.25rem;
        background: transparent;
        color: var(--color-text-primary);
        border: 1px solid var(--color-bg-tertiary, rgba(255,255,255,0.12));
        border-radius: 980px;
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
        letter-spacing: -0.2px;
        transition: background 0.2s;
      `;
      imdbBtn.addEventListener('mouseenter', () => imdbBtn.style.background = 'rgba(255,255,255,0.05)');
      imdbBtn.addEventListener('mouseleave', () => imdbBtn.style.background = 'transparent');
      actionRow.appendChild(imdbBtn);
    }
    
    infoColumn.appendChild(actionRow);
  }
  
  // ---- STILLS GALLERY — full width below columns ----
  const gallerySection = document.createElement('div');
  gallerySection.style.cssText = `
    grid-column: 1 / -1;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-bg-tertiary, rgba(255,255,255,0.06));
  `;
  
  const galleryHeader = document.createElement('div');
  galleryHeader.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  `;
  
  const galleryTitle = document.createElement('h3');
  galleryTitle.textContent = 'STILLS';
  galleryTitle.style.cssText = `
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
    color: var(--color-text-secondary);
  `;
  galleryHeader.appendChild(galleryTitle);
  
  // Gallery tabs — minimal underline style
  const tabsContainer = document.createElement('div');
  tabsContainer.style.cssText = `
    display: flex;
    gap: 0.25rem;
  `;
  
  function createTab(text, images) {
    const tab = document.createElement('button');
    tab.textContent = text;
    tab.className = 'modal-gallery-tab';
    tab.style.cssText = `
      padding: 0.35rem 0.75rem;
      background: transparent;
      color: var(--color-text-secondary);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 400;
      transition: background 0.2s, color 0.2s;
    `;
    return tab;
  }
  
  const allTab = createTab(`All ${stills.length}`, stills);
  const stillsTab = createTab(`Stills ${productionStills.length}`, productionStills);
  const btsTab = createTab(`BTS ${btsStills.length}`, btsStills);
  
  function setActiveTab(activeTab) {
    [allTab, stillsTab, btsTab].forEach(tab => {
      if (tab === activeTab) {
        tab.style.background = 'var(--color-accent)';
        tab.style.color = 'var(--color-bg-primary)';
        tab.classList.add('active');
      } else {
        tab.style.background = 'transparent';
        tab.style.color = 'var(--color-text-secondary)';
        tab.classList.remove('active');
      }
    });
  }
  
  // Set initial active
  setActiveTab(allTab);
  
  tabsContainer.appendChild(allTab);
  if (productionStills.length > 0) tabsContainer.appendChild(stillsTab);
  if (btsStills.length > 0) tabsContainer.appendChild(btsTab);
  galleryHeader.appendChild(tabsContainer);
  gallerySection.appendChild(galleryHeader);
  
  // Gallery grid — varied sizes, editorial magazine layout
  const galleryGrid = document.createElement('div');
  galleryGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.5rem;
  `;
  
  function renderGallery(images) {
    galleryGrid.innerHTML = '';
    currentGalleryImages = images;
    images.forEach((still, index) => {
      const img = document.createElement('img');
      img.src = resolvePath(still.src.startsWith('/') ? still.src : '/' + still.src);
      img.alt = still.alt || 'Still';
      img.loading = 'lazy';
      img.style.cssText = `
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        transition: opacity 0.3s, transform 0.3s;
        opacity: 0;
      `;
      img.addEventListener('load', () => { img.style.opacity = '1'; });
      img.addEventListener('mouseenter', () => { img.style.transform = 'scale(1.02)'; });
      img.addEventListener('mouseleave', () => { img.style.transform = 'scale(1)'; });
      img.addEventListener('click', () => openFullscreen(index, img));
      galleryGrid.appendChild(img);
    });
  }
  
  renderGallery(stills);
  
  allTab.addEventListener('click', () => { renderGallery(stills); setActiveTab(allTab); });
  stillsTab.addEventListener('click', () => { renderGallery(productionStills); setActiveTab(stillsTab); });
  btsTab.addEventListener('click', () => { renderGallery(btsStills); setActiveTab(btsTab); });
  
  gallerySection.appendChild(galleryGrid);
  
  // Assemble modal
  modalContent.appendChild(posterColumn);
  modalContent.appendChild(infoColumn);
  modalContent.appendChild(gallerySection);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
 // Save scroll position, then smooth-scroll to top
 const savedScrollY = window.scrollY;
 window.scrollTo({ top: 0, behavior: 'smooth' });

 // Fade in — NO body overflow lock (user needs to scroll the modal)
 requestAnimationFrame(() => {
 requestAnimationFrame(() => {
 modal.style.opacity = '1';
 });
 });

 function closeModal() {
 modal.style.opacity = '0';
 document.removeEventListener('keydown', handleModalEscape);
 setTimeout(() => {
 modal.remove();
 // Restore scroll position after modal is gone
 window.scrollTo({ top: savedScrollY, behavior: 'smooth' });
 }, 350);
 }

  // ESC key handler — checks for fullscreen viewer first
  function handleModalEscape(e) {
    if (e.key === 'Escape') {
      const fsViewer = document.querySelector('.project-fullscreen-viewer');
      if (fsViewer) {
        closeFullscreen();
      } else {
        closeModal();
      }
    }
  }
  document.addEventListener('keydown', handleModalEscape);

  // Click outside modal content to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
 // ---- FULLSCREEN VIEWER — same spec as gallery section viewFullscreenImage ----
 // Image opens horizontally centered, vertically at the same level as the clicked thumbnail
 // No scroll lock, scale animation, click outside or ESC to close
 let fsViewer = null;
 let fsHandleEscape = null;
 
 function openFullscreen(startIndex, clickedImgEl) {
 // Get the clicked image's position for the scale-from-origin animation
 const itemRect = clickedImgEl ? clickedImgEl.getBoundingClientRect() : null;
 const centerX = itemRect ? itemRect.left + itemRect.width / 2 : window.innerWidth / 2;
 const centerY = itemRect ? itemRect.top + itemRect.height / 2 + (window.pageYOffset || document.documentElement.scrollTop) : (window.pageYOffset || document.documentElement.scrollTop) + window.innerHeight / 2;
 
 const src = resolvePath(currentGalleryImages[startIndex].src.startsWith('/') ? currentGalleryImages[startIndex].src : '/' + currentGalleryImages[startIndex].src);
 
 // Create modal overlay (fullscreen) — same spec as gallery
 fsViewer = document.createElement('div');
 fsViewer.style.cssText = `
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background: rgba(0, 0, 0, 0.9);
 backdrop-filter: blur(10px);
 z-index: 100001;
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 opacity: 0;
 transition: opacity 0.3s ease;
 `;
 
 // Create image container — starts at clicked position, animates to horizontal center
 const imgContainer = document.createElement('div');
 imgContainer.style.cssText = `
 position: fixed;
 top: ${centerY}px;
 left: ${centerX}px;
 width: 90%;
 max-width: 1200px;
 display: flex;
 align-items: center;
 justify-content: center;
 transform: translate(-50%, -50%) scale(0.1);
 transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
 `;
 
 const img = document.createElement('img');
 img.src = src;
 img.alt = currentGalleryImages[startIndex].alt || 'Still';
 img.style.cssText = `
 width: 115%;
 max-height: 90vh;
 object-fit: contain;
 border-radius: var(--radius-md);
 box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
 `;
 
 // Close button — same spec as gallery (accent color, rotation hover)
 const fsCloseBtn = document.createElement('button');
 fsCloseBtn.innerHTML = '×';
 fsCloseBtn.setAttribute('aria-label', 'Close fullscreen');
 fsCloseBtn.style.cssText = `
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
 fsViewer.style.opacity = '0';
 // Return to clicked position and scale down
 imgContainer.style.left = `${centerX}px`;
 imgContainer.style.transform = 'translate(-50%, -50%) scale(0.1)';
 setTimeout(() => {
 if (fsViewer) { fsViewer.remove(); fsViewer = null; }
 // No body overflow lock to restore
 }, 300);
 };
 
 fsCloseBtn.addEventListener('mouseenter', () => {
 fsCloseBtn.style.transform = 'rotate(90deg) scale(1.1)';
 fsCloseBtn.style.background = '#ff4444';
 });
 fsCloseBtn.addEventListener('mouseleave', () => {
 fsCloseBtn.style.transform = 'rotate(0deg) scale(1)';
 fsCloseBtn.style.background = 'var(--color-accent)';
 });
 fsCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); handleClose(); });
 
 imgContainer.appendChild(img);
 imgContainer.appendChild(fsCloseBtn);
 fsViewer.appendChild(imgContainer);
 document.body.appendChild(fsViewer);
 
 // Don't disable body scroll — keep it unlocked (same as gallery)
 
 // Click outside to close
 fsViewer.addEventListener('click', (e) => {
 if (e.target === fsViewer) handleClose();
 });
 
 // Close on escape key
 fsHandleEscape = (e) => {
 if (e.key === 'Escape') {
 handleClose();
 document.removeEventListener('keydown', fsHandleEscape);
 fsHandleEscape = null;
 }
 };
 document.addEventListener('keydown', fsHandleEscape);
 
 // Animate in — scale up and move to horizontal center (keep same vertical position)
 setTimeout(() => {
 fsViewer.style.opacity = '1';
 imgContainer.style.left = '50%';
 imgContainer.style.transform = 'translate(-50%, -50%) scale(1)';
 }, 10);
 }
 
 function closeFullscreen() {
 if (fsViewer) {
 if (fsHandleEscape) { document.removeEventListener('keydown', fsHandleEscape); fsHandleEscape = null; }
 fsViewer.style.opacity = '0';
 const viewer = fsViewer;
 setTimeout(() => viewer.remove(), 300);
 fsViewer = null;
 }
 }
}

// ============================================
// MOUSE TRACKING FOR CAROUSEL CARDS
// ============================================
function initCarouselMouseTracking() {
 const workSection = document.querySelector('.work');
 const workCards = document.querySelectorAll('.work-card');
 
 if (!workSection || workCards.length === 0) return;
 
 // Use section header tracking approach (limited tilt)
 const SECTION_TILT_MAX = isMobile ? 15 : 10; // Mobile: 15°, Desktop: 10°
 
 workCards.forEach(card => {
 card.addEventListener('mousemove', (e) => {
 const rect = card.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;
 
 const centerX = rect.width / 2;
 const centerY = rect.height / 2;
 
 // Calculate tilt, clamp to ±10° (same as section headers)
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
}

// Initialize carousel on page load (MOVED to updateHeroFromConfig to run after config loads)
document.addEventListener('DOMContentLoaded', () => {
  // Carousel initialization moved to updateHeroFromConfig()
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
function initializeApp() {
clientLogger.info('Portfolio initialized successfully!');
clientLogger.info('Joel Kundu - Cinematographer & Director');
clientLogger.info(`Theme: ${savedTheme || themeToUse}`);
clientLogger.info('3D effects enabled');
clientLogger.info('Image protection enabled');
clientLogger.info('Password protection enabled');
clientLogger.info('Infinite carousel enabled');

// Load dynamic config from dashboard
// updateHeroFromConfig() is called inside loadSiteConfig() after config is loaded

// Pre-populate hero slideshow immediately using localStorage cache (if available)
// This prevents the blank hero on first load while config is fetching
// populateHeroSlideshow() will also auto-start the cycling interval
populateHeroSlideshow();

loadSiteConfig().then(() => {
clientLogger.info('Dynamic config loaded and applied!');
// updateHeroFromConfig() -> populateHeroSlideshow() will update slides with fresh config data
// and restart the interval if needed
// Initialize gallery after config is loaded (default: 'all' filter)
initGallery('all');
}).catch(err => {
clientLogger.error('Failed to load config:', err.message);
});
}

// Run when DOM is ready, or immediately if already loaded
if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initializeApp);
} else {
 // DOM already loaded, run immediately
 initializeApp();
}
// Cache buster: 1778954065
