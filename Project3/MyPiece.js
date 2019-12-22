/**
 * MyPiece
 * @constructor
 * @param scene - Reference to MyScene object
 *
 */
class MyPiece extends CGFobject {
    constructor(scene) {
        super(scene);

        this.cylinder = new MyCylinderCover(this.scene, 100, 1, 1, 2, 10, 10);
        this.cone = new MyCylinder(this.scene, 101, 1, 0, 3, 10, 10);
        this.cube = new MyCube(this.scene, 102 );
        this.sphere = new MySphere(scene, 103, 1, 10, 10);
     
    }

    getPiece(prologNumberPiece) {
        switch(prologNumberPiece){
            case 11: case 12:
                return this.cone;
                break;
            case 51: case 52:
                return this.cube;
                break;
            case 71: case 72:
                return this.cylinder;
                break;
            case 91: case 92:
                return this.sphere;
                break;
            default:
                console.log("Auxiliary Board with invalid Piece");
                break;
        }
    }

    displayPiece(prologNumberPiece) {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        switch(prologNumberPiece){
            case 11: case 12:
                this.cone.display();
                break;
            case 51: case 52:
                this.scene.translate(0, 0, 0.5);
                this.cube.display();
                break;
            case 71: case 72:
                this.cylinder.display();
                break;
            case 91: case 92:
                this.scene.translate(0, 0, 0.5);
                this.sphere.display();
                break;
            default:
                console.log("Auxiliary Board with invalid Piece");
                break;
        }
        this.scene.popMatrix();
    }

}