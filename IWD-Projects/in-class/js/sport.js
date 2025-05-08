const url = 'https://content.guardianapis.com/search?q=sport&api-key=';
const apiKey = 'e3ac8aef-9a2e-4933-a941-720140fd86b9';
const resultList = document.querySelector('#results');

fetch(url + apiKey) 
.then((response) => response.json()) 
.then((data) => {
    data.response.results.forEach(function (value) {
        console.log(value);
        const articleElement = `<div class="col-md-4">
                                    <div class="card mb-4">
                                        <div class="card-body">
                                            <h5 class="card-title">${value.webTitle}</h5>
                                            <p class="card-text">${value.sectionName}</p>
                                            <a target="_blank" href="${value.webUrl}" class="btn btn-primary">View Article</a>
                                        </div>
                                    </div>
                                </div>`;
        resultList.insertAdjacentHTML('beforeend', articleElement);
        });
    });