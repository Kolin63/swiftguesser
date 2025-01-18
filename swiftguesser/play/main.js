const playbutton = document.getElementById("playbutton");
const audio = document.getElementById("audio");
const stopwatch = document.getElementById("stopwatch");
const search = document.getElementById("search");
const searchBackground = document.getElementById("search-background");
let searchResultBoxes = document.getElementsByClassName("search-result");
const albumCovers = Array.from(document.getElementsByClassName("album-cover")); // Convert to array
const pointsDisplay = document.getElementById('points');
let points = 999;

let stopwatchMS = 0;
let playing = false;
let stopwatchInterval;

const playbuttontexture = document.getElementById("playbuttontexture");
const playtexture = "../art/playbutton.png";
const pausetexture = "../art/pause.png";

let configData;
let weightData;
let totalSongs;
let songList;
let songListAlbums;
let randomSong;
let randomSongName;
let randomSongAlbum;
let randomSongArtist;

let selectedIndex = -1;


// This function is called when the page is loaded
// It fetches the configuration and weight data, and initializes the song list
document.addEventListener('DOMContentLoaded', init);
async function init() {
    localStorage.setItem("win", "");

    configData = JSON.parse(localStorage.getItem('config'));
    weightData = await getWeight();
    totalSongs = await getTotalSongs();
    songList = getSongList();
    songListAlbums = getSongListAlbums();
    randomSong = await getSong();

    pointsDisplay.textContent = points;
    
    audio.src = randomSong; 
    audio.load();

    console.log("song list", songList);
    console.log("config", configData);
}

// Event listener for the search bar being typed in
search.addEventListener('input', function () {
    const searchValue = search.value.toLowerCase().replace(/[^\w\s-]/gi, '').replace(/-/g, ' '); // Remove punctuation and replace hyphens with spaces
    const searchResults = songList.map((song, index) => {
        const normalizedSong = song.toLowerCase().replace(/[^\w\s-]/gi, '').replace(/-/g, ' ');
        const relevance = getRelevance(normalizedSong, searchValue);
        return { song, index, relevance };
    }).filter(result => result.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance); // Sort by relevance

    // Clear previous search result boxes
    searchResultBoxes = [];
    var searchBackgroundChildren = searchBackground.children;
    for (let i = 0; i < searchBackgroundChildren.length; i++) {
        if (searchBackgroundChildren[i].className == "search-result") {
            searchBackground.removeChild(searchBackgroundChildren[i]);
            i--;
        }
    }

    if (searchValue == "") return;

    for (let i = 0; i < searchResults.length; i++) {
        // Create a search result box
        const box = document.createElement("button");
        box.className = "search-result";

        // Create an image element for the album cover
        const img = document.createElement("img");
        img.src = songListAlbums[searchResults[i].index];
        img.className = "album-cover";
        box.appendChild(img);

        // Create a text node for the song name
        box.appendChild(document.createTextNode(searchResults[i].song));

        // Append the search result box to the search background
        searchResultBoxes.push(box);
        searchBackground.appendChild(box);
    }

    // Function called when a search result box is clicked
    Array.from(searchResultBoxes).forEach(box => {
        box.addEventListener('click', function () {
            audio.pause();
            
            const boxSong = box.textContent;

            if (boxSong == "" || stopwatchMS == 0) return;

            document.getElementById("popup-wrapper").style.opacity = 100;
            const popupInfo = document.getElementsByClassName("popup-info");
            const popupTitle = document.getElementById("popup-title");
            const popupButton = document.getElementById("popup-button");

            popupInfo[0].textContent = "Song: " + randomSongName;
            popupInfo[1].textContent = "Album: " + randomSongAlbum;
            popupInfo[2].textContent = "Artist: " + randomSongArtist;
            popupInfo[3].textContent = "Points: " + points;

            if (boxSong == randomSongName) {
                localStorage.setItem("win", JSON.stringify([randomSongArtist, randomSongAlbum, randomSongName, points]));
                popupTitle.textContent = "Correct!";
                popupButton.addEventListener("click", function () {
                    window.location.href = '../leaderboard';
                })
            }
            else {
                popupTitle.textContent = "Incorrect!";
                popupButton.addEventListener("click", function () {
                    location.reload();
                })
            }

            document.addEventListener("keydown", event => {
                const key = event.key;
                if (key == " " || key == "Enter") {
                    popupButton.click();
                }
            })
        });
    });
});

function getRelevance(song, searchValue) {
    let relevance = 0;
    const searchWords = searchValue.split(' ');

    searchWords.forEach(word => {
        if (song == searchValue) {
            relevance += 5;
        } else if (song.startsWith(word)) {
            relevance += 3; // Higher score for matches at the start
        } else if (song.includes(word)) {
            relevance += 1; // Lower score for matches elsewhere
        }
    });

    return relevance;
}

// Event listener for the play button
playbutton.addEventListener('click', async function () {
    togglePlay();
});

function togglePlay() {
    const shorthand = {
        "nopause": configData["parameters"]["data"]["nopause"].value,
        "onepause": configData["parameters"]["data"]["onepause"].value
    }

    if (!playing) {
        if (shorthand["onepause"] && stopwatchMS != 0) return;

        audio.play();
        playbuttontexture.src = pausetexture;

        // Start the stopwatch
        stopwatchInterval = setInterval(() => {
            stopwatchMS = audio.currentTime * 1000; // Update stopwatch with audio's current time in milliseconds
            const seconds = (stopwatchMS / 1000).toFixed(1);
            stopwatch.textContent = makeTimeCode();
            points = Math.ceil(Math.max(0-999 / 45 * seconds + 999, 1));
            pointsDisplay.textContent = points;
        }, 1); // Update every 1ms

        playing = !playing;
    } else {
        if (shorthand["nopause"]) return;

        // Pause playback and save position
        audio.pause();
        playbuttontexture.src = playtexture;

        // Stop the stopwatch
        clearInterval(stopwatchInterval);

        playing = !playing; 
    }
}

document.addEventListener('keydown', event => {
    const key = event.key;

    if (key === 'ArrowUp') {
        selectedIndex = Math.max(selectedIndex-1, -1);

        if (selectedIndex == -1) 
            search.focus();
        else
            searchResultBoxes[selectedIndex].focus();

    }
    else if (key === 'ArrowDown') {
        selectedIndex = Math.min(selectedIndex+1, searchResultBoxes.length-1); 
        searchResultBoxes[selectedIndex].focus();
    }
    else if (event.ctrlKey && key === ' ') {
        // Ctrl+Space
        togglePlay();
    }
    else if (key === 'Enter') {
        // Handle Enter key to select the highlighted search result
        if (selectedIndex == -1) {
            searchResultBoxes[0].click();
        }
        if (selectedIndex >= 0 && selectedIndex <= 2) {
            searchResultBoxes[selectedIndex].click();
        }
    }
    else {
        selectedIndex = -1;
        search.focus();
    }
});

// Gets a random song
async function getSong() {
    randomSong = getRandomInt(1, totalSongs);

    let songIndex = 1;
    for (artist in configData) {
        if (artist == "version" || artist == "parameters") continue;
        for (album in configData[artist]["data"]) {
            // skip if the album is disabled in config
            if (!configData[artist]["data"][album].value)
                continue;

            for (song in weightData[artist][album].songs) {
                if (songIndex == randomSong) {
                    randomSongName = weightData[artist][album].songs[song];
                    randomSongAlbum = album;
                    randomSongArtist = artist;
                    return 'music/' + artist + '/' + album + '/' + weightData[artist][album].songs[song] + '.mp3';
                }

                songIndex++;
            }
        }
    }

}

// Gets the total number of songs
async function getTotalSongs() {
    let totalSongs = 0;

    for (artist in configData) {
        if (artist == "version" || artist == "parameters") continue;
        for (album in configData[artist]["data"]) {
            // skip if the album is disabled in config
            if (!configData[artist]["data"][album].value)
                continue;

            totalSongs += weightData[artist][album].amount;
        }
    }

    return totalSongs;
}

// Gets all song names in a list
function getSongList() {
    let list = [];
    for (let artist in configData) {
        if (artist == "version" || artist == "parameters") continue;
        for (let album in configData[artist]["data"]) {
            if (configData[artist]["data"][album].value) {
                list = list.concat(weightData[artist][album].songs);
            }
        }
    }
    return list;
}

// Gets the album cover paths for all songs in a list
function getSongListAlbums() {
    let albums = [];
    for (let artist in configData) {
        if (artist == "version" || artist == "parameters") continue;
        for (let album in configData[artist]["data"]) {
            if (configData[artist]["data"][album].value) {
                const albumSongs = weightData[artist][album].songs;
                const albumCoverPath = 'music/' + artist + '/' + album + '/cover.jpg';
                albums = albums.concat(albumSongs.map(() => albumCoverPath));
            }
        }
    }
    return albums;
}

async function getWeight() {
    const response = await fetch('../weight.json');
    const weightData = await response.json();
    return weightData;
}

// Formats stopwatch
function makeTimeCode() {
    let minute = Math.floor(stopwatchMS / 60000);
    let second = Math.floor((stopwatchMS / 1000) % 60);
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
