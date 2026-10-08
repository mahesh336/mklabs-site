// const popup = document.getElementById("devPopup");
// const closePopup = document.getElementById("closePopup");

// let popupOpen = false;
// let lastScrollY = window.scrollY;

// window.addEventListener("scroll", () => {

//     const currentScrollY = window.scrollY;

//     // User is scrolling down
//     if (currentScrollY > lastScrollY && currentScrollY > 300) {

//         // Show popup only if it is currently closed
//         if (!popupOpen) {
//             popup.classList.add("show");
//             popupOpen = true;
//         }

//     }

//     lastScrollY = currentScrollY;

// });

// closePopup.addEventListener("click", () => {

//     popup.classList.remove("show");
//     popupOpen = false;

// });

/* ============================= */
/* VISITOR WELCOME POPUP */
/* ============================= */

document.addEventListener("DOMContentLoaded", function () {

    const popup = document.getElementById("welcomePopup");
    const closeButton = document.getElementById("closeWelcomePopup");

    if (!popup) return;


    // Show popup shortly after page loads

    setTimeout(function () {

        popup.classList.add("show");

    }, 500);


    // Automatically hide after 5 seconds

    const hidePopup = setTimeout(function () {

        popup.classList.remove("show");

    }, 5500);


    // Allow visitor to close it manually

    if (closeButton) {

        closeButton.addEventListener("click", function () {

            popup.classList.remove("show");

            clearTimeout(hidePopup);

        });

    }

});