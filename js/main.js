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
});

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const burger = document.querySelector('.nav__burger');
  const mobile = document.querySelector('.nav__mobile');
  if (!burger || !mobile) return;

  const iconOpen  = burger.querySelector('.icon-menu');
  const iconClose = burger.querySelector('.icon-close');

  burger.addEventListener('click', () => {
    const isOpen = mobile.classList.toggle('open');
    if (iconOpen && iconClose) {
      iconOpen.style.display  = isOpen ? 'none' : '';
      iconClose.style.display = isOpen ? '' : 'none';
    }
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Schliessen, wenn ein Link geklickt wird
  mobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobile.classList.remove('open');
      if (iconOpen && iconClose) {
        iconOpen.style.display = '';
        iconClose.style.display = 'none';
      }
    });
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

/* ---------- Skill-Bars Animation ---------- */
function animateSkills() {
  const fills = document.querySelectorAll('.skill__fill');
  if (!fills.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: direkt setzen
    fills.forEach(el => el.style.width = el.dataset.level + '%');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = el.dataset.level + '%';
        observer.unobserve(el);
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
