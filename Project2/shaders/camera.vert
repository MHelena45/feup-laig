attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform float timeFactor;

varying vec2 vTextureCoord;


void main() {

	vTextureCoord.x = aTextureCoord.x;
	vTextureCoord.y = (1.0 - aTextureCoord.y);

	gl_Position = vec4(aVertexPosition, 1.0);
}