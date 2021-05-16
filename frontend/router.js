window.addEventListener("DOMContentLoaded", () => {
    makeHomePage();
});

//This is our router
window.addEventListener('hashchange', () => {
    
    let currentHash = window.location.hash;
    let currentHashArray = currentHash.split('/');
    
    if (currentHashArray[1] == "comics") {
        document.getElementById("root").replaceChildren();
    }
    
    if (currentHashArray[1] == "upload") {

    }

    if (currentHashArray[1] == "login") {

    }

});