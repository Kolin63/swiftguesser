let weightData;
let configData;
let leaderboardData;
let parameters;
const configBox = document.getElementById("lb-config");


addEventListener('DOMContentLoaded', init);
async function init() {
    weightData = await getWeight();
    configData = JSON.parse(localStorage.getItem('config'));
    fetchLeaderboard();
    buildConfig();
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
    const container = document.getElementById("leaderboard-container");
    container.innerHTML = '';

    updateParametersString();

    const songLB = parseLeaderboardString(leaderboardData[artistSelect.value][albumSelect.value][songSelect.value][parameters]);
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

    for (artist in weightData) {
        // Create a new object for the artist
        if (leaderboardData[artist] == undefined) leaderboardData[artist] = {};

        for (album in weightData[artist]) {
            // Create a new object for the album
            if (leaderboardData[artist][album] == undefined) leaderboardData[artist][album] = {};

            for (song in weightData[artist][album].songs) {
                // Create a new object for the song
                const songName = weightData[artist][album].songs[song];
                if (leaderboardData[artist][album][songName] == undefined) leaderboardData[artist][album][songName] = {};

                // Create a new object for the selected parameters
                if (leaderboardData[artist][album][songName][parameters] == undefined) leaderboardData[artist][album][songName][parameters] =
                    "NULNULNULNULNULNULNULNULNULNUL000000000000000000000000000000";
            }
        } 
    }
    updateLeaderboard();
    console.log("makeLeaderboardJSON() finished", leaderboardData);
    buildSelectionBar();
}

async function getWeight() {
    const response = await fetch('../weight.json');
    const weightData = await response.json();
    return weightData;
}

const leaderboardPath = "https://api.swiftguesser.kolin63.com";

async function fetchLeaderboard() {
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
    });
}

async function updateLeaderboard() {
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
