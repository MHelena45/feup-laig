/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Objects id
 * @param innerRadius - radius of the base (Z=0)
 * @param outerRadius - radius of the top (Z = height)
 * @param slices - number of divisions around the circumference
 * @param loops - number of divisions along the Z direction
 *
 */
class MyTorus extends CGFobject {
	constructor(scene, id, innerRadius, outerRadius, slices, loops) {
		super(scene);
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.slices = slices;
        this.loops = loops;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var theta = (2 * Math.PI) / this.loops;
        var fi = (2 * Math.PI) / this.slices;


        for(var i = 0; i <= this.slices; i++) {
            for(var j = 0; j <= this.loops; j++) {
                this.vertices.push(
                    (this.outerRadius + this.innerRadius * Math.cos(j * theta)) * Math.sin(i * fi),
                    (this.outerRadius + this.innerRadius * Math.cos(j * theta)) * Math.cos(i * fi),
                    this.innerRadius * Math.sin(j * theta)
                );

                this.normals.push(
                    Math.cos(j * theta) * Math.sin(i * fi),
                    Math.cos(j * theta) * Math.cos(i * fi),
                    Math.sin(j * theta)
                );

                // Not yet tested
                this.texCoords.push(
                    j * 1 / this.slices,
                    i * 1 / this.stacks
                );
            }
        }

        for(var i = 0; i < this.slices; i++) {
            for(var j = 0; j < this.loops; j++) {
                this.indices.push(
                    i * (this.loops + 1) + j,
                    i * (this.loops + 1) + 1 + j,
                    (i + 1) * (this.loops + 1) + j
                );

                this.indices.push(
                    i * (this.loops + 1) + 1 + j,
                    (i + 1) * (this.loops + 1) + 1 + j,
                    (i + 1) * (this.loops + 1) + j
                );
            }
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    updateBuffers(complexity){
        // this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12
        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}


