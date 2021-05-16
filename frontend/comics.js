
async function makeHomePage() {
    let data = await getComics();
    makeResultSection(data);
}


async function getComics() {
    const response = await fetch('http://localhost:3000/comics');
    return response.json();
}

function makeResultSection(data) {
    for (let i = 0; i < data.length; i++) {
        comicCard(data[i]);
    }
}


function comicCard(comicData) {
    let resultSection = document.getElementById('resultSection');
    let card = document.createElement('div');
    let title = document.createElement('p');
    let poster = document.createElement('img');

    title.innerText = comicData.comic_title;
    poster.src = "http://localhost:3000/static/" + comicData.comic_poster;

    //add an event listener to every card
    card.addEventListener('click', async function() {
        // clean the DOM 
        document.getElementById("root").replaceChildren(); 
        window.location.hash = "/comics/" + comicData.comic_id;
        let result = await getComicInfo(comicData.comic_id);
        console.log(result);
    });

    card.appendChild(poster);
    card.appendChild(title);
    resultSection.appendChild(card);
    

}


async function getComicInfo(comicId) {
    const infoResponse = await fetch('http://localhost:3000/comic/' + comicId);
    return infoResponse.json();
}





