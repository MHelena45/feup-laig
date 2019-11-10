/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param 
 */
class Patch extends CGFobject {
	constructor(scene, id, npointsU, npointsV, npartsU, npartsV, controlpoints) {
		super(scene);

		this.id = id;
		this.npointsU = npointsU;
		this.npointsV = npointsV ;
		this.npartsU = npartsU; 
		this.npartsV = npartsV
		this.controlpoints = controlpoints;

		this.surfaces = [];
		this.translations = [];
	
		this.initSurface();

	}

	initSurface() {
		this.makeSurface( this.npointsU - 1 ,  this.npointsV - 1, this.controlpoints, [0,0,0]);

	}
	
	makeSurface(degree1, degree2, controlvertexes, translation) {
		console.log(controlvertexes);
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

		var obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)

		this.surfaces.push(obj);	
		this.translations.push(translation);

	}

	
	display(){
		for (var i =0; i< this.surfaces.length; i++) {

			this.scene.pushMatrix();		
			this.scene.translate(this.translations[i][0], this.translations[i][1], this.translations[i][2]);
			this.surfaces[i].display();
			this.scene.popMatrix();
		} 
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
	updateTexCoords(length_u, length_v) {

	}

	
}

