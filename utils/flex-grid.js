/*
Custom grid overlay to overcome the fact that CSS grids can't do
grid-auto-flow: column without a specified number of rows.
*/

function update_flexgrid_styling(container) {
    // Wherein a "line" refers to either rows or columns depending on the direction
    const num_items = container.childElementCount;
    const container_style = window.getComputedStyle(container);
    const container_type = container_style["flex-direction"];
    const num_lines = container_style.getPropertyValue("--flexgrid-num-lines");
    const first_child = container.firstChild;

    // Ignore items without the property we need
    if (num_lines === null) {
        console.warn(
            "Failed to style the below element as a flexgrid container (no value for --flexgrid-num-lines): " +
                container,
        );
        return;
    }
    // Fail silently when empty
    if (first_child === null) {
        console.debug("No first child found");
        return;
    }

    console.log(
        `About to set - ${num_items}, ${num_lines}, ${container_type}, ${Math.ceil(num_items / num_lines)}`,
    );
    const wrap_at = Math.ceil(num_items / num_lines);
    const child_style = window.getComputedStyle(first_child);
    if (container_type == "column") {
        const margin_top =
            child_style["marginTop"] !== null ? child_style["marginTop"] : 0;
        const margin_bottom =
            child_style["marginBottom"] !== null
                ? child_style["marginBottom"]
                : 0;
        const max_height = child_style["maxHeight"];
        container.style.maxHeight = `calc(${wrap_at} * (${max_height} + ${margin_top} + ${margin_bottom}))`;
    } else {
        const margin_left =
            child_style["marginLeft"] !== null ? child_style["marginLeft"] : 0;
        const margin_right =
            child_style["marginRight"] !== null
                ? child_style["marginRight"]
                : 0;
        const max_width = child_style["maxWidth"];
        container.style.maxHeight = `calc(${wrap_at} * (${max_width} + ${margin_left} + ${margin_right}))`;
    }
}

// Allows prevent_update as an option, e.g. when adding lots of items in a row
function add_to_flexgrid_container(item, container, prevent_update = false) {
    container.appendChild(item);

    if (prevent_update) {
        return;
    }
    _update_grid_styling(container);
}

function remove_from_flexgrid_container(item, prevent_update = false) {
    let container = item.parentElement;

    item.remove();

    if (prevent_update) {
        return;
    }
    _update_grid_styling(container);
}

window.addEventListener("load", (event) => {
    // Import flex-grid CSS
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/css/flex-grid.css";
    document.head.appendChild(link);
});
