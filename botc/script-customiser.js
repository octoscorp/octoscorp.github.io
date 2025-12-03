// File: script_customiser.js

// TODO: use import syntax if Jekyll supports not changing the MIME type
// Requires: ./character-data.js

// Could be abstracted to another file
function assert(bool, message) {
    if (bool === false) {
        throw Error(message);
    }
}

// Globals
let loaded_script = null;

function load_JSON_to_textarea(file_input) {
    let file_err = document.querySelectorAll('[data-input-error-for="file-input"]');

    if (file_input.files.length !== 1) {
        file_err.classList.remove("hidden");
        return;
    }

    // Transfer
    let json_input = document.getElementById("json-input");
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        json_input.value = event.target.result;
    });
    reader.readAsText(file_input.files[0]);
}

function validate_meta_object(meta) {
    // Already checked for existence of id and name, and we know id == _meta
    assert(meta["name"].length <= 50, "Script name cannot exceed 50 characters");

    if (meta.hasOwnProperty("author")) {
        assert(meta["author"].length <= 50, "Script author cannot exceed 50 characters");
    }

    if (meta.hasOwnProperty("bootlegger")) {
        assert(typeof meta["bootlegger"] === "array", "Bootlegger rules must be specified as an array of strings");
        assert(meta["bootlegger"].length <= 10, "Script cannot exceed 10 bootlegger rules");
    }

    let nights = ["firstNight", "otherNight"];
    nights.forEach((night) => {
        if (meta.hasOwnProperty(night)) {
            assert(typeof meta[night] === "array", night + "order must be specified as an array of ids (including dusk and dawn)");
            // TODO check for dusk/dawn
            assert(meta[night].length <= 30, "Night order cannot exceed 30 entries.");
        }
    });

    // TODO check for logo, hideTitle, background, almanac
}

function validate_homebrew_character(char) {
    // Already checked for existence of id and name, check for the other requirements
    assert(char["id"].length > 0, "Homebrew character ID cannot be empty.");
    assert(char["id"].length <= 50, "Homebrew character ID cannot exceed 50 characters.");

    assert(char["name"].length > 0, "HB char name cannot be empty.");
    assert(char["name"].length <= 30, "HB char name cannot exceed 30 chars.");

    assert(char.hasOwnProperty("team"), "Homebrew characters must have a \"team\" field - one of: " + char_types);
    assert(char_types.includes(char["team"]), "Homebrew char team must be one of: " + char_types);

    assert(char.hasOwnProperty("ability"), "Homebrew characters must have an \"ability\" field.");
    assert(char["ability"].length > 0, "HB char ability cannot be empty.");
    assert(char["ability"].length <= 250, "HB char name cannot exceed 250 chars.");

    let nightReminders = ["firstNight", "otherNight"];
    nightReminders.forEach((night) => {
        if (char.hasOwnProperty(night)) {
            assert(typeof char[night] === "int", "HB char " + night + " field must be integer");
            if (char[night] !== 0) {
                // Wakes on this night - must have reminder!
                assert(char.hasOwnProperty(night + "Reminder"), "HB char with " + night + " value > 0 wakes so must have " + night + "Reminder.");
                assert(typeof char[night + "Reminder"] === "string", "HB char " + night + "Reminder must be a string.");
                assert(char[night + "Reminder"].length > 0, "HB char " + night + "Reminder cannot be empty while " + night + " is > 0.");
                assert(char[night + "Reminder"].length <= 500, "HB char " + night + "Reminder cannot exceed 500 chars.");
            }
        }
    });

    if (char.hasOwnProperty("reminders")) {
        assert(Array.isArray(char["reminders"]), "HB char reminders must be an array.");
        char["reminders"].forEach((reminder) => {
            assert(reminder.length <= 30, "HB character reminder token cannot exceed 30 chars.");
        });
    }
    if (char.hasOwnProperty("globalReminders")) {
        assert(Array.isArray(char["globalReminders"]), "HB char globalReminders must be an array.");
        char["globalReminders"].forEach((reminder) => {
            assert(reminder.length <= 25, "HB character global reminder token cannot exceed 25 chars.");
        });
    }

    // TODO: Check flavor, edition, setup, jinxes, special
}

function validate_script(script) {
    // Validate as a script - we already know it's valid JSON, now use the schema from:
    // https://github.com/ThePandemoniumInstitute/botc-release/blob/main/script-schema.json
    assert(Array.isArray(script), "The JSON must be an array (square brackets '[]') at top level.");
    assert(script.length >= 5, "Script array must contain at least 5 entries (including _meta) to be valid :shrug:");
    assert(script.length <= 201, "Script cannot contain more than 200 characters :shrug:");

    script.forEach((element) => {
        switch (typeof element) {
            case "string":
                assert(is_official_character(element), "Top-level string entries must be an official character ID");
                break;
            case "object":
                // Either _meta or character
                assert(element.hasOwnProperty("id"), "Object entries must have an \"id\" field.");
                assert(element.hasOwnProperty("name"), "Object entries must have a \"name\" field.");
                if (element["id"] == "_meta") {
                    validate_meta_object(element);
                } else {
                    validate_homebrew_character(element);
                }
                break;
            default:
                throw Error(typeof element + " is not a valid array entry. Options are official character ID, _meta object, or homebrew character object.");
        }
    });
    return;
}

function load_script(script) {
    // Load it in and change page display to suit
    loaded_script = script;
    toggle_show_JSON_loader(hide=true);
    toggle_show_script_customiser();
    alert("In theory, JSON loaded and customiser being shown");
}

function submit_json() {
    // Basic validation
    let json_input = document.getElementById("json-input");
    let json_err = document.querySelectorAll('[data-input-error-for="json-input"]')[0];
    try {
        if (json_input.value.length === 0) {
            throw SyntaxError("No JSON to parse!");
        }
        let script = JSON.parse(json_input.value);
        validate_script(script);
        load_script(script);
    } catch (error) {
        console.error(error);
        json_err.innerText = "Could not handle JSON: " + error.message;
        json_err.classList.remove("hidden");
    }
}

function toggle_show_script_customiser(hide=false) {
    let parent = document.getElementById("script-customiser");
    parent.classList.remove("hidden");
    if (hide) {
        parent.classList.add("hidden");
    }

    // === Callbacks ===
}

function toggle_show_JSON_loader(hide=false) {
    let parent = document.getElementById("JSON-loader");
    parent.classList.remove("hidden");
    if (hide) {
        parent.classList.add("hidden");
    }

    // === Callbacks ===
    // File loading changes
    document.getElementById("file-input").addEventListener("change", (event) => {
        load_JSON_to_textarea(event.target);
    });

    // Submit pressed
    document.getElementById("json-submit").addEventListener("click", (event) => {
        submit_json();
    });
}

window.onload = () => {toggle_show_JSON_loader()};