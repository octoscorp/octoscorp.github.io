// OK so I'm lazy, conveniently I know a programmer who left this data lying in a YAML file somewhere...

// Requires:
//  + utils: api.js

// Including whether the category shows on the default script page
const char_types = {
    "townsfolk": true,
    "outsider": true,
    "minion": true,
    "demon": true,
    "traveller": false,
    "fabled": false,
    "loric": false,
};

const char_data_URL = "https://raw.githubusercontent.com/octoscorp/ProjectsMisc/refs/heads/master/BotC/data/characters.yaml";

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
}

// TODO: read char data from Projects repo; for the moment just use buddy up
let official_characters = {
    "librarian":{
        id: "librarian",
        name: "Librarian",
        team: "townsfolk",
        ability: "Ability",
        firstNight: 44,
        otherNight: 0,
    },
    "sailor":{
        id: "sailor",
        name: "Sailor",
        team: "townsfolk",
        ability: "Ability",
        firstNight: 17,
        otherNight: 5,
    },
    "villageidiot":{
        id: "villageidiot",
        name: "Village Idiot",
        team: "townsfolk",
        ability: "Ability",
        firstNight: 59,
        otherNight: 76,
    },
    "nightwatchman":{
        id: "nightwatchman",
        name: "Nightwatchman",
        team: "townsfolk",
        ability: "Ability",
        firstNight: 61,
        otherNight: 79,
    },
    "seamstress":{
        id: "seamstress",
        name: "Seamstress",
        team: "townsfolk",
        ability: "Ability",
        firstNight: 53,
        otherNight: 73,
    },
    "huntsman":{
        id: "huntsman",
        name: "Huntsman",
        team: "townsfolk",
        ability: "Ability",
        firstNight: 40,
        otherNight: 59,
    },
    "ogre":{
        id: "ogre",
        name: "Ogre",
        team: "outsider",
        ability: "Ability",
        firstNight: 64,
        otherNight: 0,
    },
    "damsel":{
        id: "damsel",
        name: "Damsel",
        team: "outsider",
        ability: "Ability",
        firstNight: 41,
        otherNight: 0,
    },
    "marionette":{
        id: "marionette",
        name: "Marionette",
        team: "minion",
        ability: "Ability",
        firstNight: 18,
        otherNight: 0,
    },
    "eviltwin":{
        id: "eviltwin",
        name: "Evil Twin",
        team: "minion",
        ability: "Ability",
        firstNight: 32,
        otherNight: 0,
    },
    "lleech":{
        id: "lleech",
        name: "Lleech",
        team: "demon",
        ability: "Ability",
        firstNight: 22,
        otherNight: 44,
    },
};

// Load data on official characters
window.addEventListener("load", async (event) => {
    let data = await getURL(char_data_URL, api.YAML);
    console.log(data);
    // Add to official characters data
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

// TODO both
function get_image_URL(char_id) {
    return "/assets/icons/rss.svg"
}

function get_night_reminder(night_id, night) {
    return night_id + " reminder for: " + night;
}