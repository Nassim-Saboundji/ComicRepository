window.addEventListener("DOMContentLoaded", () => {
    generateHomePage();
});

//This is our router
window.addEventListener('hashchange', () => {
    
    let currentHash = window.location.hash;
    let currentHashArray = currentHash.split('/');
    
    if (currentHashArray[1] == "comics") {
        document.getElementById("root").replaceChildren();
        generateComicPage(currentHashArray[2]);
    }
    
    if (currentHashArray[1] == "upload") {

    }

    if (currentHashArray[1] == "login") {

    }

});

async function generateHomePage() {
    let data = await getComics();
    generateComicSection(data);
}


async function getComics() {
    const response = await fetch('http://localhost:3000/comics');
    return response.json();
}

function generateComicSection(data) {
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
    card.addEventListener('click', function() {
        // clean the DOM 
        document.getElementById("root").replaceChildren(); 
        window.location.hash = "/comics/" + comicData.comic_id;
        generateComicPage(comicData.comic_id);
    });

    card.appendChild(poster);
    card.appendChild(title);
    resultSection.appendChild(card);
    

}




function generateComicPage(comicId) {
    console.log(comicId);
}


