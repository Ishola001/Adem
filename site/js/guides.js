document.addEventListener('DOMContentLoaded', function () {
  var gridEl = document.getElementById('guide-grid');
  if (!gridEl) return;

  fetch('content/guides.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var items = data.guides || [];
      gridEl.innerHTML = items.map(function (g) {
        var downloadBtn = g.fileUrl
          ? '<a href="#" data-gated-download="' + g.fileUrl + '" data-title="' + escapeHtml(g.title) + '" class="btn btn-primary btn-sm">Download free →</a>'
          : '<span class="form-note">Coming soon</span>';
        return '<div class="ticket">' +
          '<div class="icon mono">PDF</div>' +
          '<h3>' + escapeHtml(g.title) + '</h3>' +
          '<p>' + escapeHtml(g.description || '') + '</p>' +
          downloadBtn + '</div>';
      }).join('');
    })
    .catch(function (err) { console.error('Could not load guides:', err); });
});

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
