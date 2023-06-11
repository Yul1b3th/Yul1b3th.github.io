const modal = document.querySelector('#helpModal');

addEventListener("keyup", (event) => {
    let key = event.key.toLowerCase();
    switch (key) {
        case "h":
            modal.classList.add("show");
            modal.style.display = "block";
            modal.style.paddingLeft = 0;
            setTimeout(() => {
                modal.classList.remove("show");
                modal.style.display = "none";
            }, 20000);
            break;
        case "escape":
            modal.classList.remove("show");
            modal.style.display = "none";
            break;
        default:
            console.log(event);
            break;
    }
});