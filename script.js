/* ===========
   script.js
   =========== */

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ---------- mobile nav toggle ---------- */
const menuToggle = $('#menu-toggle');
const navLinksContainer = $('#nav-links');

if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener('click', () => {
    const opened = navLinksContainer.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });

  // close when clicking any internal link (good UX)
  $$('#nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ---------- particles generator (unchanged) ---------- */
const parallaxLayer = document.querySelector('.parallax-layer');
function createParticles(count = 22) {
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
createParticles(24);

/* subtle parallax on mousemove & scroll */
(function particlesParallax() {
  if (!parallaxLayer) return;
  const particles = () => Array.from(parallaxLayer.children);
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

/* ---------- navbar scrolled effect ---------- */
const navbar = document.getElementById('navbar');
const hero = document.getElementById('hero');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > (hero ? (hero.offsetHeight * 0.4) : 60)) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ---------- main IntersectionObserver: reveal + scrollspy ---------- */
const sections = $$('main section, header#hero');
const navLinks = $$('#nav-links a');

const ioOptions = { threshold: 0.18 };
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');

    // reveal animation
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }

    // scrollspy - set active nav link for the visible section
    if (entry.isIntersecting && id) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, ioOptions);

sections.forEach(s => io.observe(s));

/* ---------- ROI Counter Animation (fixed & robust) ---------- */
/*
  - Each .plan is observed individually.
  - Each .counter has data-target (number). Example: data-target="1.8" or data-target="10"
  - The animation stores an internal data-current so rounding doesn't block progress.
*/
function animateCounterElement(counter) {
  const target = parseFloat(counter.dataset.target);
  if (isNaN(target)) return;

  // determine decimals to show: if target has fractional part show 1 decimal, else 0
  const decimals = (target % 1 !== 0) ? 1 : 0;

  let current = parseFloat(counter.dataset.current) || 0;
  // base increment calculated from target, and ensure a minimum increment for tiny targets
  const baseIncrement = Math.max(target / 110, 0.01); // tweak denominator for speed
  current += baseIncrement;

  // store new current
  counter.dataset.current = current;

  // display (rounded according to decimals)
  counter.innerText = decimals ? current.toFixed(decimals) : Math.round(current).toString();

  if (current < target) {
    // continue on next animation frame for smoothness
    requestAnimationFrame(() => animateCounterElement(counter));
  } else {
    // finish exactly at target
    counter.innerText = decimals ? target.toFixed(decimals) : String(Math.round(target));
    counter.dataset.current = target;
    counter.dataset.animated = 'true';
  }
}

/* Observe each .plan and animate counters inside when the card enters view */
const planObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.counter');
      counters.forEach(counter => {
        if (!counter.dataset.animated) {
          // ensure starting text is 0
          counter.innerText = '0';
          counter.dataset.current = 0;
          animateCounterElement(counter);
        }
      });
      planObserver.unobserve(entry.target); // animate only once per plan
    }
  });
}, { threshold: 0.45 });

// attach observer to each plan card
$$('.plan').forEach(plan => planObserver.observe(plan));

/* ---------- contact form simple UX ---------- */
const form = document.getElementById('contact-form');
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
    alert('Thanks — your message was sent. We will contact you shortly.');
    form.reset();
  });
}

/* ---------- set current year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Testimonial Slider ---------- */
const testimonials = document.querySelectorAll('.testimonial');
const dotsContainer = document.querySelector('.testimonial-dots');
let currentTestimonial = 0;

// create dots
if (dotsContainer && testimonials.length > 0) {
  testimonials.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showTestimonial(i));
    dotsContainer.appendChild(dot);
  });
}

function showTestimonial(index) {
  testimonials[currentTestimonial].classList.remove('active');
  dotsContainer.children[currentTestimonial].classList.remove('active');
  currentTestimonial = index;
  testimonials[currentTestimonial].classList.add('active');
  dotsContainer.children[currentTestimonial].classList.add('active');
}

function nextTestimonial() {
  let nextIndex = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(nextIndex);
}

// autoplay every 6s
setInterval(nextTestimonial, 6000);


/* ---------- Metrics Sparklines ---------- */
function drawSparkline(canvasId, data, color="#00d084") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight;
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((val, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (val / Math.max(...data)) * h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();
}

// sample sparkline data
drawSparkline('spark1', [3, 5, 6, 4, 7, 8, 10, 9, 12]);
drawSparkline('spark2', [100, 200, 300, 500, 700, 850]);
drawSparkline('spark3', [10, 12, 13, 15, 14, 14.5]);


/* ---------- Metrics Counters ---------- */
function animateCounter(counterElement) {
  const target = parseFloat(counterElement.getAttribute('data-target'));
  const duration = 2500; // 2.5s animation
  const stepTime = 20;   // update every 20ms
  let current = 0;

  const increment = target / (duration / stepTime);

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      counterElement.innerText = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
      requestAnimationFrame(updateCounter);
    } else {
      counterElement.innerText = target; // final number
    }
  };

  updateCounter();
}

// Run counters when metrics section is visible
const metricCounters = document.querySelectorAll('.metrics .counter');
const metricsSection = document.getElementById('metrics');

if (metricsSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        metricCounters.forEach(counter => animateCounter(counter));
        observer.disconnect(); // run once
      }
    });
  }, { threshold: 0.4 });

  observer.observe(metricsSection);
}


/* ---------- Contact Form with Toast ---------- */
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Basic real-time validation
    const name = contactForm.querySelector("input[name='name']");
    const email = contactForm.querySelector("input[name='email']");
    const message = contactForm.querySelector("textarea[name='message']");

    if (!name.value || !email.value || !message.value) {
      showToast("Please fill all fields", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email.value)) {
      showToast("Enter a valid email", "error");
      return;
    }

    // Simulate successful submission
    contactForm.reset();
    showToast("Message sent successfully!", "success");
  });
}

/* ---------- Toast Function ---------- */
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// =============================
// Mobile Nav Toggle with Overlay
// =============================
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Create overlay dynamically
const overlay = document.createElement("div");
overlay.id = "nav-overlay";
document.body.appendChild(overlay);

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  overlay.classList.toggle("active");
});

// Close menu when clicking outside (overlay)
overlay.addEventListener("click", () => {
  navLinks.classList.remove("active");
  overlay.classList.remove("active");
});

// =============================
// Parallax Particles
// =============================
const parallaxLayer = document.querySelector(".parallax-layer");

function createParticles(count) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    particle.style.top = Math.random() * 100 + "%";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = 5 + Math.random() * 10 + "s";
    particle.style.animationDelay = Math.random() * 5 + "s";

    parallaxLayer.appendChild(particle);
  }
}

createParticles(25); // number of particles

// =============================
// Navbar Scroll Effect
// =============================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// =============================
// ScrollSpy Active Link
// =============================
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links li a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// =============================
// Counter Animation Utility
// =============================
function animateCounter(id, target, duration = 2000) {
  const el = document.getElementById(id);
  if (!el) return;

  let start = 0;
  const increment = target / (duration / 16);

  function updateCounter() {
    start += increment;
    if (start < target) {
      el.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      el.textContent = target;
    }
  }
  updateCounter();
}
