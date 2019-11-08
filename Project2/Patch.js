/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param 
 */
class Patch extends CGFobject {
	constructor(scene, id, V1, V4) {
		super(scene);

		this.r = r;
		this.surfaces = [];
		this.translation = [];

		this.p1 = [-r, 0];
		this.p2; 
		this.p3;
		this.p4 = [0, r];

		this.l2;
		this.l3;
		this.l4 = r;

		this.r2;
		this.r3;
		//nurb
		this.makeSurface(id, 1, //degree on U: 2 control vertexes U
			1, //degree on V: 2 control vertexes on V
			[ //U = 0
				[ //V = 0.1
					[-2.0, -2.0, 0.0, 1],
					[- 2.0, 2.0, 0.0, 1]

				],
				// U = 1
				[
					//V = 0..1
					[
						[2.0, -2.0, 0.0, 1],
						[2.0, 2.0, 0.0, 1]
					]
				]
			]
		);

	/*	this.makeSurface("1", 2, //degree on U: 2 control vertexes U
			1, //degree on V: 2 control vertexes on V
			[ //U = 0
				[ //V = 0.1
					[-1.5, -1.5, 0.0, 1],
					[-1.5, 1.5, 0.0, 1]
				],
				// U = 1
				[
					//V = 0..1
					[
						[0, -1.5, 3.0, 1],
						[0, 1.5, 3.0, 1]
					]
				],
				// U = 1
				[
					//V = 0..1
					[
						[1.5, -1.5, 0.0, 1],
						[1.5, 1.5, 0.0, 1]
					]
				]
			]);*/
	}
	
	makeSurface(id, degree1, degree2, controlvertexes, translation) {
		var nurbSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

		var obj = new GCFnurbsSurface(this, 20, 20, nurbSurface);

		this.surfaces.push(obj);
		this.translation.push(translation);
	}

	
}

