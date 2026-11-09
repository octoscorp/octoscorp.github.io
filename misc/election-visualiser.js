class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(vector) {
    return new Vec2(this.x + vector.x, this.y + vector.y);
  }

  minus(vector) {
    return new Vec2(this.x - vector.x, this.y - vector.y);
  }

  times(scalar) {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  rotate(angle) {
    return new Vec2(this.x * Math.cos(angle) - this.y * Math.sin(angle),
     this.x * Math.sin(angle) + this.y * Math.cos(angle));
  }
}

const parliament = document.getElementById("parliament-area");
const draw = parliament.getContext("2d");

const seat_radius = 8;
const seat_distance = 20;
const seat_depth = 5;

const seat_step = new Vec2(-seat_distance, 0);
const row_step = new Vec2(0, -seat_distance);
const curve_start = new Vec2(130, 180);
const right_start = curve_start.plus(new Vec2(140.58, 20));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function drawSeat(party, type, location) {
  draw.beginPath();
  if (type == "list") {
    draw.arc(location.x, location.y, seat_radius - 2, 0, 2 * Math.PI);
    draw.strokeStyle = colours[party];
    draw.lineWidth = 4;
    draw.stroke();
  } else {
    draw.arc(location.x, location.y, seat_radius, 0, 2 * Math.PI);
    draw.fillStyle = colours[party];
    draw.fill();
  }
  await sleep(1);
}

function getSeatsOnCurve() {
  // Take the simple route for handling the curve for now - angled lines.
  const curve_seats = 12;
  
  let row_start = curve_start;
  let angle = 0;

  let positions = [];

  for(let i = 0; i < curve_seats; i++) {
    let pos = row_start;
    for (let j = 0; j < 5; j++) {
      positions.push(pos);
      pos = pos.plus(seat_step.rotate(angle));
    }
    let angle_step = Math.PI / (curve_seats - 1);
    angle += angle_step;
    row_start = row_start.plus(row_step.rotate(angle - angle_step/2));
  }
  return positions;
}

function getSeatsOnSide(side, count, start) {
  let seat_change = side == "left" ? seat_step : seat_step.times(-1);
  let pos = start;

  let seats = [];

  for (let i = 0; i < count; i++) {
    if (i != 0 && i % 5 == 0) {
      pos = pos.minus(row_step);
      pos = pos.minus(seat_change.times(5));
    }
    seats.push(pos);
    pos = pos.plus(seat_change);
  }

  if (side == "left") {
    // Reorder to start at the bottom
    let temp_seats = []
    for (let i = 0; i < seats.length / 5; i++) {
      let row = seats.slice(i*5, i*5+5);
      temp_seats = row.concat(temp_seats);
    }
    seats = temp_seats;
  }
  return seats;
}

/** Return an ordered list of seat locations based on number of seats */
function getSeatLocations(overhangs) {
  // Curve is the hardest to handle, start with it
  let seats = getSeatsOnCurve();
  
  // Remainder of base 120, factor in overhangs while curve doesn't
  const seats_per_side = (120 - seats.length) / 2;
  const left_start = curve_start.minus(row_step);
  seats = getSeatsOnSide("left", seats_per_side + overhangs[0], left_start).concat(seats);
  seats = seats.concat(getSeatsOnSide("right", seats_per_side + overhangs[1], right_start));

  return seats;
}

function assignListSeats(result) {
  let qualified = [];
  result.party_results.forEach(party_result => {
    if (party_result.qualifiesForList()) {
      qualified.push(party_result);
    }
  });

  // Stop us re-allocating previously run votes.
  if (qualified.length == 0) {
    return;
  }

  for (let i = 0; i < 120; i++) {
    let best = null;
    let highest_q = 0;
    for (let j = 0; j < qualified.length; j++) {
      let res = qualified[j];
      res.quotient = res.party_vote / res.divider;
      if (res.quotient > highest_q) {
        best = res;
        highest_q = res.quotient;
      }
    }
    best.increment_entitlement();
  }
  
  qualified.forEach(party => {
    party.setListSeats(party.entitlement - party.electorate_seats);
  });
}

function calculateOverhangs(result) {
  let overhangs = [0, 0];
  result.party_results.forEach(result => {
    overhangs[blocs[result.name]] += result.overhang;
  });
  return overhangs;
}

async function drawSeats(result, overhangs) {
  draw.clearRect(0, 0, parliament.width, parliament.height);
  let seats = getSeatLocations(overhangs);
  let seat_count = 0;
  let order = result.getPartyOrder();
  for (let i = 0; i < order.length; i++) {
    let party = order[i];
    if (blocs[party.name] == 0) {
      for (let i = 0; i < party.electorate_seats; i++) {
        await drawSeat(party.name, "electorate", seats[seat_count++]);
      }
    }
    for (let i = 0; i < party.list_seats; i++) {
      await drawSeat(party.name, "list", seats[seat_count++]);
    }
    if (blocs[party.name] == 1) {
      for (let i = 0; i < party.electorate_seats; i++) {
        await drawSeat(party.name, "electorate", seats[seat_count++]);
      }
    }
  }
}

function displayResult(result) {
  assignListSeats(result);
  let overhangs = calculateOverhangs(result);
  drawSeats(result, overhangs);
}

function setTitle(title) {
  document.getElementById("result-name").innerText = title;
}

function historic_result_selected(_event) {
  let name = document.getElementById("elections").value;
  displayResult(historic_results[name]);
  setTitle(name);
}

function historic_poll_selected(_event) {
  let name = document.getElementById("polls").value;
  let year = document.getElementById("poll_years").value;
  if (name == "-1" || year == "-1") {
    return;
  }

  displayResult(historic_polls[year][name]);
  setTitle(`${year}: ${name}`);
}

function update_poll_options(_event) {
  let year = document.getElementById("poll_years").value;
  let polls = document.getElementById("polls");
  
  // Clear old options
  let L = polls.options.length - 1;
  for (let i = L; i > 0; i--) {
    polls.remove(i);
  }

  // Add new options
  for (const [key, val] of Object.entries(historic_polls[year])) {
    let option = document.createElement("option");
    option.setAttribute("value", key);
    option.appendChild(document.createTextNode(key));
    polls.appendChild(option);
  }
}

window.addEventListener("load", (event) => {
  displayResult(historic_results["2026 Preliminary"]);
  setTitle("2026 Election (Preliminary)");

  document.getElementById("elections").addEventListener("change", historic_result_selected);
  document.getElementById("polls").addEventListener("change", historic_poll_selected);
  document.getElementById("poll_years").addEventListener("change", update_poll_options);
});