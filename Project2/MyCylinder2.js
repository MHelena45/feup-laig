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
class MyCylinder2 extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);       
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
        this.stacks = stacks;	

        this.surface;
        this.P1 = [-this.top, 0, this.height, 1];
        this.P4 = [ this.top, 0, this.height, 1];
        this.R1 = [0, this.top, this.height, 1];
       
        this.L3 = [-this.top/ 2, this.top, 0, 1];
        this.R2 = [this.top/2, this.top, 0, 1];

        let yH = 4 * this.top/ 3;
        this.L2 = [-this.top,  yH/2, 0, 1];
        this.R3 = [this.top, yH/2, 0, 1];
        this.H = [0, yH , 0, 1];

        this.P2 = [-this.top, yH, this.height , 1];
        this.P3 = [this.top, yH, this.height , 1];

        this.initSurface();
	}
	
	initSurface(){
        this.makeSurface(3, // degree on U: 2 control vertexes U
			1, // degree on V: 2 control vertexes on V
		    [	// U = 0
			    [ // V = 0..1;
					this.P1,
					[-this.base, 0, 0, 1]
				   
                ],
                // U = 1
			    [ // V = 0..1
                    this.P2,
                    [-this.base, 4 * this.base/ 3, 0 , 1]							 
                ],
                // U = 2
			    [ // V = 0..1
                    this.P3,
                    [this.base, 4 * this.base/ 3, 0 , 1]								 
                ],
			    // U = 3
			    [ // V = 0..1
					this.P4,
					[ this.base, 0, 0, 1]							 
			    ]
		   ]);
           
    }

    makeSurface(degree1, degree2, controlvertexes) {			
		let nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);
        this.surface = new CGFnurbsObject(this.scene, this.slices/2, this.stacks, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)		
    }
       
	display(){
        this.surface.display();
		this.scene.pushMatrix();		
		this.scene.rotate(Math.PI, 0, 0, 1);
		this.surface.display();
		this.scene.popMatrix();
	} 
    
    /**
     * In this work doesn't have to be implemented
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
    updateTexCoords(length_u, length_v) {	   }
}


