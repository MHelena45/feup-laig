/**
 * MySphere
 * Sphere is center in origin
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Objects id
 * @param radius - radius of the sphere
 * @param slices - number of divisions between poles
 * @param stacks - number of divisions around axis
 *
 */
class MySphere extends CGFobject {
	constructor(scene, id, radius, slices, stacks) {
		super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var theta = (Math.PI / 2) / this.stacks;
        var fi = (2 * Math.PI) / this.slices;

        for(var i = 0; i <= this.stacks * 2; i++) {
            for(var j = 0; j <= this.slices; j++) {
                this.vertices.push(
                    this.radius * Math.cos((i-this.stacks) * theta) * Math.cos(j * fi),
                    this.radius * Math.cos((i-this.stacks) * theta) * Math.sin(j * fi),
                    this.radius * Math.sin((i-this.stacks) * theta)
                );

                this.normals.push(
                    Math.cos((i-this.stacks) * theta) * Math.cos(j * fi),
                    Math.cos((i-this.stacks) * theta) * Math.sin(j * fi),
                    Math.sin((i-this.stacks) * theta)
                );

                this.texCoords.push(
                    j / this.slices,
                    1 - (i / (this.stacks * 2))
                );
            }
        }

        for(var i = 0; i < this.stacks * 2; i++) {
            for(var j = 0; j < this.slices; j++) {
                this.indices.push(
                    i * (this.slices + 1) + j,
                    i * (this.slices + 1) + 1 + j,
                    (i + 1) * (this.slices + 1) + j
                );

                this.indices.push(
                    i * (this.slices + 1) + 1 + j,
                    (i + 1) * (this.slices + 1) + 1 + j,
                    (i + 1) * (this.slices + 1) + j
                );
            }
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * In this work doesn't have to be implemented
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
    updateTexCoords(length_u, length_v) {	  }
}


