var vertexShaderText = `
precision mediump float;
attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;

void main() {
  fragColor = vertColor;
  gl_Position = vec4(vertPosition, 0.0, 1.0);
}`;

var fragmentShaderText = `
precision mediump float;
varying vec3 fragColor;

void main() {
  gl_FragColor = vec4(fragColor, 1.0);
}`;


	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Compile shaders and link program
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);
	gl.compileShader(vertexShader);
	gl.compileShader(fragmentShader);

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.useProgram(program);

	// Define triangle vertices with position (x, y) and color (r, g, b)
	var triangleVertices = new Float32Array([
		0.0, 0.5,   0.0, 0.0, 0.0,
		-0.5, -0.5, 0.7, 0.0, 1.0,
		0.5, -0.5,  0.1, 1.0, 0.6
	]);

	// Create buffer and load vertex data
	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 5 * 4, 0);
	gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 5 * 4, 2 * 4);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	// Draw the triangle
	gl.drawArrays(gl.TRIANGLES, 0, 3);
