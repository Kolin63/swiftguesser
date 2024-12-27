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
const leaderboardPath = "https://www.swiftguesser.kolin63.com/leaderboard/leaderboard.json";

// Endpoint to get leaderboard data
app.get(leaderboardPath, (req, res) => {
    res.send("GET request");
});

// Endpoint to update leaderboard data
app.post(leaderboardPath, (req, res) => {
    res.send("POST request");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
