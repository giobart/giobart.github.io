fetch('news.yaml')
  .then(response => response.text())
  .then(yamlText => {
    const newsList = jsyaml.load(yamlText);

    const newsContainer = document.getElementById('news-list');

    var divider = ""

    newsList.forEach(news => {
      const newsElement = document.createElement('div');
      var picture = news.picture ? `<img style="height: 10em;" src="${news.picture}" class="rounded float-right" alt="news cover image">` : ``;
      var link = news.link ? ` <a class="badge badge-primary badge-pill" href="${news.link}">${news.linkname}</a>` : ``;

      newsElement.innerHTML = `
        ${divider}
        <div class="card mb-3 bg-dark" style="max-width: 700px;">
            <div class="d-flex w-100 justify-content-between">
              <h4 class="mb-1">${news.title}${link}</h4>
              <small class="text-muted">${news.date}</small>
            </div>
            <div class="d-flex w-100 justify-content-start">
              <p><br>${news.content}</p>
              ${picture}
            </div>
        </div>
      `;

      if (divider == "") {
        divider = `<p class="text-center">---</p>`
      }

      newsContainer.appendChild(newsElement);
    });
  });