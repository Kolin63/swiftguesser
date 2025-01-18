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


        const artistFlex = document.createElement("div");
        artistFlex.className = "artist-flex";


        const header = document.createElement("label");
        header.textContent = configData[artist].display.display;

        // Creates checks for each album
        let previousCategory = null;
        for (album in configData[artist]["data"]) {
            if (album == "display") continue;

            const check = document.createElement("img");
            check.id = "check" + artist + album;
            check.artist = artist;
            check.album = album;
            check.title = configData[artist]["data"][album]["display"];

            const checkwrap = document.createElement("div");
            checkwrap.className = "checkwrap";

            if (artist == "parameters") {
                check.src = "/art/parameters/" + album + ".jpg";
            }
            else {
                check.src = "/play/music/" + artist + "/" + album + "/cover.jpg";
            }
            check.onerror = function () {
                check.src = "/art/monkey.jpg";
            }

            updateCheckColor(check);
            checkwrap.appendChild(check);
            if (artist == "parameters") {
                const covername = document.createElement("p");
                covername.className = "config-cover-name";
                covername.textContent = check.title;
                checkwrap.appendChild(covername);
                checkwrap.style.height = "152px"

                const currentCategory = configData[artist]["data"][album].category;
                if (previousCategory != null && !arraysEqual(currentCategory, previousCategory)) {
                    const flexbreak = document.createElement("div");
                    flexbreak.className = "flex-break";
                    artistFlex.appendChild(flexbreak);
                }
                previousCategory = configData[artist]["data"][album].category;
            }
            artistFlex.appendChild(checkwrap);

            // Adds event listeners to checks
            check.addEventListener('click', function () {
                albumCheckChange(check, headercheck);
            });
        }
        // Adds event listeners to header check
        headercheck.addEventListener('change', function () {
            artistCheckChange(headercheck);
        });
        header.appendChild(artistFlex);
        header.appendChild(document.createElement("br"));
        configBox.appendChild(header);
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
    updateChecks();
}

function updateParametersChecks(check, headercheck)
{
    // Check Incomps
    for (incomp in configData[check.artist]["data"][check.album]["incomp"])
    {
        let allOthersOff = true;
        for (incompcat in configData[check.artist]["data"][check.album]["incomp"][incomp])
        {
            for (exparam in configData[check.artist]["data"])
            {
                for (exparamcat in configData["parameters"]["data"][exparam]["category"])
                {
                    // If the category is the same as the certain incomp
                    try {
                        if (configData["parameters"]["data"][exparam]["category"][exparamcat] == configData[check.artist]["data"][check.album]["incomp"][incomp][incompcat]) {
                            const elem = document.getElementById("checkparameters" + exparam);
                            if (elem == check) continue;
                            const checkChecked = !configData[check.artist]["data"][check.album].value; // We not the value here because we don't actually change it until the end of this block
                            const elemChecked = configData[elem.artist]["data"][elem.album].value;

                            if (incomp == "nand") {
                                if (checkChecked && elemChecked) {
                                    configData[elem.artist]["data"][elem.album].value = false;
                                    configData[check.artist]["data"][check.album].value = true;
                                } 
                                if (elemChecked) allOthersOff = false;
                            }
                            else if (incomp == "xor") {
                                if (checkChecked && elemChecked) {
                                    configData[elem.artist]["data"][elem.album].value = false;
                                    configData[check.artist]["data"][check.album].value = true;
                                }
                            }
                            updateChecks();
                        }
                    } catch {
                        continue;
                    }
                }
            }
        }
        if (incomp == "nand" && allOthersOff) {
            configData[check.artist]["data"][check.album].value = !configData[check.artist]["data"][check.album].value;
        }
    }

    // Data
    const data = configData[check.artist]["data"][check.album]["data"];

    if (configData[check.artist]["data"][check.album]["category"].includes("album") && check.album != "cherrypick")
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
    headercheck.checked = orArtist(check.artist);
    configData[check.artist]["data"][check.album].value = !configData[check.artist]["data"][check.album].value;

    let match = false;
    let everything = true;

    for (parameter in configData["parameters"]["data"])
    {
        if (parameter == "display" || !configData["parameters"]["data"][parameter]["category"].includes("album")) continue;

        const data = configData["parameters"]["data"][parameter]["data"];
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

            for (album in configData[artist]["data"])
            {
                if (configData[artist]["data"][album].value)
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

    // const album = (Object.keys(configData[artist]["data"])[0]);
    // const elem = document.getElementById("check" + artist + album);
    // elem.checked = !elem.checked;
    // elem.click();
    updateChecks();
}

function orArtist(artist) {
    let or = false;
    for (album in configData[artist]["data"]) {
        or = or || configData[artist]["data"][album].value;
    }
    return or;
}

function andArtist(artist) {
    let and = true;
    for (album in configData[artist]["data"]) {
        and = and && configData[artist]["data"][album].value;
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
            for (album in oldConfig[artist]["data"])
            {
                const x = currentConfig[artist]["data"][album];
                if (x != undefined && x != null)
                    configData[artist]["data"][album] = oldConfig[artist]["data"][album];

                configData[artist]["data"][album] = currentConfig[artist]["data"][album];
                configData[artist]["data"][album].value = oldConfig[artist]["data"][album].value;
            }
        }
    }
}

function checkArtist(artist, bool) {
    if (artist == "parameters") return;

    for (album in configData[artist]["data"]) {
        checkAlbum(artist, album, bool);
    }
    try {
        document.getElementById("check" + artist).checked = bool;
    } catch { };
}

function checkAlbum(artist, album, bool) {
    configData[artist]["data"][album].value = bool;

    try {
        document.getElementById("check" + artist).checked = orArtist(artist);
    } catch { };
}

function numberOfBoolAlbums(artist, bool) {
    let num = 0;

    for (album in configData[artist]["data"]) {
        if (configData[artist]["data"][album].value == bool) num++;
    }

    return num;
}

function updateCheckColor(check) {
    check.className = "config-cover " + ((configData[check.artist]["data"][check.album].value) ? "config-cover-on" : "config-cover-off");
}

function updateChecks() {
    for (artist in configData) {
        for (album in configData[artist]["data"]) {
            updateCheckColor(document.getElementById("check" + artist + album))
        }
    }
}

function arraysEqual(x, y) {
    for (let i = 0; i < x.length; i++) {
        if (x[i] != y[i]) return false;
    }
    return true;
}
