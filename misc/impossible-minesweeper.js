const num_squares = {x: 16, y: 16};
const num_mines = 40;

const FLAG = "⚑";
const MINE = "✸";
const UNREVEALED = " ";
const FACES = {
    happy: "🙂",
    cool: "😎",
    sad: "😵",
};

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

    getNeighbours() {
        let output = [];
        let x = {min: this.x, max: this.x};
        let y = {min: this.y, max: this.y};
    
        if (this.x > 0) {
            x.min -= 1;
        }
        if (this.y > 0) {
            y.min -= 1;
        }
        if (this.x + 1 < num_squares.x) {
            x.max += 1;
        }
        if (this.y + 1 < num_squares.y) {
            y.max += 1;
        }

        for (let i = x.min; i <= x.max; i++) {
            for (let j = y.min; j <= y.max; j++) {
                output.push(new Cell(i, j));
            }
        }
        return output;
    }
}

class Field {
    constructor(locations) {
        this.mine_at = [];
        this.flag_at = [];
        this.revealed = [];
        this.flags_placed = 0;
        this.total_revealed = 0;
        this.total_squares = num_squares.x * num_squares.y;
        this.timerPointer = null;

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

    timer_start() {
        this.timerPointer = setInterval(timerStep, 1000);
    }

    timer_stop() {
        clearInterval(this.timerPointer);
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
        this.flags_placed += this.flag_at[index] ? 1 : -1;
        updateMineCount(num_mines - this.flags_placed);
        return true;
    }

    num_adjacent(cell) {
        // Lazily written, includes current cell
        // - Safeguard by not running this where there is a mine
        let output = 0;
        
        cell.getNeighbours().forEach(neighbour => {
            if (this.has_mine(neighbour)) {
                output += 1;
            }
        });

        return output;
    }

    has_won() {
        return this.total_revealed + num_mines === this.total_squares;
    }
}

function initialiseGame() {
    let wrapper = document.getElementById("minesweeper-wrapper");
    let area = document.getElementById("game-area");

    // Clear any existing content
    area.innerHTML = "";

    // Format area
    area.style.gridTemplateColumns = `repeat(${num_squares.y}, var(--cell-size))`;
    wrapper.style.width = `calc(${num_squares.x} * var(--cell-size))`;
    updateMineCount(num_mines);
    updateButton(FACES.happy);

    // Create children
    for (let i = 0; i < num_squares.x; i++) {
        for (let j = 0; j < num_squares.y; j++) {
            let cell = document.createElement("div");
            cell.id = `cell_${i}_${j}`
            cell.classList.add("minesweeper-cell");
            cell.innerText = UNREVEALED;

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

function updateButton(face) {
    document.getElementById("minesweeper-button").innerText = face;
}

function updateMineCount(count) {
    let mine_counter = document.getElementById("mine-count");
    mine_counter.innerText = String(count).padStart(3, "0");
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
            }
        }
    }

    // Choose a subset of locations
    let mine_locations = [];
    for (let i = 0; i < num_mines; i++) {
        let chosen = Math.floor(Math.random() * allowed.length);
        mine_locations.push(allowed.splice(chosen, 1)[0]);
    }

    // Setup mine_field
    mine_field = new Field(mine_locations);
    mine_field.timer_start();
}

function timerStep() {
    let disp = document.getElementById("timer-display");
    let val = parseInt(disp.innerText) + 1;
    disp.innerText = String(val).padStart(3, "0")
}

function toggleFlag(cell) {
    let success = mine_field.toggle_flag(cell);
    if (!success) {
        return;
    }
    // Update cell
    if (mine_field.has_flag(cell)) {
        cell.display(FLAG);
    } else {
        cell.display(UNREVEALED);
    }
}

function clickOn(cell) {
    if (mine_field.has_flag(cell)) {
        return;
    }
    if (mine_field.has_mine(cell)) {
        mineClicked();
        return;
    }
    
    // Update cell
    revealCell(cell);

    checkVictory();
}

function revealCell(cell) {
    if (mine_field.is_revealed(cell)) {
        return;
    }
    let num = mine_field.num_adjacent(cell);
    cell.display(num);
    mine_field.reveal(cell);
    if (num === 0) {
        cell.getNeighbours().forEach(neighbour => {
            revealCell(neighbour);
        });
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

function mineClicked() {
    // Leaving space to intercept this event
    gameOver(false);
}

function checkVictory() {
    if (mine_field.has_won()) {
        gameOver(true);
    }
}

function gameOver(won) {
    mine_field.timer_stop();
    // Prevent further cell-clicking
    // Reveal un-flagged mines and incorrect flags
    for (let i = 0; i < num_squares.x; i++) {
        for (let j = 0; j < num_squares.y; j++) {
            let cell = new Cell(i, j);
            // TODO: Remove incorrect flags (is this necessary?)
            if (mine_field.has_flag(cell)) {
                continue;
            }
            // Display remaining mines
            if (mine_field.has_mine(cell)) {
                cell.display(MINE);
                if (won) {
                    cell.display(FLAG)
                }
            }
        }
    }
    if (!won) {
        updateButton(FACES.sad);
        return;
    }
    // Temporary victory display
    document.querySelector("h1").innerText = "Congratulations!";
    updateButton(FACES.cool);
    return;
}

window.addEventListener("load", (event) => {
    initialiseGame();
});