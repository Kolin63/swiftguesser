document.addEventListener("DOMContentLoaded", function () {
    const template = document.createElement("div");

    template.innerHTML = '<div class="navbar"><a href="/#top" title="Home"><img src="/art/icon-wide-space.svg" class="logo" alt="Swift Guesser"></a><div style="display:flex;justify-content:right;width:100%;align-content:center;"><a href="/play" title="Play"><img src="/art/playbutton.png" class="square" style="scale: 70%;" alt="Play"></a><a href="/#config" title="Config"><img src="/art/config.svg" class="square" alt="Config"></a><a href="/leaderboard" title="Leaderboard"><img src="/art/leaderboard.svg" class="square" alt="Leaderboard"></a></div></div>';
    document.body.appendChild(template);
});
