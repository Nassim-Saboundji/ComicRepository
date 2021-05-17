window.addEventListener('DOMContentLoaded', async function () {
    const comicId = localStorage.getItem('comicId');
    const comicInfo = await getComicInfo(comicId);
    const comicChapters = await getComicChapters(comicId);
    injectComic(comicInfo, comicChapters);
});




async function getComicInfo(comicId) {
    return await (await fetch('./comic/' + comicId)).json();
}

async function getComicChapters(comicId) {
    return await (await fetch('./comic/' + comicId + '/chapters')).json();
}




function injectComic(comicInfo, comicChapters) {
 
    let poster = document.getElementById('poster');
    let img = document.createElement('img');
    img.src = './static/' + comicInfo[0].comic_poster;
    poster.appendChild(img);

    let title = document.getElementById('title');
    let h2 = document.createElement('h2');
    h2.innerText = comicInfo[0].comic_title
    title.appendChild(h2);

    let info = document.getElementById('info');
    let p = document.createElement('p');
    p.innerText = comicInfo[0].comic_info;
    info.appendChild(p);

    let chapters = document.getElementById('chapters');
    for (let i = 0; i < comicChapters.length; i++) {
        let a = document.createElement('a');
        let chapter = comicChapters[0];
        a.innerText = chapter.chapter_number + " : " + chapter.chapter_title;
        a.href = './readChapter.html'
        a.addEventListener('click', () => {
            localStorage.setItem('chapterNumber', chapter.chapter_number);
        });
        chapters.appendChild(a);

    }
}