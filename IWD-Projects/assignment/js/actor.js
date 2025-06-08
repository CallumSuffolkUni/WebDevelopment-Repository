const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const url = "https://api.tvmaze.com/people/" + id + "?embed=castcredits";
const resultList = document.querySelector('#results');
const breadcrumbElement = document.getElementById('actorNameBreadcrumb');

fetch(url)
.then((response) => response.json())
.then((data) => {
    const actorName = data.name || "Unknown";
    const country = data.country.name || "Unknown";
    const birthday = data.birthday || "Unknown";
    const deathday = data.deathday || "Unknown";
    const gender = data.gender || "Unknown";
    const imageUrl = data.image?.medium || "images/no-img-portrait-text.png";
    const castCredits = data._embedded?.castcredits || [];

    breadcrumbElement.textContent = actorName;

        // Create clickable show links with show names
        const showLinks = castCredits.map(credit => {
        const showHref = credit._links.show.href;
        const showId = showHref.split('/').pop();
        // For show name, fetch from embedded or credit?
        // API returns show name here usually:
        const showName = credit._links.show.name || "Unknown Show";

        // Return an anchor tag for the show
        return `<a class="link-dark mx-1" href="show.html?id=${encodeURIComponent(showId)}">
                    ${showName}
                </a>`;
    }).join('');

    const articleElement = `
        <div class="container mt-3">
            <div class="card d-flex flex-column flex-lg-row align-items-center p-4">
                <div class="p-3 text-center text-md-start">
                    <img src="${imageUrl}" class="rounded-start" alt="${actorName}" style="width: 300px; height: auto;">
                </div>
                <div class="p-4" style="font-size: 1.25rem";>
                    <div class="card-body">
                        <h5 class="card-title display-2 fw-bolder">${actorName}</h5>

                        <p class="card-text">
                            Nationality: ${country}<br>
                            Birthday: ${birthday}<br>
                            ${deathday ? `Deathday: ${deathday}<br>` : ''}
                            Gender: ${gender}<br>
                        </p>

                        <p class="card-text">
                            ${showLinks ? `
                                <small class="text-body-secondary">
                                    Shows: ${showLinks}
                                </small>
                            ` : ''}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        `;

    resultList.insertAdjacentHTML('beforeend', articleElement);

  })
  .catch(error => {
    console.error("Error fetching actor:", error);
    breadcrumbElement.textContent = "Error loading name";
  });
