let currently_active_modal = null;

function checkForEsc(event) {
    if (event.key === "Escape") {
        closeModal(currently_active_modal);
    }
}

function modalClicked(event) {
    // Stop the event propagating to the overlay
    event.stopPropagation();
}

function showModal(modal_id) {
    let modal = document.getElementById(modal_id);
    let overlay = document.querySelector(
        `[data-modal-overlay-for="${modal_id}"]`,
    );
    let body = document.querySelector("body");

    modal.classList.add("modal-active");
    body.classList.add("no-scroll");

    modal.addEventListener("click", modalClicked);
    document.addEventListener("keydown", checkForEsc);

    currently_active_modal = modal_id;

    // There's definitely better ways to make this optional, but letting it error out this late is also fine
    overlay.classList.add("modal-active");
    overlay.addEventListener("click", closeModal);
}

function closeModal() {
    if (currently_active_modal === null) {
        console.warn("No modal currently open. Quit the funny business.");
        return;
    }

    let modal = document.getElementById(currently_active_modal);
    let overlay = document.querySelector(
        `[data-modal-overlay-for="${currently_active_modal}"]`,
    );
    let body = document.querySelector("body");

    modal.classList.remove("modal-active");
    body.classList.remove("no-scroll");

    modal.removeEventListener("click", modalClicked);
    document.removeEventListener("keydown", checkForEsc);

    currently_active_modal = null;

    // There's definitely better ways to make this optional, but letting it error out this late is also fine
    overlay.classList.remove("modal-active");
    overlay.removeEventListener("click", closeModal);
}
