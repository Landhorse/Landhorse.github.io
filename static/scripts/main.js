var audio, canvas, ctx, context, source, analyser, scrubber;

scrubber = this.document.getElementById("scrubber");
audio = new Audio("/static/music/AllIAsk/AllIAsk.mp3");


window.onload = function () {
    canvas = this.document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    context = new AudioContext();
    
    analyser = context.createAnalyser();
    scrubber.onmouseup = function () {
        // audio.currentTime = scrubber.value;
        console.log(audio.currentTime);
    }
    console.log(scrubber);
}



audio.addEventListener("timeupdate", function () {
    scrubber.value = audio.currentTime;
});

function setTrack() {
    console.log(audio);
    if (audio === undefined || audio.paused) {
        context.resume();
        audio = new Audio("/static/music/Nov17.mp3");
        document.getElementById("audio").appendChild(audio);

        source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(context.destination);
        console.log(audio);
        audio.play();
        FrameLooper();
    } else {
        audio.pause();
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
    let delta = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < fbc_array.length; i += delta) {
        ctx.fillStyle = `hsl(` + i * 360 / fbc_array.length + `, 75%, 70%)`;

        bar_pos = i * canvas.width / fbc_array.length;
        bar_width = 2;
        bar_height = (fbc_array[i] / 2);

        ctx.fillRect(bar_pos, 0, bar_width, bar_height);
    }
}