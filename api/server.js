var express = require('express');
var fs = require('fs');
var path = require('path');
var cors = require('cors');

var app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.json({ limit: '1000mb' })); 
app.use(express.urlencoded({ limit: '1000mb' }));

app.use((req, res, next) => {
    const allowedOrigin = "https://swiftguesser.kolin63.com";
    const origin = req.get("origin") || req.get("referer");

    if (origin && origin.startsWith(allowedOrigin)) {
        next();
    } else {
        res.status(403).json({ error: "Forbidden" })
    }
})

// Path to the leaderboard JSON file
const leaderboardPath = path.join(__dirname, 'leaderboard.json');

// Endpoint to get leaderboard data
app.get('/', (req, res) => {
    fs.readFile(leaderboardPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading leaderboard file:', err);
            return res.status(500).json({ error: 'Failed to read leaderboard data' });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to update leaderboard data
app.post('/', (req, res) => {
    const newData = req.body; // Data sent from the frontend
    fs.writeFile(leaderboardPath, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to leaderboard file:', err);
            return res.status(500).json({ error: 'Failed to save leaderboard data' });
        }
        res.json({ message: 'Leaderboard updated successfully!' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
