/* =====================================================
   Noah Zürcher — Webseite (main.js)
   - Mobile Hamburger Menu Toggle
   - Aktive Navigation markieren (pro Seite)
   - Skill-Bar Animation (mit IntersectionObserver)
   - Einfache Kontaktformular-Validation
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  setActiveNav();
  animateSkills();
  initContactForm();
  initVideoPlaceholder();
  initImageFallback();
});

/* ---------- Image Fallback (data-fallback) ---------- */
function initImageFallback() {
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      const fb = img.getAttribute('data-fallback');
      if (fb && img.src !== fb) img.src = fb;
    }, { once: true });
  });
}

/* ---------- Video Placeholder (About-Seite) ---------- */
function initVideoPlaceholder() {
  const v  = document.querySelector('.video-block video');
  const ph = document.getElementById('video-placeholder');
  if (!v || !ph) return;
  v.addEventListener('loadeddata', () => ph.classList.add('is-hidden'));
  v.addEventListener('play',       () => ph.classList.add('is-hidden'));
  v.addEventListener('error',      () => ph.classList.remove('is-hidden'));
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const burger = document.querySelector('.nav__burger');
  const mobile = document.querySelector('.nav__mobile');
  if (!burger || !mobile) return;

  const iconOpen  = burger.querySelector('.icon-menu');
  const iconClose = burger.querySelector('.icon-close');

  const setOpen = (open) => {
    mobile.classList.toggle('open', open);
    if (iconOpen)  iconOpen.classList.toggle('is-hidden',  open);
    if (iconClose) iconClose.classList.toggle('is-hidden', !open);
    burger.setAttribute('aria-expanded', open);
  };

  burger.addEventListener('click', () => {
    setOpen(!mobile.classList.contains('open'));
  });

  // Schliessen, wenn ein Link geklickt wird
  mobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });
}

/* ---------- Aktive Navigation ---------- */
function setActiveNav() {
  // Aktuelle Datei ermitteln (z.B. "about.html")
  const path = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.getAttribute('data-nav') === path) {
      link.classList.add('active');
    }
  });
}

/* ---------- Skill-Bars Animation ----------
   CSS setzt die finalen Breiten via [data-level] Selektoren.
   JS macht nur den "Wachsen"-Effekt: kurz auf 0 zwingen, dann
   beim Sichtbarwerden Klasse entfernen → CSS-transition läuft. */
function animateSkills() {
  const fills = document.querySelectorAll('.skill__fill');
  if (!fills.length) return;

  if (!('IntersectionObserver' in window)) return; // Fallback: CSS zeigt bereits final

  fills.forEach(el => el.classList.add('is-pre-animate'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pre-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
}

/* ---------- Kontaktformular ---------- */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !subject || !message) {
      alert('Bitte alle Felder ausfüllen.');
      return;
    }

    // Sehr einfache E-Mail Validation
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      alert('Bitte eine gültige E-Mail-Adresse eingeben.');
      return;
    }

    // Erfolg simulieren (kein Backend angeschlossen)
    alert(`Danke ${name}! Deine Nachricht wurde erfasst.\n\nBetreff: ${subject}`);
    form.reset();
  });
}
