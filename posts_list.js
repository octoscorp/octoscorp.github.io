let current_color = null;

window.addEventListener("load", (load_event) => {
    const posts = document.querySelectorAll(".post-preview-card");
    posts.forEach((card) => {
        card.addEventListener("mouseenter", (event) => {
            let card = event.target.closest(".post-preview-card");
            card.querySelector(".post-preview-excerpt").classList.remove(
                "fade-out",
            );
        });
        card.addEventListener("mouseleave", (event) => {
            let card = event.target.closest(".post-preview-card");
            card.querySelector(".post-preview-excerpt").classList.add(
                "fade-out",
            );
        });

        // Fill image
        const post_id = card.getAttribute("data-post-id");
        while (typeof create_image !== "function") {
            continue;
        }
        current_color = get_random_color(post_id);
        current_color.push(255);

        let gen_url = create_image(
            post_id,
            40,
            10,
            (pixel_callback = pixel_thresholding),
        );
        card.querySelector(".post-preview-bg").style.backgroundImage =
            `url(/assets/images/${post_id}.png), url(${gen_url}), url(/assets/images/post-preview-default.png)`;
    });
});

function pixel_thresholding(channel_values) {
    let avg_brightness =
        (channel_values[0] + channel_values[1] + channel_values[2]) / 3;
    const threshold = 120; // Slightly lower than half to have slight majority white

    // If bright enough, show white pixel - otherwise go default colour
    if (avg_brightness < threshold) {
        return current_color;
    }

    for (let i = 0; i < 3; i++) {
        channel_values[i] = 240;
    }

    return channel_values;
}
