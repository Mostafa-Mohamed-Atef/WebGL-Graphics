let canvas, gl;

// Cube rotation variables
let theta = [0, 0, 0]; // Rotation angles for x, y, z axes
let axis = 0; // Current axis of rotation
const xAxis = 0, yAxis = 1, zAxis = 2;

// Scaling variables
let scaleFactor = [1.0, 1.0, 1.0]; // Scaling factors for x, y, z

// Animation state
let isAnimating = true;
let animationSpeed = 10; // Lower value = faster animation

// WebGL variables
let thetaLocation, scaleFactorLocation;
const NumVertices = 36;
let points = [];
let colors = [];

window.onload = () => {
    initializeWebGL();
    setupEventListeners();
    render();
};

// Initialize WebGL and setup shaders and buffers
function initializeWebGL() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    const cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLocation = gl.getUniformLocation(program, "theta");
    scaleFactorLocation = gl.getUniformLocation(program, "scaleFactor");
}

// Event listeners for user interaction
function setupEventListeners() {
    document.getElementById("xButton").onclick = () => (axis = xAxis);
    document.getElementById("yButton").onclick = () => (axis = yAxis);
    document.getElementById("zButton").onclick = () => (axis = zAxis);

    document.getElementById("MoveButton").onclick = () => {
        isAnimating = true;
    };

    document.getElementById("StopButton").onclick = () => {
        isAnimating = false;
    };

    document.getElementById("SlowButton").onclick = () => {
        animationSpeed += 150; // Slower animation
    };

    document.getElementById("EnlargeButton").onclick = () => {
        scaleFactor = scaleFactor.map(factor => factor * 1.1); // Increase scale by 10%
    };

    document.getElementById("ShrinkButton").onclick = () => {
        scaleFactor = scaleFactor.map(factor => factor * 0.9); // Decrease scale by 10%
    };
}

// Define the cube geometry with colors
function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

// Helper function to create two triangles per face
function quad(a, b, c, d) {
    const vertices = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0),
    ];

    const vertexColors = [
        [0.0, 0.0, 0.0, 1.0], // black
        [1.0, 0.0, 0.0, 1.0], // red
        [1.0, 1.0, 0.0, 1.0], // yellow
        [0.0, 1.0, 0.0, 1.0], // green
        [0.0, 0.0, 1.0, 1.0], // blue
        [1.0, 0.0, 1.0, 1.0], // magenta
        [0.0, 1.0, 1.0, 1.0], // cyan
        [1.0, 1.0, 1.0, 1.0], // white
    ];

    const indices = [a, b, c, a, c, d];
    for (let i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[a]);
    }
}

// Render the cube
function render() {
    setTimeout(() => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (isAnimating) {
            theta[axis] += 1.0;
        }

        gl.uniform3fv(thetaLocation, theta);
        gl.uniform3fv(scaleFactorLocation, scaleFactor);
        gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

        requestAnimFrame(render);
    }, animationSpeed);
}
