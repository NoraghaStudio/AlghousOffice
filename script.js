/* ======================================
   ALGHOUS ENGINEERING - MAIN SCRIPT
====================================== */

// --- Header scroll effect ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// --- Mobile menu ---
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = menuToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// --- Active nav link on scroll ---
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
});

// --- Scroll to top button ---
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Project Slider (Card Level) ---
function moveSlide(btn, dir) {
  if (event) event.stopPropagation();
  const card = btn.closest('.project-card');
  const slides = card.querySelectorAll('.project-slide');
  let activeIndex = Array.from(slides).findIndex(s => s.classList.contains('active'));
  
  slides[activeIndex].classList.remove('active');
  activeIndex = (activeIndex + dir + slides.length) % slides.length;
  slides[activeIndex].classList.add('active');
}

// --- Project Gallery (Lightbox) ---
let currentGallery = [];
let currentGalleryIndex = 0;

function openProjectLightbox(projectId) {
  const card = document.querySelector(`.project-card[data-project="${projectId}"]`);
  const slides = card.querySelectorAll('.project-slide');
  const title = card.querySelector('h4').textContent;
  
  currentGallery = Array.from(slides).map(s => ({
    src: s.getAttribute('data-src'),
    type: s.getAttribute('data-type'),
    title: title
  }));
  
  currentGalleryIndex = 0;
  updateLightbox();
  
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  const item = currentGallery[currentGalleryIndex];
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxCaption = document.getElementById('lightboxCaption');
  
  if (!item) return;

  lightboxImg.style.display = 'none';
  lightboxVideo.style.display = 'none';
  lightboxVideo.pause();
  
  if (item.type === 'video') {
    lightboxVideo.src = item.src;
    lightboxVideo.style.display = 'block';
    lightboxVideo.play();
  } else {
    lightboxImg.src = item.src;
    lightboxImg.style.display = 'block';
  }
  
  lightboxCaption.textContent = `${item.title} (${currentGalleryIndex + 1} / ${currentGallery.length})`;
}

function navigateLightbox(dir) {
  if (currentGallery.length <= 1) return;
  currentGalleryIndex = (currentGalleryIndex + dir + currentGallery.length) % currentGallery.length;
  updateLightbox();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxVideo = document.getElementById('lightboxVideo');
  if (lightboxVideo) {
    lightboxVideo.pause();
    lightboxVideo.src = "";
  }
  if (lightbox) lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') navigateLightbox(-1); // RTL
  if (e.key === 'ArrowLeft') navigateLightbox(1);
});

// Event listener for lightbox backdrop
const lb = document.getElementById('lightbox');
if (lb) {
  lb.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox' || e.target.className === 'lightbox-content') closeLightbox();
  });
}

// --- Intersection Observer for scroll animations ---
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-show');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply subtle fade-in to cards
document.querySelectorAll('.service-card, .vmv-card, .value-card, .project-card, .location-card, .contact-item').forEach(el => {
  el.classList.add('reveal-hidden');
  observer.observe(el);
});

// Staggered animation delay
document.querySelectorAll('.services-grid, .vmv-cards, .values-grid, .projects-grid, .locations-grid').forEach(grid => {
  const children = grid.children;
  Array.from(children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.08}s`;
  });
});
