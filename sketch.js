let people = [];
let immunitySlider;
let population = 250;
let infectionChance = 0.25;
let connections = [];
let infectionStarted = false;
let immunityRate = 0.4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont('sans-serif');
  
  immunitySlider = createSlider(0, 100, immunityRate * 100, 1);
  immunitySlider.position(20, 20);
  immunitySlider.style('width', '200px');
  
  generatePopulation();
  simulateInfection();
}

function generatePopulation() {
  people = [];
  for (let i = 0; i < population; i++) {
    people.push({
      x: random(width),
      y: random(height),
      state: 'susceptible'
    });
  }
  connections = [];
}

function simulateInfection() {
  immunityRate = immunitySlider.value() / 100;
  
  // Assign immunity
  for (let p of people) {
    if (random() < immunityRate) p.state = 'immune';
    else p.state = 'susceptible';
  }
  
  // Pick one random infected person
  let patientZero = random(people.filter(p => p.state === 'susceptible'));
  if (!patientZero) return; // all immune
  patientZero.state = 'infected';
  
  // Spread algorithm
  let frontier = [patientZero];
  while (frontier.length > 0) {
    let current = frontier.pop();
    for (let other of people) {
      if (other.state === 'susceptible') {
        let d = dist(current.x, current.y, other.x, other.y);
        if (d < 80 && random() < infectionChance) {
          other.state = 'infected';
          connections.push({ a: current, b: other });
          frontier.push(other);
        }
      }
    }
  }
  
  infectionStarted = true;
}

function draw() {
  background(0);
  immunityRate = immunitySlider.value() / 100;
  fill(255);
  noStroke();
  textSize(16);
  text(`Immunity: ${immunitySlider.value()}%  (press SPACE to re-simulate)`, 240, 20);

  // Draw links
  strokeWeight(1);
  for (let link of connections) {
    stroke(255, 80, 80, 100);
    line(link.a.x, link.a.y, link.b.x, link.b.y);
  }

  // Draw people
  noStroke();
  for (let p of people) {
    if (p.state === 'infected') fill(255, 70, 70);
    else if (p.state === 'immune') fill(80, 255, 120);
    else fill(220);
    circle(p.x, p.y, 6);
  }

  if (!infectionStarted) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Adjust immunity → Press SPACE to start outbreak", width/2, height/2);
  }
}

function keyPressed() {
  if (key === ' ') {
    generatePopulation();
    simulateInfection();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
