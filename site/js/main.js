// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  // Simple client-side confirmation for forms not yet wired to a backend.
  // Replace the <form action="..."> with your Formspree/Zapier endpoint,
  // then this just becomes a normal submit (remove the preventDefault block below).
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';
      if (action.includes('YOUR_FORM_ENDPOINT')) {
        e.preventDefault();
        var note = form.querySelector('.form-status');
        if (note) {
          note.textContent = 'This form isn\'t connected to an endpoint yet — see the setup note in the README.';
          note.style.color = '#FF5A36';
        }
      }
    });
  });

  // Calendly popup: any element with class="calendly-trigger" opens the
  // booking widget as an on-page overlay instead of navigating away. Uses
  // event delegation so it also works for buttons rendered by other scripts.
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.calendly-trigger');
    if (!trigger) return;
    if (typeof Calendly === 'undefined') return; // fall back to the normal link if the widget script hasn't loaded
    e.preventDefault();
    Calendly.initPopupWidget({ url: trigger.getAttribute('href') });
  });
});
