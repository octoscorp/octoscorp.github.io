// For assertions and escaping

function assert(bool, message, err_cause = null) {
    if (bool === false) {
        throw Error(message, { cause: err_cause });
    }
}

function is_alphanumeric(string) {
    return /^[A-Za-z0-9]*$/i.test(string);
}

const escape_substitutions = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    // Not escaping ", ', or `
};

function escape_html(string) {
    let output = string;
    for (banned of Object.keys(escape_substitutions)) {
        output = output.replaceAll(key, escape_substitutions[key]);
    }
    return output;
}
