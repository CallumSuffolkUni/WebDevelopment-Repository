const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const url = "https://api.tvmaze.com/shows/" + id;
const episodesUrl = "https://api.tvmaze.com/shows/" + id + "/episodes";
const resultList = document.querySelector('#results');
const breadcrumbElement = document.getElementById('showNameBreadcrumb');

fetch(url)
.then((response) => response.json())
.then((data) => {
  const showName = data.name || "Unknown";
  const genres = data.genres.join(', ') || "Unknown";
  const premiered = data.premiered || "Unknown";
  const ended = data.ended || "Still Running";
  const rating = data.rating?.average || "Unknown";
  const imageUrl = data.image?.medium || "images/no-img-portrait-text.png";
  const summary = data.summary || "No summary available.";
  const language = data.language || "Unknown";
  const network = data.network?.name || "Unknown";
  const schedule = `${data.schedule?.days?.join(', ') || "Unknown"} at ${data.schedule?.time || "Unknown"}`;

  breadcrumbElement.textContent = showName;

  const articleElement = `
  <div class="container mt-2">
    <!-- Tabs Below the Card -->
      <ul class="nav nav-tabs mb-3 tab-nav" id="infoTabs">
        <li class="nav-item">
          <a class="nav-link active" data-tab="tab-episodes" href="#">Episodes</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-tab="tab-cast" href="#">Cast</a>
        </li>
      </ul>
  </div>

  <div class="container mt-3">
    <!-- Always Visible Show Info Card -->
    <div class="card d-flex flex-column flex-lg-row align-items-center p-4 mb-4">
      <div class="p-3">
        <img src="${imageUrl}" class="rounded-start" alt="${showName}" style="width: 300px; height: auto;">
      </div>
      <div class="p-4" style="font-size: 1.25rem;">
        <div class="card-body">
          <h5 class="card-title display-2 fw-bolder">${showName}</h5>
          <p class="card-text">
            <strong>Genres:</strong> ${genres}<br>
            <strong>Language:</strong> ${language}<br>
            <strong>Premiered:</strong> ${premiered}<br>
            <strong>Ended:</strong> ${ended}<br>
            <strong>Network:</strong> ${network}<br>
          </p>
          <p class="card-text">${summary}</p>
          <small class="position-absolute top-0 end-0 m-2 text-body-secondary">
            ${rating} <i class="fa-regular fa-star"></i>
          </small>
        </div>
      </div>
    </div>

    <!-- Content Area Below Tabs -->
    <div id="tab-episodes" class="tab-content-section">

    </div>
    <div id="tab-cast" class="tab-content-section d-none"></div>
  </div>
`;


  resultList.insertAdjacentHTML('beforeend', articleElement);

  fetchEpisodes(id, 'tab-episodes');
  fetchCast(id, 'tab-cast');

  document.querySelectorAll('#infoTabs .nav-link').forEach(tab => {
  tab.addEventListener('click', function (e) {
    e.preventDefault();

    const target = this.getAttribute('data-tab');

    // Deactivate all tabs
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    this.classList.add('active');

    // Hide all content sections
    document.querySelectorAll('.tab-content-section').forEach(section => {
      section.classList.add('d-none');
    });

    // Show the selected one
    const targetContent = document.getElementById(target);
    if (targetContent) {
      targetContent.classList.remove('d-none');
    }
  });
});
})

.catch(error => {
  console.error("Error fetching show:", error);
  breadcrumbElement.textContent = "Error loading show";
  });




// Fetching Episodes
function fetchEpisodes(showId, targetElementId) {
  const episodesUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;

  fetch(episodesUrl)
    .then(response => response.json())
    .then(episodes => {
      const grouped = {};

      // Group episodes by season
      episodes.forEach(ep => {
        if (!grouped[ep.season]) {
          grouped[ep.season] = [];
        }
        grouped[ep.season].push(ep);
      });

      const target = document.getElementById(targetElementId);
      if (!target) return;

      let html = '<div class="accordion" id="seasonAccordion">';

      for (const season in grouped) {
        const seasonId = `season-${season}`;
        html += `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading-${season}">
              <button class="accordion-button ${season == 1 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${season}" aria-expanded="${season == 1 ? 'true' : 'false'}" aria-controls="collapse-${season}">
                Season ${season}
              </button>
            </h2>
            <div id="collapse-${season}" class="accordion-collapse collapse ${season == 1 ? 'show' : ''}" aria-labelledby="heading-${season}" data-bs-parent="#seasonAccordion">
              <div class="accordion-body">
        `;

        grouped[season].forEach(ep => {
          html += `
            <div class="mb-2">
              <strong>S${ep.season}E${ep.number}:</strong> ${ep.name} 
              <small class="text-muted">(${ep.airdate})</small>
            </div>
          `;
        });

        html += `
              </div>
            </div>
          </div>
        `;
      }

      html += '</div>';
      target.innerHTML = html;
    })
    .catch(error => {
      console.error("Error fetching episodes:", error);
      const target = document.getElementById(targetElementId);
      if (target) {
        target.innerHTML = `<p>Unable to load episodes.</p>`;
      }
    });
}

// Fetching Cast
function fetchCast(showId, targetElementId) {
  const castUrl = `https://api.tvmaze.com/shows/${showId}/cast`;
  const targetElement = document.getElementById(targetElementId);

  targetElement.innerHTML = '';

  fetch(castUrl)
    .then(response => response.json())
    .then(cast => {
      if (!cast || cast.length === 0) {
        targetElement.textContent = 'No cast information available.';
        return;
      }

      const castContainer = document.createElement('div');
      castContainer.style.display = 'flex';
      castContainer.style.flexWrap = 'wrap';
      castContainer.style.gap = '15px';

      cast.forEach(entry => {
        const person = entry.person;
        const character = entry.character;

        // Create the anchor wrapper for the card
        const link = document.createElement('a');
        link.href = "actor.html?id=" + person?.id;
        link.rel = 'noopener noreferrer';
        link.style.textDecoration = 'none';
        link.style.color = 'inherit';

        // Create cast card
        const castCard = document.createElement('div');
        castCard.style.width = '140px';
        castCard.style.border = '1px solid #ccc';
        castCard.style.borderRadius = '8px';
        castCard.style.padding = '10px';
        castCard.style.textAlign = 'center';
        castCard.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        castCard.style.backgroundColor = '#fafafa';
        castCard.style.cursor = 'pointer';
        castCard.style.transition = 'transform 0.2s ease';

        // Hover effect
        castCard.addEventListener('mouseenter', () => {
          castCard.style.transform = 'scale(1.05)';
          castCard.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        });
        castCard.addEventListener('mouseleave', () => {
          castCard.style.transform = 'scale(1)';
          castCard.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        });

        // Image or placeholder
        const img = document.createElement('img');
        img.style.width = '120px';
        img.style.height = 'auto';
        img.style.borderRadius = '6px';
        img.style.objectFit = 'cover';
        img.style.marginBottom = '8px';

        if (person?.image?.medium) {
          img.src = person.image.medium;
          img.alt = person.name;
        } else {
          img.alt = 'No Image';
          img.src = 'images/no-img-portrait-text.png';
          img.style.objectFit = 'contain';
          img.style.backgroundColor = '#ddd';
        }

        const nameElem = document.createElement('div');
        nameElem.textContent = person?.name || 'Unknown';
        nameElem.style.fontWeight = '600';
        nameElem.style.marginBottom = '4px';
        nameElem.style.fontSize = '14px';
        nameElem.style.color = '#333';

        const charElem = document.createElement('div');
        charElem.textContent = character?.name || '';
        charElem.style.fontSize = '13px';
        charElem.style.color = '#666';
        charElem.style.fontStyle = 'italic';

        castCard.appendChild(img);
        castCard.appendChild(nameElem);
        castCard.appendChild(charElem);

        link.appendChild(castCard);
        castContainer.appendChild(link);
      });

      targetElement.appendChild(castContainer);
    })
    .catch(error => {
      targetElement.textContent = 'Error loading cast data.';
      console.error('Error fetching cast:', error);
    });
}


