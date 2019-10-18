/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - radius of the base (Z=0)
 * @param top - radius of the top (Z = height)
 * @param height - size in the direction of the positive Z axis
 * @param slices - number of divisions around the circumference
 * @param stacks - number of divisions along the Z direction
 *
 */
class MyCylinder extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
		super(scene);
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        var tx = 0;
        var ty = 0;
        var tz = 0; 
        var lengthx = 1 / this.slices;
        var lengthy = 1 / this.stacks;
        var lengthz = this.height/ this.stacks;
              
        var ang = (2 * Math.PI) / this.slices;        
        var deltaRadius = (this.top - this.base) / this.stacks;
        var delta = (deltaRadius * i) + this.base; 

        for (var i = 0; i <= this.stacks; i++) {
            delta = (deltaRadius * i) + this.base;
            for (var j = 0; j < this.slices; j++) {
                this.vertices.push(delta * Math.cos(ang * j), delta * Math.sin(ang * j), tz);
                this.normals.push(Math.cos(j * ang), Math.sin(j * ang), Math.atan((this.base - this.top) / this.height));
                this.texCoords.push(tx, ty);
                tx += lengthx;
            }
            tx = 0;
            ty += lengthy;
            tz += lengthz;
        }
    
        for (var i = 0; i < this.stacks; i++) {
            for (var j = 0; j < this.slices - 1; j++) {
                this.indices.push(i * this.slices + j, i * this.slices + j + 1, (i + 1) * this.slices + j);
                this.indices.push(i * this.slices + j + 1, (i + 1) * this.slices + j + 1, (i + 1) * this.slices + j);
            }
    
            this.indices.push(i * this.slices + this.slices - 1, i * this.slices, (i + 1) * this.slices + this.slices - 1);
            this.indices.push(i * this.slices, i * this.slices + this.slices, (i + 1) * this.slices + this.slices - 1);
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    /**
     * In this work doesn't have to be implemented
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
    updateTexCoords(length_u, length_v) {	   }
}


