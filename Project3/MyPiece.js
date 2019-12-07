/**
 * MyPiece
 * @constructor
 * @param scene - Reference to MyScene object
 *
 */
class MyPiece extends CGFobject {
    constructor(scene) {
        super(scene);

        /* White Pieces initial positions */
        this.whiteCube1Position = [-6, -12, 0];
        this.whiteCube2Position = [-6, -16, 0];
        this.whiteCylinder1Position = [-2, -12, 0];
        this.whiteCylinder2Position = [-2, -16, 0];
        this.whiteCone1Position = [2, -12, 0];
        this.whiteCone2Position = [2, -16, 0];
        this.whiteSphere1Position = [6, -12, 0];
        this.whiteSphere2Position = [6, -16, 0];

        /* Brown Pieces initial positions */
        this.brownCube1Position = [-6, 12, 0];
        this.brownCube2Position = [-6, 16, 0];
        this.brownCylinder1Position = [-2, 12, 0];
        this.brownCylinder2Position = [-2, 16, 0];
        this.brownCone1Position = [2, 12, 0];
        this.brownCone2Position = [2, 16, 0];
        this.brownSphere1Position = [6, 12, 0];
        this.brownSphere2Position = [6, 16, 0];
    }

    //TODO: get and set of the pieces

    displayWhiteConePiece(primitivesComponentChildrenIDs) {
        this.scene.translate(this.whiteCone1Position[0], this.whiteCone1Position[1], this.whiteCone1Position[2]);
        this.scene.registerForPick(21, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
        this.scene.translate(-this.whiteCone1Position[0], -this.whiteCone1Position[1], -this.whiteCone1Position[2]);
        this.scene.translate(this.whiteCone2Position[0], this.whiteCone2Position[1], this.whiteCone2Position[2]);   
        this.scene.registerForPick(22, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
    }

    displayWhiteSpherePiece(primitivesComponentChildrenIDs) {
        this.scene.translate(this.whiteSphere1Position[0], this.whiteSphere1Position[1], this.whiteSphere1Position[2]);
        this.scene.registerForPick(23, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
        this.scene.translate(-this.whiteSphere1Position[0], -this.whiteSphere1Position[1], -this.whiteSphere1Position[2]);
        this.scene.translate(this.whiteSphere2Position[0], this.whiteSphere2Position[1], this.whiteSphere2Position[2]);
        this.scene.registerForPick(24, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
    }

    displayWhiteCylinderPiece(primitivesComponentChildrenIDs) {
        this.scene.translate(this.whiteCylinder1Position[0], this.whiteCylinder1Position[1], this.whiteCylinder1Position[2]);
        this.scene.registerForPick(19, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
        this.scene.translate(-this.whiteCylinder1Position[0], -this.whiteCylinder1Position[1], -this.whiteCylinder1Position[2]);
        this.scene.translate(this.whiteCylinder2Position[0], this.whiteCylinder2Position[1], this.whiteCylinder2Position[2]);
        this.scene.registerForPick(20, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
    }

    displayWhiteCubePiece(primitivesComponentChildrenIDs) {
        this.scene.translate(this.whiteCube1Position[0], this.whiteCube1Position[1], this.whiteCube1Position[2]);
        this.scene.registerForPick(17, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
        this.scene.translate(-this.whiteCube1Position[0], -this.whiteCube1Position[1], -this.whiteCube1Position[2]);
        this.scene.translate(this.whiteCube2Position[0], this.whiteCube2Position[1], this.whiteCube2Position[2]);
        this.scene.registerForPick(18, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
    }

    displayBrownConePiece(primitivesComponentChildrenIDs) {
        this.scene.translate(this.brownCone1Position[0], this.brownCone1Position[1], this.brownCone1Position[2]);
        this.scene.registerForPick(29, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
        this.scene.translate(-this.brownCone1Position[0], -this.brownCone1Position[1], -this.brownCone1Position[2]);
        this.scene.translate(this.brownCone2Position[0], this.brownCone2Position[1], this.brownCone2Position[2]);
        this.scene.registerForPick(30, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
    }

    displayBrownCubePiece(primitivesComponentChildrenIDs) {
        this.scene.translate(this.brownCube1Position[0], this.brownCube1Position[1], this.brownCube1Position[2]);
        this.scene.registerForPick(25, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
        this.scene.translate(-this.brownCube1Position[0], -this.brownCube1Position[1], -this.brownCube1Position[2]);
        this.scene.translate(this.brownCube2Position[0], this.brownCube2Position[1], this.brownCube2Position[2]);
        this.scene.registerForPick(26, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
    }   
    
    displayBrownSpherePiece(primitivesComponentChildrenIDs) {
        this.scene.translate(this.brownSphere1Position[0], this.brownSphere1Position[1], this.brownSphere1Position[2]);
        this.scene.registerForPick(31, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
        this.scene.translate(-this.brownSphere1Position[0], -this.brownSphere1Position[1], -this.brownSphere1Position[2]);
        this.scene.translate(this.brownSphere2Position[0], this.brownSphere2Position[1], this.brownSphere2Position[2]);
        this.scene.registerForPick(32, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
    }

    displayBrownCylinderPiece(primitivesComponentChildrenIDs) {
        this.scene.translate(this.brownCylinder1Position[0], this.brownCylinder1Position[1], this.brownCylinder1Position[2]);
        this.scene.registerForPick(27, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
        this.scene.translate(-this.brownCylinder1Position[0], -this.brownCylinder1Position[1], -this.brownCylinder1Position[2]);
        this.scene.translate(this.brownCylinder2Position[0], this.brownCylinder2Position[1], this.brownCylinder2Position[2]);
        this.scene.registerForPick(28, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
    } 
}