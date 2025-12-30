let current_color = null;
let current_search_params = null;
let posts = null;

/* Accepts a URLSearchParams object with key = val or key = [vals...] */
function set_url_params(params) {
    let param_string = `?${params.toString()}`;

    // In case nothing was added
    if (param_string == "?") {
        param_string = "";
    }
    // We use replace so the user doesn't have to press back repeatedly to leave the page
    window.history.replaceState(null, document.title, `/${param_string}`);
}

// Display the current filter settings
function communicate_to_user() {
    const tag_string = current_search_params.get("tags");
    let tags = [];
    if (tag_string !== null) {
        tags = tag_string.split(",");
    }
    const tag_filters = document.querySelectorAll(".post-tag");
    for (let filter of tag_filters) {
        if (tags.includes(filter.innerText)) {
            filter.classList.add("filter-selected");
        } else {
            filter.classList.remove("filter-selected");
        }
    }
}

function set_post_visibility(post, visible = true) {
    if (visible) {
        post.classList.remove("hidden");
    } else {
        post.classList.add("hidden");
    }
}

function save_user_preference() {
    localStorage.setItem("filter_preference", JSON.stringify(Array.from(current_search_params.entries())));
}

function load_user_preference() {
    let prefs = localStorage.getItem("filter_preference");
    if (prefs === null) {
        return;
    }
    current_search_params = new URLSearchParams(JSON.parse(prefs));
    set_url_params(current_search_params);
}

function filter_from_url(initial = false) {
    current_search_params = new URLSearchParams(window.location.search);
    if (initial && current_search_params.size === 0) {
        load_user_preference();
    }

    posts.forEach((card) => {
        let is_shown = true;

        // Tag filtering
        const tag_string = current_search_params.get("tags");
        if (tag_string !== null) {
            let post_tags = card.getAttribute("data-post-tags").split(",");
            let has_matching_tag = false;
            for (let tag of tag_string.split(",")) {
                if (post_tags.includes(tag)) {
                    has_matching_tag = true;
                    break;
                }
            }
            if (!has_matching_tag) {
                is_shown = false;
            }
        }

        set_post_visibility(card, is_shown);
    });

    communicate_to_user();
    save_user_preference();
}

function tag_filter_clicked (event) {
    let tag = event.target.innerText;
    const tag_string = current_search_params.get("tags");
    let tags = tag_string === null ? [] : tag_string.split(",");
    let index = tags.indexOf(tag);
    if (index === -1) {
        tags.push(tag);
    } else {
        tags.splice(index, 1);
    }
    if (tags.length > 0) {
        current_search_params.set("tags", tags.join(","));
    } else {
        current_search_params.delete("tags");
    }
    set_url_params(current_search_params);
    filter_from_url();
}

function setup_filter_controls() {
    const tag_container = document.getElementById("tag-filter-container");
    let tags = new Set();
    posts.forEach((post) => {
        let post_tags = post.getAttribute("data-post-tags").split(",");
        for (tag of post_tags) {
            tags.add(tag);
        }
    });

    tags.delete("");

    tags.values().forEach((tag) => {
        let tag_div = document.createElement("div");
        tag_div.classList.add("post-tag");
        tag_div.innerText = tag;

        tag_div.addEventListener("click", tag_filter_clicked);

        tag_container.appendChild(tag_div);
    });
}

document.addEventListener("DOMContentLoaded", (load_event) => {
    posts = document.querySelectorAll(".post-preview-card");
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

    // Initial filtering
    setup_filter_controls();
    filter_from_url(initial = true);
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
