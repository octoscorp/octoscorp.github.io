// OK so I'm lazy, conveniently I know a programmer who left this data lying in a YAML file somewhere...

const char_types = [
    "townsfolk",
    "outsider",
    "minion",
    "demon",
    "traveller",
    "fabled",
    "loric",
];

// TODO: read char data from Projects repo
let official_characters = [
    "washerwoman",
    "soldier",
    "imp",
    "ravenkeeper",
    "librarian",
    "sailor",
    "villageidiot",
    "nightwatchman",
    "seamstress",
    "huntsman",
    "ogre",
    "damsel",
    "marionette",
    "eviltwin",
    "lleech",
];

function is_official_character(char_name) {
    return official_characters.includes(char_name);
}
