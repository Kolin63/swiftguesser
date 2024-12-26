let weightData;
let configData;
let leaderboardData = {};

addEventListener('DOMContentLoaded', init);
async function init() {
    weightData = await getWeight();
    configData = JSON.parse(localStorage.getItem('config'));
    fetchLeaderboard()
    buildSelectionBar();
}

const artistSelect = document.getElementById('select-artist');
const albumSelect = document.getElementById('select-album');
const songSelect = document.getElementById('select-song');
artistSelect.onchange = (event) => {artistSelectChange()};
albumSelect.onchange = (event) => {albumSelectChange()};
songSelect.onchange = (event) => {songSelctChange()};

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

function songSelectChange() {
    const container = document.getElementById("leaderboard-container");
    for (i in document.getElementsByClassName("lb-result"))
        container.removeChild(i);

}

// This function is here for developer purposes
function makeLeaderboardJSON() {
    // Make a string representing enabled parameters
    let parameters = "";
    for (parameter in configData["parameters"])
    {
        if (configData["parameters"][parameter] == true)
            parameters = parameters.concat(parameter);
    }
    if (parameters == "") parameters = "none";
    console.log("parameters: ", parameters);

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
                if (leaderboardData[artist][album].songName[parameters] == undefined) leaderboardData[artist][album].songName[parameters] = getEmptyLeaderboard();
            }
        } 
    }
    updateLeaderboard(leaderboardData);
    console.log("makeLeaderboardJSON() finished", leaderboardData);
}

async function getWeight() {
    const response = await fetch('../weight.json');
    const weightData = await response.json();
    return weightData;
}

function fetchLeaderboard() {
    fetch('https://swiftguesser.kolin63.com/leaderboard/leaderboard.json')
    .then(response => response.json())
    .then(data => {
        console.log("fetchLeaderboard() finished: ", data);
        leaderboardData = data;
        makeLeaderboardJSON();
    });
}

function updateLeaderboard(updatedLeaderboard) {
    fetch('https://swiftguesser.kolin63.com/leaderboard/leaderboard.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedLeaderboard)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Leaderboard Updated", data.message);
    });
}

function getEmptyLeaderboard() {
    let emptyLeaderboard = [];
    for (let i = 0; i < 10; i++) {
        emptyLeaderboard[i] = {
            "name": "NUL",
            "points": 0
        }
    }
    return emptyLeaderboard;
}
