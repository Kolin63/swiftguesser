let weightData;
let configData;
let leaderboardData = undefined;
let parameters;
let winData;
let initBool = true; // false if localSelect is undefined, false when init() is done running. True while init() is running if localSelect is valid. 
const configBox = document.getElementById("lb-config");

const localSelect = [localStorage.getItem("artistSelect"), localStorage.getItem("albumSelect"), localStorage.getItem("songSelect")];

addEventListener('DOMContentLoaded', init);
async function init() {
    try { winData = JSON.parse(localStorage.getItem("win")); }
    catch { winData = ""; }
    localStorage.setItem("win", "");
    console.log("Win Data:", winData);
    if (localSelect == undefined) initBool = false;

    weightData = await getWeight();
    await fetchConfig();

    buildConfig();
    await buildSelectionBar();

    initBool = false;
}

function parseLeaderboardString(s) {
    let songLB = [];
    // Names
    for (let i = 0; i < 10; i++) {
        songLB[i] = {};
        songLB[i].name = s.slice(0, 3);
        s = s.slice(3, s.length);
    }
    // Points
    for (let i = 0; i < 10; i++) {
        songLB[i].points = Number(s.slice(0, 3));
        s = s.slice(3, s.length);
    }

    return songLB;
}

function makeLeaderboardString(s) {
    let result = "";
    // Names
    for (i in s)
        result = result.concat(s[i].name);
    // Names
    for (i in s) 
        result = result.concat((s[i].points + "").padStart(3, '0'));

    return result;
}

const artistSelect = document.getElementById('select-artist');
const albumSelect = document.getElementById('select-album');
const songSelect = document.getElementById('select-song');
artistSelect.onchange = (event) => {artistSelectChange()};
albumSelect.onchange = (event) => {albumSelectChange()};
songSelect.onchange = (event) => { songSelectChange() };

async function getAlbumParameterData() {
    for (parameter in configData["parameters"]["data"]) {
        const p = configData["parameters"]["data"][parameter];
        if (p["category"].includes("album") && p.value) {
            if (parameter == "everything" || parameter == "cherrypick") return {};
            else return p["data"];
        }
    }
}

async function buildSelectionBar() {
    artistSelect.innerHTML = '';

    const data = await getAlbumParameterData();
    console.log("album parameter data", data);

    for (artist in configData) {
        if (artist == "parameters" || artist == "version") continue;
        if (orArtist(artist) == false) continue;
        if (document.getElementById("artistselectoption" + artist)) continue;
        console.log("orArtist " + artist + " is true");

        // Create a new object for the artist
        const artistOption = document.createElement("option");
        artistOption.textContent = artist;
        artistOption.id = "artistselectoption" + artist;
        artistSelect.appendChild(artistOption);
    }

    if (initBool) {
        if (winData == "") {
            artistSelect.value = localSelect[0];
        } else {
            artistSelect.value = winData[0];
        }
    } else {
        artistSelect.value = localStorage.getItem("artistSelect");
    }

    await artistSelectChange(data);

    if (winData != "" && initBool) {
        await addNameToLeaderboard();
        winData = "";
    } 
}

async function addNameToLeaderboard() {
    let songLB = parseLeaderboardString(leaderboardData[parameters]);
    const playerName = localStorage.getItem("playerName");
    const playerPoints = winData[3];

    for (let i = 0; i < songLB.length; i++) {
        if (songLB[i].points < playerPoints) {
            // Shifts Leaderboard Down
            for (let j = songLB.length - 2; j >= i; j--) {
                songLB[j + 1].name = songLB[j].name;
                songLB[j + 1].points = songLB[j].points;
            }

            songLB[i] = { "name": playerName, "points": playerPoints };
            console.log("addNameToLeaderboard(): Adding " + playerName + " to rank " + i + ". ", "Win Data: ", winData + ". ", "Leaderboard: ", songLB);

            leaderboardData[parameters] = makeLeaderboardString(songLB);
            await updateLeaderboard();
            updateLeaderboardList();

            break;
        } 
    }
}

async function artistSelectChange(data = {}) {
    if (artistSelect.value == "") {
        artistSelect.value = artistSelect.firstChild.textContent;
    }

    console.log("%cArtist Select Changed to: " + artistSelect.value, "color:#F44");
    if (data = {}) data = await getAlbumParameterData();

    albumSelect.innerHTML = '';
    for (album in configData[artistSelect.value]["data"]) {
        if (configData[artistSelect.value]["data"][album].value == false) continue;
        if (document.getElementById("albumselectoption" + album)) continue;

        // Create a new object for the album
        const albumOption = document.createElement("option");
        albumOption.textContent = album;
        albumOption.id = "albumselectoption" + album;
        albumSelect.appendChild(albumOption); 
    } 

    if (initBool) {
        if (winData == "") {
            albumSelect.value = localSelect[1];
        } else {
            albumSelect.value = winData[1];
        }
    } else {
        albumSelect.value = localStorage.getItem("albumSelect");
    }

    localStorage.setItem('artistSelect', artistSelect.value);

    await albumSelectChange(); 
}

async function albumSelectChange() {
    if (albumSelect.value == "") {
        albumSelect.value = albumSelect.firstChild.textContent;
    }

    console.log("%cAlbum Select Changed to: " + albumSelect.value, "color:#F44");

    songSelect.innerHTML = '';
    for (song in weightData[artistSelect.value][albumSelect.value].songs) {
        // Create a new object for the song
        const songOption = document.createElement("option");
        songOption.textContent = weightData[artistSelect.value][albumSelect.value].songs[song];
        songSelect.appendChild(songOption);
    }

    if (initBool) {
        if (winData == "") {
            songSelect.value = localSelect[2];
        } else {
            songSelect.value = winData[2];
        }
    } else {
        songSelect.value = localStorage.getItem("songSelect");
    }

    localStorage.setItem('albumSelect', albumSelect.value);

    await songSelectChange();
}

async function songSelectChange() {
    if (songSelect.value == "") {
        songSelect.value = songSelect.firstChild.textContent;
    }
    console.log("%cSong Select Changed to: " + songSelect.value, "color:#F44;");

    localStorage.setItem('songSelect', songSelect.value);

    await fetchLeaderboard();
    if (leaderboardData == undefined) return;

    await makeLeaderboardJSON();
}

async function updateParametersString() {
    // Make a string representing enabled parameters
    parameters = "";
    for (parameter in configData["parameters"]["data"])
    {
        if (configData["parameters"]["data"][parameter].value == true)
            parameters = parameters.concat(parameter).concat(',');
    }
    if (parameters == "") {
        console.error("config parameters invalid");
        window.location.href = "/#config"; 
    }
    console.log("parameters: ", parameters);
}

function updateLeaderboardList() {
    const container = document.getElementById("leaderboard-container");
    container.innerHTML = '';

    const songLB = parseLeaderboardString(leaderboardData[parameters]);
    console.log("Song Leaderboard: ", songLB);
    for (i in songLB) {
        const rank = document.createElement('div');
        rank.className = "leaderboard rank";

        const name = document.createElement('p');
        name.style = "display: inline";
        name.textContent = songLB[i]["name"];

        const points = document.createElement('p');
        points.style = "display: inline";
        points.textContent = ('' + songLB[i]["points"]).padStart(3, '0');

        rank.appendChild(name);
        rank.appendChild(points);

        container.appendChild(rank);
    }
}

// This function is here for developer purposes
async function makeLeaderboardJSON() {
    await updateParametersString();    

    // Create a new object for the selected parameters
    if (leaderboardData != undefined && leaderboardData[parameters] == undefined) leaderboardData[parameters] =
        "NULNULNULNULNULNULNULNULNULNUL000000000000000000000000000000";
    

    await updateLeaderboard();
    updateLeaderboardList();
    console.log("makeLeaderboardJSON() finished", leaderboardData);
}

async function getWeight() {
    const response = await fetch('../weight.json');
    const weightData = await response.json();
    return weightData;
}

let leaderboardPath = undefined;
async function updateLeaderboardPath() {
    leaderboardPath = "https://api.swiftguesser.kolin63.com/leaderboard/" + artistSelect.value + "/" + albumSelect.value + "/" + songSelect.value;
    leaderboardPath = leaderboardPath.replaceAll(" ", "%20");
    console.log("Leaderboard Path: ", leaderboardPath);
}

async function fetchLeaderboard() {
    await updateLeaderboardPath();

    try {
        await fetch(leaderboardPath)
            .then(response => {
                if (!response.ok) {
                    console.error("fetchLeaderboard() error " + response.status);
                }
                return response.json();
            })
            .then(async json => {
                try {
                    leaderboardData = JSON.parse(json);
                } catch (err) {
                    leaderboardData = {};
                }
                console.log("%cfetchLeaderboard() finished: " + leaderboardData, "color:#FF7");
                await makeLeaderboardJSON();
            });
    } catch (err) {
        console.error("fetchLeaderboard(): " + err);
    }
}

async function updateLeaderboard() {
    console.log("updateLeaderboard() called with ", leaderboardData);

    await updateLeaderboardPath();

    try {
        fetch(leaderboardPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leaderboardData)
        })
            .then(response => response.json())
            .then(async data => {
                console.log("%cupdateLeaderboard() finished: " + data.message, "color:#6D6");
            });
    } catch (err) {
        console.error("updateLeaderboard(): " + err);
    }
}

document.addEventListener('keydown', event => {
    const key = event.key;

    if (event.ctrlKey && key === ' ') {
        // Ctrl+Space
        window.location.href = "/play";
    }
});
