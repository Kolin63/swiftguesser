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
    console.log(`Request URL: ${req.url}`);
    console.log(`Content-Length: ${req.headers['content-length']}`);
    next();
});

app.use((req, res, next) => {
    const allowedOrigin = "https://swiftguesser.kolin63.com";
    const origin = req.get("origin") || req.get("referer");

    if (origin && origin.startsWith(allowedOrigin)) {
        next();
    } else {
        res.status(403).json({ error: "Forbidden" });
    }
})

// Helper function to ensure directory and file existence
function ensureDirectoryExistence(artist, album, song) {
    const requiredPath = path.join(__dirname, 'leaderboard', artist, album, song);
    if (!fs.existsSync(requiredPath)) {
        fs.mkdirSync(requiredPath, { recursive: true });
    }
}

function ensureFileExistence(artist, album, song) {
    const requiredPath = path.join(__dirname, 'leaderboard', artist, album, song);
    const emptyLBPath = path.join(__dirname, 'emptyleaderboard.json');
    const leaderboardFilePath = path.join(requiredPath, 'leaderboard.json');

    try {
        try {
            fs.copyFileSync(emptyLBPath, leaderboardFilePath, fs.constants.COPYFILE_EXCL);
        } catch (err) {
            if (err.code == 'EEXIST') {
                // Error -17: File already exists
                return;
            } else {
                console.error('Error Copying Leaderboard File:', err);
            }
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Endpoint to get leaderboard data
app.get('/leaderboard/:artist/:album/:song', async (req, res) => {
    try {
        const { artist, album, song } = req.params;
        ensureDirectoryExistence(artist, album, song);
        ensureFileExistence(artist, album, song);

        const leaderboardPath = path.join(__dirname, 'leaderboard', artist, album, song, 'leaderboard.json');
        console.log(leaderboardPath);

        fs.readFile(leaderboardPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading leaderboard file:', err);
                return res.status(500).json({ error: 'Failed to read leaderboard data' });
            }
            try {
                res.json(data);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                res.status(500).json({ error: 'Invalid JSON format' });
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to update leaderboard data
app.post('/leaderboard/:artist/:album/:song', async (req, res) => {
    try {
        const { artist, album, song } = req.params;
        ensureDirectoryExistence(artist, album, song);
        ensureFileExistence(artist, album, song);

        const leaderboardPath = path.join(__dirname, 'leaderboard', artist, album, song, 'leaderboard.json');
        const newData = req.body; // Data sent from the frontend

        fs.writeFile(leaderboardPath, JSON.stringify(newData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to leaderboard file:', err);
                return res.status(500).json({ error: 'Failed to save leaderboard data' });
            }
            res.json({ message: 'Leaderboard updated successfully!' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function getStatistics() {
    return new Promise((resolve, reject) => {
        const directory = path.join(__dirname, 'stat.json');
        fs.readFile(directory, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading statistics file:', err);
                return reject(err);
            }
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                reject(parseError);
            }
        });
    });
}

app.get('/stat/play/get', async (req, res) => {
    try {
        const data = await getStatistics();
        res.json(data);
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/stat/play/up', async (req, res) => {
    try {
        const directory = path.join(__dirname, 'stat.json');
        const currentData = await getStatistics();
        currentData.plays += 1;

        fs.writeFile(directory, JSON.stringify(currentData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to statistics file:', err);
                return res.status(500).json({ error: 'Failed to save statistics data' });
            }
            console.log("Plays:", currentData.plays);
            res.json(currentData);
        });
    } catch (err) {
        console.error("Error reading or writing to statistics file", err);
        return res.status(500).json({ error: 'Failed to save statistics data' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
