const playbutton = document.getElementById("playbutton");
const audio = document.getElementById("audio");
const stopwatch = document.getElementById("stopwatch");
const search = document.getElementById("search");
const searchResultBoxes = document.getElementsByClassName("search-result")
const albumCovers = Array.from(document.getElementsByClassName("album-cover"));

let stopwatchMS = 0;
let playing = false;
let stopwatchInterval;

const playbuttontexture = document.getElementById("playbuttontexture");
const playtexture = "art/playbutton.png";
const pausetexture = "art/pause.png";

let configData;
let weightData;
let totalSongs;
let songList;
let songListAlbums;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    configData = await getConfig();
    weightData = await getWeight();
    totalSongs = await getTotalSongs();
    songList = getSongList();
    songListAlbums = getSongListAlbums();

    console.log(songList);
}

search.addEventListener('input', function () {
    const searchValue = search.value.toLowerCase();
    const searchResults = songList.filter(song => song.toLowerCase().includes(searchValue));
    console.log(albumCovers);

    for (let i = 0; i < 3; i++) {
        if (searchResults[i] != undefined) {
            searchResultBoxes[i].textContent = searchResults[i];
            albumCovers[i].src = songListAlbums[songList.indexOf(searchResults[i])];
        } else {
            searchResultBoxes[i].textContent = "";
            albumCovers[i].src = "favicon.ico";
        } 
        console.log(albumCovers[i].src);
    }
});

// Event listener for the play button
playbutton.addEventListener('click', async function () {
    if (!playing) {
        // Start or resume playback
        if (!audio.src) {
            audio.src = await getSong(); // Set the source only once
            audio.load();
        }
        audio.play();
        playbuttontexture.src = pausetexture;

        // Start the stopwatch
        stopwatchInterval = setInterval(() => {
            stopwatchMS = audio.currentTime * 1000; // Update stopwatch with audio's current time in milliseconds
            const seconds = (stopwatchMS / 1000).toFixed(1);
            stopwatch.textContent = makeTimeCode();
        }, 1); // Update every 100ms
    } else {
        // Pause playback and save position
        audio.pause();
        playbuttontexture.src = playtexture;

        // Stop the stopwatch
        clearInterval(stopwatchInterval);
    }

    playing = !playing; // Toggle the playing state
});

async function getSong() {
    const randomSong = getRandomInt(1, totalSongs);

    let songIndex = 1;
    for (artist in configData) {
        for (album in configData[artist]) {
            // skip if the album is disabled in config
            if (!configData[artist][album])
                continue;

            for (song in weightData[artist][album].songs) {
                if (songIndex == randomSong) {
                    return 'music/' + artist + '/' + album + '/' + weightData[artist][album].songs[song] + '.mp3';
                }

                songIndex++;
            }
        }
    }
}

async function getTotalSongs() {
    let totalSongs = 0;

    for (artist in configData) {
        for (album in configData[artist]) {
            // skip if the album is disabled in config
            if (!configData[artist][album])
                continue;

            totalSongs += weightData[artist][album].amount;
        }
    }

    return totalSongs;
}

function getSongList() {
    let list = [];
    for (let artist in configData) {
        for (let album in configData[artist]) {
            if (configData[artist][album]) {
                list = list.concat(weightData[artist][album].songs);
            }
        }
    }
    return list;
}

function getSongListAlbums() {
    let albums = [];
    for (let artist in configData) {
        for (let album in configData[artist]) {
            if (configData[artist][album]) {
                const albumSongs = weightData[artist][album].songs;
                const albumCoverPath = 'music/' + artist + '/' + album + '/cover.jpg';
                albums = albums.concat(albumSongs.map(() => albumCoverPath));
            }
        }
    }
    return albums;
}

async function getConfig() {
    const response = await fetch('config.json');
    const configData = await response.json();
    return configData;
}

async function getWeight() {
    const response = await fetch('weight.json');
    const weightData = await response.json();
    return weightData;
}

function makeTimeCode() {
    let minute = Math.floor(stopwatchMS / 60000);
    let second = Math.floor(stopwatchMS / 1000);
    let millisecond = Math.floor(stopwatchMS % 1000);

    let formattedMinute = minute.toString().padStart(2, '0').padEnd(3, ':');
    let formattedSecond = second.toString().padStart(2, '0').padEnd(3, '.');
    let formattedMillisecond = millisecond.toString().padStart(3, '0');

    let timecode = formattedMinute + formattedSecond + formattedMillisecond;

    return timecode;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}