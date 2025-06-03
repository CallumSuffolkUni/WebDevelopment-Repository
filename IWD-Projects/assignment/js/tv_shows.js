//Initializing variables
const urlParams = new URLSearchParams(window.location.search);
const keyword = urlParams.get('keyword')?.trim() || "";
const resultList = document.querySelector('#results');
const paginationContainer = document.querySelector('#pagination');
let currentPage = 0;
const itemsPerPage = 15;
let shows = [];

//Provides the ability to let the search on index.html and Shows.html to both use the url to search for shows.
let url;
if (keyword === "") {
    url = "https://api.tvmaze.com/shows";
} else {
    url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(keyword)}`;
}

console.log(url);

//Fetching the url
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        shows = Array.isArray(data) ? data.map(item => item.show || item) : [];

        if (shows.length === 0) {
            resultList.innerHTML = "<p class='text-white text-center'>No results found.</p>";
            return;
        }

        renderShows();
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
        resultList.innerHTML = "<p class='text-danger text-center'>Failed to load data.</p>";
    });
//Function to call the api and render the shows
function renderShows() {
    resultList.innerHTML = "";

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const visibleShows = shows.slice(start, end);
    
    visibleShows.forEach((show) => {
        const name = show.name || "Unknown";
        const imageUrl = show.image?.medium;
        const rating = show.rating?.average;
        const summary = show.summary;

        const articleElement = `
        <div class="container">
            <div class="list-group">
                <a id="tvshowsData" href="show.html?id=${show.id}" class="list-group-item list-group-item-action position-relative overflow-hidden" aria-current="true">
                    <div class="d-flex">
                        <img src="${imageUrl}" class="rounded-start me-3" style="width: 200px; height: 300px; object-fit: cover;" alt="${name}">
                        <div>
                            <h5 class="mb-1 display-5 fw-semibold">${name}</h5>
                            <p class="mb-1 summary fs-5">${summary}</p>
                        </div>
                    </div>
                    <small class="position-absolute top-0 end-0 m-2 text-body-secondary">${rating}<i class="fa-regular fa-star"></i></small>
                </a>
            </div>
        </div>
        `;
        resultList.insertAdjacentHTML('beforeend', articleElement);
    });

    renderPagination(shows.length, Math.ceil(shows.length / itemsPerPage));
}

// Function to limit number of shows to pages.
function renderPagination(totalItems, totalPages) {
    paginationContainer.innerHTML = '';
    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center flex-wrap';

    const maxVisiblePages = 5;
    const startPage = Math.floor(currentPage / maxVisiblePages) * maxVisiblePages;
    const endPage = Math.min(startPage + maxVisiblePages, totalPages);

    if (startPage > 0) {
        const li = document.createElement('li');
        li.className = 'page-item';
        li.innerHTML = '<button class="page-link">&laquo;</button>';
        li.addEventListener('click', () => {
            currentPage = startPage - 1;
            renderShows();
            window.scrollTo(0, 0);
        });
        ul.appendChild(li);
    }

    for (let i = startPage; i < endPage; i++) {
        const li = document.createElement('li');
        li.className = 'page-item' + (i === currentPage ? ' active' : '');

        const btn = document.createElement('button');
        btn.className = 'page-link';
        btn.textContent = i + 1;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderShows();
            window.scrollTo(0, 0);
        });

        li.appendChild(btn);
        ul.appendChild(li);
    }

    if (endPage < totalPages) {
        const li = document.createElement('li');
        li.className = 'page-item';
        li.innerHTML = '<button class="page-link">&raquo;</button>';
        li.addEventListener('click', () => {
            currentPage = endPage;
            renderShows();
            window.scrollTo(0, 0);
        });
        ul.appendChild(li);
    }

    nav.appendChild(ul);
    paginationContainer.appendChild(nav);
}
