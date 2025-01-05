function buildConfig()
{
    for (artist in configData) {
        if (artist == "version") continue;

        // Creates header for each artist / category
        const headercheck = document.createElement("input");
        headercheck.type = "checkbox";
        headercheck.id = "check" + artist;
        headercheck.name = "check" + artist;
        headercheck.className = "headercheck";
        headercheck.artist = artist;
        headercheck.checked = orArtist(artist);
        if (artist == "parameters") {
            headercheck.checked = false;
            headercheck.disabled = true;
        }
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
            if (artist == "parameters")
                check.checked = configData[artist][album].value;
            else
                check.checked = configData[artist][album];


            const label = document.createElement("label");
            label.for = "check" + artist + album;
            label.textContent = album;


            const bullet = document.createElement("li");
            bullet.appendChild(check);
            bullet.appendChild(label);

            configBox.appendChild(bullet);

            // Adds event listeners to checks
            check.addEventListener('change', function () {
                albumCheckChange(check, headercheck);
            });
        }
        // Adds event listeners to header check
        headercheck.addEventListener('change', function () {
            artistCheckChange(headercheck);
        });

        configBox.appendChild(document.createElement("br"));
    }
}

function albumCheckChange(check, headercheck)
{
    if (check.artist == "parameters")
    {
        updateParametersChecks(check, headercheck);
    }
    else
    {
        updateAlbumChecks(check, headercheck);
    }

    if (window.location.pathname == "/leaderboard/") {
        try {
            buildSelectionBar();
        } catch {
            makeLeaderboardJSON();
            buildSelectionBar();
        }
    }

    console.log(configData);
    storeConfig();
}

function updateParametersChecks(check, headercheck)
{
    // Check Incomps
    for (incomp in configData[check.artist][check.album]["incomp"])
    {
        for (incompcat in configData[check.artist][check.album]["incomp"][incomp])
        {
            for (exparam in configData[check.artist])
            {
                for (exparamcat in configData[check.artist][exparam]["category"])
                {
                    // If the category is the same as the certain incomp
                    if (configData[check.artist][exparam]["category"][exparamcat] == configData[check.artist][check.album]["incomp"][incomp][incompcat] && exparam != check.album) 
                    {
                        const elem = document.getElementById("checkparameters" + exparam);

                        if (incomp == "nand")
                        {
                            if (check.checked && elem.checked) {
                                elem.checked = !check.checked;
                                configData[elem.artist][elem.album].value = elem.checked;
                            }    
                        }
                        else if (incomp == "xor")
                        {
                            if (check.checked && elem.checked)
                            {
                                elem.checked = !check.checked;
                                configData[elem.artist][elem.album].value = elem.checked;
                            }

                            if (!check.checked) check.checked = true;
                        }
                    }
                }
            }
        }
    }

    configData[check.artist][check.album].value = check.checked;

    // Data
    const data = configData[check.artist][check.album]["data"];

    if (configData[check.artist][check.album].category.includes("album") && check.album != "cherrypick")
    {
        for (artist in configData) {
            if (artist == "parameters") continue;
            checkArtist(artist, false);
        }

        if (data && data["artists"]) for (artist in data["artists"]) {
            checkArtist(data["artists"][artist], true);
        }

        if (data && data["albums"]) for (artist in data["albums"]) for (album in data["albums"][artist]) {
            checkAlbum(artist, data["albums"][artist][album], true);
        }

        if (check.album == "everything") for (artist in configData) {
            if (artist == "parameters") continue;
            checkArtist(artist, true);
        }
    }
}

function updateAlbumChecks(check, headercheck)
{
    configData[check.artist][check.album] = check.checked;
    headercheck.checked = orArtist(check.artist);

    let match = false;
    let everything = true;

    for (parameter in configData["parameters"])
    {
        if (!configData["parameters"][parameter]["category"].includes("album")) continue;

        const data = configData["parameters"][parameter]["data"];
        let currentData = {};
    
        for (artist in configData)
        {
            if (artist == "parameters" || artist == "version") continue;

            if (andArtist(artist))
            {
                if (currentData["artists"] == undefined) currentData["artists"] = [];
                currentData["artists"].push(artist);
                continue;
            }

            everything = false;

            for (album in configData[artist])
            {
                if (configData[artist][album])
                {
                    if (currentData["albums"] == undefined) currentData["albums"] = {};
                    if (currentData["albums"][artist] == undefined) currentData["albums"][artist] = [];
                    currentData["albums"][artist].push(album);
                }
            }
        }

        if (JSON.stringify(currentData) == JSON.stringify(data))
        {
            document.getElementById("checkparameters" + parameter).click();
            match = true;
            break;
        }
    }

    if (everything) document.getElementById("checkparameterseverything").click();
    else if (!match) document.getElementById("checkparameterscherrypick").click();
}

function artistCheckChange(headercheck)
{
    const artist = headercheck.artist;

    checkArtist(artist, headercheck.checked);
    storeConfig();

    const album = (Object.keys(configData[artist])[0]);
    const elem = document.getElementById("check" + artist + album);
    elem.checked = !elem.checked;
    elem.click();
}

function orArtist(artist) {
    let or = false;
    for (album in configData[artist]) {
        or = or || configData[artist][album];
    }
    return or;
}

function andArtist(artist) {
    let and = true;
    for (album in configData[artist]) {
        and = and && configData[artist][album];
    }
    return and;
}

async function getConfig() {
    const response = await fetch('/config.json');
    const configData = await response.json();
    console.log("getConfig(): ", configData);
    return configData;
}

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

function checkArtist(artist, bool) {
    if (artist == "parameters") return;

    for (album in configData[artist]) {
        checkAlbum(artist, album, bool);
    }
    try {
        document.getElementById("check" + artist).checked = bool;
    } catch { };
}

function checkAlbum(artist, album, bool) {
    try {
        document.getElementById("check" + artist + album).checked = bool;
    } catch { };
    configData[artist][album] = bool;

    try {
        document.getElementById("check" + artist).checked = orArtist(artist);
    } catch { };
}

function numberOfBoolAlbums(artist, bool) {
    let num = 0;

    for (album in configData[artist]) {
        if (configData[artist][album] == bool) num++;
    }

    return num;
}
