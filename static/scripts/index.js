l = document.querySelector("#light");
secret = document.querySelector("#secret");
lastPage = "index"

document.onkeydown = function (e) {
    if (e.key === "/") {
        if (l.classList.contains("hide")) {
            l.classList.remove("hide");
            secret.classList.remove("hide");
        } else {
            l.classList.add("hide");
            secret.classList.add("hide");
        }
    }
}

document.addEventListener("mousemove", (event) => {
    var rect = secret.getBoundingClientRect();
    l.style.left = Math.max(rect.left - l.offsetWidth + 100, Math.min(event.pageX - l.offsetWidth + 100, rect.right - l.offsetWidth + 100)) + "px";
    //l.style.left = (event.pageX - l.offsetWidth) + "px";
    l.style.top = Math.max(rect.top - l.offsetHeight + 100, Math.min(event.pageY - l.offsetHeight + 100, rect.bottom - l.offsetHeight + 100)) + "px";
});

function show(page) {
    p = page.toLowerCase();
    if (lastPage !== p) {
        document.querySelector("#" + p).classList.remove("hide");
        document.querySelector("#" + lastPage).classList.add("hide");
        lastPage = p;
    }
}