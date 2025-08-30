/* ===========
   script.js
   =========== */

// --- helpers ---
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// --- MOBILE NAVBAR TOGGLE ---
const menuToggle = $('#menu-toggle');
const navLinksContainer = $('#nav-links');

if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener('click', () => {
    const opened = navLinksContainer.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });

  // Close menu when clicking any link
  $$('#nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// --- PARALLAX PARTICLES ---
const parallaxLayer = $('.parallax-layer');
function createParticles(count = 24) {
  if (!parallaxLayer) return;
  parallaxLayer.innerHTML = '';
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

// Parallax movement
(function particlesParallax() {
  const particles = () => parallaxLayer ? Array.from(parallaxLayer.children) : [];
  window.addEventListener('mousemove', (e) => {
    const w = window.innerWidth, h = window.innerHeight;
    const cx = (e.clientX - w/2) / (w/2);
    const cy = (e.clientY - h/2) / (h/2);
    particles().forEach((p, i) => {
      const speed = parseFloat(p.dataset.speed || 0.5);
      const tx = Math.round(cx * (6 * speed) * (i % 3 + 1));
      const ty = Math.round(cy * (8 * speed) * (i % 4 + 1));
      p.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  });

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    particles().forEach((p, i) => {
      const speed = parseFloat(p.dataset.speed || 0.5);
      p.style.transform = `translate3d(0, ${- (scrollY * speed * 0.03)}px, 0)`;
    });
  });
})();

// --- NAVBAR SCROLL EFFECT ---
const navbar = $('#navbar');
const hero = $('#hero');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > (hero ? (hero.offsetHeight * 0.4) : 60)) {
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
    // Reveal animation
    if (entry.isIntersecting) entry.target.classList.add('visible');
    // ScrollSpy highlight
    if (entry.isIntersecting && id) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, ioOptions);

sections.forEach(s => io.observe(s));

// --- ROI & METRICS COUNTERS ---
const counters = document.querySelectorAll('.counter');
const speed = 150; // lower = faster

const animateCounter = (counter) => {
  const target = +counter.dataset.target;
  let count = +counter.innerText;
  const increment = target / speed;

  if (count < target) {
    count += increment;
    if (target < 10) counter.innerText = count.toFixed(1);
    else counter.innerText = Math.ceil(count);
    requestAnimationFrame(() => animateCounter(counter));
  } else {
    counter.innerText = target;
  }
};

// Animate when visible
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(c => animateCounter(c));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.plan, .metric').forEach(el => counterObserver.observe(el));

// --- TESTIMONIAL SLIDER ---
const testimonials = $$('.testimonial');
const dotsContainer = $('.testimonial-dots');
let currentTestimonial = 0;
let testimonialInterval;

// Create dots
testimonials.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.classList.add(i === 0 ? 'active' : '');
  dot.dataset.index = i;
  dot.addEventListener('click', () => {
    showTestimonial(i);
    resetTestimonialInterval();
  });
  dotsContainer.appendChild(dot);
});

function showTestimonial(index) {
  testimonials.forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });
  dotsContainer.querySelectorAll('span').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
  currentTestimonial = index;
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}

function resetTestimonialInterval() {
  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(nextTestimonial, 7000);
}

testimonialInterval = setInterval(nextTestimonial, 7000);

// Pause on hover
const slider = $('.testimonial-slider');
if (slider) {
  slider.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
  slider.addEventListener('mouseleave', () => testimonialInterval = setInterval(nextTestimonial, 7000));
}

// --- CONTACT FORM ---
const form = $('#contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name?.value.trim();
    const email = form.email?.value.trim();
    const message = form.message?.value.trim();
    if (!name || !email || !message) {
      showToast('Please fill all fields.', 'error');
      return;
    }
    form.reset();
    showToast('Message sent successfully!', 'success');
  });
}

// Toast function
function showToast(msg, type = 'success') {
  let toast = document.createElement('div');
  toast.className = `toast ${type} show`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.remove('show'), 3000);
  setTimeout(() => toast.remove(), 3500);
}

// --- DYNAMIC YEAR ---
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
