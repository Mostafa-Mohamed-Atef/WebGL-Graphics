// Utility function for 2D vectors
function vec2(x, y) {
    return [x, y];
}

// Mix function to get midpoint between two points
function mix(a, b, t) {
    return [(1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1]];
}

// Flatten function to convert an array of vec2 to Float32Array
function flatten(arr) {
    return new Float32Array(arr.flat());
}

var points = [];
var NumTimesToSubdivide = 5; // Controls the level of recursion

// Initial vertices of the triangle
var vertices = [
    vec2(-1, -1),
    vec2(0, 1),
    vec2(1, -1)
];

// Function to push vertices of one triangle into points
function triangle(a, b, c) {
    points.push(a, b, c);
}

// Recursive function to divide a triangle
function divideTriangle(a, b, c, count) {
    if (count === 0) {
        triangle(a, b, c);
    } else {
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);
        count--;
        //three new triangles
        divideTriangle(a, ab, ac, count);
        divideTriangle(c, ac, bc, count);
        divideTriangle(b, bc, ab, count);
    }
}

// Start dividing the triangle
divideTriangle(vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);

// Initialize WebGL
function init() {
    var canvas = document.getElementById("gl-canvas");
    var gl = canvas.getContext("webgl");

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background

    // Load and compile shaders
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, document.getElementById("vertex-shader").text);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, document.getElementById("fragment-shader").text);
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    // Load data into GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Link vertex position attribute from shader
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render(gl);
}

// Function to compile shaders
function loadShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Render function to draw the triangles
function render(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}

// Start initialization on window load
window.onload = init;
