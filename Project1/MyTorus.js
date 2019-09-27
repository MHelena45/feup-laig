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


