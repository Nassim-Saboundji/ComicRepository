

async function getComics() {
    return await (await fetch('http://localhost:3000/comics')).json();
}

async function injectComicList() {
    const comicList = await getComics();
    let listSection = document.getElementById('comics');
    for (let i = 0; i < comicList.length; i++) {
        let div = document.createElement('div');
        let item = comicList[i];
        div.id = item.comicId;
        div.innerHTML = `
        <img src="http://localhost:3000/static/${item.comicPoster}" id="poster" width="100" height="150">
        <p id="title">${item.comicTitle}</p>
        `;
        div.addEventListener('click', () => {
            window.localStorage.setItem('comicId', item.comicId);
            window.location.href = "http://localhost:3000/comic.html";
        });
        listSection.appendChild(div);
    }
}

function injectAdminFeatures() {
    console.log(window.localStorage.getItem('logged'))
    if (window.localStorage.getItem('logged') == "true") {
        document.getElementById('admin').innerHTML = `<button id="addComic">Add a Comic</button>`;
    }
}


injectComicList();
injectAdminFeatures();