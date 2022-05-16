const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");



window.onload = (event) => {
};

function updateRipple(scroll) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    delta = 40;
    scale = 1.1;
    for (let index = 0; index < scroll; index += delta) {
        console.log(index);
        ctx.strokeStyle = `rgba(0, 150, 150, ` + (75 - scroll + index) / 75 + `)`;
        ctx.beginPath();
        ctx.ellipse(140, 60, (100 + scroll - index) / scale, (scroll - index) / (4 * scale), 0, 0, 2 * Math.PI);
        ctx.stroke();

    }

}
