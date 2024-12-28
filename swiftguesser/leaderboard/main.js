let weightData;
let configData;
let leaderboardData;

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

const configBox = document.getElementById("config");

function buildConfig() {
    for (artist in configData) {
        if (artist != "parameters") continue;

        // Creates header for each artist / category
        const headercheck = document.createElement("input");
        headercheck.type = "checkbox";
        headercheck.id = "check" + artist;
        headercheck.name = "check" + artist;
        headercheck.className = "headercheck";
        headercheck.artist = artist;
        headercheck.checked = orArtist(configData[artist]);
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
            check.checked = configData[artist][album];


            const label = document.createElement("label");
            label.for = "check" + artist + album;
            label.textContent = album;


            const bullet = document.createElement("li");
            bullet.appendChild(check);
            bullet.appendChild(label);

            configBox.appendChild(bullet);  

            // Adds event listeners to checks
            check.addEventListener('change', function() {
                configData[check.artist][check.album] = check.checked;
                headercheck.checked = orArtist(configData[check.artist]);
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

function songSelectChange() {
    const container = document.getElementById("leaderboard-container");
    container.innerHTML = '';

    const songLB = parseLeaderboardString(leaderboardData[artistSelect.value][albumSelect.value][songSelect.value]["none"]);
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
    // Make a string representing enabled parameters
    let parameters = "";
    for (parameter in configData["parameters"])
    {
        if (configData["parameters"][parameter] == true)
            parameters = parameters.concat(parameter).concat(',');
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

// pass it as configData[artist]
function orArtist(artist) {
    let or = false;
    for (album in artist) {
        or = or || artist[album];
    }
    return or;
}

