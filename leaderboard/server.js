// Thanks to ChatGPT for this code :)

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const https = require('https');
const privateKey = fs.readFileSync('/etc/letsencrypt/live/swiftguesser.kolin63.com/privkey.pem');
const certificate = fs.readFileSync('/etc/letsencrypt/live/swiftguesser.kolin63.com/fullchain.pem');

const credentials = { key: privateKey, cert: certificate };
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to the leaderboard JSON file
const leaderboardPath = "~/leaderboard/leaderboard.json";

// Endpoint to get leaderboard data
app.get('/leaderboard/leaderboard.json', (req, res) => {
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
app.post('/leaderboard/leaderboard.json', (req, res) => {
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

const httpsServer = https.createServer(credentials, app);

// Start the server
httpsServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
