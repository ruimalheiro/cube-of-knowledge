
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
        
    var vertexShader = glContext.createShader(glContext.VERTEX_SHADER);
	glContext.shaderSource(vertexShader, vertex_shader_source);
	glContext.compileShader(vertexShader);

	return vertexShader;
}