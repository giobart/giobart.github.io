function filterPubList(filter) {
  // Declare variables
  var ul, li, i, txtValue;
  ul = document.getElementById("publication-list");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the filter
  for (i = 0; i < li.length; i++) {
    category = li[i].getElementsByTagName("div")[0];
    txtValue = category.textContent || category.innerText;
    if (txtValue.includes(filter)) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

fetch('pubs.yaml')
  .then(response => response.text())
  .then(yamlText => {
    const publications = jsyaml.load(yamlText);

    const publicationListContainer = document.getElementById('publication-list');

    publications.forEach(publication => {
      const publicationElement = document.createElement('div');

      // Check the publication awards
      var awards = ''
      if (publication.awards && publication.awards.length > 0) {
        for (var i = 0; i < publication.awards.length; i++) {
          awards += `<span class="badge badge-primary badge-pill" itemprop="award" style="background-color: yellow; color: black"> 🏆 ${publication.awards[i]} </span>`;
        }
      }

      // Check presentation video available
      var video = publication.presentation ? `<a class="btn btn-primary" href="${publication.presentation}" target="_blank"><span class="bi bi-camera-video"></span> Presentation</a>` : ` `;
      
      // Check ig DOI available
      var link = publication.doi ? `href="${publication.doi}"` : `disabled`;
      
      // Add badges
      var badges = ``
      if (publication.badges) {
        publication.badges.forEach(badge => {
          badges+=`<img style="width: 5em" src="${badge}" class="img-fluid rounded-start" alt="publication badge">`
        })
        badges+=`<br><br>`
      }
      publicationElement.innerHTML = `
      <li class="list-group-item bg-dark">
        <div style="display: none">${publication.category}</div>
        <div class="card mb-3 bg-dark" style="max-width: 900px;">
        <div class="row g-0 align-items-center">
            <div class="col-sm-4">
            <img style="width: 100%;" src="${publication.image}" class="img-fluid rounded-start" alt="publication cover image">
            </div>
            <div class="col-md-8">
            <div class="card-body" itemscope itemtype="https://schema.org/ScholarlyArticle">
                <h5 class="card-title"> <b> <a itemprop="name" ${link}> ${publication.title} </a> </b></h5>
                <p class="card-text" >Authors: <span itemprop="author"> ${publication.author} </span></p>
                <p class="card-text"> <span itemprop="journalName"> ${publication.journal_title} </span></p>
                ${awards}
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