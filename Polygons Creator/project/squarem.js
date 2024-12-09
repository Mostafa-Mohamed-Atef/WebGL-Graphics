var canvas;
var gl;


var maxNumVertices = 500;
var index = 0;
var polygonStartIndices = [];
var redraw = false;

function getColor(){
   var menu = document.getElementById('menu')
   var color = menu.value
   if (color == 'black'){
      return vec4(0,0,0,1);
   }
   else if(color == 'red'){
      return vec4(1,0,0,1)
   }
}

var color = getColor()
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    canvas.addEventListener("mousedown", function(event){
      redraw = true;
      if(redraw) {
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        var t = vec2(2*event.clientX/canvas.width-1,
         2*(canvas.height-event.clientY)/canvas.height-1); //for scaling for making coordinates 1 and -1
      gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));// rather than creating a new buffer each time we can update the existed buffer x,y 4 bytes 
  
      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      t = vec4(color);
      gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
      index++;
    }});

    canvas.addEventListener("mouseup", function(event){
      redraw = false;
    });


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW ); //200 * 4 *4 bytes of x and y

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();

}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, index ); //Changes points into triangles 

    window.requestAnimFrame(render);

}
