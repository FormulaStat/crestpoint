/* ===========
   script.js
   =========== */

// --- helpers ---
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// --- MOBILE NAV TOGGLE ---
const menuToggle = $('#menu-toggle');
const navLinksContainer = $('#nav-links');

if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener('click', () => {
    const opened = navLinksContainer.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });

  // close menu on link click
  $$('#nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// --- PARTICLES GENERATOR ---
const parallaxLayer = document.querySelector('.parallax-layer');
function createParticles(count = 24) {
  if (!parallaxLayer) return;
  parallaxLayer.innerHTML = ''; // reset
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 3 + Math.round(Math.random() * 6);
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.left = `${Math.random() * 100}%`;
    p.dataset.speed = (0.2 + Math.random() * 0.9).toFixed(2);
    parallaxLayer.appendChild(p);
  }
}
createParticles();

// --- PARTICLES PARALLAX ---
(function particlesParallax() {
  const particles = () => parallaxLayer ? Array.from(parallaxLayer.children) : [];
  window.addEventListener('mousemove', (e) => {
    const w = window.innerWidth, h = window.innerHeight;
    const cx = (e.clientX - w / 2) / (w / 2);
    const cy = (e.clientY - h / 2) / (h / 2);
    particles().forEach((p, i) => {
      const speed = parseFloat(p.dataset.speed || 0.5);
      const tx = Math.round(cx * (6 * speed) * (i % 3 + 1));
      const ty = Math.round(cy * (8 * speed) * (i % 4 + 1));
      p.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  });
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    particles().forEach((p) => {
      const speed = parseFloat(p.dataset.speed || 0.5);
      p.style.transform = `translate3d(0, ${-(scrollY * speed * 0.03)}px, 0)`;
    });
  });
})();

// --- NAVBAR SCROLLED EFFECT ---
const navbar = $('#navbar');
const hero = $('#hero');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > (hero ? hero.offsetHeight * 0.4 : 60)) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- SCROLLSPY & REVEAL ---
const sections = $$('main section, header#hero');
const navLinks = $$('#nav-links a');

const ioOptions = { threshold: 0.18 };
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    // reveal animation
    if (entry.isIntersecting) entry.target.classList.add('visible');
    // scrollspy highlight
    if (entry.isIntersecting && id) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, ioOptions);
sections.forEach(s => io.observe(s));

// --- ROI / METRICS COUNTERS ---
const counters = document.querySelectorAll('.counter');
const animateCounter = (counter) => {
  const target = +counter.getAttribute('data-target');
  let count = +counter.innerText;
  const increment = target / 150; // speed
  if (count < target) {
    counter.innerText = (count + increment).toFixed(1);
    setTimeout(() => animateCounter(counter), 25);
  } else {
    counter.innerText = target;
  }
};

// animate when visible
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const planCounters = entry.target.querySelectorAll('.counter');
      planCounters.forEach(c => animateCounter(c));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.plan, .metric').forEach(el => counterObserver.observe(el));

// --- TESTIMONIAL SLIDER ---
const slides = $$('.testimonial');
const dotsContainer = $('.testimonial-dots');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.toggle('active', i === index);
      dot.addEventListener('click', () => showSlide(i));
      dotsContainer.appendChild(dot);
    });
  }
}
showSlide(currentSlide);
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 7000);

// --- CONTACT FORM TOAST ---
const form = $('#contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const msg = form.message.value.trim();
    if (!name || !email || !msg) return showToast('Please fill all fields', 'error');
    form.reset();
    showToast('Message sent successfully!', 'success');
  });
}

function showToast(message, type = 'success') {
  let toast = $('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = `toast ${type}`;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// --- DYNAMIC YEAR ---
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ROI Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 150; // smaller = faster

const animateCounter = (counter) => {
  const target = +counter.getAttribute('data-target');
  const count = +counter.innerText;

  const increment = target / speed;

  if (count < target) {
    counter.innerText = (count + increment).toFixed(1);
    setTimeout(() => animateCounter(counter), 30);
  } else {
    counter.innerText = target;
  }
};

// Trigger counters when plans section or metrics section is visible
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // animate all counters inside this section
      entry.target.querySelectorAll('.counter').forEach(counter => animateCounter(counter));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

// Observe the plans section and metrics section
const sectionsWithCounters = document.querySelectorAll('.plans, .metrics');
sectionsWithCounters.forEach(section => counterObserver.observe(section));
