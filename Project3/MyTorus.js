/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Objects id
 * @param inner - radius of the base (Z=0)
 * @param outer - radius of the top (Z = height)
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

        let theta = (2 * Math.PI) / this.slices;
        let fi = (2 * Math.PI) / this.loops;

        for(let i = 0; i <= this.slices; i++) {
            for(let j = 0; j <= this.loops; j++) {
                this.vertices.push(
                    (this.outerRadius + this.innerRadius * Math.cos(i * theta)) * Math.cos(j * fi),
                    (this.outerRadius + this.innerRadius * Math.cos(i * theta)) * Math.sin(j * fi),
                    this.innerRadius * Math.sin(i * theta)
                );

                let size = Math.sqrt(Math.pow(Math.cos(i * theta) * Math.cos(j * fi),2) +
                    Math.pow(Math.cos(i * theta) * Math.sin(j * fi), 2) +
                    Math.pow(Math.sin(i * theta) , 2));

                //normalized normals
                this.normals.push(
                    Math.cos(i * theta) * Math.cos(j * fi) / size,
                    Math.cos(i * theta) * Math.sin(j * fi) / size,
                    Math.sin(i * theta) /size
                );

                this.texCoords.push(
                    i * 1 / this.slices,
                    j * 1 / this.loops
                );
            }
        }

        for(let i = 0; i < this.slices; i++) {
            for(let j = 0; j < this.loops; j++) {
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
          
    /**
     * In this work doesn't have to be implemented
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
    updateTexCoords(length_u, length_v) {	   }
}


