const configBox = document.getElementById('config');

let configData;

// Function called when page is loaded
document.addEventListener('DOMContentLoaded', init);
async function init() {
    await fetchConfig();
    console.log("config", configData);

    buildConfig();
}

function buildConfig() {
    for (artist in configData) {
        if (artist == "version") continue;

        // Creates header for each artist / category
        const headercheck = document.createElement("input");
        headercheck.type = "checkbox";
        headercheck.id = "check" + artist;
        headercheck.name = "check" + artist;
        headercheck.className = "headercheck";
        headercheck.artist = artist;
        headercheck.checked = orArtist(configData[artist]);
        configBox.appendChild(headercheck);


        const header = document.createElement("label");
        header.for = "check" + artist;
        header.textContent = artist;
        configBox.appendChild(header);

        // Creates checks for each album
        for (album in configData[artist]) {
            const check = document.createElement("input");
            check.type = "checkbox";
            check.id = "check" + artist + album;
            check.name = "check" + artist + album;
            check.className = "albumcheck";
            check.artist = artist;
            check.album = album;
            check.checked = configData[artist][album];


            const label = document.createElement("label");
            label.for = "check" + artist + album;
            label.textContent = album;


            const bullet = document.createElement("li");
            bullet.appendChild(check);
            bullet.appendChild(label);

            configBox.appendChild(bullet);  

            // Adds event listeners to checks
            check.addEventListener('change', function() {
                configData[check.artist][check.album] = check.checked;
                headercheck.checked = orArtist(configData[check.artist]);
                storeConfig();
            });
        }
        // Adds event listeners to header check
        headercheck.addEventListener('change', function() {
            for (album in configData[headercheck.artist]) {
                const check = document.getElementById("check" + headercheck.artist + album);
                check.checked = headercheck.checked;
                configData[headercheck.artist][album] = headercheck.checked;
                storeConfig();
            }
        });

        configBox.appendChild(document.createElement("br"));
    }
}

async function getConfig() {
    const response = await fetch('config.json');
    const configData = await response.json();
    return configData;
}

// pass it as configData[artist]
function orArtist(artist) {
    let or = false;
    for (album in artist) {
        or = or || artist[album];
    }
    return or;
}

Array.from(document.getElementsByClassName('playbutton')).forEach(element => {
    element.addEventListener('click', async function() {
        storeConfig();
        window.location.href = '/play';
    });
})

function storeConfig() {
    localStorage.setItem('config', JSON.stringify(configData));
}

async function fetchConfig() {
    const currentConfig = await getConfig();
    configData = JSON.parse(localStorage.getItem('config'));
    if (configData.version != currentConfig.version)
        configData = currentConfig;
}