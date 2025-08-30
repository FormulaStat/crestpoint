/* ===========
   SCRIPT.JS – CLEAN & FIXED
   =========== */

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// MOBILE NAV TOGGLE + OVERLAY
const toggle = $('#menu-toggle');
const nav = $('#nav-links');
const overlay = document.createElement('div');
overlay.id = 'nav-overlay';
document.body.appendChild(overlay);

toggle?.addEventListener('click', () => {
  nav.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  nav.classList.remove('active');
  overlay.classList.remove('active');
});

// SCROLL STYLING ON NAV
const navBar = $('#navbar');
const hero = $('#hero');
window.addEventListener('scroll', () => {
  if (!navBar) return;
  const threshold = hero ? hero.offsetHeight * 0.4 : 60;
  navBar.classList.toggle('scrolled', window.scrollY > threshold);
});

// SCROLL REVEAL + SCROLLSPY
const sections = $$('main section, header#hero');
const links = $$('#nav-links a');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const targetId = e.target.id;
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      links.forEach(a => 
        a.classList.toggle('active', a.getAttribute('href') === `#${targetId}`));
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => io.observe(s));

// PARTICLE GENERATION + PARALLAX EFFECT
const layer = $('.parallax-layer');
if (layer) {
  layer.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = Math.random() * 7 + 3;
    p.style.width = p.style.height = `${sz}px`;
    p.style.top = `${Math.random()*100}%`;
    p.style.left = `${Math.random()*100}%`;
    p.dataset.speed = (0.2 + Math.random()*0.8).toFixed(2);
    layer.append(p);
  }

  window.addEventListener('mousemove', e => {
    const cx = (e.clientX - window.innerWidth/2) / (window.innerWidth/2);
    const cy = (e.clientY - window.innerHeight/2) / (window.innerHeight/2);
    layer.querySelectorAll('.particle').forEach((pt, idx) => {
      const speed = parseFloat(pt.dataset.speed);
      pt.style.transform = `translate(${cx * 12 * speed}px, ${cy * 12 * speed}px)`;
    });
  });

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    layer.querySelectorAll('.particle').forEach(pt => {
      const sp = parseFloat(pt.dataset.speed);
      pt.style.transform = `translateY(${ -sy * sp * 0.03 }px)`;
    });
  });
}

// SMOOTH COUNTER FUNCTION
const animateNumber = (el, tgt) => {
  let cur = 0;
  const step = Math.max(1, Math.round(tgt / 200));
  const tick = () => {
    cur += step;
    if (cur < tgt) {
      el.innerText = cur;
      requestAnimationFrame(tick);
    } else {
      el.innerText = tgt;
    }
  };
  tick();
};

// PLAN COUNTERS
const planObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter').forEach(cnt => {
        animateNumber(cnt, parseFloat(cnt.dataset.target));
      });
      planObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
$$('.plan').forEach(p => planObs.observe(p));

// METRICS COUNTERS (UNDER “OUR TRACK RECORD”)
const metObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.metrics .counter').forEach(cnt => {
        animateNumber(cnt, parseFloat(cnt.dataset-target));
      });
      metObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
metObs.observe($('.metrics'));

// CURRENT YEAR SETTER
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
