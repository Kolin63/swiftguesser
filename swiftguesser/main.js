const configBox = document.getElementById('config');

let configData;

// Function called when page is loaded
document.addEventListener('DOMContentLoaded', init);
async function init() {
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
