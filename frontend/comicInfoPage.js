window.addEventListener('DOMContentLoaded', async function () {
    let comicId = localStorage.getItem('comic_id');

});


async function getComicInfo(comicId) {
    return await (await fetch('./comic/' + comicId)).json();
}

async function getComicChapters(comicId) {
    return await (await fetch('./comic/' + comicId + '/chapters')).json();
}