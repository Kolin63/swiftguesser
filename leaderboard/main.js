document.getElementById('getleaderboard').addEventListener('click', function() {
    fetch('http://localhost:3000/api/leaderboard')
    .then(response => response.json())
    .then(data => {
        console.log('Leaderboard:', data);
        // Display leaderboard on the page
    });
});