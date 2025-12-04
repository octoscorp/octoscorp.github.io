// OK so I'm lazy, conveniently I know a programmer who left this data lying in a YAML file somewhere...

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
    },
    "sailor":{
        id: "sailor",
        name: "Sailor",
        team: "townsfolk",
        ability: "Ability",
    },
    "villageidiot":{
        id: "villageidiot",
        name: "Village Idiot",
        team: "townsfolk",
        ability: "Ability",
    },
    "nightwatchman":{
        id: "nightwatchman",
        name: "Nightwatchman",
        team: "townsfolk",
        ability: "Ability",
    },
    "seamstress":{
        id: "seamstress",
        name: "Seamstress",
        team: "townsfolk",
        ability: "Ability",
    },
    "huntsman":{
        id: "huntsman",
        name: "Huntsman",
        team: "townsfolk",
        ability: "Ability",
    },
    "ogre":{
        id: "ogre",
        name: "Ogre",
        team: "outsider",
        ability: "Ability",
    },
    "damsel":{
        id: "damsel",
        name: "Damsel",
        team: "outsider",
        ability: "Ability",
    },
    "marionette":{
        id: "marionette",
        name: "Marionette",
        team: "minion",
        ability: "Ability",
    },
    "eviltwin":{
        id: "eviltwin",
        name: "Evil Twin",
        team: "minion",
        ability: "Ability",
    },
    "lleech":{
        id: "lleech",
        name: "Lleech",
        team: "demon",
        ability: "Ability",
    },
};

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