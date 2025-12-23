window.addEventListener("load", (load_event) => {
    document.querySelectorAll(".post-preview-card").forEach((card) => {
        card.addEventListener("mouseenter", (event) => {
            let card = event.target.closest(".post-preview-card");
            card.querySelector(".post-preview-excerpt").classList.remove("fade-out");
        });
        card.addEventListener("mouseleave", (event) => {
            let card = event.target.closest(".post-preview-card");
            card.querySelector(".post-preview-excerpt").classList.add("fade-out");
        });
    });
});