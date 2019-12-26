/**
 * MyPiece
 * @constructor
 * @param scene - Reference to MyScene object
 *
 */
class MyPiece extends CGFobject {
    constructor(scene) {
        super(scene);

        // white Material
        this.whiteMaterial = new CGFappearance(this.scene);
        this.whiteMaterial.setAmbient(0.7, 0.7, 0.7, 1);
        this.whiteMaterial.setDiffuse(1, 0, 0, 1);
        this.whiteMaterial.setSpecular(0.9, 0.1, 0.1, 1);
        this.whiteMaterial.setShininess(10.0);  
        
        // brown Material
        this.brownMaterial = new CGFappearance(this.scene);
        this.brownMaterial.setAmbient(0.20, 0.10, 0, 1);
        this.brownMaterial.setDiffuse(0.50, 0.15, 0.00, 1);
        this.brownMaterial.setSpecular(1.0, 0.40, 0.10, 1);
        this.brownMaterial.setShininess(1.0); 

        // red Material
        this.selectMaterial = new CGFappearance(this.scene);
        this.selectMaterial.setAmbient(1, 0, 0, 1);
        this.selectMaterial.setDiffuse(1, 0, 0, 1);
        this.selectMaterial.setSpecular(0.9, 0.1, 0.1, 1);
        this.selectMaterial.setShininess(10.0);  


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
                break;
        }
    }

    displayPiece(prologNumberPiece, selected) {
        //pieces of player 1 end with 1 and of player 2 end with 2 always in prolog representation
        if(selected == 1)
            this.selectMaterial.apply();
        else if(prologNumberPiece % 2 == 0)
            this.brownMaterial.apply();
        else this.whiteMaterial.apply();
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
                break;
        }
        this.scene.popMatrix();
    }

}