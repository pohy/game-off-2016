document.body.onload = init;

let config = {
    canvasId: 'gl_canvas'
};

function init() {
    const canvas = document.getElementById(config.canvasId);

    const {width, height} = canvas;
    config.viewport = {width, height};

    const gl = initWebGL(canvas);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, width, height);

    run(gl);
}

function run(gl) {
    const vertexShader = compileShader(gl, {
        source:
            'attribute vec3 aVertexPosition;\n\n' +
            'uniform mat4 uMVMatrix;\n' +
            'uniform mat4 uPMatrix;\n\n' +
            'void main() {\n' +
            '   gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n' +
            '}',
        type: gl.VERTEX_SHADER
    });
    const fragmentShader = compileShader(gl, {
        source:
            'void main() {\n' +
                '   gl_FragColor = vec4(0, 1, 0, 1);\n' +
            '}',
        type: gl.FRAGMENT_SHADER
    });
    const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(shaderProgram);

    const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPositionAttribute);

    drawScene();

    function drawScene() {
        const square = [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];
        const vertexBuffer = initBuffer(gl, square);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const perspectiveMatrix = makePerspective(45, config.viewport.width / config.viewport.height, 0.1, 100.0);
        loadIdentity();
        mvTranslate([-0.0, 0.0, -6.0]);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        setMatrixUniforms(gl, shaderProgram, mvMatrix, perspectiveMatrix);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

function loadIdentity() {
    mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
    mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
    multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms(gl, shaderProgram, mvMatrix, perspectiveMatrix) {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

function initBuffer(gl, vertices) {
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return vertexBuffer;
}

function createShaderProgram(gl, ...shaders) {
    let shaderProgram = gl.createProgram();
    shaders.forEach((shader) => gl.attachShader(shaderProgram, shader));
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error(`Program linking failed: ${gl.getProgramInfoLog(shaderProgram)}`);
    }
    return shaderProgram;
}

function compileShader(gl, shader) {
    let compiledShader = gl.createShader(shader.type);
    gl.shaderSource(compiledShader, shader.source);
    gl.compileShader(compiledShader);
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        const infoLog = gl.getShaderInfoLog(compiledShader);
        gl.deleteShader(compiledShader);
        throw new Error(`Shader compilation failed: ${infoLog}`);
    }
    return compiledShader;
}

function initWebGL(canvas) {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        throw new Error('Unable to initalize WebGL');
    }
    return gl;
}