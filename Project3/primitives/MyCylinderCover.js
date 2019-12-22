/**
 * MyCylinderCover
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - radius of the base (Z=0)
 * @param top - radius of the top (Z = height)
 * @param height - size in the direction of the positive Z axis
 * @param slices - number of divisions around the circumference
 * @param stacks - number of divisions along the Z direction
 *
 */
class MyCylinderCover extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);
        this.height = height;
        this.cylinder = new MyCylinder(this.scene, id, base, top, height, slices, stacks);
        this.baseCircle = new MyCircle(this.scene, base, slices);
        this.topCircle  = new MyCircle(this.scene, top, slices);

        this.cylinder.initBuffers();
        this.baseCircle.initBuffers();
    }
    
    display(){
        this.scene.pushMatrix();
        this.cylinder.display();
        this.baseCircle.display();
        this.scene.translate(0, 0, this.height),
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.topCircle.display();
        this.scene.popMatrix();
    }
	

    /**
     * In this work doesn't have to be implemented
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
    updateTexCoords(length_u, length_v) {	   }
}

