# Utils

A handful of JS utilities that allow pages to load only what they need.

## API

A basic utility for API/webpage interaction. For the moment, this page has no need to extend beyond GET requests.

This also has built-in processing to convert responses into native JS objects where possible. For JSON responses, this is provided trivially by JS. For YAML responses, [Jeremy Fa's yaml.js](https://github.com/jeremyfa/yaml.js) (version 0.3.0) is used.

### Usage

Invoke the async function `getURL` with arguments `<URL>` and optionally `<process_as>`:
```
const data = await getURL(myURL, api.YAML);
```

`<process_as>` may be any of:
- api.UNDEFINED (default) - return resultant data as plaintext
- api.JSON - parse JSON into native JS object
- api.YAML - parse YAML into native JS object

## Drag-and-drop

A simple drag-and-drop implementation.

### Usage

Include `/utils/drag-and-drop.js`.
Invoke `make_children_draggable()` with arguments `parent` (an HTMLElement) and optionally `set_id` (a name to identify the drag-and-drop collection) and `callback` (a function called when the drag is completed).

The callback function can access (via event.details) the following attributes:
- `set` (set id)
- `index` for the new index within the order

## Flex-Grid

A flexbox-based alternative to CSS grids. This is to allow filling items in the direction the container can grow instead of across this direction.

### Background

In CSS, `grid` displays can only fill in the direction that they will not be growing (see [this StackOverflow thread](https://stackoverflow.com/questions/44092529/make-grid-container-fill-columns-not-rows) for another explanation). Essentially, if we define a grid with 2 columns and an arbitrary number of rows, it will only be filled like this:
```
1  2
3  4
5  6
...
```

If we instead want the order to flow down these columns, but keep the remaining behaviour, we can use a workaround of defining the number of required rows. This allows `grid-auto-flow: column` to know when to start putting items in the next column. This is tolerable up until the number of items in the grid becomes dynamic - suddenly, we need an arbitrary number of rows as well.

At this point, we need a JS solution to dynamically set the number of rows. We can build our solution with either the grid or flexbox framework in mind - I've opted for flexbox because it looks better for my original use case.

### Usage

Add the `flexgrid-column-container` or `flexgrid-row-container` class to the parent element.

**For a pure CSS solution**, style this element and set `--flexgrid-wrap-at` to an appropriate CSS length value - this effectively translates to the `max-height` or `max-width` of the container. Include `/assets/css/flex-grid.css`.

**For a JS-integrated solution**, instead set `--flexgrid-num-lines` to the number of desired columns (if using column container) or rows (if using row container). Include `/utils/flex-grid.js` - it will automatically import the required stylesheet.

## Modal

Basic of making modals responsive. Displays/hide overlays and modals together, and adds cancel functionality when `<Esc>` is pressed or when the overlay is clicked. The CSS component is part of the site default.

### Usage

Create a div with the `modal` class and an id. Optionally add another div with the `modal-overlay` class and a `data-modal-overlay-for` attribute set to the modal's id.

```
<div class="modal-overlay" data-modal-overlay-for="homebrew-char-modal" />
<div id="homebrew-char-modal" class="modal character-editor">
```

This will not appear on the page by default, but can be revealed with the `showModal(modal_id)` function. The open modal will be closed when the `closeModal()` function is invoked (this includes clicking the overlay and pressing escape.)