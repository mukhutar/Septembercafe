(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- language toggle (EN / AR) ---------- */
  var LANG_KEY = 'sepcafe_lang';
  function getStoredLang() {
    try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; }
  }
  function storeLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* storage unavailable, ignore */ }
  }
  function applyLang(lang) {
    var html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var attr = lang === 'ar' ? 'data-ar' : 'data-en';
      var text = el.getAttribute(attr) || el.getAttribute('data-en');
      el.textContent = text;
    });
    var toggleBtn = document.getElementById('langToggle');
    if (toggleBtn) {
      toggleBtn.textContent = lang === 'ar' ? 'English' : 'عربي';
    }
    storeLang(lang);
  }
  var initialLang = getStoredLang() || ((navigator.language || '').toLowerCase().indexOf('ar') === 0 ? 'ar' : 'en');
  applyLang(initialLang);
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var current = document.documentElement.lang === 'ar' ? 'ar' : 'en';
      applyLang(current === 'ar' ? 'en' : 'ar');
    });
  }

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- hero coffee beans (decorative, safe: no user input) ---------- */
  var stage = document.getElementById('beanStage');
  if (stage && !reduceMotion) {
    var count = window.innerWidth < 640 ? 5 : 9;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var b = document.createElement('div');
      b.className = 'bean';
      var w = 22 + Math.random() * 26;
      b.style.setProperty('--w', w + 'px');
      b.style.setProperty('--x', Math.random() * 100 + '%');
      b.style.setProperty('--y', Math.random() * 100 + '%');
      b.style.setProperty('--dur', (9 + Math.random() * 10) + 's');
      b.style.setProperty('--delay', (Math.random() * -14) + 's');
      b.style.setProperty('--dx', (Math.random() * 70 - 35) + 'px');
      b.style.setProperty('--dy', (Math.random() * 50 - 25) + 'px');
      b.style.setProperty('--dz', (Math.random() * 120 - 30) + 'px');
      b.style.setProperty('--ry', (Math.random() * 40 - 20) + 'deg');
      b.style.setProperty('--rz', (Math.random() * 50 - 25) + 'deg');
      var lobe = document.createElement('div');
      lobe.className = 'lobe';
      var crease = document.createElement('div');
      crease.className = 'crease';
      b.appendChild(lobe);
      b.appendChild(crease);
      frag.appendChild(b);
    }
    stage.appendChild(frag);
  }

  /* ---------- highlight today in hours table ---------- */
  var hoursRows = document.querySelectorAll('[data-day]');
  if (hoursRows.length) {
    var dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var today = dayNames[new Date().getDay()];
    hoursRows.forEach(function (row) {
      if (row.getAttribute('data-day') === today) {
        row.classList.add('today');
      }
    });
  }

  /* ---------- lightweight tilt for teaser cards ---------- */
  var isTouch = window.matchMedia('(hover: none)').matches;
  if (!reduceMotion && !isTouch) {
    document.querySelectorAll('.teaser-card, .badge').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotateY(' + (px * 8) + 'deg) rotateX(' + (-py * 8) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---------- reveal-on-scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
