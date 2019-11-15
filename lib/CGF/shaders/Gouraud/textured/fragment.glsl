#version 300 es
precision highp float;

in vec4 vFinalColor;
in vec2 vTextureCoordinates;

out vec4 fragColor;

uniform sampler2D uSampler;

uniform bool uUseTexture;

void main() {
	// Branching should be reduced to a minimal. 
	// When based on a non-changing uniform, it is usually optimized.
	if (uUseTexture)
	{
		vec4 textureColor = texture(uSampler, vTextureCoordinates);
		fragColor = textureColor * vFinalColor;
	}
	else
		fragColor = vFinalColor;

}