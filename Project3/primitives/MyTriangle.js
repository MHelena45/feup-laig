/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x of the first point
 * @param y1 - Y of the first point
 * @param z1 - z of the first point
 * @param x2 - x of the second point
 * @param y2 - y of the second point
 * @param z2 - z of the second point
 * @param x3 - x of the third point
 * @param y3 - y of the third point
 * @param z3 - z of the third point
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;
		this.a = Math.sqrt(Math.pow((this.x2 - this.x1),2) + Math.pow((this.y2 - this.y1),2) + Math.pow((this.z2 - this.z1),2));
		this.b = Math.sqrt(Math.pow((this.x3 - this.x2),2) + Math.pow((this.y3 - this.y2),2) + Math.pow((this.z3 - this.z2), 2));
		this.c = Math.sqrt(Math.pow((this.x1 - this.x3), 2) + Math.pow((this.y1 - this.y3),2) + Math.pow((this.z1 - this.z3), 2));	
		this.cosb = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c,2)) / (2 * this.a * this.c);
		this.sinb = Math.sqrt( 1 - Math.pow(this.cosb,2));

		this.nX = (this.y2 - this.y1) * (this.z3 - this.z1) - (this.z2 - this.z1) * (this.y3 - this.y1);
		this.nY = (this.z2 - this.z1) * (this.x3 - this.x1) - (this.x2 - this.x1) * (this.z3 - this.z1);
		this.nZ = (this.x2 - this.x1) * (this.y3 - this.y1) - (this.y2 - this.y1) * (this.x3 - this.x1);
		this.nSize = Math.sqrt(Math.pow(this.nX,2) + Math.pow(this.nY,2) + Math.pow(this.nZ,2) ); //to normalize normals
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];
		//Facing Z positive
		
		this.normals = [
			this.nX/this.nSize, this.nY/this.nSize, this.nZ/this.nSize,
			this.nX/this.nSize, this.nY/this.nSize, this.nZ/this.nSize,
			this.nX/this.nSize, this.nY/this.nSize, this.nZ/this.nSize
		];

		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */
		this.texCoords = [	//the texture scales if necessary	
			0, 1,
			1,1,
			this.c * this.cosb, 0
		];		

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
     * @method updateTexCoords
	 * Updates the list of texture coordinates of the triangle
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
	updateTexCoords(length_u, length_v) {		
		this.texCoords = [					
			0, this.c*this.sinb /length_v,
			this.a/length_u, this.c*this.sinb /length_v,
			this.c * this.cosb /length_u, 0
		];	
		this.updateTexCoordsGLBuffers();
	}
}
