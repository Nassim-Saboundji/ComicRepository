document.addEventListener("DOMContentLoaded", () => {
    getComics();
});


async function getComics() {
    const response = await fetch('http://localhost:3000/comics');
    const data = await response.json();
    generateComicSection(data);

}

function generateComicSection(data) {
    for (let i = 0; i < data.length; i++) {
        comicCard(data[i]);
    }
}


function comicCard(comicData) {
    let card = document.createElement('div');
    let title = document.createElement('p');
    let poster = document.createElement('img');

    title.innerText = comicData.comic_title;
    poster.src = "http://localhost:3000/static/" + comicData.comic_poster;
    card.id = comicData.comic_id;

    card.appendChild(poster);
    card.appendChild(title);
    document.getElementById('resultSection').appendChild(card);
    
}