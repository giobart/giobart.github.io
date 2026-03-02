/* ═══════════════════════════════════════════════════════════
   blog.js  –  Loads blog/index.json and renders post cards.
   Clicking a card fetches the markdown file and renders it
   in the modal using marked.js.
   ═══════════════════════════════════════════════════════════ */

const blogGrid    = document.getElementById('blog-list');
const modalOverlay = document.getElementById('blogModalOverlay');
const modalContent = document.getElementById('blogModalContent');

/* ── Open a post ─────────────────────────────────────────── */
function openBlogPost(slug) {
  fetch(`blog/${slug}.md`)
    .then(r => {
      if (!r.ok) throw new Error('Post not found');
      return r.text();
    })
    .then(md => {
      modalContent.innerHTML = marked.parse(md);
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      modalOverlay.querySelector('.blog-modal').scrollTop = 0;
    })
    .catch(() => {
      modalContent.innerHTML = '<p>Sorry, this post could not be loaded.</p>';
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
}

/* ── Render post cards ───────────────────────────────────── */
function renderPosts(posts) {
  blogGrid.innerHTML = '';

  if (!posts || posts.length === 0) {
    blogGrid.innerHTML = '<p class="blog-empty">No posts yet. Check back soon!</p>';
    return;
  }

  posts.forEach(post => {
    const tags = (post.tags || [])
      .map(t => `<span class="blog-tag">${t}</span>`)
      .join(' ');

    const card = document.createElement('article');
    card.className = 'blog-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Read blog post: ${post.title}`);
    card.innerHTML = `
      <div class="blog-date">${post.date || ''}</div>
      <div class="blog-title">${post.title}</div>
      <div class="blog-excerpt">${post.excerpt || ''}</div>
      <div style="margin-top:auto; padding-top:0.5rem">${tags}</div>
    `;
    card.addEventListener('click', () => openBlogPost(post.slug));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openBlogPost(post.slug);
    });
    blogGrid.appendChild(card);
  });
}

/* ── Fetch index ─────────────────────────────────────────── */
fetch('blog/index.json')
  .then(r => r.ok ? r.json() : [])
  .then(posts => renderPosts(posts))
  .catch(() => {
    blogGrid.innerHTML = '<p class="blog-empty">No posts yet. Check back soon!</p>';
  });
