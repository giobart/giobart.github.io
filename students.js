/* ── Filter ─────────────────────────────────────────────── */
function filterStudentList(filter) {
  const items = document.querySelectorAll('#student-list li[data-category]');
  items.forEach(item => {
    const cat = item.dataset.category || '';
    item.style.display = (!filter || cat.includes(filter)) ? '' : 'none';
  });
}

/* ── Render ─────────────────────────────────────────────── */
fetch('students.yaml')
  .then(r => r.text())
  .then(yamlText => {
    const entries = jsyaml.load(yamlText);
    const list = document.getElementById('student-list');

    entries.forEach(entry => {
      // Buttons
      const pdfBtn   = entry.pdf_url ? `<a class="btn btn-primary" href="${entry.pdf_url}" target="_blank" rel="noopener">PDF</a>` : '';
      const videoBtn = entry.presentation ? `<a class="btn" href="${entry.presentation}" target="_blank" rel="noopener">▶ Presentation</a>` : '';
      const doiAttr  = entry.doi ? `href="${entry.doi}"` : '';

      // Cover image
      const cover = entry.image
        ? `<img class="pub-cover" src="${entry.image}" alt="Cover of ${entry.title}" loading="lazy">`
        : `<div class="pub-cover" style="background:var(--surface-2)"></div>`;

      const li = document.createElement('li');
      li.dataset.category = entry.category || '';
      li.innerHTML = `
        <div class="pub-card" itemscope itemtype="https://schema.org/ScholarlyArticle">
          ${cover}
          <div class="pub-body">
            <div class="pub-title">
              <a itemprop="name" ${doiAttr} target="_blank" rel="noopener">${entry.title}</a>
            </div>
            <div class="pub-authors">
              Student: <span itemprop="author">${entry.author || ''}</span>
            </div>
            <div class="pub-venue" itemprop="isPartOf">${entry.journal_title || ''}</div>
            <div class="pub-meta">
              <span itemprop="datePublished">${entry.publication_date || ''}</span>
              &nbsp;·&nbsp; pp.&nbsp;<span itemprop="pageStart">${entry.firstpage || ''}</span>–<span itemprop="pageEnd">${entry.lastpage || ''}</span>
            </div>
            <div class="pub-footer">
              ${pdfBtn}
              ${videoBtn}
            </div>
          </div>
        </div>
      `;
      list.appendChild(li);
    });
  });
