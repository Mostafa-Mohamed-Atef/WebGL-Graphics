var gl, program;
var vBuffer, cBuffer;
var maxNumTriangles = 30;
var numTriangles = 0;
var count = 0;
var points = [];
var colors = [];
var selectedColor = [0.0, 0.0, 0.0]; // Default black color

// Map color names to their RGB values
var colorMapping = {
    Black: [0.0, 0.0, 0.0],
    Red: [1.0, 0.0, 0.0],
    Yellow: [1.0, 1.0, 0.0],
    Green: [0.0, 1.0, 0.0],
    Blue: [0.0, 0.0, 1.0],
    Magenta: [1.0, 0.0, 1.0],
    Cyan: [0.0, 1.0, 1.0]
};

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    
    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 0.0, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create buffers for vertex positions and colors
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * 3 * maxNumTriangles, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 12 * 3 * maxNumTriangles, gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Dropdown event listener for color selection
    var selectColor = document.getElementById("colorList");
    selectColor.addEventListener("change", function (event) {
        var selectedColorName = event.target.value;
        selectedColor = colorMapping[selectedColorName]; // Update the current color
        console.log(selectedColor)
    });

    // Canvas click event for adding points
    canvas.addEventListener("click", function (event) {
        if (numTriangles >= maxNumTriangles) return;

        var rect = canvas.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
        var y = ((canvas.height - (event.clientY - rect.top)) / canvas.height) * 2 - 1;

        points.push(vec2(x, y));
        colors.push(selectedColor);
        count++;

        if (count === 3) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferSubData(
                gl.ARRAY_BUFFER,
                8 * numTriangles * 3,
                flatten(points)
            );

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferSubData(
                gl.ARRAY_BUFFER,
                12 * numTriangles *3,
                flatten(colors)
            );

            points = [];
            colors=[];
            count = 0;
            numTriangles++;
        }
    });

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, numTriangles * 3);
    requestAnimationFrame(render);
}
