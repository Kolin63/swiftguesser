var express = require('express');
var fs = require('fs');
var path = require('path');
var cors = require('cors');
const { stringify } = require('querystring');

var app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to the leaderboard JSON file
const leaderboardPath = "leaderboard.json";

// Endpoint to get leaderboard data
app.get("/", (req, res) => {
    fs.readFile(leaderboardPath, function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

// Endpoint to update leaderboard data
app.post("/", (req, res) => {
    fs.writeFile(leaderboardPath, req, function (err) {
        if (err) throw err;
        res.json({ "msg": "Leaderboard Updated!" });
    })
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
