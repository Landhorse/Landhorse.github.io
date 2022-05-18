const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const delta = 50;
const scale = 1.1;


window.onload = (event) => {
};

function updateRipple(scroll) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    
    for (let index = 0; index < scroll; index += delta) {
        console.log(index);
        ctx.strokeStyle = `rgba(0, 150, 150, ` + (75 - scroll + index) / 75 + `)`;
        ctx.beginPath();
        ctx.ellipse((canvas.width + 10)/2, (canvas.height + 10)/2, (100 + scroll - index) / scale, (scroll - index) / (4 * scale), 0, 0, 2 * Math.PI);
        ctx.stroke();

    }

}
