// OK so I'm lazy, conveniently I know a programmer who left this data lying in a YAML file somewhere...

// Requires:
//  + utils: api.js

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

// TODO: read char data from Projects repo; for the moment just use buddy up
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
    // TODO: similar behaviour for homebrew chars
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

function get_image_URL(char_id) {
    let image = null;

    // TODO: replace with switch for dusk/dawn etc
    if (loaded_characters.hasOwnProperty(char_id)) {
        image = loaded_characters[char_id].image;
    }

    if (image == null) {
        return "/assets/icons/rss.svg";
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
            console.debug("Searching for display name for " + night_id);
            return loaded_characters[night_id][night + "Reminder"];
    }
}
