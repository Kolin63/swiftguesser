let changingName = false;
let namePopupStatus = false;
const styles = [
    "visibility:visible;background-color:#EEE",
    "visibility:hidden;padding:0;margin:0;height:0"
]
let playerName = "NUL";

document.addEventListener("DOMContentLoaded", function () {
    const template = document.createElement("div");

    template.innerHTML = `
        <div class="navbar" id="navbar">
            <a href="/#top" title="Home">
                <img src="/art/icon-wide-space.png" class="logo" alt="Swift Guesser" id="navbarlogo">
            </a>

            <div style="display:flex;justify-content:right;width:100%;align-content:center;height:50px">
                <div id="namedisplay">
                    <button id="nametext">NUL</button>
                    <input id="namechange">
                </div>

                <a href="/play" title="Play" class="navbar-link">
                    <img src="/art/playbutton.png" class="square" alt="Play">
                    <p id="navbarplay">Play</p>
                </a>
                <a href="/#config" title="Config" class="navbar-link">
                    <img src="/art/config.svg" class="square" alt="Config">
                    <p id="navbarconfig">Config</p>
                </a>
                <a href="/leaderboard" title="Leaderboard" class="navbar-link">
                    <img src="/art/leaderboard.svg" class="square" alt="Leaderboard">
                    <p id="navbarleaderboard">Leaderboard</p>
                </a>
                <div style="height:0;width:50px"></div>
            </div>
        </div>
    `;
    document.body.appendChild(template);

    const nametext = document.getElementById("nametext");
    const namechange = document.getElementById("namechange");
    namechange.setAttribute("placeholder", "Name");

    playerName = localStorage.getItem("playerName");
    if (playerName == undefined || playerName == null || !playerName) {
        playerName = "NUL";
        localStorage.setItem("playerName", playerName);
    }
    nametext.textContent = playerName;

    nametext.style = styles[0];
    namechange.style = styles[1];

    nametext.addEventListener("click", function () {
        updateChangingName(nametext, namechange);
    });

    namechange.addEventListener("input", function () {
        if (namechange.value.length >= 3) {
            playerName = namechange.value.slice(0, 3);
            localStorage.setItem("playerName", playerName);
            console.log("new name:", playerName);
            updateChangingName(nametext, namechange);
            if (playerName != "NUL" && namePopupStatus) {
                namePopupStatus = false;
                namePopupWrapper.style.visibility = "hidden";
                namechange.style.position = "static";
                namePopup.style.scale = "0";
            }
        }
    })

    const namePopupWrapper = document.createElement("div");
    namePopupWrapper.className = "popup-wrapper";
    namePopupWrapper.id = "name-popup-wrapper";
    namePopupWrapper.style.zIndex = "1";
    namePopupWrapper.style.visibility = "hidden";
    namePopupWrapper.innerHTML = `
        <div id="name-popup-background" class="popup-background"></div>
        <div id="name-popup" class="popup">
            <h1 id="name-popup-title" class="popup-title" style="margin: 50px 0 0 0">Set Your Name</h1>
            <p class="popup-info">Must be 3 characters long</p>
            <p class="popup-info">Will be shown on the leaderboard</p>
            <p class="popup-info">Can be changed at any time in the top-right corner</p>
            <div id="navbar-namechange-target"></div>
        </div> `;
    document.body.appendChild(namePopupWrapper);
    const namePopup = document.getElementById("name-popup");
    namePopup.style.scale = "1";

    setInterval(function () {
        if (playerName == "NUL" && !namePopupStatus) {
            namePopupStatus = true;
            updateChangingName(nametext, namechange);
            namePopupWrapper.style.visibility = "visible";
            namechange.focus();
            namePopup.style.scale = "1";
        }
        if (playerName == "NUL" && namePopupStatus) {
            const targetRect = document.getElementById("navbar-namechange-target").getBoundingClientRect();
            namechange.style.position = "absolute";
            namechange.style.left = (targetRect.left + 400 / 2 - 94 / 2) + "px";
            namechange.style.top = (targetRect.top + 20) + "px";
            document.getElementById("navbar").style.zIndex = "10";
        }
    }, 1000)

    resizeNavbar();
});

window.onresize = resizeNavbar;

function resizeNavbar() {
    const width = window.innerWidth;
    const logo = document.getElementById("navbarlogo");
    const play = document.getElementById("navbarplay");
    const config = document.getElementById("navbarconfig");
    const leaderboard = document.getElementById("navbarleaderboard");

    logo.src = "/art/icon-wide-space.png";
    play.textContent = "Play";
    config.textContent = "Config";
    leaderboard.textContent = "Leaderboard";

    if (width < 1060) {
        play.textContent = "";
        config.textContent = "";
        leaderboard.textContent = "";
    }
    if (width < 860) {
        logo.src = "/art/icon.svg";
    }
}

function updateChangingName(nametext, namechange) {
    changingName = !changingName;
    console.log("changingName:", changingName);

    if (!changingName) {
        nametext.style = styles[0];
        nametext.textContent = playerName;
        namechange.style = styles[1];
    } else {
        nametext.style = styles[1];
        namechange.style = styles[0];

        namechange.value = "";
        namechange.focus();
    }
}
