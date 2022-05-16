// TRACKLIST
// TODO: Get song names dynamically
const songNames = ["Sep12", "Break Apart", "All I Ask", "Nov17"]

// EQ
const canvas = document.querySelector("#eq");
const ctx = canvas.getContext("2d");

// CONTROL BAR
const scrubber = document.querySelector("#scrubber");
const mainPause = document.querySelector("#pause-button");

// LYRICS
const lyricContainer = document.querySelector("#lyric-container");
const songTitle = document.querySelector("#song-title");
const lyrics = document.querySelector("#lyrics");

var started = false;

var audio, context, source, analyser, scrubberMouseDown, spans, songIdx;

function Start() {
    audio = new Audio("");
    context = new AudioContext();
    analyser = context.createAnalyser();

    source = context.createMediaElementSource(audio);

    songIdx = 0;

    source.connect(analyser);
    analyser.connect(context.destination);

    scrubberMouseDown = false;
    FrameLooper();
}

function SelectSong() {
    if (!started) {
        Start();
        started = true;
    }
    obfName = "".concat(songNames[songIdx].trim().split(" "));
    audio = new Audio("/static/music/" + obfName + "/" + obfName + ".mp3");
}


function FrameLooper() {
    window.RequestAnimationFrame =
        window.requestAnimationFrame(FrameLooper) ||
        window.msRequestAnimationFrame(FrameLooper) ||
        window.mozRequestAnimationFrame(FrameLooper) ||
        window.webkitRequestAnimationFrame(FrameLooper);

    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    let delta = 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "black";
    for (var i = 0; i < fbc_array.length; i += delta) {
        ctx.fillStyle = `hsl(` + i * 360 / fbc_array.length + `, 100%, 50%)`;

        bar_pos = i * canvas.width / fbc_array.length;
        bar_width = 1;
        bar_height = (fbc_array[i] / 2);

        ctx.fillRect(bar_pos, 0, bar_width, bar_height);
    }
}