fetch('pubs.yaml')
  .then(response => response.text())
  .then(yamlText => {
    const publications = jsyaml.load(yamlText);

    const publicationListContainer = document.getElementById('publication-list');

    publications.forEach(publication => {
      const publicationElement = document.createElement('div');
      var supervision = publication.issupervision ? `Role: <span class="badge badge-primary badge-pill">Advisor</span>` : ` `;
      var video = publication.presentation ? `<a class="btn btn-primary" href="${publication.presentation}" target="_blank"><span class="bi bi-camera-video"></span> Presentation</a>` : ` `;
      var link = publication.doi ? `href="${publication.doi}"` : `disabled`;
      var badges = ``
      if (publication.badges) {
        publication.badges.forEach(badge => {
          badges+=`<img style="width: 5em" src="${badge}" class="img-fluid rounded-start" alt="publication badge">`
        })
        badges+=`<br><br>`
      }
      publicationElement.innerHTML = `
      <li class="list-group-item bg-dark">
        <div class="card mb-3 bg-dark" style="max-width: 540px;">
        <div class="row g-0 align-items-center">
            <div class="col-sm-4">
            <img style="width: 100%;" src="${publication.image}" class="img-fluid rounded-start" alt="publication cover image">
            </div>
            <div class="col-md-8">
            <div class="card-body" itemscope itemtype="https://schema.org/ScholarlyArticle">
                <h5 class="card-title"> <b> <a itemprop="name" ${link}> ${publication.title} </a> </b></h5>
                <p class="card-text" >Authors: <span itemprop="author"> ${publication.author} </span></p>
                <p class="card-text"> <span itemprop="journalName"> ${publication.journal_title} </span></p>
                ${supervision}
                <p class="card-text">Pages: ${publication.firstpage}-${publication.lastpage}</p>
                <p class="card-text"><small class="text-muted">Date: <span itemprop="datePublished">${publication.publication_date}</span></small></p>
                <a itemprop="url" ${publication.doi}></a>
                <a itemprop="doi" ${publication.doi}></a>
                ${badges}
                <a class="btn btn-primary" href="${publication.pdf_url}" target="_blank"><span class="bi bi-file-pdf"></span>PDF</a>
                ${video}
            </div>
            </div>
        </div>
        </div>
      </li>
      `;

      publicationListContainer.appendChild(publicationElement);
    });
  });