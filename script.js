/* ===========
   script.js
   =========== */

// --- helpers ---
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// --- mobile nav toggle ---
const menuToggle = $('#menu-toggle');
const navLinksContainer = $('#nav-links');

if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener('click', () => {
    const opened = navLinksContainer.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
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

// --- particles generator ---
const parallaxLayer = document.querySelector('.parallax-layer');
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

// particles parallax
(function particlesParallax() {
  const particles = () => parallaxLayer ? Array.from(parallaxLayer.children) : [];
  window.addEventListener('mousemove', e => {
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
    particles().forEach((p, i) => {
      const speed = parseFloat(p.dataset.speed || 0.5);
      p.style.transform = `translate3d(0, ${-(scrollY * speed * 0.03)}px, 0)`;
    });
  });
})();

// --- navbar scroll effect ---
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

// --- ScrollSpy & reveal ---
const sections = $$('main section, header#hero');
const navLinks = $$('#nav-links a');
const ioOptions = { threshold: 0.18 };
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    if (entry.isIntersecting) entry.target.classList.add('visible');
    if (entry.isIntersecting && id) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, ioOptions);
sections.forEach(s => io.observe(s));

// --- Contact Form ---
const form = $('#contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name?.value?.trim();
    const email = form.email?.value?.trim();
    const msg = form.message?.value?.trim();
    if (!name || !email || !msg) {
      alert('Please fill all fields before sending.');
      return;
    }
    alert('Thanks — your message was sent. We will contact you shortly.');
    form.reset();
  });
}

// --- Dynamic Year ---
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Counters ---
const animateCounter = counter => {
  const target = +counter.getAttribute('data-target');
  let count = parseFloat(counter.innerText) || 0;
  const increment = target / 150;
  if (count < target) {
    counter.innerText = (count + increment).toFixed(target % 1 ? 1 : 0);
    setTimeout(() => animateCounter(counter), 25);
  } else {
    counter.innerText = target;
  }
};

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(c => animateCounter(c));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

$$('.plans, .metrics').forEach(section => counterObserver.observe(section));

// --- Testimonials Slider ---
const testimonials = $$('.testimonial');
const dotsContainer = $('.testimonial-dots');
let currentTestimonial = 0;

if (dotsContainer) {
  testimonials.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showTestimonial(i));
    dotsContainer.appendChild(dot);
  });
}

const dots = $$('.testimonial-dots span');

function showTestimonial(index) {
  testimonials.forEach((t, i) => t.classList.toggle('active', i === index));
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  currentTestimonial = index;
}

// Auto-slide with pause on hover
let sliderInterval = setInterval(nextTestimonial, 6000);
function nextTestimonial() {
  let next = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(next);
}

const testimonialSlider = $('.testimonial-slider');
if (testimonialSlider) {
  testimonialSlider.addEventListener('mouseenter', () => clearInterval(sliderInterval));
  testimonialSlider.addEventListener('mouseleave', () => sliderInterval = setInterval(nextTestimonial, 6000));
}
