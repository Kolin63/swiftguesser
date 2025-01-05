let weightData;
let configData;
let leaderboardData = undefined;
let parameters;
let winData;
const configBox = document.getElementById("lb-config");

addEventListener('DOMContentLoaded', init);
async function init() {
    try { winData = JSON.parse(localStorage.getItem("win")); }
    catch { winData = ""; }
    localStorage.setItem("win", "");
    console.log("Win Data:", winData);

    weightData = await getWeight();
    await fetchConfig();

    const localArtistSelect = localStorage.getItem('artistSelect');
    const localAlbumSelect = localStorage.getItem('albumSelect');
    const localSongSelect = localStorage.getItem('songSelect');

    buildConfig();
    await buildSelectionBar();

    artistSelect.value = localArtistSelect;
    await artistSelectChange();
    albumSelect.value = localAlbumSelect;
    await albumSelectChange();
    songSelect.value = localSongSelect;
    await songSelectChange();
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
    for (parameter in configData["parameters"]) {
        const p = configData["parameters"][parameter];
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

    for (artist in weightData) {
        if (data["artists"] && !data["artists"].includes(artist)) continue;
        if (data["albums"] && !Object.keys(data["albums"]).includes(artist)) continue;

        // Create a new object for the artist
        const artistOption = document.createElement("option");
        artistOption.textContent = artist;
        artistSelect.appendChild(artistOption);
    }

    await artistSelectChange(data);

    if (winData != "") {
        addNameToLeaderboard();
    } 
}

async function addNameToLeaderboard() {
    let songLB = parseLeaderboardString(leaderboardData[parameters]);
    const playerName = localStorage.getItem("playerName");
    const playerPoints = winData[3];

    const chickenalpha = leaderboardData;
    console.log("chicken alpha", chickenalpha);

    for (let i = 0; i < songLB.length; i++) {
        if (songLB[i].points < playerPoints) {
            // Shifts Leaderboard Down
            for (let j = songLB.length - 2; j >= i; j--) {
                console.log("chicken", songLB[j].name, songLB[j].points);
                songLB[j + 1].name = songLB[j].name;
                songLB[j + 1].points = songLB[j].points;
            }
            console.log("chicken:", songLB);

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
    if (data = {}) data = await getAlbumParameterData();

    albumSelect.innerHTML = '';
    for (album in weightData[artistSelect.value]) {
        if (data["albums"] && !data["albums"][artistSelect.value].includes(album)) continue;

        // Create a new object for the album
        const albumOption = document.createElement("option");
        albumOption.textContent = album;
        albumSelect.appendChild(albumOption); 
    } 

    localStorage.setItem('artistSelect', artistSelect.value);

    await albumSelectChange(); 
}

async function albumSelectChange() {
    console.log("Album Select Changed to: ", albumSelect.value);

    songSelect.innerHTML = '';
    for (song in weightData[artistSelect.value][albumSelect.value].songs) {
        // Create a new object for the song
        const songOption = document.createElement("option");
        songOption.textContent = weightData[artistSelect.value][albumSelect.value].songs[song];
        songSelect.appendChild(songOption);
    }

    localStorage.setItem('albumSelect', albumSelect.value);

    await songSelectChange();
}

async function songSelectChange() {
    console.log("Song Select Changed to: ", songSelect.value);

    localStorage.setItem('songSelect', songSelect.value);

    await fetchLeaderboard();
    if (leaderboardData == undefined) return;

    await makeLeaderboardJSON();
}

async function updateParametersString() {
    // Make a string representing enabled parameters
    parameters = "";
    for (parameter in configData["parameters"])
    {
        if (configData["parameters"][parameter].value == true)
            parameters = parameters.concat(parameter).concat(',');
    }
    if (parameters == "") parameters = "none";
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
    console.trace();

    await updateLeaderboardPath();

    await fetch(leaderboardPath)
    .then(response => {
        if (!response.ok) {
            throw new Error("fetchLeaderboard() error " + response.status);
        }
        return response.json();
    }) 
    .then(async json => {
        try {
            leaderboardData = JSON.parse(json);
        } catch (err) {
            leaderboardData = {};
        }
        console.log("fetchLeaderboard() finished: ", leaderboardData);
        await makeLeaderboardJSON();
    });
    console.log("fetchLeaderboard() returning");
}

async function updateLeaderboard() {
    console.trace();
    console.log("updateLeaderboard() called with ", leaderboardData, JSON.stringify(leaderboardData));

    await updateLeaderboardPath();

    fetch(leaderboardPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(leaderboardData)
    })
    .then(response => response.json())
    .then(async data => {
        console.log("updateLeaderboard():", data.message);
    });
}
