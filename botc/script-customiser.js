// File: script_customiser.js

// Requires: ./character-data.js
//  + utils: drag-and-drop.js

// Globals
let loaded_script = null;
const nights = ["firstNight", "otherNight"];
const array_keys = ["reminders", "globalReminders"];
const int_keys = ["firstNight", "otherNight"];
const bool_keys = ["setup"];
const string_inputs = [
    "name",
    "id",
    "ability",
    "edition",
    "flavor",
    "image",
    "firstNightReminder",
    "otherNightReminder",
];

class ScriptMetaData {
    // Doesn't like being called name
    script_name;
    author = null;
    logo = null;
    hideTitle = null;
    background = null;
    almanac = null;
    bootlegger = null;
    firstNight = null;
    otherNight = null;
}

class Script {
    // Instance of ScriptMetaData
    _meta;
    official_chars = new Array();
    homebrew_chars = new Array();

    get_by_id(char_id) {
        for (let char_type of ["official_chars", "homebrew_chars"]) {
            for (let char of this[char_type]) {
                if (char.id === char_id) {
                    return char;
                }
            }
        }
        return null;
    }
}

function load_JSON_to_textarea(file_input) {
    let file_err = document.querySelectorAll(
        '[data-input-error-for="file-input"]',
    );

    if (file_input.files.length !== 1) {
        file_err.classList.remove("hidden");
        return;
    }

    // Transfer
    let json_input = document.getElementById("json-input");
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        json_input.value = event.target.result;
    });
    reader.readAsText(file_input.files[0]);
}

function validate_meta_object(meta) {
    // Already checked for existence of id and name, and we know id == _meta
    let meta_obj = new ScriptMetaData();

    assert(
        meta["name"].length <= 50,
        "Script name cannot exceed 50 characters",
    );
    meta_obj.script_name = meta["name"];

    if (meta.hasOwnProperty("author")) {
        assert(
            meta["author"].length <= 50,
            "Script author cannot exceed 50 characters",
        );
        meta_obj.author = meta["author"];
    }

    if (meta.hasOwnProperty("bootlegger")) {
        assert(
            typeof meta["bootlegger"] === "array",
            "Bootlegger rules must be specified as an array of strings",
        );
        assert(
            meta["bootlegger"].length <= 10,
            "Script cannot exceed 10 bootlegger rules",
        );
        meta_obj.bootlegger = meta["bootlegger"];
    }

    let nights = ["firstNight", "otherNight"];
    nights.forEach((night) => {
        if (meta.hasOwnProperty(night)) {
            assert(
                Array.isArray(meta[night]),
                night +
                    " order must be specified as an array of ids (including dusk and dawn)",
            );
            assert(
                meta[night].length <= 30,
                "Customised night order cannot exceed 30 entries :shrug:.",
            );
            meta_obj[night] = meta[night];
        }
    });

    return meta_obj;
}

function convert_to_char_object(data_obj, data_type = "JSON") {
    let char_obj = new Character();
    switch (data_type) {
        case "JSON":
            // Expect compliant object
            for (key of Object.keys(char_obj)) {
                if (data_obj.hasOwnProperty(key)) {
                    char_obj[key] = data_obj[key];
                }
            }
            break;
        case "FORM":
            // Assumes name="key" is set on the form
            const array_keys = ["reminders", "globalReminders"];
            const int_keys = ["firstNight", "otherNight"];
            const bool_keys = ["setup"];
            for (key of Object.keys(char_obj)) {
                let values = data_obj.getAll(key);
                if (values.length === 0) {
                    continue;
                }
                if (array_keys.includes(key)) {
                    // Last item is always an empty value
                    values.pop();
                    if (values.length > 0) {
                        char_obj[key] = values;
                    }
                } else {
                    let val = values[0];
                    if (val === "") {
                        // Leave it as null
                        continue;
                    }
                    if (int_keys.includes(key)) {
                        val = parseInt(val);
                    } else if (bool_keys.includes(key)) {
                        val = val === "true";
                    }
                    char_obj[key] = val;
                }
            }
            break;
        default:
            throw new Error(data_type + " is not a known datatype value");
    }
    return char_obj;
}

function validate_script(script) {
    // Validate as a script - we already know it's valid JSON, now use the schema from:
    // https://github.com/ThePandemoniumInstitute/botc-release/blob/main/script-schema.json
    assert(
        Array.isArray(script),
        "The JSON must be an array (square brackets '[]') at top level.",
    );
    assert(
        script.length >= 5,
        "Script array must contain at least 5 entries (including _meta) to be valid :shrug:",
    );
    assert(
        script.length <= 201,
        "Script cannot contain more than 200 characters :shrug:",
    );

    let script_object = new Script();
    script.forEach((element) => {
        switch (typeof element) {
            case "string":
                assert(
                    is_official_character(element),
                    "Did not recognise " +
                        element +
                        " as an official character ID",
                );
                script_object.official_chars.push(
                    get_official_character_object(element),
                );
                break;
            case "object":
                // Either _meta or character
                assert(
                    element.hasOwnProperty("id"),
                    'Object entries must have an "id" field.',
                );
                assert(
                    element.hasOwnProperty("name"),
                    'Object entries must have a "name" field.',
                );
                if (element["id"] == "_meta") {
                    script_object._meta = validate_meta_object(element);
                } else {
                    let char = convert_to_char_object(
                        element,
                        (data_type = "JSON"),
                    );
                    validate_homebrew_character(char);
                    script_object.homebrew_chars.push(char);
                }
                break;
            default:
                throw Error(
                    typeof element +
                        " is not a valid array entry. Options are official character ID, _meta object, or homebrew character object.",
                );
        }
    });
    return script_object;
}

function set_modal_data(char) {
    // Populate the modal's fields with the required data
    if (char !== null) {
        for (key of Object.keys(char)) {
            let input = document.getElementById(`${key}-input`);
            if (input === null) {
                continue;
            }
            input.value = char[key];
            input.dispatchEvent(new Event("change", { bubbles: true }));
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    } else {
        // Set defaults
        for (key of string_inputs) {
            document.getElementById(`${key}-input`).value = null;
        }
        for (key of int_keys) {
            document.getElementById(`${key}-input`).value = 0;
        }
        document.getElementById("team-input").value = "townsfolk";
        document.getElementById("setup-input").checked = false;
        const reminders_input = document.getElementById(
            "reminders-input-first",
        );
        reminders_input.value = null;
        const remindersGlobal_input = document.getElementById(
            "globalReminders-input-first",
        );
        remindersGlobal_input.value = null;

        // Let them know changes have occurred
        for (key of Object.keys(new Character())) {
            let input = document.getElementById(`${key}-input`);
            if (input === null) {
                continue;
            }
            input.dispatchEvent(new Event("change", { bubbles: true }));
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
        [reminders_input, remindersGlobal_input].forEach((input) => {
            input.dispatchEvent(new Event("change", { bubbles: true }));
            input.dispatchEvent(new Event("input", { bubbles: true }));
        });
    }
}

function character_clicked(event) {
    const char_id = event.target
        .closest(".character-box")
        .getAttribute("data-char-id");

    let char = loaded_script.get_by_id(char_id);

    set_modal_data(char);
    showModal("homebrew-char-modal");

    // Store original ID in case it gets changed
    document
        .getElementById("character-submit")
        .setAttribute("data-orig-char-id", char_id);
}

function format_ability_text(original_text) {
    // Also including night reminders
    return original_text;
}

function add_char_to_page(char) {
    console.debug("Examining " + char.name);

    if (is_playable_character(char)) {
        let container = document.getElementById(char.team + "-char-container");
        // Create character display
        let char_box = document.createElement("div");
        char_box.classList.add("character-box", "click-to-homebrew");
        char_box.setAttribute("data-char-id", char.id);
        char_box.addEventListener("click", character_clicked);

        let char_icon = document.createElement("img");
        char_icon.classList.add("icon", "character-icon");
        char_icon.src = get_image_URL(char.id);
        char_box.appendChild(char_icon);

        // Wraps name and ability text together
        let char_text = document.createElement("div");
        char_text.classList.add("character-text");

        let char_name = document.createElement("span");
        char_name.classList.add("character-name");
        char_name.innerText = char.name;
        char_text.appendChild(char_name);

        let char_ability = document.createElement("p");
        char_ability.classList.add("character-ability");
        char_ability.innerText = format_ability_text(char.ability);
        char_text.appendChild(char_ability);

        char_box.appendChild(char_text);

        // Add to page
        add_to_flexgrid_container(char_box, container, (prevent_update = true));
    } else {
        console.error(
            "Sorry, " +
                char.name +
                " is not playable so development hasn't caught up yet.",
        );
        return;
    }
}

function add_night_reminder_to_page(night, night_id) {
    let container = document.getElementById(night + "-container");
    console.debug("container " + container + " was chosen for " + night);

    // Create display
    let reminder_box = document.createElement("div");
    reminder_box.classList.add("night-reminder-box");
    reminder_box.setAttribute("data-botc-script-char-id", night_id);

    let reminder_icon = document.createElement("img");
    reminder_icon.classList.add("icon", "night-reminder-icon");
    reminder_icon.src = get_image_URL(night_id);
    reminder_box.appendChild(reminder_icon);

    // Wrap name and message together
    let reminder_text = document.createElement("div");
    reminder_text.classList.add("night-reminder-text");

    let char_name = document.createElement("span");
    char_name.classList.add("character-name");
    char_name.innerText = get_display_name(night_id);
    reminder_text.appendChild(char_name);

    let char_message = document.createElement("p");
    char_message.classList.add("night-reminder-message");
    char_message.innerText = format_ability_text(
        get_night_reminder(night_id, night),
    );
    reminder_text.appendChild(char_message);

    reminder_box.appendChild(reminder_text);

    // Add to page
    container.appendChild(reminder_box);
}

function fill_night_order(night) {
    let order = loaded_script._meta[night];
    if (order === null) {
        order = new Array();
        // Determine from character priorities
        for (const char of loaded_script.official_chars) {
            if (char[night] !== 0 && char[night] !== null) {
                order.push(char.id);
            }
        }
        for (const char of loaded_script.homebrew_chars) {
            if (char[night] !== 0 && char[night] !== null) {
                order.push(char.id);
            }
        }
        order.push("dawn");
        if (night === "firstNight") {
            order.push("minioninfo", "demoninfo");
        }
        order.sort((a, b) => {
            // Return negative to indicate that a goes before b
            return get_night_priority(a, night) - get_night_priority(b, night);
        });
        // Always goes at the front
        order.unshift("dusk");

        // Add to meta object
        loaded_script._meta[night] = order;
    }

    // Fill the page
    order.forEach((night_id) => {
        add_night_reminder_to_page(night, night_id);
    });

    // Enable drag-and-drop
    let container = document.getElementById(night + "-container");
    make_children_draggable(container, night, night_order_modified);
}

function clear_script_from_page() {
    Object.keys(char_types).forEach((category) => {
        let container = document.getElementById(`${category}-char-container`);
        if (container !== null) {
            container.textContent = "";
        }
    });

    nights.forEach((night) => {
        let container = document.getElementById(`${night}-container`);
        if (container !== null) {
            container.textContent = "";
        }
    });
}

function load_script(script) {
    // Load it in and change page display to suit
    loaded_script = script;
    toggle_show_element("JSON-loader", (hide = true));
    toggle_show_element("script-customiser", (hide = false));
    clear_script_from_page();

    // Fill in meta details
    document.getElementById("script-name").innerText = script._meta.script_name;
    if (script._meta.author !== null) {
        document.getElementById("script-author").innerText =
            script._meta.author;
    }

    // Fill in chars
    script.official_chars.forEach(add_char_to_page);
    script.homebrew_chars.forEach((char) => {
        add_char_to_page(char);
        load_homebrew_character(char);
    });

    // Update char display
    for (team of ["townsfolk", "outsider", "minion", "demon"]) {
        let container = document.getElementById(team + "-char-container");
        update_flexgrid_styling(container);
    }

    // Fill in night order
    let nights = ["firstNight", "otherNight"];
    nights.forEach(fill_night_order);
}

function submit_json() {
    // Basic validation
    let json_input = document.getElementById("json-input");
    let json_err = document.querySelectorAll(
        '[data-input-error-for="json-input"]',
    )[0];
    try {
        if (json_input.value.length === 0) {
            throw SyntaxError("No JSON to parse!");
        }
        let script_data = JSON.parse(json_input.value);
        let script_object = validate_script(script_data);
        load_script(script_object);
    } catch (error) {
        console.error(error);
        json_err.innerText = "Could not handle JSON: " + error.message;
        json_err.classList.remove("hidden");
    }
}

function export_JSON() {
    let output = [];

    // Compile _meta
    let meta_obj = { id: "_meta" };
    for (let key of Object.keys(loaded_script._meta)) {
        if (loaded_script._meta[key] !== null) {
            // Handle script_name variable (thanks JS)
            let saved_key = key == "script_name" ? "name" : key;
            meta_obj[saved_key] = loaded_script._meta[key];
        }
    }
    output.push(meta_obj);

    // Add official char IDs
    for (let char of loaded_script.official_chars) {
        output.push(char.id);
    }

    // Add homebrew characters
    for (let char of loaded_script.homebrew_chars) {
        output.push(char);
    }

    // Convert to downloadable file
    const blob = new Blob([JSON.stringify(output, null, 2)], {
        type: "application/json",
    });

    // Download - we do this by creating a link and clicking it
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = loaded_script._meta.script_name + ".json";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function toggle_show_element(elementID, hide = false) {
    let element = elementID;
    if (typeof element === "string") {
        element = document.getElementById(elementID);
    }
    element.classList.remove("hidden");
    if (hide) {
        element.classList.add("hidden");
    }
}

// Functions with type as one of [homebrew, official]
function add_to_script(char, original_id, type) {
    let to_remove = char.id;
    let message = null;
    if (original_id !== null && char.id !== original_id) {
        message = `Are you sure you want to overwrite "${original_id}" with "${char.id}?"`;
        to_remove = original_id;
    } else if (loaded_script.get_by_id(char.id) !== null) {
        message = `Are you sure you want to overwrite the previous "${char.id}"?`;
    }
    if (message !== null && !confirm(message)) {
        return false;
    }

    // Discard return value as we don't care
    remove_from_script(to_remove);
    loaded_script[`${type}_chars`].push(char);
    return true;
}

function remove_from_script(char_id) {
    ["homebrew_chars", "official_chars"].forEach((char_type) => {
        for (let i = 0; i < loaded_script[char_type].length; i++) {
            let found_char = loaded_script[char_type][i];
            if (found_char.id === char_id) {
                loaded_script[char_type].splice(i, 1);
                return true;
            }
        }
    });
    // Could not find
    return false;
}

function submit_character(event) {
    const original_id = event.target.getAttribute("data-orig-char-id");
    const char_form = document.getElementById("character-editor-form");
    const id_input = document.getElementById("id-input");

    // Enable the field so we can access the value
    const id_input_original_state = id_input.disabled;
    id_input.disabled = false;
    const char_data = new FormData(char_form);

    // Validity checks
    if (!char_form.reportValidity()) {
        id_input.disabled = id_input_original_state;
        return;
    }
    try {
        let char = convert_to_char_object(char_data, (data_type = "FORM"));
        validate_homebrew_character(char);
        id_input.disabled = id_input_original_state;

        // Load into script
        let added = add_to_script(char, original_id, "homebrew");
        if (!added) {
            // Likely due to confirmation dialog failing
            return;
        }

        // Update JS and page
        load_script(loaded_script);
        closeModal("homebrew-char-modal");
        set_modal_data(null);
    } catch (error) {
        console.log("Validation error: " + error);
        let field_id = error.cause["name"];
        let input = document.getElementById(`${field_id}-input`);
        if (input === null) {
            // The reminders and globalReminders fields don't have this ID format
            input = document.querySelectorAll(`input[name="${field_id}"]`)[
                error.cause["index"]
            ];
        }

        // Show the error message
        input.setCustomValidity(error.message);
        char_form.reportValidity();
        id_input.disabled = id_input_original_state;
        return;
    }
}

function update_auto_id() {
    const char_name = document.getElementById("name-input").value;
    const id_input = document.getElementById("id-input");

    // Guard clauses
    if (!document.getElementById("id-name-check").checked) {
        return;
    }
    if (char_name === null || char_name === "") {
        id_input.value = "";
        return;
    }

    // Apply
    id_input.value = char_name_to_id(char_name);
}

function match_night_priority_to_reminder(event) {
    const night_reminder = event.target;
    const night = night_reminder.id.substring(0, 10);
    const night_prio = document.getElementById(night + "-input");
    const prio_label = document.querySelector(`[for="${night}-input"]`);

    if (night_reminder.value === null || night_reminder.value === "") {
        toggle_show_element(night_prio, (hide = true));
        toggle_show_element(prio_label, (hide = true));
        night_prio.value = 0;
    } else {
        toggle_show_element(night_prio, (hide = false));
        toggle_show_element(prio_label, (hide = false));
        night_prio.value = 1;
    }
}

function update_number_reminders(event) {
    const container = event.target.parentElement;
    const type = container.id.split("-", 2)[0];
    let reminder_inputs = container.querySelectorAll("textarea");
    let empty = [];

    for (input of reminder_inputs) {
        if (input.value === null || input.value === "") {
            empty.push(input);
        }
    }

    if (empty.length === 0) {
        // Simple case - add an input
        let new_input = document.createElement("textarea");
        new_input.name = type;
        new_input.cols = "60";
        new_input.rows = "3";
        new_input.maxlength = "500";
        new_input.minlength = "0";
        container.appendChild(new_input);
        new_input.addEventListener("change", update_number_reminders);
        return;
    }

    if (empty.length > 1) {
        // Remove unnecessary empties (avoid the first empty in case it's the first child)
        for (let i = 1; i < empty.length; i++) {
            empty[i].remove();
        }
        // Update list
        reminder_inputs = container.querySelectorAll("input");
    }

    // Bubble up values to make sure the empty input is last
    for (let i = 0; i < reminder_inputs.length - 1; i++) {
        let input = reminder_inputs[i];
        if (input.value === null || input.value === "") {
            input.value = reminder_inputs[i + 1].value;
            reminder_inputs[i + 1].value = null;
        }
    }
}

async function check_image_URL_status() {
    const requestURL = document.getElementById("image-input").value;
    const outputDisplay = document.getElementById("image-input-response-label");

    if (requestURL === null || requestURL === "" || !confirmRequestsAllowed()) {
        outputDisplay.classList.add("hidden");
        return;
    }

    let response = await getURL(
        requestURL,
        (follow_redirects = false),
        (process_as = api.NONE),
    );
    let display = "";
    let message = "";
    let status = "error";

    if (response === null || response.status === 0) {
        display = "FAIL";
        message =
            "Request failed for an unknown reason - check the console (F12) if you need to know.";
    } else {
        if (response.redirected) {
            display = "3xx";
            message = `Request was redirected to ${response.url}`;
            status = "warning";
        } else {
            display = `${response.status}`;
            message = `Request succeeded (i.e. the URL points to something - the rest is your problem)`;
            status = "success";
        }
    }

    // Update page
    outputDisplay.innerText = display;
    outputDisplay.title = message;
    outputDisplay.classList.remove(
        "success-bg",
        "warning-bg",
        "error-bg",
        "hidden",
    );
    outputDisplay.classList.add(`${status}-bg`);
}

function delete_character() {
    const char_id = document.getElementById("id-input").value;
    const char_name = document.getElementById("name-input").value;

    if (
        char_id === null ||
        char_id === "" ||
        !confirm(
            `Are you sure you wish to delete "${char_name}"? This cannot be undone.`,
        )
    ) {
        return;
    }

    remove_from_script(char_id);
    load_script(loaded_script);
    closeModal("homebrew-char-modal");
}

function register_input_callbacks() {
    // File loading changes
    document
        .getElementById("file-input")
        .addEventListener("change", (event) => {
            load_JSON_to_textarea(event.target);
        });

    // JSON manipulation
    document
        .getElementById("json-submit")
        .addEventListener("click", (event) => {
            submit_json();
        });

    document
        .getElementById("export-JSON")
        .addEventListener("click", (event) => {
            export_JSON();
        });

    // Character editor modal
    document.getElementById("name-input").addEventListener("input", (event) => {
        update_auto_id();
    });

    document
        .getElementById("id-name-check")
        .addEventListener("change", (event) => {
            document.getElementById("id-input").disabled = event.target.checked;
            update_auto_id();
        });

    document
        .getElementById("image-input")
        .addEventListener("input", (event) => {
            event.target.classList.add("warning-border");
            if (
                event.target.value === null ||
                event.target.value.length === 0
            ) {
                event.target.classList.remove("warning-border");
            }
        });

    document
        .getElementById("image-input")
        .addEventListener("change", check_image_URL_status);

    document
        .getElementById("firstNightReminder-input")
        .addEventListener("change", match_night_priority_to_reminder);
    document
        .getElementById("otherNightReminder-input")
        .addEventListener("change", match_night_priority_to_reminder);

    document
        .getElementById("reminders-input-first")
        .addEventListener("change", update_number_reminders);
    document
        .getElementById("globalReminders-input-first")
        .addEventListener("change", update_number_reminders);

    document
        .getElementById("character-delete-button")
        .addEventListener("click", delete_character);

    document
        .getElementById("character-submit")
        .addEventListener("click", submit_character);
}

window.addEventListener("load", (event) => {
    register_input_callbacks();
});

// Callbacks
function night_order_modified(event) {
    const char_id = event.target.getAttribute("data-botc-script-char-id");
    const night = event.detail.set;
    const new_index = event.detail.index;
    console.debug(
        "night_order_modified called back with: " +
            `${char_id}, ${night}, ${new_index}`,
    );

    const old_index = loaded_script._meta[night].indexOf(char_id);
    if (old_index == -1) {
        throw new Error(
            `Character "${char_id}" not located in ${night} order:\n${loaded_script._meta}`,
        );
    }
    // Delete
    loaded_script._meta[night].splice(old_index, 1);
    // Add (why are these the same function, JS?)
    loaded_script._meta[night].splice(new_index, 0, char_id);
    console.debug(
        "New order for " + night + " : " + loaded_script._meta[night],
    );
}
