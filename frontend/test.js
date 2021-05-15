async function getComics() {
    // GET request using fetch with async/await
    const response = await fetch('http://localhost:3000/comics');
    const data = await response.json();
    console.log(data);
}