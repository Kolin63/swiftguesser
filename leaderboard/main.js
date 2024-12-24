let weightData;
let leaderboardData = {};

addEventListener('DOMContentLoaded', init);
async function init() {
    weightData = await getWeight();
    fetchLeaderboard()
}

document.getElementById('getleaderboard').addEventListener('click', function() {
    console.log(leaderboardData);
});

document.getElementById('makeleaderboard').addEventListener('click', function() {
    makeLeaderboardJSON();
});

// This function is here for developer purposes
function makeLeaderboardJSON() {
    for (artist in weightData) {
        // Create a new object for the artist
        if (leaderboardData[artist] == undefined) leaderboardData[artist] = {};

        for (album in weightData[artist]) {
            // Create a new object for the album
            if (leaderboardData[artist][album] == undefined) leaderboardData[artist][album] = {};

            for (song in weightData[artist][album].songs) {
                // Create a new object for the song
                const songName = weightData[artist][album].songs[song];
                if (leaderboardData[artist][album][songName] == undefined) leaderboardData[artist][album][songName] = getEmptyLeaderboard();
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

async function fetchLeaderboard() {
    fetch('https://www.swiftguesser.kolin63.com/leaderboard/leaderboard.json')
    .then(response => response.json())
    .then(data => {
        console.log("fetchLeaderboard() finished: ", data);
        leaderboardData = data;
        makeLeaderboardJSON();
    });
}

async function updateLeaderboard(updatedLeaderboard) {
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