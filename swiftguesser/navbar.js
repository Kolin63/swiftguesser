let changingName = false;
const styles = [
    "visibility:visible;background-color:#EEE",
    "visibility:hidden;padding:0;margin:0;height:0"
]
let playerName = "NUL";

document.addEventListener("DOMContentLoaded", function () {
    const template = document.createElement("div");

    template.innerHTML = `
        <div class="navbar">
            <a href="/#top" title="Home">
                <img src="/art/icon-wide-space.svg" class="logo" alt="Swift Guesser">
            </a>

            <div style="display:flex;justify-content:right;width:100%;align-content:center;">
                <div id="namedisplay">
                    <button id="nametext">NUL</button>
                    <input id="namechange">
                </div>

                <a href="/play" title="Play">
                    <img src="/art/playbutton.png" class="square" alt="Play">
                </a>
                <a href="/#config" title="Config">
                    <img src="/art/config.svg" class="square" alt="Config">
                </a>
                <a href="/leaderboard" title="Leaderboard">
                    <img src="/art/leaderboard.svg" class="square" alt="Leaderboard">
                </a>
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
        }
    })

    setInterval(function () {
        if (playerName == "NUL" && nametext.style.backgroundColor == "rgb(238, 238, 238)") {
            nametext.style.backgroundColor = "rgb(255, 0, 0)"
        } else {
            nametext.style.backgroundColor = "rgb(238, 238, 238)"
        }
    }, 1000)
});

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
