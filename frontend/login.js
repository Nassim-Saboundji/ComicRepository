window.addEventListener('DOMContentLoaded', async function () {
    
    document.getElementById('login').addEventListener('click', async function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
    
        if (validate(username) && validate(password)) {
            const loginResponse = await (
            await fetch('./loginAdmin?username=' + username + "&password=" + password)
            ).json();
            
            console.log(loginResponse.message);
            let messageElement = document.getElementById('message');
            if (loginResponse.message == 'Admin is logged in.') {
                messageElement.innerText = "Login was successful. You can now upload or remove comics or chapters.";
            } else if (loginResponse.message == 'Admin is already logged in.') {
                messageElement.innerText = "You're aleady logged in."
            } else {
                messageElement.innerText = "Login was unsuccessful. Try again.";
            }
        }

    })
});

function validate(string) {
    const alphanumeric = /^[\p{L}\p{N}]+$/u;
    const result = string.match(alphanumeric);
    if (result != null) {
        return true;
    }

    return false;
}
