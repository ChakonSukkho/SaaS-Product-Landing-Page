/* ============================================================
   TaskFlow — Landing Page JavaScript
   ============================================================ */

'use strict';

/* ---- Navbar Scroll Effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ---- Mobile Hamburger Menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Animate hamburger lines
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ---- Smooth Scroll for Navigation Links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Scroll Reveal Animation ---- */
const revealElements = document.querySelectorAll('.reveal, .reveal-float, .reveal-float-2');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
          .filter(el => !el.classList.contains('visible'));
        if (siblings.includes(entry.target)) {
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 80);
        } else {
          entry.target.classList.add('visible');
        }
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

/* ---- Pricing Toggle ---- */
const billingToggle = document.getElementById('billingToggle');
const monthlyLabel  = document.getElementById('monthlyLabel');
const annualLabel   = document.getElementById('annualLabel');
const priceAmounts  = document.querySelectorAll('.price-amount');

billingToggle.addEventListener('change', () => {
  const isAnnual = billingToggle.checked;

  // Toggle active label
  monthlyLabel.classList.toggle('active', !isAnnual);
  annualLabel.classList.toggle('active', isAnnual);

  // Animate price changes
  priceAmounts.forEach(el => {
    const monthly = parseInt(el.dataset.monthly, 10);
    const annual  = parseInt(el.dataset.annual,  10);
    const target  = isAnnual ? annual : monthly;

    // Flip animation
    el.style.transform = 'translateY(-10px)';
    el.style.opacity   = '0';

    setTimeout(() => {
      el.textContent = target === 0 ? '$0' : `$${target}`;
      el.style.transform = 'translateY(10px)';
      setTimeout(() => {
        el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        el.style.transform  = 'translateY(0)';
        el.style.opacity    = '1';
      }, 30);
    }, 180);
  });
});

/* ---- FAQ Accordion ---- */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn    = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach(fi => {
      fi.classList.remove('open');
      fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it wasn't already open)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ---- Button Ripple Effect ---- */
function createRipple(e) {
  const btn    = e.currentTarget;
  const ripple = document.createElement('span');
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  const x      = e.clientX - rect.left - size / 2;
  const y      = e.clientY - rect.top  - size / 2;

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px; height: ${size}px;
    left: ${x}px; top: ${y}px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    transform: scale(0);
    animation: ripple-anim 0.55s linear;
    pointer-events: none;
  `;

  // Ensure btn has relative positioning for ripple
  if (getComputedStyle(btn).position === 'static') {
    btn.style.position = 'relative';
  }
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);

  ripple.addEventListener('animationend', () => ripple.remove());
}

// Inject ripple keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-anim {
    to { transform: scale(4); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Apply ripple to all primary buttons
document.querySelectorAll('.btn-primary, .btn-white').forEach(btn => {
  btn.addEventListener('click', createRipple);
});

/* ---- Active Nav Link on Scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    link.style.fontWeight = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--blue)';
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ---- Counter Animation for Stats ---- */
function animateCounter(el, target, duration = 1500, prefix = '', suffix = '') {
  const start     = performance.now();
  const startVal  = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(startVal + (target - startVal) * eased);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Observe stats section
const statsEls = document.querySelectorAll('.stat strong');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el   = entry.target;
      const text = el.textContent.trim();
      if (text.includes('50K')) {
        animateCounter(el, 50, 1200, '', 'K+');
      } else if (text.includes('99.9')) {
        el.textContent = '99.9%';
      } else if (text.includes('4.9')) {
        el.textContent = '4.9★';
      }
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statsEls.forEach(el => statsObserver.observe(el));

/* ---- Progress Bar Animation in Benefits ---- */
const progressBars = document.querySelectorAll('.bcard-bar div');
const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const width = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        bar.style.width = width;
      }, 200);
      progressObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

progressBars.forEach(bar => progressObserver.observe(bar));

/* ---- Feature Card Hover Tilt ---- */
document.querySelectorAll('.feature-card, .testi-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -4;
    const rotateY = ((x - cx) / cx) *  4;
    card.style.transform     = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    card.style.transition    = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

/* ---- Dashboard Sidebar Navigation ---- */
const dashNavItems = document.querySelectorAll('.dash-nav-item');
const dashPages    = document.querySelectorAll('.dash-page');
const browserUrl   = document.getElementById('browserUrl');

dashNavItems.forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    const url  = item.dataset.url;

    // Update active sidebar item
    dashNavItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');

    // Show corresponding page
    dashPages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    // Update browser URL bar
    if (browserUrl) browserUrl.textContent = url;
  });
});

/* ---- Dashboard Floating Cards Bounce ---- */
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, i) => {
  card.style.animation = `float-bounce ${3 + i * 0.5}s ease-in-out infinite alternate`;
});

const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes float-bounce {
    from { transform: translateY(0px); }
    to   { transform: translateY(-8px); }
  }
`;
document.head.appendChild(floatStyle);

/* ---- Logo Carousel — seamless infinite scroll ---- */
(function () {
  const carousel  = document.getElementById('logosCarousel');
  const track1    = document.getElementById('logoTrack1');
  const track2    = document.getElementById('logoTrack2');
  if (!carousel || !track1 || !track2) return;

  // After fonts load, sync track2 width to exactly match track1
  function syncCarousel() {
    const w = track1.scrollWidth;
    // Set animation to move exactly one track width (= 50% of the doubled belt)
    carousel.style.setProperty('--track-width', w + 'px');
  }

  // Run after fonts are ready
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncCarousel);
  } else {
    window.addEventListener('load', syncCarousel);
  }

  // Pause on hover
  carousel.addEventListener('mouseenter', () => {
    carousel.style.animationPlayState = 'paused';
  });
  carousel.addEventListener('mouseleave', () => {
    carousel.style.animationPlayState = 'running';
  });
})();

/* ---- Init: Ensure first visible elements animate on load ---- */
window.addEventListener('load', () => {
  window.dispatchEvent(new Event('scroll'));
});