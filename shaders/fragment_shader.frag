precision mediump float;
varying vec2 vTextureCoordinates;
uniform sampler2D uSampler;
void main(void){
	gl_FragColor = texture2D(uSampler, vec2(vTextureCoordinates.s, vTextureCoordinates.t));
}