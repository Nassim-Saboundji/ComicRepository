
async function send(e, form) {
    e.preventDefault();
    const response = await (await fetch(form.action, {method:'post', body: new FormData(form)})).json();
    console.log(response);
    return false;
}