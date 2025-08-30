// ============================
// Navbar Scroll Effect
// ============================
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ============================
// Mobile Menu Toggle
// ============================
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuToggle.classList.toggle("open");
});

// Close mobile menu on link click
document.querySelectorAll("#nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("open");
  });
});

// ============================
// ScrollSpy (Active Link Highlight)
// ============================
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll("#nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (pageYOffset >= sectionTop) {
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

// ============================
// Counter Animation
// ============================
function animateCounter(element, target, duration) {
  let start = 0;
  const increment = target / (duration / 16); // ~60fps
  const counter = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(counter);
    }
    element.textContent = Math.floor(start);
  }, 16);
}

// Observe counters when visible
const counters = document.querySelectorAll(".counter");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute("data-target"));
      animateCounter(el, target, 2000);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.4 });

counters.forEach(counter => observer.observe(counter));
