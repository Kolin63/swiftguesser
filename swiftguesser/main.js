const configBox = document.getElementById('config');

let configData;

// Function called when page is loaded
document.addEventListener('DOMContentLoaded', init);
async function init() {
    localStorage.setItem('win', "");

    await fetchConfig();
    console.log("config", configData);

    buildConfig();
}

Array.from(document.getElementsByClassName('playbutton')).forEach(element => {
    element.addEventListener('click', async function() {
        storeConfig();
        window.location.href = './play';
    });
})

document.getElementById('reset-config').addEventListener('click', async function () {
    configData = await getConfig();
    storeConfig();
    location.reload();
})

document.addEventListener('keydown', event => {
    const key = event.key;

    if (event.ctrlKey && key === ' ') {
        // Ctrl+Space
        window.location.href = "/play";
    }
});
