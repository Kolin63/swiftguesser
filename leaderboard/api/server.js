// Thanks to ChatGPT for this code :)

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
// app.use(express.json());

// Path to the leaderboard JSON file
const leaderboardPath = "/leaderboard/leaderboard.json";

// Endpoint to get leaderboard data
app.get("/leaderboard", (req, res) => {
    res.send("GET request");
    res.json({ "colin": 63 });
});

// Endpoint to update leaderboard data
app.post("/leaderboard", (req, res) => {
    res.send("POST request");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
