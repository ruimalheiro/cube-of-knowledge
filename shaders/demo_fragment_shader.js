
function get_demo_fragment_shader() {

	var fragment_shader_source = 
		"precision mediump float;" +
	    "varying vec2 vTextureCoordinates;" +
	    "uniform sampler2D uSampler;" +
	    "void main(void){" +
	    "	gl_FragColor = texture2D(uSampler, vec2(vTextureCoordinates.s, vTextureCoordinates.t));" +
	    "}"
	    ;

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragment_shader_source);
	gl.compileShader(fragmentShader);

	gl.attachShader(program, fragmentShader);

	return fragmentShader;
}