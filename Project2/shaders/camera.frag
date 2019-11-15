#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform float timeFactor;

uniform sampler2D uSampler;		// original texture

void main() {
	
	vec4 color = texture2D(uSampler, vTextureCoord);

    float cenas = mod(timeFactor + vTextureCoord.y * 100.0, 12.0);
    
    if(cenas < 1.0)
        color = vec4(1.0, 1.0, 1.0, 1.0);

	color.rgb = color.rgb - (abs(vTextureCoord.x - 0.5) + abs(vTextureCoord.y - 0.5)) / 1.2;

	gl_FragColor = color;
}