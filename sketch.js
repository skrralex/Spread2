let nodes = [];
let links = [];
let slider;
let numNodes = 120;
let linkRadius = 140;
let spreadChance = 0.02;
let waveSpeed = 0.015;
let fadeSpeed = 0.004;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont("sans-serif");

  slider = createSlider(0, 100, 40, 1);
  slider.position(20, 20);
  slider.style("width", "200px");

  createNetwork();
}

function createNetwork() {
  nodes = [];
  links = [];

  let criticalRatio = slider.value() / 100;
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2),
      state: random() < criticalRatio ? "critical" : "neutral",
      active: false,
      pulse: 0
    });
  }

  for (let i = 0; i < numNodes; i++) {
    for (let j = i + 1; j < numNodes; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < linkRadius) {
        links.push({ a: i, b: j, d: d });
      }
    }
  }

  // start one node as a rumor source
  let source = random(nodes);
  source.state = "misinfo";
  source.active = true;
  source.pulse = 1;
}

function draw() {
  background(0, 30);

  fill(255);
  textSize(16);
  noStroke();
  text(`Source-critical: ${slider.value()}%`, 240, 20);

  // gentle drift
  for (let n of nodes) {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;
  }

  // draw and propagate waves
  for (let link of links) {
    let a = nodes[link.a];
    let b = nodes[link.b];

    // spread misinformation pulses
    if (a.active && a.state === "misinfo" && b.state === "neutral" && random() < spreadChance) {
      b.state = "misinfo";
      b.active = true;
      b.pulse = 1;
    }
    if (b.active && b.state === "misinfo" && a.state === "neutral" && random() < spreadChance) {
      a.state = "misinfo";
      a.active = true;
      a.pulse = 1;
    }

    // glowing lines where both are active
    let glow = (a.pulse + b.pulse) * 120;
    if (glow > 5) {
      stroke(255, 80, 80, glow);
      strokeWeight(1.5);
      line(a.x, a.y, b.x, b.y);
    }
  }

  noStroke();
  for (let n of nodes) {
    // update pulse dynamics
    if (n.active) {
      n.pulse += waveSpeed;
      if (n.pulse > 1) n.active = false;
    } else if (n.pulse > 0) {
      n.pulse -= fadeSpeed;
      if (n.pulse < 0) n.pulse = 0;
    }

    // color transitions
    let c;
    if (n.state === "critical") c = color(80, 255, 150);
    else if (n.state === "misinfo") c = color(255, 70, 70);
    else c = color(220);

    // glow overlay for pulses
    let r = 6 + n.pulse * 20;
    let glowAlpha = n.pulse * 180;
    fill(red(c), green(c), blue(c), glowAlpha);
    circle(n.x, n.y, r * 1.8);

    // core node
    fill(c);
    circle(n.x, n.y, 6);

    // decay misinfo into neutral again
    if (n.state === "misinfo" && n.pulse === 0) {
      n.state = "neutral";
    }
  }

  // periodically restart the network when calm
  if (frameCount % 1000 === 0) {
    if (!nodes.some(n => n.pulse > 0.1)) {
      createNetwork();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}      createNetwork();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
