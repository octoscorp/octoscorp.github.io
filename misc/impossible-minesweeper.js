const num_squares = {x: 16, y: 16};
const num_mines = 40;

let mine_field = null;

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(cell) {
        return this.x === cell.x &&
               this.y === cell.y;
    }

    display(value) {
        document.getElementById(`cell_${this.x}_${this.y}`).innerText = value;
    }
}

class Field {
    constructor(locations) {
        this.mine_at = [];
        this.flag_at = [];
        this.revealed = [];
        this.total_revealed = 0;
        this.total_squares = num_squares.x * num_squares.y;

        // Init to false
        for (let i = 0; i < num_squares.x; i++) {
            for (let j = 0; j < num_squares.y; j++) {
                this.mine_at.push(false);
                this.flag_at.push(false);
                this.revealed.push(false);
            }
        }

        // Update with mines
        locations.forEach(element => {
            this.mine_at[element.x + (num_squares.x * element.y)] = true;
        });
    }

    has_mine(cell) {
        return this.mine_at[cell.x + (num_squares.x * cell.y)];
    }

    has_flag(cell) {
        return this.flag_at[cell.x + (num_squares.x * cell.y)];
    }

    is_revealed(cell) {
        return this.revealed[cell.x + (num_squares.x * cell.y)];
    }

    reveal(cell) {
        this.revealed[cell.x + (num_squares.x * cell.y)] = true;
        this.total_revealed += 1;
    }

    toggle_flag(cell) {
        if (this.is_revealed(cell)) {
            return false;
        }
        let index = cell.x + (num_squares.x * cell.y);
        this.flag_at[index] = !this.flag_at[index];
        return true;
    }

    num_adjacent(cell) {
        // Lazily written, includes current cell
        // - Safeguard by not running this where there is a mine
        let output = 0;
        let x = {min: cell.x, max: cell.x};
        let y = {min: cell.y, max: cell.y};
    
        if (cell.x > 0) {
            x.min -= 1;
        }
        if (cell.y > 0) {
            y.min -= 1;
        }
        if (cell.x + 1 < num_squares.x) {
            x.max += 1;
        }
        if (cell.y + 1 < num_squares.y) {
            y.max += 1;
        }

        for (let i = x.min; i <= x.max; i++) {
            for (let j = y.min; j <= y.max; j++) {
                console.debug(`Checking at (${i}, ${j})`);
                if (this.has_mine(new Cell(i, j))) {
                    output += 1;
                    console.debug("Found adjacent");
                }
            }
        }

        return output;
    }

    has_won() {
        return this.total_revealed + num_mines === this.total_squares;
    }
}

function initialiseGame() {
    let area = document.getElementById("game-area");
    // Clear any existing content
    area.innerHTML = "";

    // Format area
    area.style.gridTemplateColumns = `repeat(${num_squares.y}, var(--cell-size))`;

    // Create children
    for (let i = 0; i < num_squares.x; i++) {
        for (let j = 0; j < num_squares.y; j++) {
            let cell = document.createElement("div");
            cell.id = `cell_${i}_${j}`
            cell.classList.add("minesweeper-cell");
            cell.setAttribute("data-x", i);
            cell.setAttribute("data-y", j);
            cell.setAttribute("data-flag", false);
            area.appendChild(cell);

            // Attach JS behaviour to cell
            cell.addEventListener("click", (e) => {
                // Event embeds some button data, do we really care?
                processCellClick(e.target, "left");
            });
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                processCellClick(e.target, "right");
            });
        }
    }
}

// cell is the one location where mine placement is disallowed
function placeMines(cell) {
    // Generate list of legal mine locations to exclude `cell`
    let allowed = [];
    for (let i = 0; i < num_squares.x; i++) {
        for (let j = 0; j < num_squares.y; j++) {
            let potential = new Cell(i, j);
            if (!potential.equals(cell)) {
                allowed.push(potential);
                console.debug(`Adding cell ${i}, ${j} to allowed locations`);
                console.debug(`Cell ${cell.x}, ${cell.y} not equal`);
            }
        }
    }

    // Choose a subset of locations
    let mine_locations = [];
    for (let i = 0; i < num_mines; i++) {
        let chosen = Math.floor(Math.random() * allowed.length);
        mine_locations.push(allowed.splice(chosen, 1)[0]);
        console.debug(`Adding cell ${mine_locations[-1]} to mine locations`);
    }

    // Setup mine_field
    mine_field = new Field(mine_locations);
}

function toggleFlag(cell) {
    let success = mine_field.toggle_flag(cell);
    if (!success) {
        return;
    }
    // Update cell
    if (mine_field.has_flag(cell)) {
        cell.display("F");
    } else {
        cell.display("");
    }
}

function clickOn(cell) {
    if (mine_field.has_flag(cell)) {
        return;
    }
    if (mine_field.has_mine(cell)) {
        gameOver();
        return;
    }
    
    // Update cell
    cell.display(mine_field.num_adjacent(cell));
    mine_field.reveal(cell);

    if (mine_field.has_won()) {
        // Temporary victory display
        document.querySelector("h1").innerText = "Congratulations!";
    }
}

function processCellClick(clicked, type) {
    let cell = new Cell(parseInt(clicked.dataset.x), parseInt(clicked.dataset.y));

    if (mine_field === null) {
        placeMines(cell);
    }

    // Handle L/R click
    switch (type) {
        case "left":
            clickOn(cell);
            break;
        case "right":
            toggleFlag(cell);
            break;
        default:
            return;
    }
}

function gameOver() {
    // Prevent further cell-clicking
    // Reveal un-flagged mines and incorrect flags
    for (let i = 0; i < num_squares.x; i++) {
        for (let j = 0; j < num_squares.y; j++) {
            let cell = new Cell(i, j);
            if (mine_field.has_mine(cell)) {
                cell.display("X");
            }
        }
    }
    return;
}

window.addEventListener("load", (event) => {
    initialiseGame();
});