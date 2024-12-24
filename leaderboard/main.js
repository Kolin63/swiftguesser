let configData;
let leaderboardData;

addEventListener('DOMContentLoaded', init);
async function init() {
    configData = await getConfig();
    leaderboardData = getLeaderboard();
    makeLeaderboardJSON();

    console.log("config", configData);
    console.log("leaderboard", leaderboardData);
}

document.getElementById('getleaderboard').addEventListener('click', function() {
    console.log(leaderboardData);
});

document.getElementById('makeleaderboard').addEventListener('click', function() {
    makeLeaderboardJSON();
});

function makeLeaderboardJSON() {
    console.log("make leaderboard called");
    for (artist in configData) {
        if (artist == "version" || artist == "parameters") continue;
        for (album in configData[artist]) {
            leaderboardData[artist][album] = getEmptyLeaderboard();
            console.log(artist, album);
        } 
    }
    console.log(leaderboardData);
}

async function getConfig() {
    const response = await fetch('../config.json');
    const configData = await response.json();
    return configData;
}

function getLeaderboard() {
    fetch('http://localhost:3000/api/leaderboard')
    .then(response => response.json())
    .then(data => {
        return data;
    });
}

function setLeaderboard(updatedLeaderboard) {
    fetch('https://www.swiftguesser.kolin63.com/leaderboard/leaderboard.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedLeaderboard)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
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