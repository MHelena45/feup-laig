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
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
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

      /*  var a = Math.sqrt(Math.pow((this.x1-this.x3)) + Math.pow((this.y1 - this.y3)) + Math.pow((this.z1 - this.z3)));
        var b = Math.sqrt(Math.pow((this.x2-this.x1)) + Math.pow((this.y2 - this.y1)) + Math.pow((this.z2 - this.z1)));
        var c = Math.sqrt(Math.pow((this.x3-this.x2)) + Math.pow((this.y3 - this.y2)) + Math.pow((this.z3 - this.z2)));

        var cosb = (Math.pow(a) - Math.pow(b) - Math.pow(c)) / (2*a*c);
        //var sinb = Math.sqrt( 1 + pow((Math.pow(a) + Math.pow(b) - Math.pow(c)) / (2*a*b), 2));
     
        this.texCoords = [
			c-a * cosb, 1 - a * sinb,
			0, 0,
			0, 1
		]
    */
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}
