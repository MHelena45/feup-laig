#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoordinates;

uniform sampler2D uSampler;		// original texture

void main() {
	
	vec4 color = texture2D(uSampler, vTextureCoordinates);

	gl_FragColor = color;
}
