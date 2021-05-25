var comicId = window.localStorage.getItem('comicId');
var chapterNumber = window.localStorage.getItem('chapterNumber');


async function getPages() {
    return await (await fetch('http://localhost:3000/comic/'
    + comicId + '/' + chapterNumber)).json();
}

async function injectPages() {
    let pages = await getPages();
    console.log(pages);
    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
        document.body.insertAdjacentHTML('beforeend', `
            <img src="http://localhost:3000/static/${page.pageImage}" width="400" height="800">
        `);
    }
}

injectPages();