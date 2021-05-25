var comicId = window.localStorage.getItem('comicId');


async function getComicInfo() {
    return await (await fetch('http://localhost:3000/comic/'+ comicId)).json();
}

async function getComicChapters() {
    return await (await fetch('http://localhost:3000/comic/' + comicId + '/chapters')).json();
}

async function injectComicPage() {
    let comicInfo = await (await getComicInfo())[0];
    let comicChapters = await getComicChapters();
    console.log(comicChapters);

    let comicPoster = document.getElementById('comicPoster');
    let details = document.getElementById('details');
    let chapters = document.getElementById('chapters');

    comicPoster.innerHTML = `<img src="http://localhost:3000/static/${comicInfo.comicPoster}" width="300" height="400">`
    details.innerHTML = `
      <h1>${comicInfo.comicTitle}</h1>
      <p>${comicInfo.comicInfo}</p>
    `;

    for (let i = 0; i < comicChapters.length; i++) {
        let aTag = document.createElement('a');
        aTag.addEventListener('click', () => {
            window.localStorage.setItem('comicId', comicId);
            window.localStorage.setItem('chapterNumber', comicChapters[i].chapterNumber);
        });
        aTag.href = "http://localhost:3000/chapter.html";
        aTag.innerText = comicChapters[i].chapterNumber + "-- " + comicChapters[0].chapterTitle;
        chapters.appendChild(aTag);
    }

}


injectComicPage();