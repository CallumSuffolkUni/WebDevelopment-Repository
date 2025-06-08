const root = document.querySelector('#root');

// Fetch Top 5 Shows
fetch('https://api.tvmaze.com/shows')
  .then(response => response.json())
  .then(shows => {
    const topShows = shows
      .filter(s => s.rating?.average)
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, 5);

    const showCardsHTML = topShows.map(show => {
      const imageUrl = show.image?.medium || 'images/no-img-landscape-text.png';
      const showName = show.name || 'Unknown Show';

      return `
        <a href="show.html?id=${show.id}" class="text-decoration-none text-dark">
          <div class="card mx-1" style="width: 200px;">
            <img src="${imageUrl}" class="card-img-top" alt="${showName}">
            <div class="card-body p-2">
              <h6 class="card-title mb-0">${showName}</h6>
            </div>
          </div>
        </a>
      `;
    }).join('');

    const showsSection = `
      <div class="container mx-auto">
        <h2 class="mb-3 mt-3 text-center ">Top Shows</h2>
        <div class="d-flex flex-wrap justify-content-center">
          ${showCardsHTML}
        </div>
        <a role="button" type="button" class="d-grid col-4 mx-auto mt-1 btn btn-outline-info" href="tv_shows.html">See More</a>
      </div>
    `;

    root.insertAdjacentHTML('beforeend', showsSection);
  });

// Fetch Top 5 People
fetch('https://api.tvmaze.com/people')
  .then(response => response.json())
  .then(people => {
    const topPeople = people.slice(0, 5); 

    const peopleCardsHTML = topPeople.map(person => {
      const imageUrl = person.image?.medium || 'images/no-img-portrait-text.png';
      const personName = person.name || 'Unknown Actor';

      return `
        <a href="actor.html?id=${person.id}" class="text-decoration-none text-dark">
          <div class="card mx-1" style="width: 200px;">
            <img src="${imageUrl}" class="card-img-top" alt="${personName}">
            <div class="card-body p-2">
              <h6 class="card-title mb-0">${personName}</h6>
            </div>
          </div>
        </a>
      `;
    }).join('');

    const peopleSection = `
      <div class="container mx-auto justify-content-center">
        <h2 class="mb-3 mt-3 text-center">Top Actors/Actresses</h2>
        <div class="d-flex flex-wrap justify-content-center">
          ${peopleCardsHTML}
        </div>
        <a role="button" type="button" class="d-grid col-4 mx-auto mt-1 btn btn-outline-info" href="people.html">See More</a>
      </div>
    `;

    root.insertAdjacentHTML('beforeend', peopleSection);
  })
  .catch(err => {
    root.innerHTML = `<div class="alert alert-danger">Error loading content: ${err}</div>`;
    console.error(err);
  });
