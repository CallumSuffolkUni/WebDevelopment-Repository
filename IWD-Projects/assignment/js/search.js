const searchForm = document.querySelector('#searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const query = document.querySelector('#searchInput').value.trim();
    if (!query) return;

    const [showsRes, peopleRes] = await Promise.all([
      fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`),
      fetch(`https://api.tvmaze.com/search/people?q=${encodeURIComponent(query)}`)
    ]);

    const shows = await showsRes.json();
    const people = await peopleRes.json();

    if (shows.length === 1 && people.length === 0) {
      window.location.href = `show.html?id=${shows[0].show.id}`;
    } else if (people.length === 1 && shows.length === 0) {
      window.location.href = `actor.html?id=${people[0].person.id}`;
    } else {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  });
}


// Only run this on search.html
if (window.location.pathname.includes("search.html")) {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  const showsContainer = document.getElementById('showsContainer');
  const peopleContainer = document.getElementById('peopleContainer');

  if (query) {
    fetchResults(query);
  }

  async function fetchResults(query) {
    try {
      const [showsRes, peopleRes] = await Promise.all([
        fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`),
        fetch(`https://api.tvmaze.com/search/people?q=${encodeURIComponent(query)}`)
      ]);

      const shows = await showsRes.json();
      const people = await peopleRes.json();

      // Show cards
      if (shows.length > 0) {
        shows.forEach(item => {
          const show = item.show;
          const imageUrl = show.image?.medium || 'images/no-img-landscape-text.png';
          const card = `
            <a href="show.html?id=${show.id}" class="text-decoration-none text-dark">
              <div class="card mx-2 mb-3" style="width: 200px;">
                <img src="${imageUrl}" class="card-img-top" alt="${show.name}">
                <div class="card-body p-2">
                  <h6 class="card-title mb-0">${show.name}</h6>
                </div>
              </div>
            </a>
          `;
          showsContainer.insertAdjacentHTML('beforeend', card);
        });
      } else {
        showsContainer.innerHTML = '<p class="text-muted">No shows found.</p>';
      }

      // People cards
      if (people.length > 0) {
        people.forEach(item => {
          const person = item.person;
          const imageUrl = person.image?.medium || 'images/no-img-portrait-text.png';
          const card = `
            <a href="actor.html?id=${person.id}" class="text-decoration-none text-dark">
              <div class="card mx-2 mb-3" style="width: 200px;">
                <img src="${imageUrl}" class="card-img-top" alt="${person.name}">
                <div class="card-body p-2">
                  <h6 class="card-title mb-0">${person.name}</h6>
                </div>
              </div>
            </a>
          `;
          peopleContainer.insertAdjacentHTML('beforeend', card);
        });
      } else {
        peopleContainer.innerHTML = '<p class="text-muted">No people found.</p>';
      }

    } catch (err) {
      console.error('Search error:', err);
      document.getElementById('searchResults').innerHTML = `
        <div class="alert alert-danger">Oops! Something went wrong. Please try again later.</div>
      `;
    }
  }
}
