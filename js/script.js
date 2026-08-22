const popup = document.getElementById("devPopup");
const closePopup = document.getElementById("closePopup");

let popupShown = false;

window.addEventListener("scroll", () => {

    if (window.scrollY > 300 && !popupShown) {

        popup.classList.add("show");

        popupShown = true;
    }

});

closePopup.addEventListener("click", () => {

    popup.classList.remove("show");

});