/* ===========
   Professional script.js
   Fully debugged & optimized
   =========== */

/* --- Helper Functions --- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* =========================
   Mobile Nav Toggle
   ========================= */
const menuToggle = $('#menu-toggle');
const navLinksContainer = $('#nav-links');

if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener('click', () => {
    const isActive = navLinksContainer.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  $$('#nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* =========================
   Navbar Scroll Effect
   ========================= */
const navbar = $('#navbar');
const hero = $('#hero');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > (hero ? hero.offsetHeight * 0.4 : 60));
});

/* =========================
   Smooth Scroll Spy & Reveal
   ========================= */
const sections = $$('main section, header#hero');
const navLinks = $$('#nav-links a');

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    entry.target.classList.toggle('visible', entry.isIntersecting);
    if (entry.isIntersecting && id) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, { threshold: 0.25 });

sections.forEach(s => io.observe(s));

/* =========================
   Hero Particles (Optimized)
   ========================= */
const parallaxLayer = document.querySelector('.parallax-layer');
let particles = [];

function createParticles(count = 24) {
  if (!parallaxLayer) return;
  parallaxLayer.innerHTML = '';
  particles = [];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 3 + Math.random() * 6;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.left = `${Math.random() * 100}%`;
    p.dataset.speed = (0.2 + Math.random() * 0.9).toFixed(2);
    parallaxLayer.appendChild(p);
    particles.push(p);
  }
}
createParticles();

// Unified Particle Animation
function updateParticles(mouseX = 0, mouseY = 0, scrollY = window.scrollY) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const cx = (mouseX - w / 2) / (w / 2);
  const cy = (mouseY - h / 2) / (h / 2);

  particles.forEach((p, i) => {
    const speed = parseFloat(p.dataset.speed || 0.5);
    const tx = Math.round(cx * (6 * speed) * (i % 3 + 1));
    const ty = Math.round(cy * (8 * speed) * (i % 4 + 1) - scrollY * speed * 0.03);
    p.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
  });
}

window.addEventListener('mousemove', (e) => updateParticles(e.clientX, e.clientY));
window.addEventListener('scroll', () => updateParticles());

/* =========================
   Metrics / ROI Counters
   ========================= */
const animateCounter = (counter) => {
  const target = parseFloat(counter.dataset.target);
  let count = 0;
  const increment = target / 120;

  const step = () => {
    count += increment;
    if (count < target) {
      counter.innerText = target % 1 !== 0 ? count.toFixed(1) : Math.floor(count);
      requestAnimationFrame(step);
    } else {
      counter.innerText = target;
    }
  };
  step();
};

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

$$('.plans, .metrics').forEach(section => counterObserver.observe(section));

/* =========================
   Testimonials Slider
   ========================= */
const testimonials = $$('.testimonial');
const dotsContainer = $('.testimonial-dots');
let currentTestimonial = 0;
let testimonialInterval;

// create dots
if (dotsContainer) {
  testimonials.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.toggle('active', i === 0);
    dot.addEventListener('click', () => showTestimonial(i));
    dotsContainer.appendChild(dot);
  });
}

const dots = $$('.testimonial-dots span');

function showTestimonial(index) {
  testimonials.forEach((t, i) => t.classList.toggle('active', i === index));
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  currentTestimonial = index;
  resetTestimonialInterval();
}

function resetTestimonialInterval() {
  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(() => {
    let next = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(next);
  }, 6000);
}

resetTestimonialInterval();

/* =========================
   Contact Form Handling
   ========================= */
const form = $('#contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name?.value?.trim();
    const email = form.email?.value?.trim();
    const msg = form.message?.value?.trim();

    if (!name || !email || !msg) {
      alert('Please fill all fields before sending.');
      return;
    }

    const btn = form.querySelector('button');
    btn.innerText = 'Sending...';
    btn.disabled = true;

    // Simulate async send
    setTimeout(() => {
      alert('Thanks! Your message was sent successfully.');
      form.reset();
      btn.innerText = 'Send Message';
      btn.disabled = false;
    }, 1200);
  });
}

/* =========================
   Dynamic Year
   ========================= */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
