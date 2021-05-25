
document.getElementById('login').addEventListener('click', async () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let loginResponse = await (await fetch(
        `http://localhost:3000/loginAdmin?username=${username}&password=${password}`)).json();

    if (loginResponse.message == "Admin is logged in." 
    || loginResponse.message == "Admin is already logged in.") {
        window.localStorage.setItem('logged', "true");
        window.location.href = "http://localhost:3000";
    }
});