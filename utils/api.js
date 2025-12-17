const api = Object.freeze({
    UNDEFINED: 0,
    NONE: 1,
    STATUS: 2,
    JSON: 3,
    YAML: 4,
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

async function getURL(apiURL, follow_redirects = true, process_as = api.UNDEFINED) {
    let redir_str = follow_redirects ? 'follow' : 'manual';
    try {
        let response = await fetch(apiURL, {
            method: 'GET',
            redirect: redir_str,
        });
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
            case api.STATUS:
                return response.status;
            case api.NONE:
                return response;
            case api.UNDEFINED: // Fallthrough - weeeee!
            default:
                return await response.text();
        }
    } catch (error) {
        console.error(`Error when requesting ${apiURL}:\n${error.message}`);
        console.log("Attempting to continue anyway");
    }
    return null;
}

function confirmRequestsAllowed() {
    let stored_answer = localStorage.getItem('api_requestsAllowed');
    if (stored_answer === null) {
        stored_answer = JSON.stringify(window.confirm("Allow this site to make requests to user-specified URLs? A malicious URL could track your IP address this way. (Your choice will be remembered)"));
        localStorage.setItem('api_requestsAllowed', stored_answer);
    }
    return JSON.parse(stored_answer);
}
