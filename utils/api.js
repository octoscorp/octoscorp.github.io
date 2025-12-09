const api = Object.freeze({
    UNDEFINED: 0,
    JSON: 1,
    YAML: 2,
});

const script_location = document.currentScript;
let YAML_parser_loaded = false;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function _import_YAML_parser() {
    if (YAML_parser_loaded) {
        // No need to load it twice
        return;
    }
    // Import yaml.js
    let parser_script = document.createElement("script");
    parser_script.type = "text/javascript";
    // From https://github.com/jeremyfa/yaml.js at version 0.3.0
    parser_script.src = "/utils/yaml.js";
    script_location.parentElement.insertBefore(parser_script, script_location);
    YAML_parser_loaded = true;
    // Need to delay to allow it to load
    // TODO: add loaded event to yaml parser
    await delay(150);
}

async function _process_YAML(text) {
    // This isn't loaded until the first YAML request
    await _import_YAML_parser();
    return YAML.parse(text);
}

async function getURL(apiURL, process_as = api.UNDEFINED) {
    try {
        let response = await fetch(apiURL);
        // Sometimes fetch spits errors, sometimes not
        if (!response.ok) {
            throw new Error(
                `Not-OK response trying to reach ${apiURL}\n Status: ${response.status} ${response.statusText}\n URL: ${response.url}\n Headers: ${response.headers}\n Body: ${response.body}`,
            );
        }

        switch (process_as) {
            case api.JSON:
                return await response.json();
            case api.YAML:
                return await _process_YAML(await response.text());
            case api.UNDEFINED: // Fallthrough - weeeee!
            default:
                return await response.text();
        }
    } catch (error) {
        console.error(error.message);
        console.log("Attempting to continue anyway");
    }
    return null;
}
