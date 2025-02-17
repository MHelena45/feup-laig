#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoordinates;
uniform float timeFactor;
uniform float lineThickness;
uniform float lineSpacing;
uniform float lineComponentR;
uniform float lineComponentG;
uniform float lineComponentB;

uniform sampler2D uSampler;		// original texture

void main() {
	
	vec4 color = texture2D(uSampler, vTextureCoordinates);

    float animation = mod(timeFactor + vTextureCoordinates.y * 100.0, 12.0 * lineSpacing);
    
    if(animation < lineThickness) {
        color = vec4(lineComponentR, lineComponentG, lineComponentB, 1.0);
    }

	color.rgb = color.rgb - (abs(vTextureCoordinates.x - 0.5) + abs(vTextureCoordinates.y - 0.5)) / 1.2;

	gl_FragColor = color;
}