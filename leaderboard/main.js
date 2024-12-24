document.getElementById('getleaderboard').addEventListener('click', function() {
    fetch('https://swiftguesser.kolin63.com/leaderboard/')
    .then(response => response.json())
    .then(data => {
        console.log('Leaderboard:', data);
        // Display leaderboard on the page
    });
});