let configData;
let leaderboardData;

addEventListener('DOMContentLoaded', init);
async function init() {
    configData = getConfig();
    makeLeaderboardJSON();

    console.log("config", configData);
    console.log("leaderboard", leaderboardData);
}

document.getElementById('getleaderboard').addEventListener('click', function() {
    fetch('https://www.swiftguesser.kolin63.com/leaderboard/leaderboard.json')
    .then(response => response.json())
    .then(data => {
        console.log('Leaderboard:', data);
        // Display leaderboard on the page
        leaderboardData = data;
    });
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
    const response = await fetch('config.json');
    const configData = await response.json();
    return configData;
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