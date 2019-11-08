/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class Plane extends CGFobject {
	constructor(scene, id, nrDivU, nrDivV) {
		super(scene);
		this.id = id;
		// nrDivU e nrDivV = 1 if not provided
		nrDivU = typeof nrDivU !== 'undefined' ? nrDivU : 1;
		nrDivV = typeof nrDivV !== 'undefined' ? nrDivV : 1;

		this.nrDivU = nrDivU;
		this.nrDivV = nrDivV;
		this.patchLengthV = 1.0 / nrDivV;
		this.patchLengthU = 1.0 / nrDivU;

		this.initBuffers();
	}

	initBuffers() {
		// Generate vertices, normals, and texCoords
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let zCoord = -0.5;
		for (let j = 0; j <= this.nrDivU; j++) {
			let xCoord = -0.5;
			for (let i = 0; i <= this.nrDivV; i++) {
				this.vertices.push(xCoord, 0, zCoord);
				this.normals.push(0, 1, 0);
			//	this.texCoords.push(xCoord, 0, zCoord);
				xCoord += this.patchLengthV;
			}
			zCoord += this.patchLengthU;
		}

		// Generating indices
		var ind = 0;
		for (let j = 0; j < this.nrDivU; j++) {
			for (let i = 0; i < this.nrDivV; i++) {
				this.indices.push(ind);
				this.indices.push(ind + this.nrDivV + 1);
				this.indices.push(ind + 1);

				this.indices.push(ind + 1);
				this.indices.push(ind + this.nrDivV + 1);
				this.indices.push(ind + this.nrDivV + 2);
				ind++;

			}
			ind++;

		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
	updateTexCoords(length_u, length_v) {
		/*this.texCoords = [		
			0, 1/length_v,
			1/length_u, 1/length_v,
			0, 0,
			1/length_u,0
		];	
		this.updateTexCoordsGLBuffers();*/
	}


}