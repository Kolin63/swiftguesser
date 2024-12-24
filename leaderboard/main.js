let configData;

addEventListener('DOMContentLoaded', init);
async function init() {
    configData = getConfig();
    makeLeaderboardJSON();
}

document.getElementById('getleaderboard').addEventListener('click', function() {
    fetch('https://www.swiftguesser.kolin63.com/leaderboard/leaderboard.json')
    .then(response => response.json())
    .then(data => {
        console.log('Leaderboard:', data);
        // Display leaderboard on the page
    });
});

function makeLeaderboardJSON() {
    for (artist in configData) {
        if (artist == "version" || artist == "parameters") continue;
        for (album in configData[artist]) {

        } 
    }
}

async function getConfig() {
    const response = await fetch('config.json');
    const configData = await response.json();
    return configData;
}