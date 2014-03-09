
function get_demo_vertex_shader() {
	var vertex_shader_source = 
		"attribute vec3 aVertexPosition;" +
        "attribute vec2 aTextureCoordinates;" +
        "uniform mat4 uMVMatrix;" +
        "uniform mat4 uPMatrix;" +
        "varying vec2 vTextureCoordinates;" +
        "void main(void){" +
        "   gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);" +
        "   vTextureCoordinates = aTextureCoordinates;" +
        "}"
        ;
        
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertex_shader_source);
	gl.compileShader(vertexShader);

	gl.attachShader(program, vertexShader);

	return vertexShader;
}