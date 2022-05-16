const canvas = document.querySelector("#eq");
const ctx = canvas.getContext("2d");
const scrubber = document.querySelector("#scrubber");
const volumeScrubber = document.querySelector("#volume-scrubber");
const volumeSymbol = document.querySelector("#volume-symbol");
const mainPause = document.querySelector("#pause-button");
const songTitle = document.querySelector("#song-title");
const lyrics = document.querySelector("#lyrics");
const lyricContainer = document.querySelector("#lyric-container");
const songNames = ["Sep12", "BreakApart", "AllIAsk", "Nov17", "Jun25"]

var started, audio, context, source, analyser, scrubberMouseDown, currentSong, lastVolume, volumeToggle;


window.onload = (event) => {
    started = false;
    lastVolume = 1;
    volumeToggle = true;
};

function start() {
    audio = new Audio("");
    context = new AudioContext();
    analyser = context.createAnalyser();

    source = context.createMediaElementSource(audio);
    currentSong = null;
    // selectSong(currentSong);

    source.connect(analyser);
    analyser.connect(context.destination);

    scrubberMouseDown = false;

    FrameLooper();
}

function selectSong(song) {
    if (!started) {
        start();
        started = true;
    }
    if (audio !== undefined) audio.pause();
    mainPause.innerHTML = "<i class=\"bi bi-play\"></i>"
    audio = new Audio("/static/music/" + songNames[song] + "/" + songNames[song] + ".mp3");

    scrubber.setAttribute("value", 0);
    audio.addEventListener("loadedmetadata", () => {
        scrubber.setAttribute("max", audio.duration);
        document.querySelector("#duration").innerHTML = formatTime(audio.duration);
    });

    audio.addEventListener("ended", () => {
        forward();
    });

    updateVolume();

    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    if (song !== currentSong) {
        if (currentSong !== null) {
            document.querySelector("#heading" + songNames[currentSong]).children[1].classList.remove("song-active");
            document.querySelector("#heading" + songNames[currentSong]).children[0].innerHTML = "<i class=\"bi bi-play\"></i>";
        }
        document.querySelector("#heading" + songNames[song]).children[1].classList.add("song-active");
        currentSong = song;
    }

    songTitle.innerHTML = songNames[song];
    fetch("/static/music/" + songNames[song] + "/lyrics.html")
        .then(response => response.body)
        .then(rb => {
            const reader = rb.getReader();

            return new ReadableStream({
                start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and value a "Uint8Array"
                        reader.read().then(({ done, value }) => {
                            // If there is no more data to read
                            if (done) {
                                // console.log('done', done);
                                controller.close();
                                return;
                            }
                            // Get the data and send it to the browser via the controller
                            controller.enqueue(value);
                            // Check chunks by logging to the console
                            // console.log(done, value);
                            push();
                        })
                    }

                    push();
                }
            });
        })
        .then(stream => {
            // Respond with our stream
            return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
        })
        .then(result => {
            // Do things with result
            lyrics.innerHTML = result;
        });

    lyrics.scroll(0, 0);
}



function pause() {
    if (!started) {
        start();
        started = true;
    }
    if (audio.paused) {
        audio.play();
        mainPause.innerHTML = "<i class=\"bi bi-pause\"></i>"
        document.querySelector("#heading" + songNames[currentSong]).children[0].innerHTML = "<i class=\"bi bi-pause\"></i>"
    } else {
        audio.pause();
        mainPause.innerHTML = "<i class=\"bi bi-play\"></i>"
        document.querySelector("#heading" + songNames[currentSong]).children[0].innerHTML = "<i class=\"bi bi-play\"></i>"
    }
}

function singlePlay(song) {
    if (song !== currentSong) {
        selectSong(song);
    }
    pause();
}


function backward() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        if (currentSong === 0)
            selectSong(songNames.length - 1);
        else
            selectSong(currentSong - 1);
        pause();
    }
}

function forward() {
    selectSong((currentSong + 1) % songNames.length);
    pause();
}

document.onkeydown = function(e) {
    if (audio !== undefined) {
        if (e.key === "ArrowLeft"){
            audio.currentTime -= 5;
        } else if (e.key === "ArrowRight"){
            audio.currentTime += 5;
        }
    }
    if (e.key === "ArrowUp"){
        volumeScrubber.value = Number(volumeScrubber.value) + 0.1;
        updateVolume();
    } else if (e.key === "ArrowDown"){
        volumeScrubber.value = Number(volumeScrubber.value) - 0.1;
        updateVolume();
    }

}

function updateTime() {
    audio.currentTime = scrubber.value;
}

function toggleVolume() {
    if (volumeToggle) {
        lastVolume = volumeScrubber.value;
        volumeScrubber.value = 0;
        volumeSymbol.classList.remove("bi-volume-up-fill");
        volumeSymbol.classList.add("bi-volume-mute-fill");
        volumeToggle = false;
    } else {
        if (lastVolume !== 0)
            volumeScrubber.value = lastVolume;
        volumeSymbol.classList.remove("bi-volume-mute-fill");
        volumeSymbol.classList.add("bi-volume-up-fill");
        volumeToggle = true;
    }
}

function updateVolume() {
    if ((Number(volumeScrubber.value) === 0) === volumeToggle) {
        toggleVolume();
    }
    if (audio !== undefined) {
        audio.volume = volumeScrubber.value;
    }
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
        bar_height = fbc_array[i] * canvas.height / 256;

        ctx.fillRect(bar_pos, 0, bar_width, bar_height);
    }

    for (let p of lyrics.children) {
        for (let s of p.children) {
            if (s.dataset.time < Number(scrubber.value)) {
                s.removeAttribute('style');
            } else {
                s.setAttribute('style', 'color: white;');
            }
        }
    }
    // if (!audio.paused) {
    //     lyricContainer.scrollTop += 1;
    // }
    if (currentSong !== null)
        document.querySelector("#current-time").innerHTML = formatTime(Number(scrubber.value));
    if (!scrubberMouseDown)
        scrubber.value = audio.currentTime;
    // console.log(audio.currentTime / audio.duration);


    //console.log(scrubberMouseDown);
}

function formatTime(seconds) {
    minutes = Math.floor(seconds / 60);
    // minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}