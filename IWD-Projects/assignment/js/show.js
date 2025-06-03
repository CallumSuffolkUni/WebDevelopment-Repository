const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const url = "https://api.tvmaze.com/people/" + id + "?embed=castcredits";
const resultList = document.querySelector('#results');
const breadcrumbElement = document.getElementById('showNameBreadcrumb');

fetch(url)
.then((response) => response.json())
.then((data) => {
    const showName = data.name || "Unknown";
    const genre = data.genre  || [];
    const premiered = data.premiered || "Unkown";
    const eneded = data.ended;
    const rating = data.rating?.average || "Unknown";;
    const imageUrl = data.image?.medium || "images/no-img-portrait-text.png";
    const summary = data.summary;

    breadcrumbElement.textContent = showName;

    const showLinks = castCredits.map(credit => {
        const showHref = credit._links.show.href;
        const showId = showHref.split('/').pop();
        const showName = credit._links.show.name;

        if (showId && showName) {
            return `<a class="link-dark" href="show.html?id=${encodeURIComponent(showId)}">${showName}</a>`;
        }
        return "Uknown Show";
    }).join(', ');

    const articleElement = `
        <div class="container mt-3">
            <div class="card d-flex flex-row align-items-center p-4">
                <div class="p-3">
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
