fetch('pubs.yaml')
  .then(response => response.text())
  .then(yamlText => {
    const publications = jsyaml.load(yamlText);

    const publicationListContainer = document.getElementById('publication-list');

    publications.forEach(publication => {
      const publicationElement = document.createElement('div');
      var supervision = publication.issupervision ? `Role: <span class="badge badge-primary badge-pill">Advisor</span>` : ` `;
      publicationElement.innerHTML = `
      <li class="list-group-item bg-dark">
        <div class="card mb-3 bg-dark" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-sm-4">
            <img style="width: 100%;" src="${publication.image}" class="img-fluid rounded-start" alt="publication cover image">
            </div>
            <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">  ${publication.title} </h5>
                <p class="card-text">Authors: ${publication.author}</p>
                <p class="card-text">${publication.journal_title}</p>
                ${supervision}
                <p class="card-text">Pages: ${publication.firstpage}-${publication.lastpage}</p>
                <p class="card-text"><small class="text-muted">Date: ${publication.publication_date}</small></p>
                <a class="btn btn-primary" href="${publication.pdf_url}" target="_blank"><span class="bi bi-file-pdf"></span>PDF</a>
            </div>
            </div>
        </div>
        </div>
      </li>
      `;

      publicationListContainer.appendChild(publicationElement);
    });
  });