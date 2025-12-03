function load_JSON_to_textarea(file_input) {
    let file_err = document.querySelectorAll('[data-input-error-for="file-input"]');

    if (file_input.files.length !== 1) {
        file_err.visibility = "visible";
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

function validate_script(script) {
    // Validate as a script - we already know it's valid JSON
    return;
}

function load_script(script) {
    // Load it in and change page display to suit
    return;
}

function submit_json() {
    // Basic validation
    let json_input = document.getElementById("json-input");
    let json_err = document.querySelectorAll('[data-input-error-for="json-input"]');
    try {
        if (json_input.value.length === 0) {
            throw SyntaxError("No JSON to parse!");
        }
        let script = JSON.parse(json_input.value);
        validate_script(script);
        load_script(script);
    } catch (error) {
        console.error(error);
        json_err.innerText = "Could not parse JSON: " + error.message;
        json_err.visibility = "visible";
    }
}

function show_JSON_loader() {
    let parent = document.getElementById("JSON-loader")
    parent.visibility = "visible";

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

window.onload = () => {show_JSON_loader()};