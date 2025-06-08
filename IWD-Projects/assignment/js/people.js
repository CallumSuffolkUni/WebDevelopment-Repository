//Initializing variables
const urlParams = new URLSearchParams(window.location.search);
const keyword = urlParams.get('keyword')?.trim() || "";
const resultList = document.querySelector('#results');
const paginationContainer = document.querySelector('#pagination');
let currentPage = 0;
const itemsPerPage = 15;
let people = [];

//Provides the ability to let the search on index.html and people.html to both use the url to search for actors.
let url;
if (keyword === "") {
    url = "https://api.tvmaze.com/people";
} else {
    url = `https://api.tvmaze.com/search/people?q=${encodeURIComponent(keyword)}`;
}

console.log(url);

//Fetching the url
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        people = Array.isArray(data) ? data.map(item => item.person || item) : [];

        if (people.length === 0) {
            resultList.innerHTML = "<p class='text-white text-center'>No results found.</p>";
            return;
        }

        renderPeople();
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
        resultList.innerHTML = "<p class='text-danger text-center'>Failed to load data.</p>";
    });
//Function to call the api and render the actors
function renderPeople() {
    resultList.innerHTML = "";

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const visiblePeople = people.slice(start, end);

    visiblePeople.forEach((person) => {
        const name = person.name || "Unknown";
        const imageUrl = person.image?.medium || "images/no-img-portrait-text.png";

        const articleElement = `
        <div class="card-group col-lg-4 col-md-6 col-sm-6 justify-content-center">
            <a href="actor.html?id=${person.id}" class="people" style="width: 100%"> 
                <div class="card text-bg-dark text-center no-border rounded-1">
                    <img src="${imageUrl}" class="object-fit-cover opacity-75" alt="${name}">
                    <div class="card-img-overlay top-80">
                        <h5 class="text-white bg-dark-subtle card-title fw-bolder text-capitalize">${name}</h5>
                    </div>
                </div>
            </a>
        </div>
        `;
        resultList.insertAdjacentHTML('beforeend', articleElement);
    });

    renderPagination(people.length, Math.ceil(people.length / itemsPerPage));
}

// Function to limit number of actors to pages.
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
            renderPeople();
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
            renderPeople();
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
            renderPeople();
        });
        ul.appendChild(li);
    }

    nav.appendChild(ul);
    paginationContainer.appendChild(nav);
}
