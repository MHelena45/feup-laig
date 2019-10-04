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
	constructor(scene, id, inner, outer, slices, loops) {
		super(scene);
        this.innerRadius = inner;
        this.outerRadius = outer;
        this.slices = slices;
        this.loops = loops;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var theta = (2 * Math.PI) / this.slices;
        var fi = (2 * Math.PI) / this.loops;


        for(var i = 0; i <= this.slices; i++) {
            for(var j = 0; j <= this.loops; j++) {
                this.vertices.push(
                    (this.outerRadius + this.innerRadius * Math.cos(i * theta)) * Math.cos(j * fi),
                    (this.outerRadius + this.innerRadius * Math.cos(i * theta)) * Math.sin(j * fi),
                    this.innerRadius * Math.sin(i * theta)
                );

                this.normals.push(
                    Math.cos(i * theta) * Math.cos(j * fi),
                    Math.cos(i * theta) * Math.sin(j * fi),
                    Math.sin(i * theta)
                );

                // Not yet tested
                this.texCoords.push(
                    i * 1 / this.slices,
                    j * 1 / this.loops
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


