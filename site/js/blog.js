// Renders blog list + single-post view from content/blog.json
// URL pattern: blog.html (list) or blog.html?post=slug-here (single post)
document.addEventListener('DOMContentLoaded', function () {
  var listEl = document.getElementById('post-list');
  var detailEl = document.getElementById('post-detail');
  if (!listEl && !detailEl) return;

  fetch('content/blog.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var posts = (data.posts || []).slice().sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      var params = new URLSearchParams(window.location.search);
      var slug = params.get('post');

      if (slug && detailEl) {
        var post = posts.find(function (p) { return p.slug === slug; });
        if (listEl) listEl.style.display = 'none';
        if (post) {
          detailEl.style.display = 'block';
          detailEl.innerHTML =
            '<span class="eyebrow">' + escapeHtml(post.category || 'Guide') + '</span>' +
            '<h1 style="font-size:32px;">' + escapeHtml(post.title) + '</h1>' +
            '<p class="mono" style="color:var(--muted); font-size:13px; margin-bottom:24px;">' + formatDate(post.date) + '</p>' +
            (post.image ? '<img src="' + post.image + '" alt="" style="border-radius:14px; margin-bottom:28px; border:1px solid var(--line);">' : '') +
            '<div class="post-body-content">' + post.body + '</div>' +
            '<p style="margin-top:40px;"><a href="blog.html" class="btn btn-outline btn-sm">← Back to all posts</a></p>';
        } else {
          detailEl.style.display = 'block';
          detailEl.innerHTML = '<p>Post not found. <a href="blog.html">Back to all posts</a></p>';
        }
        return;
      }

      if (listEl) {
        if (detailEl) detailEl.style.display = 'none';
        listEl.innerHTML = posts.map(function (p) {
          return '<a href="blog.html?post=' + encodeURIComponent(p.slug) + '" class="post-card" style="text-decoration:none; color:inherit;">' +
            '<div class="thumb"' + (p.image ? ' style="background-image:url(\'' + p.image + '\'); background-size:cover; background-position:center;"' : '') + '></div>' +
            '<div class="body">' +
            '<div class="date">' + escapeHtml(p.category || 'Guide') + ' · ' + formatDate(p.date) + '</div>' +
            '<h3>' + escapeHtml(p.title) + '</h3>' +
            '<p>' + escapeHtml(p.excerpt || '') + '</p>' +
            '</div></a>';
        }).join('');
      }
    })
    .catch(function (err) { console.error('Could not load blog posts:', err); });
});

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
function formatDate(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
