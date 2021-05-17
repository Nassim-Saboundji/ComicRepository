window.addEventListener('DOMContentLoaded', async function () {
    let comics = await getComics();
    injectComicsLinks(comics);
});


async function getComics() {
    return await (await fetch('./comics')).json();
}

function injectComicsLinks(comics) {
    const comicSection = document.getElementById('comicSection');
    for (let i = 0; i < comics.length; i++) {
        let a = document.createElement('a');
        a.innerText = comics[i].comic_title;
        a.href = "./comicInfoPage.html";
        
        a.addEventListener('click', () => {
            localStorage.setItem('comicId', comics[i].comic_id);
        });
        
        
        comicSection.appendChild(a);
        
    }
}