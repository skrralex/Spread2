let nodes = [];
let links = [];
let misinformation = [];
let slider;
let numNodes = 120;
let linkRadius = 150;
let spreadChance = 0.05;
let decayRate = 0.002;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  slider = createSlider(0, 100, 40, 1);
  slider.position(20, 20);
  slider.style('width', '200px');
  
  createNetwork();
}

function createNetwork() {
  nodes = [];
  links = [];

  let immunity = slider.value() / 100;

  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      state: random() < immunity ? "critical" : "neutral",
      timer: 0
    });
  }

  // Create links based on proximity
  for (let i = 0; i < numNodes; i++) {
    for (let j = i + 1; j < numNodes; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < linkRadius) {
        links.push({ a: i, b: j, weight: random(0.5, 1) });
      }
    }
  }

  // Start misinformation at one node
  let start = random(nodes);
  start.state = "misinfo";
  start.timer = 1;
}

function draw() {
  background(0, 30);
  let immunity = slider.value() / 100;
  
  fill(255);
  textSize(16);
  noStroke();
  text(`Source-critical: ${slider.value()}%`, 240, 20);

  // Update node positions (gentle floating motion)
  for (let n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;
  }

  // Spread misinformation along links
  for (let link of links) {
    let a = nodes[link.a];
    let b = nodes[link.b];

    // Draw faint link lines
    stroke(80, 80, 80, 40);
    strokeWeight(1);
    line(a.x, a.y, b.x, b.y);

    if (a.state === "misinfo" && b.state === "neutral" && random() < spreadChance) {
      b.state = "misinfo";
      b.timer = 1;
    }
    if (b.state === "misinfo" && a.state === "neutral" && random() < spreadChance) {
      a.state = "misinfo";
      a.timer = 1;
    }
  }

  // Update and draw nodes
  noStroke();
  for (let n of nodes) {
    if (n.state === "misinfo") {
      fill(255, 50, 50, 180);
      n.timer -= decayRate;
      if (n.timer < 0) {
        n.state = "neutral";
      }
    } else if (n.state === "critical") {
      fill(100, 255, 150);
    } else {
      fill(220);
    }
    circle(n.x, n.y, 8);
  }

  // If all misinfo fades out, restart automatically
  if (!nodes.some(n => n.state === "misinfo")) {
    if (frameCount % 200 === 0) {
      createNetwork();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
