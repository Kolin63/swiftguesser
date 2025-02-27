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

                <a href="/play" title="Play" class="navbar-link" id="navbarplay-link">
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
    getPlayCounter();
});

window.onresize = resizeNavbar;

function resizeNavbar() {
    const width = window.innerWidth;
    const logo = document.getElementById("navbarlogo");
    const play = document.getElementById("navbarplay");
    const config = document.getElementById("navbarconfig");
    const leaderboard = document.getElementById("navbarleaderboard");

    logo.src = "/art/icon-wide-space.png";
    play.style.visibility = "visible";
    play.style.position = "static";
    config.textContent = "Config";
    leaderboard.textContent = "Leaderboard";

    if (width < 1060) {
        play.style.visibility = "hidden";
        play.style.position = "fixed";
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

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

async function getPlayCounter()
{
    try {
        await fetch("https://api.swiftguesser.kolin63.com/stat/play/get")
            .then(response => {
                if (!response.ok) {
                    console.error("Error getting play counter " + response.status);
                }
                return response.json();
            })
            .then(async json => {
                const plays = json.plays;
                const playText = "Play (" + plays + ")"; 
                console.log("Plays: " + plays);
                document.getElementById("navbarplay-link").title = playText;
                document.getElementById("navbarplay").textContent = playText;
            });
    } catch (err) {
        console.error("Error getting play counter (bottom) " + err);
    }
}
