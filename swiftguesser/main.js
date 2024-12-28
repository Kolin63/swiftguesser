const configBox = document.getElementById('config');

let configData;

// Function called when page is loaded
document.addEventListener('DOMContentLoaded', init);
async function init() {
    await fetchConfig();
    console.log("config", configData);

    buildConfig();
}

async function getConfig() {
    const response = await fetch('config.json');
    const configData = await response.json();
    return configData;
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
    if (configData == null || configData == undefined || configData.version != currentConfig.version)
    {
        const oldConfig = configData;
        configData = currentConfig;

        for (artist in oldConfig)
        {
            for (album in oldConfig[artist])
            {
                const x = currentConfig[artist][album];
                if (x != undefined && x != null)
                    configData[artist][album] = oldConfig[artist][album];

                if (artist == "parameters")
                {
                    configData[artist][album] = currentConfig[artist][album];
                    configData[artist][album].value = oldConfig[artist][album].value;
                }
            }
        }
    }
}

document.getElementById('reset-config').addEventListener('click', async function () {
    configData = await getConfig();
    storeConfig();
    location.reload();
})
