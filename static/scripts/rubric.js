var keys = [];

window.onload = async function () {
    setColClicks();
    keyNum = 1354;
    whiteIdx = 0;
    blackIdx = 0;
    var whiteKeys = document.getElementById("white-keys").children;
    var blackKeys = document.getElementById("black-keys").children;
    for (let index = 0; index < 12; index++) {
        if ((keyNum & 1) === 0)
            keys.push(whiteKeys[whiteIdx++]);
        else
            keys.push(blackKeys[blackIdx++]);
        keys[keys.length - 1].onclick = async function () {
            keys[index].classList.add("pressed");
            playNote(index + 40);
            await sleep(250);
            keys[index].classList.remove("pressed");
        }
        keyNum>>=1;
    }
}

function setColClicks() {
    const cols = document.getElementsByClassName("col");
    rowLen = cols.length / 13;
    for (let index = 0; index < cols.length; index++) {
        const element = cols[index];
        if (index > rowLen - 1) {
            element.onclick = function () {
                if (element.classList.contains("toggle"))
                    element.classList.remove("toggle");
                else {
                    element.classList.add("toggle");
                    keys[Math.floor(12 - (index - rowLen + 1) / rowLen)].onclick();
                }
            }
        }
    }
}

function playNote(note) {
    new Audio("http://carolinegabriel.com/demo/js-keyboard/sounds/0" + note + ".wav").play();
}

async function playAll() {
    const cols = document.getElementsByClassName("col");
    rowLen = cols.length / 13;
    for (let t = 0; t < rowLen; t++) {
        for (let index = t; index < cols.length; index += rowLen)
            if (cols[index].classList.contains("toggle"))
                keys[Math.floor(12 - (index - rowLen + 1) / rowLen)].onclick();
        await (sleep(500));
    }
}

function clearCols() {
    const cols = document.getElementsByClassName("col");
    for (let index = 0; index < cols.length; index++) {
        const element = cols[index];
        if (element.classList.contains("toggle"))
            element.classList.remove("toggle");
    }
}

function addCol() {
    rows = document.querySelectorAll(".row");
    const col = document.createElement("div");
    col.classList.add("col");
    rows[0].appendChild(col);
    for (let index = 1; index < rows.length; index++) {
        const element = rows[index];
        const col = document.createElement("div");
        col.classList.add("col");
        element.appendChild(col);
    }
    setColClicks();
}

function remCol() {
    rows = document.querySelectorAll(".row");
    if (rows[0].children.length > 3) {
        rows.forEach((element) => {
            element.children[element.children.length - 1].remove();
        });
    }
    setColClicks();
}

document.onkeydown = async function (e) {
    const keyboard = ["a","w","s","e","d","f","t","g","y","h","u","j"];
    if (e.key === " ") {
        playAll();
    } else if (e.key === "Backspace") {
        clearCols();
    } else if (e.key === "=") {
        addCol();
    } else if (e.key === "-") {
        remCol();
    } else if (keyboard.includes(e.key)){
        keys[keyboard.indexOf(e.key)].onclick();
    } else if (e.key === "Shift") {
        document.querySelector("#add-button").classList = ["bi bi-dash"];
        document.querySelector("#add-button").onclick = remCol;
    }
    //console.log(e.key);
}

document.onkeyup = function(e) {
    if (e.key === "Shift") {
        document.querySelector("#add-button").classList = ["bi bi-plus"];
        document.querySelector("#add-button").onclick = addCol;
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

