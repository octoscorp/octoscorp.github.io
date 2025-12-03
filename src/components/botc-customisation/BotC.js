import React from 'react';

function script_tool() {
    // Dear React, can I please just use JS like a normal dev instead of whatever this BS is?!!!!
    // {'{'} and {'}'} look normal - statements uttered by the entirely deranged
    return (
<script>
function load_JSON_to_textarea() {'{'}
    let json_input = document.getElementById("json-input");
    const reader = new FileReader();
    reader.addEventListener('load'), (event) => {'{'}
        json_input.value = event.target.result;
    {'}'};
{'}'}

function validate_script() {'{'}
    return;
{'}'}

function load_script() {'{'}
    return;
{'}'}

function show_JSON_loader() {'{'}
    alert('TEST');
    console.log("show_JSON_loader called");
    let parent = document.getElementById("JSON-loader")
    parent.visibility = "visible";
    parent.getElementById("json-submit").addEventListener("click", (event) => {'{'}
        console.log("json-submit onClick triggered");
        // Validate
        let json_input = document.getElementById("json-input");
        let json_err = document.querySelectorAll("[data-input-error-for='json-input']");
        let file_input = document.getElementById("file-input");
        let file_err = document.querySelectorAll("[data-input-error-for='file-input']");

        if (file_input.files.length === 1) {'{'}
            load_JSON_to_textarea();
        {'}'} else {'{'}
            file_err.show();
        {'}'}

        try {'{'}
            if (json_input.value.length === 0) {'{'}
                throw SyntaxError("No JSON to parse!");
            {'}'}
            let script = JSON.parse(json_input.value);
            validate_script(script);
            load_script(script);
        {'}'} catch (SyntaxError) {'{'}
            console.error(error);
            json_err.innerText = "Could not parse JSON: " + error.message;
            json_err.show();
        {'}'}
        console.log("Validation done");
    {'}'});
    console.log("show_JSON_loader done");
{'}'}

window.onload = () => {'{'}show_JSON_loader(){'}'};
</script>
    )
}

function BotC() {
    return (
        <div className="centre-container">
            <h2 className="logo-font font--extra-large">BotC Tool<hr /></h2>
            <div id="JSON-loader">
                <label htmlFor="file-input">Load script JSON: </label>
                <input type="file" id="file-input" accept=".json" />
                <br />
                <span className="input-error" data-input-error-for="file-input">Bestie, one JSON file at a time please. I'm not exactly making this fancy</span>
                <br />
                <span className="input-error" data-input-error-for="json-input" />
                <br />
                <textarea id="json-input" rows="20" cols="50" placeholder="Or paste JSON here" />
                <br />
                <button id="json-submit" onClick='show_JSON_loader'>Load JSON</button>
            </div>
            {script_tool()}
        </div>
    )
}

export default BotC