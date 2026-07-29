/* ══════════════════════════════════════════════════════
   ENTRE DEUX VERRES — script.js
   ══════════════════════════════════════════════════════ */

'use strict';

/* ── CURSOR ── */
(function initCursor() {
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursor || !cursorDot) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mx = -200, my = -200;
  let cx = -200, cy = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  function animateCursor() {
    cx += (mx - cx) * 0.14;
    cy += (my - cy) * 0.14;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
})();

/* ── HEADER SCROLL STATE ── */
(function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  let lastY = 0;

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    lastY = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE NAV ── */
(function initMobileNav() {
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('navMobile');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── SCROLL PROGRESS + SECTION INDICATOR ── */
(function initScrollProgress() {
  const bar   = document.getElementById('scrollBar');
  const label = document.getElementById('scrollLabel');
  if (!bar) return;

  const sections = document.querySelectorAll('[data-section]');

  function update() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = Math.min(progress, 100) + '%';

    // Find current section
    if (label) {
      let current = sections[0];
      sections.forEach(section => {
        const top = section.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.4) current = section;
      });
      if (current) label.textContent = current.dataset.section;
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── HERO IMG REVEAL ── */
document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('word-deux');
  const images  = document.getElementById('heroImages');
  if (!trigger || !images) return;

  trigger.addEventListener('click', () => {
    images.classList.toggle('revealed');
  });
});

/* ── CARTE TABS ── */
(function initCarte() {
  const tabs   = document.querySelectorAll('.carte-tab');
  const panels = document.querySelectorAll('.carte-panel');
  if (!tabs.length) return;

  // Set today's date
  const dateEl = document.getElementById('carteDate');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('fr-FR', {
      day:   'numeric',
      month: 'long',
      year:  'numeric'
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ── SCROLL REVEAL ── */
(function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.section-header, .philosophie-grid, .stat-card, .plat-item, ' +
    '.menu-card, .vin-region-card, .vin-item, .temoignage-row, ' +
    '.info-block, .reservation-layout, .vins-featured-list'
  );

  if (!elements.length) return;

  // Add reveal class
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ── SMOOTH ANCHOR SCROLL (offset for fixed nav) ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const offset   = document.querySelector('.site-header')?.offsetHeight || 80;
      const top      = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── RESERVATION FORM ── */
(function initForm() {
  const form    = document.getElementById('reservationForm');
  const message = document.getElementById('formMessage');
  if (!form || !message) return;

  // Set minimum date to today
  const dateInput = form.querySelector('#date');
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    message.className  = 'form-message';
    message.textContent = '';

    const nom      = form.querySelector('#nom')?.value.trim();
    const email    = form.querySelector('#email')?.value.trim();
    const date     = form.querySelector('#date')?.value;
    const couverts = form.querySelector('#couverts')?.value;
    const service  = form.querySelector('#service')?.value;

    // Basic validation
    if (!nom) {
      showMessage('Veuillez renseigner votre nom.', 'error');
      return;
    }
    if (!email || !isValidEmail(email)) {
      showMessage('Veuillez renseigner un email valide.', 'error');
      return;
    }
    if (!date) {
      showMessage('Veuillez choisir une date.', 'error');
      return;
    }

    // Simulate submission (in production, replace with fetch to your backend)
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.6';
    }

    setTimeout(() => {
      const dateFormatted = new Date(date + 'T12:00:00').toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const serviceLabel = service === 'midi' ? 'midi (12h–14h)' : 'soir (19h–22h)';

      showMessage(
        `✓ Réservation reçue pour ${couverts} couvert${couverts > 1 ? 's' : ''} le ${dateFormatted} au ${serviceLabel}. ` +
        `Un email de confirmation sera envoyé à ${email}.`,
        'success'
      );

      form.reset();
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '';
      }
    }, 1200);
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className   = 'form-message ' + type;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();

/* ── TICKER PAUSE ON HOVER ── */
(function initTicker() {
  const ticker = document.querySelector('.ticker-track');
  if (!ticker) return;
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
})();

/* ── ACTIVE NAV LINK HIGHLIGHT ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  function setActive() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active-nav', href === '#' + current);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();
