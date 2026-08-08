// Renders case-study cards + detail sections from content/case-studies.json
document.addEventListener('DOMContentLoaded', function () {
  var gridEl = document.getElementById('case-study-grid');
  var detailsEl = document.getElementById('case-study-details');
  if (!gridEl && !detailsEl) return;

  fetch('content/case-studies.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var items = data.case_studies || [];

      if (gridEl) {
        gridEl.setAttribute('data-reveal-stagger', '');
        gridEl.innerHTML = items.map(function (c) {
          var tags = (c.tags || []).map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('');
          return '<a href="#' + escapeHtml(c.slug) + '" class="ticket" style="text-decoration:none;">' +
            '<div class="tag-row">' + tags + '</div>' +
            '<h3>' + escapeHtml(c.client) + '</h3>' +
            '<p>' + escapeHtml(c.summary || '') + '</p>' +
            '<span class="link">Read case file →</span></a>';
        }).join('');
        // re-trigger reveal observer for dynamically injected content
        if ('IntersectionObserver' in window) {
          var io2 = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) { entry.target.classList.add('in-view'); io2.unobserve(entry.target); }
            });
          }, { threshold: 0.1 });
          io2.observe(gridEl);
        } else {
          gridEl.classList.add('in-view');
        }
      }

      if (detailsEl) {
        detailsEl.innerHTML = items.map(function (c, i) {
          var alt = i % 2 === 1 ? 'alt' : '';
          var download = c.downloadUrl
            ? '<a href="#" data-gated-download="' + c.downloadUrl + '" data-title="' + escapeHtml(c.client) + ' Case Study" class="btn btn-outline btn-sm">Download full case study (PDF) →</a>'
            : '';
          var order;
          if (c.image) {
            var media = mediaBlock(c);
            order = i % 2 === 1
              ? '<div class="split">' + media + '<div>' + caseBody(c, download) + '</div></div>'
              : '<div class="split"><div>' + caseBody(c, download) + '</div>' + media + '</div>';
          } else {
            order = '<div style="max-width:640px;">' + caseBody(c, download) + '</div>';
          }
          return '<section class="' + alt + '" id="' + escapeHtml(c.slug) + '"><div class="wrap">' + order + galleryStrip(c) + '</div></section>';
        }).join('');
      }
    })
    .catch(function (err) { console.error('Could not load case studies:', err); });
});

function mediaBlock(c) {
  if (c.image) {
    return '<img src="' + c.image + '" alt="' + escapeHtml(c.client) + '" style="border-radius:14px; border:1px solid var(--line); width:100%; aspect-ratio:4/3; object-fit:cover;">';
  }
  return '<div class="media-placeholder">Add: ' + escapeHtml(c.client) + ' screenshot<br>(1200×900px)</div>';
}

function galleryStrip(c) {
  if (!c.gallery || !c.gallery.length) return '';
  var imgs = c.gallery.map(function (g) {
    return '<div style="flex:0 0 auto; width:220px;">' +
      '<img src="' + g.src + '" alt="" style="width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:10px; border:1px solid var(--line);">' +
      (g.label ? '<div class="mono" style="font-size:11.5px; color:var(--muted); margin-top:6px; text-align:center;">' + escapeHtml(g.label) + '</div>' : '') +
      '</div>';
  }).join('');
  return '<div style="margin-top:22px;">' +
    (c.galleryLabel ? '<p class="mono" style="font-size:12px; color:var(--red); text-transform:uppercase; letter-spacing:.04em; margin-bottom:10px;">' + escapeHtml(c.galleryLabel) + '</p>' : '') +
    '<div style="display:flex; gap:14px; overflow-x:auto; padding-bottom:6px;">' + imgs + '</div></div>';
}

function caseBody(c, downloadBtn) {
  return '<span class="result-pill">◆ Case file</span>' +
    '<h2 style="font-size:26px;">' + escapeHtml(c.client) + '</h2>' +
    '<p style="color:var(--muted);"><strong style="color:var(--ink);">Role:</strong> ' + escapeHtml(c.role || '') + '</p>' +
    '<p style="color:var(--muted);"><strong style="color:var(--ink);">Scope:</strong> ' + escapeHtml(c.scope || '') + '</p>' +
    (c.results ? '<p style="color:var(--muted);"><strong style="color:var(--ink);">Results:</strong> ' + escapeHtml(c.results) + '</p>' : '') +
    '<div style="margin-top:16px;">' + downloadBtn + '</div>';
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
