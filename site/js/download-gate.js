// Gated download modal: any element with [data-gated-download] opens a form;
// on submit, the file at data-gated-download starts downloading automatically.
document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('download-gate-modal');
  if (!modal) return;

  var form = modal.querySelector('form');
  var titleEl = modal.querySelector('.dg-title');
  var closeBtn = modal.querySelector('.dg-close');
  var fileInput = modal.querySelector('input[name="file_url"]');
  var statusEl = modal.querySelector('.dg-status');
  var pendingLink = null;

  function openModal(link) {
    pendingLink = link;
    var name = link.getAttribute('data-title') || 'this download';
    titleEl.textContent = 'Get "' + name + '"';
    fileInput.value = link.getAttribute('data-gated-download');
    statusEl.textContent = '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-gated-download]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(link);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  form.addEventListener('submit', function (e) {
    var action = form.getAttribute('action') || '';
    var fileUrl = fileInput.value;

    if (action.includes('YOUR_FORM_ENDPOINT')) {
      // No lead-capture endpoint connected yet — see README. Still let the
      // download proceed so testing the flow doesn't require it first.
      e.preventDefault();
      statusEl.textContent = 'Starting your download…';
      statusEl.style.color = 'var(--teal)';
      triggerDownload(fileUrl);
      setTimeout(closeModal, 900);
      return;
    }

    // Real endpoint connected: let the form submit in the background,
    // then trigger the download immediately without waiting on a redirect.
    e.preventDefault();
    fetch(action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .catch(function () { /* fail open — still deliver the download */ })
      .finally(function () {
        statusEl.textContent = 'Starting your download…';
        statusEl.style.color = 'var(--teal)';
        triggerDownload(fileUrl);
        setTimeout(closeModal, 900);
      });
  });

  function triggerDownload(url) {
    if (!url) return;
    var a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
});
