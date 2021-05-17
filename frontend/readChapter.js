
window.addEventListener('DOMContentLoaded', async function () {
    const comicId = localStorage.getItem('comicId');
    const chapterNumber = localStorage.getItem('chapterNumber');
    const chapterPages = await getChapterPages(comicId, chapterNumber);
    injectPages(chapterPages);
});

async function getChapterPages(comicId, chapterNumber) {
    return await (await fetch('./comic/' + comicId + '/' + chapterNumber)).json();
}

function injectPages(chapterPages) {
    let pages = document.getElementById('pages');
    for (let i = 0; i < chapterPages.length; i++) {
        let div = document.createElement('div');
        let img = document.createElement('img');
        img.src = './static/' + chapterPages[i].page_image;
        div.appendChild(img);
        pages.appendChild(div);
    }
}