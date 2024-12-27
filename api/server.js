var express = require('express');
var fs = require('fs');
var path = require('path');
var cors = require('cors');

var app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to the leaderboard JSON file
const leaderboardPath = "/leaderboard/api/leaderboard.json";

// Endpoint to get leaderboard data
app.get("/", (req, res) => {
    res.json({ "colin": 63 });
});

// Endpoint to update leaderboard data
app.post("/", (req, res) => {
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
