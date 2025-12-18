// OK so I'm lazy, conveniently I know a programmer who left this data lying in a YAML file somewhere...

// Requires:
//  + utils: api.js

function assert(bool, message, err_cause = null) {
    if (bool === false) {
        throw Error(message, { cause: err_cause });
    }
}

function is_alphanumeric(string) {
    return /^[A-Za-z0-9]*$/i.test(string);
}

// Including whether the category shows on the default script page
const char_types = {
    townsfolk: true,
    outsider: true,
    minion: true,
    demon: true,
    traveller: false,
    fabled: false,
    loric: false,
};

const char_data_URL =
    "https://raw.githubusercontent.com/octoscorp/ProjectsMisc/refs/heads/master/BotC/data/characters.yaml";

class Character {
    // Required fields
    id;
    name;
    team;
    ability;

    // Optional fields
    image = null;
    firstNight = null;
    firstNightReminder = null;
    otherNight = null;
    otherNightReminder = null;
    reminders = null;
    globalReminders = null;
    flavor = null;
    edition = null;
    setup = null;
    jinxes = null;
    special = null;

    static from(obj) {
        let output = new Character();
        for (let key of Object.keys(obj)) {
            output[key] = obj[key];
        }
        return output;
    }
}

function validate_homebrew_character(char) {
    // Check required fields are non-null
    const required = ["id", "name", "team", "ability"];
    console.debug(char);

    for (field of required) {
        assert(
            char[field] !== null,
            `Character ${field} cannot be empty.`,
            (err_cause = { name: field }),
        );
    }

    assert(
        char.id.length > 0,
        "Character ID cannot be empty.",
        (err_cause = { name: "id" }),
    );
    assert(
        char.id.length <= 50,
        "Character ID cannot exceed 50 characters.",
        (err_cause = "id"),
    );
    assert(
        is_alphanumeric(char.id),
        "ID may only include alphanumeric characters.",
        (err_cause = { name: "id" }),
    );

    assert(
        char.name.length > 0,
        "Char name cannot be empty.",
        (err_cause = { name: "name" }),
    );
    assert(
        char.name.length <= 30,
        "Char name cannot exceed 30 chars.",
        (err_cause = { name: "name" }),
    );

    assert(
        char_types.hasOwnProperty(char.team),
        "Char team must be one of: " + Object.keys(char_types),
        (err_cause = { name: "team" }),
    );

    assert(
        char.hasOwnProperty("ability"),
        'Characters must have an "ability" field.',
        (err_cause = { name: "ability" }),
    );
    assert(
        char.ability.length > 0,
        "Char ability cannot be empty.",
        (err_cause = { name: "ability" }),
    );
    assert(
        char.ability.length <= 250,
        "Char name cannot exceed 250 chars.",
        (err_cause = { name: "ability" }),
    );

    nights.forEach((night) => {
        if (char[night] !== null) {
            assert(
                typeof char[night] === "number",
                "Char " + night + " field must be integer",
                (err_cause = { name: night }),
            );
            if (char[night] !== 0) {
                // Wakes on this night - must have reminder!
                assert(
                    char[night + "Reminder"] !== null,
                    `Char with ${night} value > 0 wakes so must have ${night}Reminder.`,
                    (err_cause = { name: `${night}Reminder` }),
                );
                assert(
                    typeof char[night + "Reminder"] === "string",
                    "Char " + night + "Reminder must be a string.",
                    (err_cause = { name: `${night}Reminder` }),
                );
                assert(
                    char[night + "Reminder"].length > 0,
                    `${night}Reminder cannot be empty while ${night} is > 0.`,
                    (err_cause = { name: `${night}Reminder` }),
                );
                assert(
                    char[night + "Reminder"].length <= 500,
                    "Char " + night + "Reminder cannot exceed 500 chars.",
                    (err_cause = { name: `${night}Reminder` }),
                );
            } else {
                assert(
                    char[night + "Reminder"] === null ||
                        char[night + "Reminder"] === "",
                    `Character does not wake on ${night} (priority 0) so cannot have ${night}Reminder`,
                    (err_cause = { name: `${night}Reminder` }),
                );
            }
        }
    });

    if (char.reminders !== null) {
        assert(
            Array.isArray(char.reminders),
            "Char reminders must be an array.",
            (err_cause = { name: "reminders" }),
        );

        for (let i = 0; i < char.reminders.length; i++) {
            assert(
                char.reminders[i].length <= 30,
                "Character reminder token cannot exceed 30 chars.",
                (err_cause = { name: "reminders", index: i }),
            );
        }
    }
    if (char.globalReminders !== null) {
        assert(
            Array.isArray(char.globalReminders),
            "Char globalReminders must be an array.",
            (err_cause = { name: "globalReminders" }),
        );

        for (let i = 0; i < char.globalReminders.length; i++) {
            assert(
                char.globalReminders[i].length <= 25,
                "Character global reminder token cannot exceed 25 chars.",
                (err_cause = { name: "globalReminders", index: i }),
            );
        }
    }
}

let official_characters = {};

// Load data on official characters
window.addEventListener("load", async (event) => {
    let data = await getURL(char_data_URL, follow_redirects = true, api.YAML);
    // Add to official characters data
    for (let data_team of Object.keys(data)) {
        for (let data_id of Object.keys(data[data_team])) {
            official_characters[data_id] = Character.from(
                data[data_team][data_id],
            );
            official_characters[data_id].id = data_id;
            official_characters[data_id].team = data_team;
        }
    }

    console.debug("Official characters loaded!\n", official_characters);
});

// Gets updated to include homebrews
let loaded_characters = official_characters;

// More accurately, whether they show on the default script page
function is_playable_character(char_obj) {
    return char_types[char_obj.team];
}

function is_official_character(char_id) {
    return official_characters.hasOwnProperty(char_id);
}

function get_official_character_object(char_id) {
    // For homebrew chars, use Script.get_by_id
    return official_characters[char_id];
}

function load_homebrew_character(char_obj) {
    loaded_characters[char_obj.id] = char_obj;
}

function get_night_priority(char_id, night) {
    // Dusk comes first so can be ignored
    switch (char_id) {
        case "minioninfo":
            return night == "firstNight" ? 11 : 0;
        case "demoninfo":
            return night == "firstNight" ? 15 : 0;
        case "dawn":
            return night == "firstNight" ? 69 : 87;
        default:
            let prio = loaded_characters[char_id][night];
            return prio !== null ? prio : 0;
    }
}

function get_display_name(char_id) {
    switch (char_id) {
        case "dusk":
            return "Dusk";
        case "dawn":
            return "Dawn";
        case "minioninfo":
            return "Minion Info";
        case "demoninfo":
            return "Demon Info";
        default:
            console.debug("Searching for display name for " + char_id);
            return loaded_characters[char_id].name;
    }
}

function get_team(char_id) {
    return loaded_characters[char_id].team;
}

function get_image_URL(char_id) {
    let image = null;

    switch (char_id) {
        case "dusk":    // Weeeee!
        case "dawn":
        case "minioninfo":
        case "demoninfo":
            return `/assets/icons/${char_id}.svg`;
        default:
            if (loaded_characters.hasOwnProperty(char_id)) {
                image = loaded_characters[char_id].image;
            }
    }

    if (image == null) {
        return `/assets/icons/${get_team(char_id)}_default.svg`;
    }
    return image;
}

function get_night_reminder(night_id, night) {
    switch (night_id) {
        case "dusk":
            return "Start the Night Phase.";
        case "dawn":
            return "Wait for a few seconds. End the Night Phase.";
        case "minioninfo":
            return "If there are 7 or more players, wake all Minions: Show the {THIS IS THE DEMON} token. Point to the Demon. Show the {THESE ARE YOUR MINIONS} token. Point to the other Minions.";
        case "demoninfo":
            return "If there are 7 or more players, wake the Demon: Show the {THESE ARE YOUR MINIONS} token. Point to all Minions. Show the {THESE CHARACTERS ARE NOT IN PLAY} token. Show 3 not-in-play good character tokens.";
        default:
            console.debug("Searching for night reminder for " + night_id);
            return loaded_characters[night_id][night + "Reminder"];
    }
}

function char_name_to_id(char_name) {
    // Convert to id
    let generated_id = "";
    for (let char of char_name) {
        if (is_alphanumeric(char)) {
            generated_id += char;
        }
    }
    return generated_id.toLowerCase();
}
