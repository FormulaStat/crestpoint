/* ===========
   script.js — Clean, defensive, full-featured
   =========== */

/* Helpers */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

/* ------- Mobile nav + overlay ------- */
const menuToggle = $('#menu-toggle');
const navLinks = $('#nav-links');

// ensure overlay exists
let overlay = $('#nav-overlay');
if (!overlay) {
  overlay = document.createElement('div');
  overlay.id = 'nav-overlay';
  document.body.appendChild(overlay);
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const opened = navLinks.classList.toggle('active');
    overlay.classList.toggle('active', opened);
    menuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });

  // close when clicking a nav link (mobile UX)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // close when clicking overlay
  overlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  });
}

/* ------- Navbar scroll effect ------- */
const navbar = $('#navbar');
const hero = $('#hero');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  const threshold = hero ? hero.offsetHeight * 0.4 : 60;
  navbar.classList.toggle('scrolled', window.scrollY > threshold);
});

/* ------- Reveal on scroll + ScrollSpy ------- */
const sections = $$('main section, header#hero');
const navAnchors = $$('#nav-links a');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (id) {
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      }
    }
  });
}, { threshold: 0.2 });

sections.forEach(s => revealObserver.observe(s));

/* ------- Particles generator + light parallax ------- */
const parallaxLayer = document.querySelector('.parallax-layer');
if (parallaxLayer) {
  parallaxLayer.innerHTML = '';
  const createParticles = (count = 24) => {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.round(3 + Math.random() * 7);
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.left = `${Math.random() * 100}%`;
      p.dataset.speed = (0.2 + Math.random() * 0.8).toFixed(2);
      parallaxLayer.appendChild(p);
    }
  };
  createParticles(24);

  // mousemove parallax (light)
  window.addEventListener('mousemove', (e) => {
    const cx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const cy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    parallaxLayer.querySelectorAll('.particle').forEach((pt, i) => {
      const sp = parseFloat(pt.dataset.speed || 0.5);
      const tx = Math.round(cx * 8 * sp);
      const ty = Math.round(cy * 8 * sp);
      pt.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  });

  // scroll gentle offset
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    parallaxLayer.querySelectorAll('.particle').forEach(pt => {
      const sp = parseFloat(pt.dataset.speed || 0.4);
      pt.style.transform = `translate3d(0, ${-sy * sp * 0.03}px, 0)`;
    });
  });
}

/* ------- Testimonial slider (auto + dots) ------- */
(function testimonialSlider() {
  const slides = $$('.testimonial');
  const dotsWrap = $('.testimonial-dots');
  if (!slides.length || !dotsWrap) return;

  let idx = 0;
  slides.forEach((s, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => show(i));
    dotsWrap.appendChild(dot);
  });

  function show(i) {
    slides[idx].classList.remove('active');
    dotsWrap.children[idx].classList.remove('active');
    idx = i;
    slides[idx].classList.add('active');
    dotsWrap.children[idx].classList.add('active');
  }

  function next() { show((idx + 1) % slides.length); }

  let timer = setInterval(next, 6000);
  // pause on hover
  const wrap = document.querySelector('.testimonial-slider');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', () => timer = setInterval(next, 6000));
  }
})();

/* ------- Small utility: animate integer counters ------- */
function animateInt(el, target, opts = {}) {
  if (!el) return;
  target = Math.round(target || 0);
  const duration = opts.duration || 1600;
  const steps = Math.max(12, Math.round(duration / 16));
  const step = Math.max(1, Math.round(target / steps));
  let cur = 0;
  function tick() {
    cur += step;
    if (cur < target) {
      el.textContent = cur.toLocaleString();
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString();
    }
  }
  tick();
}

/* ------- Plan counters: animate when each plan enters view ------- */
const planCards = $$('.plan');
if (planCards.length) {
  const planObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.counter');
        counters.forEach(c => {
          const tgt = parseFloat(c.dataset.target || c.getAttribute('data-target') || 0);
          animateInt(c, tgt);
        });
        planObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  planCards.forEach(pc => planObserver.observe(pc));
}

/* ------- Metrics counters under "Our Track Record" ------- */
const metricsSection = $('.metrics');
if (metricsSection) {
  const metricsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = metricsSection.querySelectorAll('.counter');
        counters.forEach(c => {
          const tgt = parseFloat(c.dataset.target || 0);
          animateInt(c, tgt);
        });
        metricsObserver.unobserve(metricsSection);
      }
    });
  }, { threshold: 0.45 });
  metricsObserver.observe(metricsSection);
}

/* ------- Sparklines: small canvas charts (no libs) ------- */
function drawSparkline(canvasId, data, color = 'rgba(0,208,132,0.95)') {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !Array.isArray(data) || !data.length) return;
  const ctx = canvas.getContext('2d');
  // responsive size
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight;
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(...data);
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
}

// try to draw sample sparklines if canvases exist (replace with real data later)
setTimeout(() => {
  drawSparkline('spark1', [3,5,6,4,7,8,10,9,12], 'rgba(240,192,64,0.95)');
  drawSparkline('spark2', [100,200,300,500,700,850], 'rgba(0,208,132,0.95)');
  drawSparkline('spark3', [10,12,13,15,14,14.5], 'rgba(240,100,80,0.95)');
}, 300);

/* ------- Contact form: validation + toast (no alerts) ------- */
function showToast(message, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = message;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(()=>t.remove(),400); }, 3000);
}

const contactForm = $('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('input[name="name"]')?.value?.trim();
    const email = contactForm.querySelector('input[name="email"]')?.value?.trim();
    const message = contactForm.querySelector('textarea[name="message"]')?.value?.trim();
    if (!name || !email || !message) {
      showToast('Please complete all fields', 'error');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    // TODO: Replace this with real submit (fetch/XHR)
    contactForm.reset();
    showToast('Message sent — we will contact you shortly', 'success');
  });
}

/* ------- Set copyright year ------- */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
