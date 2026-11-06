/* =============================================================
   AEGISFORT SECURITY — Interactions
   -------------------------------------------------------------
   1. Sticky header + back-to-top
   2. Mobile navigation
   3. Dropdowns (click / keyboard / touch)
   4. Smooth scrolling + active nav link
   5. Scroll reveal
   6. Animated statistics counters
   7. Image fallback
   8. Footer year
   ============================================================= */
(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  const toTop = document.getElementById('toTop');
  const body = document.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery = window.matchMedia('(max-width: 1080px)');

  /* 1. STICKY HEADER + BACK-TO-TOP ---------------------------- */
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    toTop.classList.toggle('is-visible', y > window.innerHeight * 0.9);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* 2. MOBILE NAVIGATION -------------------------------------- */
  function setMenu(open) {
    body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open) closeAllDropdowns();
  }
  navToggle.addEventListener('click', () => setMenu(!body.classList.contains('nav-open')));

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (body.classList.contains('nav-open')) { setMenu(false); navToggle.focus(); }
    closeAllDropdowns();
  });

  // Reset menu state when resizing up to desktop
  mobileQuery.addEventListener('change', (e) => { if (!e.matches) setMenu(false); });

  /* 3. DROPDOWNS ---------------------------------------------- */
  const dropdowns = document.querySelectorAll('.has-dropdown');

  function closeAllDropdowns(except) {
    dropdowns.forEach((dd) => {
      if (dd === except) return;
      dd.classList.remove('is-open');
      dd.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach((dd) => {
    const btn = dd.querySelector('.dropdown-toggle');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !dd.classList.contains('is-open');
      closeAllDropdowns(dd);
      dd.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    // Keep hover state in sync with aria for screen readers on desktop
    dd.addEventListener('mouseleave', () => {
      if (!mobileQuery.matches) {
        dd.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Click outside closes desktop dropdowns
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) closeAllDropdowns();
  });

  /* 4. SMOOTH SCROLLING + ACTIVE LINK ------------------------- */
  // CSS scroll-behavior + scroll-padding handle the offset; here we
  // close the mobile menu and keep focus management sensible.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return; // plain "#" placeholder links
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  // Highlight the nav link of the section currently in view
  const navLinks = document.querySelectorAll('.nav-list a.nav-link');
  const linkMap = new Map();
  navLinks.forEach((a) => linkMap.set(a.getAttribute('href').slice(1), a));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const link = linkMap.get(entry.target.id);
      if (!link) return;
      navLinks.forEach((a) => a.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  linkMap.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });

  /* 5. SCROLL REVEAL ------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* 6. ANIMATED COUNTERS -------------------------------------- */
  // Values come from data-target / data-suffix in the HTML.
  const formatter = new Intl.NumberFormat('en-US');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    if (prefersReducedMotion) { el.textContent = formatter.format(target) + suffix; return; }

    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      el.textContent = formatter.format(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('.stat-num[data-target]');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => counterObserver.observe(c));

  /* 7. IMAGE FALLBACK ----------------------------------------- */
  // If a photo fails to load, show a branded gradient panel instead
  // of a broken-image icon.
  document.querySelectorAll('.media img').forEach((img) => {
    const markFailed = () => img.closest('.media').classList.add('is-fallback');
    if (img.complete && img.naturalWidth === 0) markFailed();
    else img.addEventListener('error', markFailed, { once: true });
  });

  /* 8. FOOTER YEAR -------------------------------------------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
