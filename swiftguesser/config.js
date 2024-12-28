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
            check.addEventListener('change', function () {
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
                }
                else
                {
                    configData[check.artist][check.album] = check.checked;
                    headercheck.checked = orArtist(configData[check.artist]);
                }
                console.log(configData);
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

// pass it as configData[artist]
function orArtist(artist) {
    let or = false;
    for (album in artist) {
        or = or || artist[album];
    }
    return or;
}
