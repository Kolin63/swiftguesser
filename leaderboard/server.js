// Thanks to ChatGPT for this code :)

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to the leaderboard JSON file
const leaderboardPath = "/leaderboard/leaderboard.json";

// Endpoint to get leaderboard data
app.get('/leaderboard', (req, res) => {
    res.send("GET request");
    fs.readFile(leaderboardPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading leaderboard file:', err);
            return res.status(500).json({ error: 'Failed to read leaderboard data' });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to update leaderboard data
app.post('/leaderboard', (req, res) => {
    res.send("POST request");
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
