
let currently_selected = null;

function droppedOn(event) {
    let old_index = currently_selected.getAttribute('data-draggable-set-index');
    let replaced = event.target.closest(".draggable");
    let new_index = replaced.getAttribute('data-draggable-set-index');
    let set_id = replaced.getAttribute('data-draggable-set-id');

    if (set_id !== currently_selected.getAttribute('data-draggable-set-id')) {
        return;
    };

    let parent = currently_selected.parentElement;
    parent.insertBefore(currently_selected, replaced);
    for (let i = Math.min(new_index, old_index); i <= Math.max(new_index, old_index); i++) {
        let child = parent.children[i];
        child.setAttribute('data-draggable-set-index', i);
    }

    // Remove droppable class from `replaced` because it didn't receive dragexit
    replaced.classList.remove("droppable");

    currently_selected.dispatchEvent(new CustomEvent("draggableCallback", {
        detail: {
            set: set_id,
            index: new_index,
        }
    }));
}

/**
 * Make all children of the node draggable
 * @param {*} parent the parent of the nodes to make draggable
 * @param {*} set_id a unique identifier for this set of draggables. Items which share an id can be dragged onto each other
 * @param {*} callback called when a drag is completed with an event containing `set` (set id) and `index` for the new index
 */
function make_children_draggable(parent, set_id=null, callback=null) {
    if (set_id === null) {
        set_id = parent.id;
    }
    for (let i = 0; i < parent.children.length; i++) {
        let child = parent.children[i];
        child.classList.add("draggable");
        child.setAttribute("draggable", true);
        child.setAttribute("data-draggable-set-id", set_id);
        child.setAttribute("data-draggable-set-index", i);

        // Setup drag-drop events
        child.addEventListener("dragover", (event) => {
            // Make them droppable
            event.preventDefault();
        });
        child.addEventListener("dragstart", (event) => {
            currently_selected = event.target.closest(".draggable");
        });
        child.addEventListener("dragenter", (event) => {
            event.target.closest(".draggable").classList.add("droppable");
        });
        child.addEventListener("dragexit", (event) => {
            event.target.closest(".draggable").classList.remove("droppable");
        });
        child.addEventListener("drop", droppedOn);
        child.addEventListener("draggableCallback", callback);
    }
}

window.addEventListener("load", (event) => {
    // Import the drag-and-drop CSS
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/drag-and-drop.css';
    document.head.appendChild(link);
});