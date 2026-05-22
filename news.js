/* ── News timeline loader ────────────────────────────────── */
const NEWS_INITIAL = 3;

fetch('news.yaml')
  .then(r => r.text())
  .then(yamlText => {
    const newsList = jsyaml.load(yamlText);
    const container = document.getElementById('news-list');

    newsList.forEach((news, idx) => {
      const link = news.link
        ? `<a class="btn btn-primary" href="${news.link}" target="_blank" rel="noopener" style="margin-top:0.5rem">${news.linkname || 'Read more'}</a>`
        : '';
      const picture = news.picture
        ? `<img src="${news.picture}" alt="News image" loading="lazy" style="max-width:320px; border-radius:6px; border:1px solid var(--border); margin-top:0.6rem;">`
        : '';

      const row = document.createElement('div');
      row.className = 'news-row';
      if (idx >= NEWS_INITIAL) {
        row.classList.add('news-hidden');
        row.style.display = 'none';
      }
      row.innerHTML = `
        <div class="news-time">${news.date || ''}</div>
        <div class="news-connector">
          <div class="news-connector-dot"></div>
          <div class="news-connector-line"></div>
        </div>
        <div class="news-body-col">
          <div class="news-title">${news.title || ''}</div>
          <div class="news-text">${news.content || ''}</div>
          ${picture}
          ${link}
        </div>
      `;
      container.appendChild(row);
    });

    // Add "Show more" button if there are hidden items
    if (newsList.length > NEWS_INITIAL) {
      const remaining = newsList.length - NEWS_INITIAL;
      const btn = document.createElement('button');
      btn.id = 'news-toggle-btn';
      btn.className = 'btn';
      btn.style.cssText = 'margin-top:1rem; align-self:flex-start;';
      btn.textContent = `Show ${remaining} more news`;
      btn.addEventListener('click', () => {
        const hidden = container.querySelectorAll('.news-hidden');
        const isExpanded = btn.dataset.expanded === 'true';
        hidden.forEach(r => r.style.display = isExpanded ? 'none' : '');
        btn.dataset.expanded = isExpanded ? 'false' : 'true';
        btn.textContent = isExpanded
          ? `Show ${remaining} more news`
          : 'Show less';
      });
      container.after(btn);
    }
  });