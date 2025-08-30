/* ===========
   script.js - Clean & Functional Build
   ========== */

// Helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// Mobile Nav Toggle
const toggle = $('#menu-toggle');
const navLinks = $('#nav-links');
const overlay = document.createElement('div');
overlay.id = 'nav-overlay';
document.body.appendChild(overlay);

toggle?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay?.addEventListener('click', () => {
  navLinks.classList.remove('active');
  overlay.classList.remove('active');
});

// Navbar Scroll Styling
const navbar = $('#navbar');
const hero = $('#hero');

window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > (hero?.offsetHeight * 0.4 || 60)) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Scroll Reveal + ScrollSpy
const sections = $$('main section, header#hero');
const links = $$('#nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const id = e.target.id;
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));

// Particle Effect
const pl = $('.parallax-layer');
if (pl) {
  const count = 25;
  pl.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 3;
    p.style.width = p.style.height = `${size}px`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.left = `${Math.random() * 100}%`;
    p.dataset.speed = (0.2 + Math.random() * 0.8).toFixed(2);
    pl.appendChild(p);
  }

  window.addEventListener('mousemove', e => {
    const w = window.innerWidth, h = window.innerHeight;
    const cx = (e.clientX - w / 2) / (w / 2);
    const cy = (e.clientY - h / 2) / (h / 2);
    pl.querySelectorAll('.particle').forEach((pt, i) => {
      const speed = parseFloat(pt.dataset.speed);
      const tx = cx * 10 * speed;
      const ty = cy * 10 * speed;
      pt.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    pl.querySelectorAll('.particle').forEach(pt => {
      const speed = parseFloat(pt.dataset.speed);
      pt.style.transform = `translate(0, ${-sy * speed * 0.03}px)`;
    });
  });
}

// ROI Counters for Plans
const animateNumber = (el, target) => {
  const step = Math.max(1, Math.round(target / 200));
  let cur = 0;
  const tick = () => {
    cur += step;
    if (cur < target) {
      el.innerText = cur;
      requestAnimationFrame(tick);
    } else {
      el.innerText = target;
    }
  };
  tick();
};

const planObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter').forEach(cnt => {
        animateNumber(cnt, parseInt(cnt.dataset.target, 10));
      });
      planObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

$$('.plan').forEach(p => planObserver.observe(p));

// Metrics Counters
const metObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.metrics .counter').forEach(cnt => {
        const target = parseFloat(cnt.dataset.target);
        animateNumber(cnt, Math.round(target));
      });
      metObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

metObserver.observe($('.metrics'));

// Contact year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
