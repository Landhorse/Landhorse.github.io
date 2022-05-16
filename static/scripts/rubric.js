const audio = document.querySelector("#audio");
const cols = document.getElementsByClassName("col");

window.onload = async function () {
    for (let index = 3; index < cols.length; index++) {
        
        const element = cols[index];
        element.onclick = function () {
            if (element.classList.contains("toggle"))
                element.classList.remove("toggle");
            else {
                element.classList.add("toggle");
                playNote(Math.floor(51 - (index -5)/3));
            }
        }
    }
    var whiteKeys = document.getElementById("white-keys");
    var whiteKeyVals = [40, 42, 44, 45, 47, 49, 51];
    var blackKeys = document.getElementById("black-keys");
    var blackKeyVals = [41, 43, 46, 48, 50];
    for (let index = 0; index < whiteKeys.children.length; index++) {
        const element = whiteKeys.children[index];
        element.onclick = async function() {
            element.classList.add("pressed");
            playNote(whiteKeyVals[index]);
            await sleep(250);
            element.classList.remove("pressed");
        }
    }
    for (let index = 0; index < blackKeys.children.length; index++) {
        const element = blackKeys.children[index];
        element.onclick =async function() {
            element.classList.add("pressed");
            playNote(blackKeyVals[index]);
            await sleep(500);
            element.classList.remove("pressed");
        }
    }
}

function playNote(note) {
    new Audio("http://carolinegabriel.com/demo/js-keyboard/sounds/0" + note + ".wav").play();

}

document.onkeydown = async function(e) {
    if (e.key === " "){
        for (let t = 0; t < 3; t++) {
            for (let index = t; index < cols.length; index+=3) {
                const element = cols[index];
                if (element.classList.contains("toggle")) {
                    playNote(Math.floor(51 - (index -5)/3));
                }
            }
            await (sleep(500));
        }
        console.log("done")
    }
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

