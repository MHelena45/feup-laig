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

        /* 4 Points need to create a half circle */
        this.P1Top = [-this.top, 0, this.height, 1];
        this.P1Base = [-this.base, 0, 0, 1];

        let yH = 4 * this.top / 3;
        
        this.P2Top = [-this.top, yH, this.height , 1];
        this.P2Base = [-this.base, yH, 0 , 1];

        this.P3Top = [this.top, yH, this.height , 1];
        this.P3Base = [this.base, yH, 0 , 1];

        this.P4Top = [ this.top, 0, this.height, 1];
        this.P4Base = [ this.base, 0, 0, 1];

        this.initSurface();
	}
	
	initSurface(){
        this.makeSurface(3, // degree on U: 2 control vertexes U
			1, // degree on V: 2 control vertexes on V
		    [	// U = 0
			    [ // V = 0..1;
					this.P1Top,
					this.P1Base			   
                ],
                // U = 1
			    [ // V = 0..1
                    this.P2Top,
                    this.P2Base						 
                ],
                // U = 2
			    [ // V = 0..1
                    this.P3Top,
                    this.P3Base								 
                ],
			    // U = 3
			    [ // V = 0..1
					this.P4Top,
					this.P4Base						 
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


