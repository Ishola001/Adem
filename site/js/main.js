// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  var iconHamburger = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4.5H16M2 9H16M2 13.5H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var iconClose = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2L14 14M14 2L2 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  var header = document.querySelector('.site-header');
  var savedScrollY = 0;

  function openMenu() {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    links.classList.add('open');
    if (header) header.classList.add('nav-fixed');
    toggle.innerHTML = iconClose;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + savedScrollY + 'px';
    document.body.style.width = '100%';
  }

  function closeMenu() {
    links.classList.remove('open');
    if (header) header.classList.remove('nav-fixed');
    toggle.innerHTML = iconHamburger;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollY);
  }

  if (toggle && links) {
    toggle.innerHTML = iconHamburger;
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (links.classList.contains('open')) closeMenu();
      });
    });
  }

  // Demo-form fallback notice (real Formspree endpoints just submit normally)
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';
      if (action.includes('YOUR_FORM_ENDPOINT')) {
        e.preventDefault();
        var note = form.querySelector('.form-status');
        if (note) {
          note.textContent = 'This form isn\'t connected to an endpoint yet — see the setup note in the README.';
          note.style.color = '#C0392B';
        }
      }
    });
  });

  // Calendly popup
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.calendly-trigger');
    if (!trigger) return;
    if (typeof Calendly === 'undefined') return;
    e.preventDefault();
    Calendly.initPopupWidget({ url: trigger.getAttribute('href') });
  });

  // ---------- Reveal on scroll ----------
  var revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // ---------- Animated proof counters ----------
  var counters = document.querySelectorAll('.hero-proof .num[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counted = false;
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          counters.forEach(animateCount);
          cio.disconnect();
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el.closest('.hero-proof')); });
  }
  function animateCount(el) {
    var target = el.getAttribute('data-count');
    var suffix = el.getAttribute('data-suffix') || '';
    var numeric = parseInt(target, 10);
    if (isNaN(numeric)) { el.textContent = target; return; }
    var start = 0;
    var duration = 1100;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * numeric) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = numeric + suffix;
    }
    requestAnimationFrame(step);
  }

  // ---------- Hero media rotator ----------
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dots span');
  var badge = document.querySelector('.hero-badge');
  if (slides.length > 1) {
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
      if (badge) {
        var num = slides[current].getAttribute('data-num');
        var label = slides[current].getAttribute('data-label');
        badge.style.opacity = 0;
        setTimeout(function () {
          badge.querySelector('.hero-badge-num').textContent = num;
          badge.querySelector('.hero-badge-label').textContent = label;
          badge.style.opacity = 1;
        }, 260);
      }
    }, 3800);
  }

  // ---------- Testimonials: click-and-drag swipe (mouse + touch) ----------
  document.querySelectorAll('.testi-track').forEach(function (track) {
    var isDown = false, startX, scrollLeft, moved;
    track.addEventListener('mousedown', function (e) {
      isDown = true; moved = false;
      track.classList.add('dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    ['mouseleave', 'mouseup'].forEach(function (evt) {
      track.addEventListener(evt, function () {
        isDown = false;
        track.classList.remove('dragging');
      });
    });
    track.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = x - startX;
      if (Math.abs(walk) > 5) moved = true;
      track.scrollLeft = scrollLeft - walk;
    });
    // Prevent accidental link/card click right after a drag
    track.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  });

  // ---------- FAQ plus/minus icon swap on native <details> ----------
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var summary = item.querySelector('summary');
    if (summary && !summary.querySelector('.faq-plus')) {
      var span = document.createElement('span');
      span.className = 'faq-plus';
      span.textContent = '+';
      summary.appendChild(span);
    }
  });
});
