/**
 * MyCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCube extends CGFobject {
	constructor(scene, id) {
		super(scene);
		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [
			-1, -1, 1,  //0
			-1, 1, 1,   //1
			1, 1, 1,	  //2
			1, -1, 1,   //3

			-1, -1, 1,  //4
			-1, 1, 1,   //5
			-1, 1, -1, //6
			-1, -1, -1,  //7

			-1, 1, -1, //8
			-1, -1, -1, //9
			1, 1, -1, //10
			1, -1, -1, //11
		
			1, 1, -1, //12
			1, -1, -1, //13
			1, 1, 1,	  //14
			1, -1, 1,   //15

			-1, 1, 1,   //16
			-1, 1, -1, //17
			1, 1, -1, //18
			1, 1, 1,	  //19

			-1, -1, 1,  //20
			1, -1, 1,   //21
			1, -1, -1, //22
			-1, -1, -1,  //23
		];

		//Counter-clockwise reference of vertices
		this.indices = [
		//Front SIDE		
		2,1, 0,
		3, 2, 0,

		//Left SIDE
		4, 5, 6,
		4, 6,7,

		//BACK SIDE
		10, 9 , 8,
		9, 10, 11,

		//Right SIDE
		12, 15, 13,	
		12, 14, 15,

		//TOP SIDE
		18,17 , 16,
		19,18, 16,

		//DOWN SIDE
		20, 23, 22,
		20, 22, 21,
		];
		
		this.normals = [
			// left and right
			0, 0, 1,  //0
			0, 0, 1,   //1
			0, 0, 1,	  //2
			0, 0, 1,   //3
			-1, 0,0 ,  //4
			-1, 0, 0,  //5
			-1, 0,0 ,  //6
			-1, 0, 0,  //7
			0, 0, -1,  //8
			0, 0, -1,   //9
			0, 0, -1,	  //10
			0, 0, -1,   //11
			1, 0,0 ,  //12
			1, 0, 0,  //13
			1, 0,0 ,  //14
			1, 0, 0,  //15
			0, 1, 0, //16
			0, 1, 0, //17
			0, 1, 0,
			0, 1, 0,
			0,- 1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateBuffers(complexity){
        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
	}
	
	 /**
     * In this work doesn't have to be implemented
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
    updateTexCoords(length_u, length_v) {	   }
}

