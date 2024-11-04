const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  console.error('WebGL not supported');
}

// Vertex Shader
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_color = a_color;
  }
`;

// Fragment Shader
const fragmentShaderSource = `
  precision mediump float;
  varying vec3 v_color;

  void main() {
    gl_FragColor = vec4(v_color, 1.0);
  }
`;

// Compile shader
function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

// Link shaders to create program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error('Error linking program:', gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

gl.useProgram(program);

// Define square vertices with color data (position and color for each corner)
const vertices = new Float32Array([
  // Position     // Color
  -1.0,  1.0,     1.0, 0.0, 0.0,  // Top-left (Red)
   1.0,  1.0,     0.0, 1.0, 0.0,  // Top-right (Green)
  -1.0, -1.0,     0.0, 0.0, 1.0,  // Bottom-left (Blue)
   1.0, -1.0,     1.0, 1.0, 0.0   // Bottom-right (Yellow)
]);

// Create a buffer and put the vertices data in it
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Get the attribute locations
const aPosition = gl.getAttribLocation(program, 'a_position');
const aColor = gl.getAttribLocation(program, 'a_color');

// Enable attributes and define the data layout
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.enableVertexAttribArray(aPosition);

gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(aColor);

// Clear the canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw the square
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
