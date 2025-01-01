function buildConfig() {
    for (artist in configData) {
        if (artist == "version") continue;
        if (configBox.id == "lb-config" && artist != "parameters") continue;

        // Creates header for each artist / category
        const headercheck = document.createElement("input");
        headercheck.type = "checkbox";
        headercheck.id = "check" + artist;
        headercheck.name = "check" + artist;
        headercheck.className = "headercheck";
        headercheck.artist = artist;
        headercheck.checked = orArtist(configData[artist]);
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
            check.addEventListener('change', function ()
            {
                if (check.artist == "parameters")
                {
                    const incomps = configData[check.artist][check.album]["incomp"];
                    if (incomps["nand"] != undefined)
                    {
                        for (nand in incomps["nand"])
                        {
                            const elem = document.getElementById("check" + check.artist + incomps["nand"][nand]);
                            if (check.checked && elem.checked) {
                                elem.checked = !check.checked;
                                configData[elem.artist][elem.album].value = elem.checked;
                            }
                        }
                    }

                    if (incomps["xor"] != undefined)
                    {
                        for (xor in incomps["xor"]) {
                            const elem = document.getElementById("check" + check.artist + incomps["xor"][xor]);
                            if (check.checked && elem.checked) {
                                elem.checked = !check.checked;
                                configData[elem.artist][elem.album].value = elem.checked;
                            }
                        }

                        if (!check.checked) check.checked = true;
                    }

                    configData[check.artist][check.album].value = check.checked;

                    if (check.album == "allswift") {
                        checkArtist("taylorswift", true);
                        checkArtist("sabrinacarpenter", false);
                    }
                    else if (check.album == "allsabrina") {
                        checkArtist("taylorswift", false);
                        checkArtist("sabrinacarpenter", true);
                    }
                    else if (check.album == "modernsabrina") {
                        checkArtist("taylorswift", false);
                        checkArtist("sabrinacarpenter", false);
                        checkAlbum("sabrinacarpenter", "emailsicantsend", true);
                        checkAlbum("sabrinacarpenter", "shortnsweet", true);
                    }
                    else if (check.album == "everything") {
                        checkArtist("taylorswift", true);
                        checkArtist("sabrinacarpenter", true);
                    }
                }
                else
                {
                    configData[check.artist][check.album] = check.checked;
                    headercheck.checked = orArtist(configData[check.artist]);

                    if (check.artist == "taylorswift") {
                        if (andArtist(configData["taylorswift"])) {
                            document.getElementById("checkparametersallswift").click();
                        }
                    }
                    else if (check.artist == "sabrinacarpenter") {
                        if (andArtist(configData["sabrinacarpenter"])) {
                            document.getElementById("checkparametersallsabrina").click();
                        }
                        else if (numberOfBoolAlbums("sabrinacarpenter", true) == 2 && configData["sabrinacarpenter"]["emailsicantsend"] == true && configData["sabrinacarpenter"]["shortnsweet"] == true && orArtist(configData["taylorswift"]) == false) {
                            document.getElementById("checkparametersmodernsabrina").click();
                        }
                    }
                }
                console.log(configData);
                storeConfig();

                if (window.location.pathname == "/leaderboard/") {
                    try {
                        songSelectChange();
                    } catch {
                        makeLeaderboardJSON();
                        songSelectChange();
                    }
                }
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

            for (album in configData[headercheck.artist]) {
                const check = document.getElementById("check" + headercheck.artist + album);
                check.click();
                check.click();
                break;
            }
        });

        configBox.appendChild(document.createElement("br"));
    }
}

// pass it as configData[artist]
function orArtist(artist) {
    let or = false;
    for (album in artist) {
        or = or || artist[album];
    }
    return or;
}

// pass it as configData[artist]
function andArtist(artist) {
    let and = true;
    for (album in artist) {
        and = and && artist[album];
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
