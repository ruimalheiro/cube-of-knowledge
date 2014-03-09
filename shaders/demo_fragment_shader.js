
function get_demo_fragment_shader() {

	var fragment_shader_source = 
		"precision mediump float;" +
	    "varying vec2 vTextureCoordinates;" +
	    "uniform sampler2D uSampler;" +
	    "void main(void){" +
	    "	gl_FragColor = texture2D(uSampler, vec2(vTextureCoordinates.s, vTextureCoordinates.t));" +
	    "}"
	    ;

	var fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER);
	glContext.shaderSource(fragmentShader, fragment_shader_source);
	glContext.compileShader(fragmentShader);

	return fragmentShader;
}