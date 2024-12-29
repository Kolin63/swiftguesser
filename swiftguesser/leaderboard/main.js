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
    configData = JSON.parse(localStorage.getItem('config'));
    buildConfig();
    buildSelectionBar();
    fetchLeaderboard();
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
songSelect.onchange = (event) => {songSelectChange()};

function buildSelectionBar() {
    artistSelect.innerHTML = '';
    for (artist in weightData) {
        // Create a new object for the artist
        const artistOption = document.createElement("option");
        artistOption.textContent = artist;
        artistSelect.appendChild(artistOption);
    }
    artistSelectChange();

    if (winData != "") {
        artistSelect.value = winData[0];
        artistSelectChange();
        albumSelect.value = winData[1];
        albumSelectChange();
        songSelect.value = winData[2];
        songSelectChange();
    }
}

function artistSelectChange() {
    albumSelect.innerHTML = '';
    for (album in weightData[artistSelect.value]) {
        // Create a new object for the album
        const albumOption = document.createElement("option");
        albumOption.textContent = album;
        albumSelect.appendChild(albumOption); 
    } 
    albumSelectChange(); 
}

function albumSelectChange() {
    songSelect.innerHTML = '';
    for (song in weightData[artistSelect.value][albumSelect.value].songs) {
        // Create a new object for the song
        const songOption = document.createElement("option");
        songOption.textContent = weightData[artistSelect.value][albumSelect.value].songs[song];
        songSelect.appendChild(songOption);
    }
    songSelectChange();
}

function updateParametersString() {
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

function songSelectChange() {
    if (leaderboardData == undefined) return;
    fetchLeaderboard();

    const container = document.getElementById("leaderboard-container");
    container.innerHTML = '';

    makeLeaderboardJSON();
    
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
function makeLeaderboardJSON() {
    updateParametersString();    
    console.log("makeLeaderboardJSON() started", leaderboardData);

    // Create a new object for the selected parameters
    if (leaderboardData != undefined && leaderboardData[parameters] == undefined) leaderboardData[parameters] =
        "NULNULNULNULNULNULNULNULNULNUL000000000000000000000000000000";
    

    updateLeaderboard();
    console.log("makeLeaderboardJSON() finished", leaderboardData);
}

async function getWeight() {
    const response = await fetch('../weight.json');
    const weightData = await response.json();
    return weightData;
}

let leaderboardPath = undefined;
function updateLeaderboardPath() {
    leaderboardPath = "https://api.swiftguesser.kolin63.com/" + artistSelect.value + "/" + albumSelect.value + "/" + songSelect.value;
    leaderboardPath = leaderboardPath.replaceAll(" ", "%20");
    console.log("Leaderboard Path: ", leaderboardPath);
}

async function fetchLeaderboard() {
    updateLeaderboardPath();

    fetch(leaderboardPath)
    .then(response => {
        if (!response.ok) {
            throw new Error("fetchLeaderboard() error " + response.status);
        }
        return response.json();
    }) 
    .then(json => {
        console.log("fetchLeaderboard() finished: ", json);
        leaderboardData = json;
        makeLeaderboardJSON();
        songSelectChange();
    });
}

async function updateLeaderboard() {
    updateLeaderboardPath();

    fetch(leaderboardPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(leaderboardData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    });
}

document.getElementById("test-button").addEventListener("click", function () {
    let songLB = parseLeaderboardString(leaderboardData[parameters]);

    for (i in songLB) {
        if (songLB[i].name == "NUL") {
            songLB[0] = { "name": "TST", "points": 987 };
            break;
        }
    }

    leaderboardData[parameters] = makeLeaderboardString(songLB);
    console.log("testbutton: ", leaderboardData);
    updateLeaderboard();
    songSelectChange();
})
