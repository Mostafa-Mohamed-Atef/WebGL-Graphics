// Vertex shader program
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform vec2 uOffset;
    
    varying lowp vec4 vColor;
    
    void main() {
        vec4 position = aVertexPosition;
        position.xy += uOffset;
        gl_Position = uProjectionMatrix * uModelViewMatrix * position;
        vColor = aVertexColor;
    }
`;

// Fragment shader program
const fsSource = `
    precision mediump float;
    varying lowp vec4 vColor;
    
    void main() {
        gl_FragColor = vColor;
    }
`;

// Initialize WebGL context
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
}

// Scene state
let isNight = false;
let carPosition = -1.0;
let personPosition = 1.0;
let windmillAngle = 0;

// Function to create shape data
function createShapeData() {
    const shapes = {
        ground: {
            positions: [
                -1.0, -0.3, 0.0,
                1.0, -0.3, 0.0,
                1.0, -1.0, 0.0,
                -1.0, -1.0, 0.0
            ],
            colors: new Array(4).fill([0.133, 0.545, 0.133, 1.0]).flat()
        },
        sky: {
            positions: [
                -1.0, 1.0, 0.0,
                1.0, 1.0, 0.0,
                1.0, -0.3, 0.0,
                -1.0, -0.3, 0.0
            ],
            colors: new Array(4).fill(isNight ? [0.0, 0.0, 0.2, 1.0] : [0.529, 0.808, 0.922, 1.0]).flat()
        },
        house: {
            positions: [
                // House base
                -0.2, 0.0, 0.0,
                0.2, 0.0, 0.0,
                0.2, -0.3, 0.0,
                -0.2, -0.3, 0.0,
                // Roof
                -0.25, 0.0, 0.0,
                0.0, 0.2, 0.0,
                0.25, 0.0, 0.0
            ],
            colors: [
                // House base colors (brown)
                0.545, 0.271, 0.075, 1.0,
                0.545, 0.271, 0.075, 1.0,
                0.545, 0.271, 0.075, 1.0,
                0.545, 0.271, 0.075, 1.0,
                // Roof colors (dark red)
                0.647, 0.165, 0.165, 1.0,
                0.647, 0.165, 0.165, 1.0,
                0.647, 0.165, 0.165, 1.0
            ]
        },
        car: {
            positions: [
                // Car body
                0.0, -0.05, 0.0,
                0.15, -0.05, 0.0,
                0.15, -0.15, 0.0,
                0.0, -0.15, 0.0,
                // Car roof
                0.03, -0.05, 0.0,
                0.12, -0.05, 0.0,
                0.1, 0.0, 0.0,
                0.05, 0.0, 0.0
            ],
            colors: [
                // Car body colors (red)
                1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,
                // Car roof colors (darker red)
                0.8, 0.0, 0.0, 1.0,
                0.8, 0.0, 0.0, 1.0,
                0.8, 0.0, 0.0, 1.0,
                0.8, 0.0, 0.0, 1.0
            ]
        },
        person: {
            positions: [
                // Body
                -0.02, 0.0, 0.0,
                0.02, 0.0, 0.0,
                0.02, -0.15, 0.0,
                -0.02, -0.15, 0.0,
                // Head
                0.0, 0.05, 0.0,
                0.04, 0.0, 0.0,
                0.0, -0.05, 0.0,
                -0.04, 0.0, 0.0
            ],
            colors: [
                // Body colors (blue)
                0.0, 0.0, 0.8, 1.0,
                0.0, 0.0, 0.8, 1.0,
                0.0, 0.0, 0.8, 1.0,
                0.0, 0.0, 0.8, 1.0,
                // Head colors (skin tone)
                0.992, 0.855, 0.725, 1.0,
                0.992, 0.855, 0.725, 1.0,
                0.992, 0.855, 0.725, 1.0,
                0.992, 0.855, 0.725, 1.0
            ]
        },
        tree: {
            positions: [
                // Trunk
                -0.05, -0.1, 0.0,
                0.05, -0.1, 0.0,
                0.05, -0.4, 0.0,
                -0.05, -0.4, 0.0,
                // Leaves (triangle)
                -0.2, -0.1, 0.0,
                0.2, -0.1, 0.0,
                0.0, 0.2, 0.0
            ],
            colors: [
                // Trunk colors (brown)
                0.545, 0.271, 0.075, 1.0,
                0.545, 0.271, 0.075, 1.0,
                0.545, 0.271, 0.075, 1.0,
                0.545, 0.271, 0.075, 1.0,
                // Leaves colors (green)
                0.0, 0.392, 0.0, 1.0,
                0.0, 0.392, 0.0, 1.0,
                0.0, 0.392, 0.0, 1.0
            ]
        }
    };

    return shapes;
}

// Initialize shader program
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

// Initialize buffers
function initBuffers(gl, shapeData) {
    const buffers = {};
    
    for (const [shapeName, data] of Object.entries(shapeData)) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.positions), gl.STATIC_DRAW);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.colors), gl.STATIC_DRAW);

        buffers[shapeName] = {
            position: positionBuffer,
            color: colorBuffer,
            vertexCount: data.positions.length / 3
        };
    }

    return buffers;
}

// Draw shape
function drawShape(gl, programInfo, buffers, shape, offset = [0, 0]) {
    const shapeBuffers = buffers[shape];
    
    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        3,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        4,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.uniform2fv(programInfo.uniformLocations.offset, offset);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, shapeBuffers.vertexCount);
}

// Draw scene
function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const projectionMatrix = mat4.create();
    const modelViewMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -1.0, 1.0, -1.0, 1.0, -1.0, 1.0);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );

    // Draw background elements
    drawShape(gl, programInfo, buffers, 'sky');
    drawShape(gl, programInfo, buffers, 'ground');

    // Draw static elements
    drawShape(gl, programInfo, buffers, 'house', [-0.5, 0.3]);
    drawShape(gl, programInfo, buffers, 'tree', [0.5, 0.3]);

    // Draw moving elements
    drawShape(gl, programInfo, buffers, 'car', [carPosition, 0]);
    drawShape(gl, programInfo, buffers, 'person', [personPosition, 0]);

    // Update animation
    carPosition += 0.005;
    if (carPosition > 1.2) carPosition = -1.2;
    
    personPosition -= 0.003;
    if (personPosition < -1.2) personPosition = 1.2;

    requestAnimationFrame(() => drawScene(gl, programInfo, buffers));
}

// Initialize the scene
function main() {
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const shapeData = createShapeData();
    
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            offset: gl.getUniformLocation(shaderProgram, 'uOffset'),
        },
    };

    const buffers = initBuffers(gl, shapeData);

    // Enable vertex attributes
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    
    // Event listeners
    document.getElementById('themeButton').addEventListener('click', () => {
        isNight = !isNight;
        document.getElementById('themeButton').textContent = 
            isNight ? 'Switch to Day' : 'Switch to Night';
        const newShapeData = createShapeData();
        const newBuffers = initBuffers(gl, newShapeData);
        buffers = newBuffers;
    });

    document.getElementById('moveCarButton').addEventListener('click', () => {
        carPosition += 0.1;
        if (carPosition > 1.2) carPosition = -1.2;
    });

    document.getElementById('movePersonButton').addEventListener('click', () => {
        personPosition -= 0.1;
        if (personPosition < -1.2) personPosition = 1.2;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    });

    drawScene(gl, programInfo, buffers);
}

main();