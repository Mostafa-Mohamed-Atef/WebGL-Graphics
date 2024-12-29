// Get the canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables for theme and positions
let isNight = false;
let carPosition = -100;
let personPosition = canvas.width + 50;
let angle = 0;

// Function to draw the scene
function drawScene() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the sky
  drawSky();

  // Draw the sun or moon
  drawSunOrMoon();

  // Draw the ground
  drawGround();

  // Draw the house
  drawHouse();

  // Draw the tree
  drawTree();

  // Draw the windmill
  drawWindmill();

  // Draw the car
  drawCar();

  // Draw the person
  drawPerson();

  // Update angle for rotation (if any)
  angle += 0.05;

  // Request the next frame
  requestAnimationFrame(drawScene);
}

// Function to draw the sky with gradient
function drawSky() {
  let skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5);

  if (isNight) {
    skyGradient.addColorStop(0, "#000033");
    skyGradient.addColorStop(1, "#000066");
  } else {
    skyGradient.addColorStop(0, "#87CEEB");
    skyGradient.addColorStop(1, "#87CEFA");
  }

  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Function to draw the sun or moon
function drawSunOrMoon() {
  ctx.save();
  if (isNight) {
    ctx.fillStyle = "#FFFFE0";
  } else {
    ctx.fillStyle = "#FFD700";
  }
  ctx.beginPath();
  ctx.arc(canvas.width - 100, 100, 50, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

// Function to draw the ground
function drawGround() {
  ctx.fillStyle = "#228B22";
  ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
}

// Function to draw the house
function drawHouse() {
  ctx.save();
  // House base
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(100, canvas.height * 0.5, 200, 200);

  // Roof
  ctx.beginPath();
  ctx.moveTo(80, canvas.height * 0.5);
  ctx.lineTo(200, canvas.height * 0.35);
  ctx.lineTo(320, canvas.height * 0.5);
  ctx.closePath();
  ctx.fillStyle = "#A52A2A";
  ctx.fill();

  // Windows
  ctx.fillStyle = isNight ? "#FFFFE0" : "#FFFACD";
  ctx.fillRect(130, canvas.height * 0.6, 50, 50);
  ctx.fillRect(220, canvas.height * 0.6, 50, 50);

  // Door
  ctx.fillStyle = "#654321";
  ctx.fillRect(190, canvas.height * 0.65, 40, 85);
  ctx.restore();
}

// Function to draw the tree
function drawTree() {
  ctx.save();

  // Trunk
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(500, canvas.height * 0.6, 30, 100);

  // Leaves (3D effect with gradient)
  let leafGradient = ctx.createRadialGradient(
    515,
    canvas.height * 0.6,
    10,
    515,
    canvas.height * 0.6 - 50,
    70
  );
  leafGradient.addColorStop(0, "#006400");
  leafGradient.addColorStop(1, "#00FF00");
  ctx.fillStyle = leafGradient;

  ctx.beginPath();
  ctx.arc(515, canvas.height * 0.6 - 50, 70, 0, 2 * Math.PI);
  ctx.fill();

  ctx.restore();
}

// Function to draw a windmill
function drawWindmill() {
  ctx.save();
  ctx.translate(700, canvas.height * 0.5);

  // Windmill base
  ctx.fillStyle = "#D3D3D3";
  ctx.fillRect(-10, 0, 20, 100);

  // Rotating blades
  ctx.save();
  ctx.rotate(angle);
  ctx.fillStyle = "#FFFFFF";

  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -50);
    ctx.lineTo(10, -40);
    ctx.lineTo(0, -60);
    ctx.lineTo(-10, -40);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  ctx.restore();
}

// Function to draw the car
function drawCar() {
  ctx.save();
  ctx.translate(carPosition, canvas.height * 0.75);

  // Car body
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0, -30, 80, 30);

  // Car roof
  ctx.beginPath();
  ctx.moveTo(20, -30);
  ctx.lineTo(30, -50);
  ctx.lineTo(60, -50);
  ctx.lineTo(70, -30);
  ctx.closePath();
  ctx.fill();

  // Wheels
  ctx.fillStyle = "#000000";

  // Front wheel
  ctx.beginPath();
  ctx.arc(20, 0, 10, 0, 2 * Math.PI);
  ctx.fill();

  // Rear wheel
  ctx.beginPath();
  ctx.arc(60, 0, 10, 0, 2 * Math.PI);
  ctx.fill();

  ctx.restore();
}

// Function to draw the person
function drawPerson() {
  ctx.save();
  ctx.translate(personPosition, canvas.height * 0.75);

  // Head
  ctx.fillStyle = "#FFDAB9";
  ctx.beginPath();
  ctx.arc(0, -50, 10, 0, 2 * Math.PI);
  ctx.fill();

  // Body
  ctx.fillStyle = "#0000CD";
  ctx.fillRect(-5, -50, 10, 30);

  // Arms
  ctx.strokeStyle = "#FFDAB9";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-5, -40);
  ctx.lineTo(-20, -30);
  ctx.moveTo(5, -40);
  ctx.lineTo(20, -30);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(-5, -20);
  ctx.lineTo(-10, 0);
  ctx.moveTo(5, -20);
  ctx.lineTo(10, 0);
  ctx.stroke();

  ctx.restore();
}

// Event listener for the theme button
document.getElementById("themeButton").addEventListener("click", () => {
  isNight = !isNight;
  document.getElementById("themeButton").textContent = isNight
    ? "Switch to Day"
    : "Switch to Night";
});

// Event listener for the "Move Car" button
document.getElementById("moveCarButton").addEventListener("click", () => {
  carPosition += 10; // Move the car right by 10 pixels
  if (carPosition > canvas.width + 100) {
    carPosition = -100; // Reset position if it goes off-screen
  }
});

// Event listener for the "Move Person" button
document.getElementById("movePersonButton").addEventListener("click", () => {
  personPosition -= 10; // Move the person left by 10 pixels
  if (personPosition < -50) {
    personPosition = canvas.width + 50; // Reset position if it goes off-screen
  }
});

// Start the drawing loop
drawScene();
