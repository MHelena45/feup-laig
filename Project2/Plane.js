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

		this.obj;	

		this.initSurface();

	}

	initSurface() {

		this.makeSurface(1, // degree on U: 2 control vertexes U
			1, // degree on V: 2 control vertexes on V
		   [	// U = 0
			   [ // V = 0..1;
					[-0.5, 0, 0.5, 1 ],
					[-0.5, 0, -0.5, 1 ]
				   
			   ],
			   // U = 1
			   [ // V = 0..1
					[ 0.5, 0, 0.5, 1 ],
					[ 0.5, 0, -0.5, 1 ]							 
			   ]
		   ], // translation of surface 
		   [0,0,0]);

	}

	display(){
		this.obj.display();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
	updateTexCoords(length_u, length_v) {

	}

    makeSurface(degree1, degree2, controlvertexes, translation) {
		let nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);
		this.obj = new CGFnurbsObject(this.scene, this.nrDivU, this.nrDivV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

}