/* ── Filter ─────────────────────────────────────────────── */
function filterPubList(filter) {
  const items = document.querySelectorAll('#publication-list li[data-category]');
  items.forEach(item => {
    const cat = item.dataset.category || '';
    item.style.display = (!filter || cat.includes(filter)) ? '' : 'none';
  });
}

/* ── Inject Google Scholar citation meta tags ────────────── */
function injectCitationMeta(pub) {
  const add = (name, content) => {
    if (!content) return;
    const m = document.createElement('meta');
    m.name = name;
    m.content = content;
    document.head.appendChild(m);
  };
  add('citation_title',            pub.title);
  add('citation_journal_title',    pub.journal_title);
  add('citation_publication_date', pub.publication_date);
  add('citation_firstpage',        pub.firstpage);
  add('citation_lastpage',         pub.lastpage);
  add('citation_pdf_url',          pub.pdf_url ? location.origin + '/' + pub.pdf_url.replace(/^\.\//, '') : null);
  if (pub.doi)    add('citation_doi', pub.doi.replace(/^https?:\/\/doi\.org\//, ''));
  if (pub.author) {
    pub.author.split(',').forEach(a => add('citation_author', a.trim()));
  }
}

/* ── Render ─────────────────────────────────────────────── */
fetch('pubs.yaml')
  .then(r => r.text())
  .then(yamlText => {
    const publications = jsyaml.load(yamlText);
    const list = document.getElementById('publication-list');

    publications.forEach(pub => {
      // Inject scholar meta tags
      injectCitationMeta(pub);

      // Awards
      let awards = '';
      if (pub.awards?.length) {
        awards = pub.awards.map(a =>
          `<span class="award-badge" itemprop="award">🏆 ${a}</span>`
        ).join('');
      }

      // Artifact badges
      let badges = '';
      if (pub.badges?.length) {
        badges = pub.badges.map(b =>
          `<img class="artifact-badge" src="${b}" alt="artifact badge">`
        ).join('');
      }

      // Buttons
      const pdfBtn   = pub.pdf_url ? `<a class="btn btn-primary" href="${pub.pdf_url}" target="_blank" rel="noopener">PDF</a>` : '';
      const videoBtn = pub.presentation ? `<a class="btn" href="${pub.presentation}" target="_blank" rel="noopener">▶ Presentation</a>` : '';
      const doiAttr  = pub.doi ? `href="${pub.doi}"` : '';

      // Cover image fallback
      const cover = pub.image
        ? `<img class="pub-cover" src="${pub.image}" alt="Cover of ${pub.title}" loading="lazy">`
        : `<div class="pub-cover" style="background:var(--surface-2)"></div>`;

      const li = document.createElement('li');
      li.dataset.category = pub.category || '';
      li.innerHTML = `
        <div class="pub-card" itemscope itemtype="https://schema.org/ScholarlyArticle">
          ${cover}
          <div class="pub-body">
            <div class="pub-title">
              <a itemprop="name" ${doiAttr} target="_blank" rel="noopener">${pub.title}</a>
            </div>
            <div class="pub-authors">
              <span itemprop="author">${pub.author || ''}</span>
            </div>
            <div class="pub-venue" itemprop="isPartOf">${pub.journal_title || ''}</div>
            <div class="pub-meta">
              <span itemprop="datePublished">${pub.publication_date || ''}</span>
              &nbsp;·&nbsp; pp.&nbsp;<span itemprop="pageStart">${pub.firstpage || ''}</span>–<span itemprop="pageEnd">${pub.lastpage || ''}</span>
            </div>
            <link itemprop="url"    href="${pub.doi || ''}">
            <link itemprop="sameAs" href="${pub.doi || ''}">
            <div class="pub-footer">
              ${awards}
              ${badges}
              ${pdfBtn}
              ${videoBtn}
            </div>
          </div>
        </div>
      `;
      list.appendChild(li);
    });
  });