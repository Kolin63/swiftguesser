let weightData;
let leaderboardData = {};

addEventListener('DOMContentLoaded', init);
async function init() {
    weightData = await getWeight();
    leaderboardData = await getLeaderboard();
    console.log("immediate leaderboardData", leaderboardData);
    makeLeaderboardJSON();

    console.log("weight", weightData);
    console.log("leaderboard", leaderboardData);
}

document.getElementById('getleaderboard').addEventListener('click', function() {
    console.log(leaderboardData);
});

document.getElementById('makeleaderboard').addEventListener('click', function() {
    makeLeaderboardJSON();
});

function makeLeaderboardJSON() {
    console.log("make leaderboard called", leaderboardData);
    for (artist in weightData) {
        for (album in weightData[artist]) {
            for (song in weightData[artist][album].songs) {
                const songName = weightData[artist][album].songs[song];
                leaderboardData[artist][album] = {
                    "name": "NUL",
                    "points": 0
                }
                console.log(leaderboardData);
            }
            console.log(artist, album);
        } 
    }
    console.log(leaderboardData);
}

async function getWeight() {
    const response = await fetch('../weight.json');
    const weightData = await response.json();
    return weightData;
}

async function getLeaderboard() {
    fetch('https://www.swiftguesser.kolin63.com/leaderboard/leaderboard.json')
    .then(response => response.json())
    .then(data => {
        console.log("getLeaderboard(): ", data);
        return data;
    });
}

async function setLeaderboard(updatedLeaderboard) {
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