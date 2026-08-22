const popup = document.getElementById("devPopup");
const closePopup = document.getElementById("closePopup");

let popupOpen = false;
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {

    const currentScrollY = window.scrollY;

    // User is scrolling down
    if (currentScrollY > lastScrollY && currentScrollY > 300) {

        // Show popup only if it is currently closed
        if (!popupOpen) {
            popup.classList.add("show");
            popupOpen = true;
        }

    }

    lastScrollY = currentScrollY;

});

closePopup.addEventListener("click", () => {

    popup.classList.remove("show");
    popupOpen = false;

});