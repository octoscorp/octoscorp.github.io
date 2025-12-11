// File: script_customiser.js

// Requires: ./character-data.js
//  + utils: drag-and-drop.js

// Could be abstracted to another file
function assert(bool, message) {
    if (bool === false) {
        throw Error(message);
    }
}

// Globals
let loaded_script = null;
const nights = ["firstNight", "otherNight"];

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
            // TODO check for dusk/dawn
            assert(
                meta[night].length <= 30,
                "Customised night order cannot exceed 30 entries :shrug:.",
            );
            meta_obj[night] = meta[night];
        }
    });

    // TODO check for logo, hideTitle, background, almanac
    return meta_obj;
}

function convert_to_char_object(data_obj, data_type="JSON") {
    let char_obj = new Character();
    switch (data_type) {
        case "JSON":
            // Expect compliant object
            for(key of Object.keys(char_obj)) {
                if (data_obj.hasOwnProperty(key)) {
                    char_obj[key] = data_obj[key];
                }
            }
            break;
        case "FORM":
            break;
        default:
            throw new Error(data_type + " is not a known datatype value");
    }
    return char_obj;
}

function validate_homebrew_character(char) {
    // Check required fields are non-null
    const required = ["id", "name", "team", "ability"];
    for (field of required) {
        assert(char[field] !== null, `Character ${field} cannot be empty.`)
    }

    assert(char.id.length > 0, "Homebrew character ID cannot be empty.");
    assert(
        char.id.length <= 50,
        "Homebrew character ID cannot exceed 50 characters.",
    );

    assert(char.name.length > 0, "HB char name cannot be empty.");
    assert(char.name.length <= 30, "HB char name cannot exceed 30 chars.");

    assert(
        char_types.hasOwnProperty(char.team),
        "Homebrew char team must be one of: " + Object.keys(char_types),
    );

    assert(
        char.hasOwnProperty("ability"),
        'Homebrew characters must have an "ability" field.',
    );
    assert(char.ability.length > 0, "HB char ability cannot be empty.");
    assert(
        char.ability.length <= 250,
        "HB char name cannot exceed 250 chars.",
    );

    nights.forEach((night) => {
        if (char[night] !== null) {
            assert(
                typeof char[night] === "number",
                "HB char " + night + " field must be integer",
            );
            if (char[night] !== 0) {
                // Wakes on this night - must have reminder!
                assert(
                    char[night + "Reminder"] !== null,
                    `HB char with ${night} value > 0 wakes so must have ${night}Reminder.`,
                );
                assert(
                    typeof char[night + "Reminder"] === "string",
                    "HB char " + night + "Reminder must be a string.",
                );
                assert(
                    char[night + "Reminder"].length > 0,
                    `HB char ${night}Reminder cannot be empty while ${night} is > 0.`,
                );
                assert(
                    char[night + "Reminder"].length <= 500,
                    "HB char " + night + "Reminder cannot exceed 500 chars.",
                );
            }
        } else {
            assert(
                char[night + "Reminder"] === null || char[night + "Reminder"] === "",
                `Character does not wake on ${night} so cannot have ${night}Reminder`
            );
        }
    });

    if (char.reminders !== null) {
        assert(
            Array.isArray(char.reminders),
            "HB char reminders must be an array.",
        );
        char.reminders.forEach((reminder) => {
            assert(
                reminder.length <= 30,
                "HB character reminder token cannot exceed 30 chars.",
            );
        });
    }
    if (char.globalReminders !== null) {
        assert(
            Array.isArray(char.globalReminders),
            "HB char globalReminders must be an array.",
        );
        char.globalReminders.forEach((reminder) => {
            assert(
                reminder.length <= 25,
                "HB character global reminder token cannot exceed 25 chars.",
            );
        });
    }

    // TODO: Check flavor, edition, setup, jinxes, special
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
                    let char = convert_to_char_object(element, data_type="JSON");
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

function format_ability_text(original_text) {
    // Also including night reminders
    // TODO: format for {TOKEN}
    // TODO: format for [SETUP]
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
        // TODO: handle loric/fabled/travellers
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

function load_script(script) {
    // Load it in and change page display to suit
    loaded_script = script;
    toggle_show_element("JSON-loader", (hide = true));
    toggle_show_element("script-customiser", (hide = false));

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
    // TODO: remove night order if it matches default
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

function submit_character(event) {
    const char_form = document.getElementById("character-editor-form");
    const char_data = new FormData(char_form);

    // Validity checks
    if (!char_form.reportValidity()) {
        return;
    }
    try {
        let char = convert_to_char_object(char_data, data_type = "FORM");
    } catch (error) {
        console.error(error);
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

    // Convert to id
    let generated_id = "";
    const alpha_num = /^[A-Za-z0-9]$/i
    for (let char of char_name) {
        if (alpha_num.test(char)) {
            generated_id += char;
        }
    }
    generated_id = generated_id.toLowerCase();

    // Apply
    id_input.value = generated_id;
}

function match_night_priority_to_reminder(event) {
    const night_reminder = event.target;
    const night = night_reminder.id.substring(0, 10);
    const night_prio = document.getElementById(night + "-input");
    const prio_label = document.querySelector(`[for="${night}-input"]`);

    if (night_reminder.value === null || night_reminder.value === "") {
        toggle_show_element(night_prio, hide = true);
        toggle_show_element(prio_label, hide = true);
        night_prio.value = 0;
    } else {
        toggle_show_element(night_prio, hide = false);
        toggle_show_element(prio_label, hide = false);
        night_prio.value = 1;
    }
}

function update_number_reminders(event) {
    const reminder_input = event.target;
    const container = reminder_input.parentElement;
    const type = container.id.split('-', 2)[0];

    if (reminder_input.value === null || reminder_input.value === "") {
        // Don't remove last item
        if (reminder_input.id !== null) {
            return;
        }
        reminder_input.remove();
    } else {
        let new_input = document.createElement("input");
        new_input.type = "text";
        new_input.name = type + "[]";
        new_input.maxlength = "500";
        new_input.minlength = "0";
        container.appendChild(new_input);
        new_input.addEventListener("change", update_number_reminders);
    }
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
    document
        .getElementById("name-input")
        .addEventListener("input", (event) => {
            update_auto_id();
        });

    document
        .getElementById("id-name-check")
        .addEventListener("change", (event) => {
            document.getElementById("id-input").disabled = event.target.checked;
            update_auto_id();
        });

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
        .getElementById("remindersGlobal-input-first")
        .addEventListener("change", update_number_reminders);

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
        // TODO: Raise error!
        return;
    }
    // Delete
    loaded_script._meta[night].splice(old_index, 1);
    // Add (why are these the same function, JS?)
    loaded_script._meta[night].splice(new_index, 0, char_id);
    console.debug(
        "New order for " + night + " : " + loaded_script._meta[night],
    );
}
