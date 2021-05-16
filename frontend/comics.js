
function clean() {
    document.getElementById("root").replaceChildren(); 
    document.getElementById("comicSection").replaceChildren();
    document.getElementById("chapterSection").replaceChildren();
    document.getElementById("comicManager").replaceChildren();
    document.getElementById("chapterManager").replaceChildren();
    document.getElementById("adminLogin").replaceChildren();
}


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
        clean();
        window.location.hash = "/comics/" + comicData.comic_id;
        const comicInfo = await (await fetch('http://localhost:3000/comic/' + comicData.comic_id)).json();
        const comicChapters = await (await fetch('http://localhost:3000/comic/' + comicData.comic_id + '/chapters')).json();
        console.log(comicChapters);
        comicInfoPage(comicInfo[0], comicChapters);
    });

    card.appendChild(poster);
    card.appendChild(title);
    resultSection.appendChild(card);
    

}


function comicInfoPage(comicData, comicChaptersData) {
    let comicSection = document.getElementById('comicSection');
    let card = document.createElement('div');
    let title = document.createElement('p');
    let poster = document.createElement('img');
    let info = document.createElement('p');
    let chapterList = document.createElement('ul');

    title.innerText = comicData.comic_title;
    poster.src = "http://localhost:3000/static/" + comicData.comic_poster;
    info.innerText = comicData.comic_info;

    for (let i = 0; i < comicChaptersData.length; i++) {
        let li = document.createElement('li');
        li.innerText = comicChaptersData[i].chapter_title;
        li.id = comicChaptersData[i].chapter_number;
        li.addEventListener('click', async function () {
            clean();
            const chapterPages = await (await fetch('http://localhost:3000/comic/' + comicData.comic_id + "/" + li.id )).json();
            makeChapter(chapterPages);
        });
        chapterList.appendChild(li);
    }

    comicSection.appendChild(card);
    card.appendChild(poster);
    card.appendChild(title);
    card.appendChild(info);
    card.appendChild(chapterList);

}


function makeChapter(chapterPages) {
    let chapterSection = document.getElementById("chapterSection");
    for (let i = 0; i < chapterPages.length; i++) {
        let page = document.createElement('img');
        page.src = 'http://localhost:3000/static/' + chapterPages[i].page_image;
        chapterSection.appendChild(page);
    }
}

