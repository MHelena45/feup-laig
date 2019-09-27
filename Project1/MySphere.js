/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Objects id
 * @param radius - radius of the base (Z=0)
 * @param top - radius of the top (Z = height)
 * @param height - size in the direction of the positive Z axis
 * @param slices - number of divisions around the circumference
 * @param stacks - number of divisions along the Z direction
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

        for(var i = -this.stacks; i <= this.stacks; i++) {
            for(var j = 0; j <= this.slices; j++) {
                this.vertices.push(
                    this.radius * Math.cos(i * theta) * Math.cos(j * fi),
                    this.radius * Math.cos(i * theta) * Math.sin(j * fi),
                    this.radius * Math.sin(i * theta)
                );

                this.normals.push(
                    Math.cos(i * theta) * Math.cos(j * fi),
                    Math.cos(i * theta) * Math.sin(j * fi),
                    Math.sin(i * theta)
                );

                // Not yet tested
                this.texCoords.push(
                    i * 1 / this.slices,
                    j * 1 / this.stacks
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
    
    updateBuffers(complexity){
        //this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12
        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}


