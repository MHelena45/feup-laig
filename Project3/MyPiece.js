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

        this.positionTile = [
            [-6, 6, 0 ], //row 1 column 1
            [-2, 6, 0],  //row 1 column 2
            [2, 6, 0 ], // row 1 column 3
            [6, 6, 0],
            [-6, 2, 0],
            [-2, 2, 0],
            [2, 2, 0 ],
            [6, 2, 0], 
            [-6, -2, 0 ],
            [-2, -2, 0],
            [2, -2, 0 ],
            [6, -2, 0],
            [-6, -6 , 0 ],
            [-2, -6, 0],
            [2, -6, 0 ],
            [6, -6, 0]
        ];

        this.selected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        this.selectMaterial = new CGFappearance(this.scene);
        this.selectMaterial.setAmbient(1, 0, 0, 1);
        this.selectMaterial.setDiffuse(1, 0, 0, 1);
        this.selectMaterial.setSpecular(0.9, 0.1, 0.1, 1);
        this.selectMaterial.setShininess(10.0);


    }

    isSelected() {
        for(let i = 0; i < this.selected.length; i++)
            if(this.selected[i] == 1)
                return true;
        return false;
    }

    setPiece(piece, row, column) {
        let calc = (4 * (row - 1)) + (column - 1);
        switch(piece){
            case(17):
                this.whiteCube1Position = this.positionTile[calc];
                break;
            case(18):
                this.whiteCube2Position = this.positionTile[calc];
                break;
            case(19):
                this.whiteCylinder1Position = this.positionTile[calc];
                break;
            case(20):
                this.whiteCylinder2Position = this.positionTile[calc];
                break;
            case(21):
                this.whiteCone1Position = this.positionTile[calc];
                break;
            case(22):
                this.whiteCone2Position = this.positionTile[calc];
                break;
            case(23):
                this.whiteSphere1Position = this.positionTile[calc];
                break;
            case(24):
                this.whiteSphere2Position = this.positionTile[calc];
                break;
            case(25):
                this.brownCube1Position = this.positionTile[calc];
                break;
            case(26):
                this.brownCube2Position = this.positionTile[calc];
                break;
            case(27):
                this.brownCylinder1Position =  this.positionTile[calc];
                break;
            case(28):
                this.brownCylinder2Position =  this.positionTile[calc];
                break;
            case(29):
                this.brownCone1Position =  this.positionTile[calc];
                break;
            case(30):
                this.brownCone2Position =  this.positionTile[calc];
                break;
            case(31):
                this.brownSphere1Position =  this.positionTile[calc];
                break;
            case(32):
                this.brownSphere2Position =  this.positionTile[calc];
                break;
            default:
                break;

        }
    }

    checkPicked(piece) {
        if(this.selected[piece - 17])
            this.selectMaterial.apply();
    }

    displayWhiteConePiece(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.whiteCone1Position[0], this.whiteCone1Position[1], this.whiteCone1Position[2]);
        this.scene.registerForPick(21, primitivesComponentChildrenIDs);    
        this.checkPicked(21);   
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayWhiteConePiece1(primitivesComponentChildrenIDs) {   
        this.scene.pushMatrix();
        this.scene.translate(this.whiteCone2Position[0], this.whiteCone2Position[1], this.whiteCone2Position[2]);   
        this.scene.registerForPick(22, primitivesComponentChildrenIDs);
        this.checkPicked(22);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayWhiteSpherePiece(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.whiteSphere1Position[0], this.whiteSphere1Position[1], this.whiteSphere1Position[2]);
        this.scene.registerForPick(23, primitivesComponentChildrenIDs);
        this.checkPicked(23);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayWhiteSpherePiece1(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.whiteSphere2Position[0], this.whiteSphere2Position[1], this.whiteSphere2Position[2]);
        this.checkPicked(24);  
        this.scene.registerForPick(24, primitivesComponentChildrenIDs);
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayWhiteCylinderPiece(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.whiteCylinder1Position[0], this.whiteCylinder1Position[1], this.whiteCylinder1Position[2]);
        this.scene.registerForPick(19, primitivesComponentChildrenIDs);
        this.checkPicked(19);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayWhiteCylinderPiece1(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.whiteCylinder2Position[0], this.whiteCylinder2Position[1], this.whiteCylinder2Position[2]);
        this.scene.registerForPick(20, primitivesComponentChildrenIDs);
        this.checkPicked(20);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayWhiteCubePiece(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.whiteCube1Position[0], this.whiteCube1Position[1], this.whiteCube1Position[2]);
        this.scene.registerForPick(17, primitivesComponentChildrenIDs);
        this.checkPicked(17);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayWhiteCubePiece1(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.whiteCube2Position[0], this.whiteCube2Position[1], this.whiteCube2Position[2]);
        this.scene.registerForPick(18, primitivesComponentChildrenIDs);
        this.checkPicked(18);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayBrownConePiece(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.brownCone1Position[0], this.brownCone1Position[1], this.brownCone1Position[2]);
        this.scene.registerForPick(29, primitivesComponentChildrenIDs);
        this.checkPicked(29);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayBrownConePiece1(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.brownCone2Position[0], this.brownCone2Position[1], this.brownCone2Position[2]);
        this.scene.registerForPick(30, primitivesComponentChildrenIDs);
        this.checkPicked(30);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayBrownCubePiece(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.brownCube1Position[0], this.brownCube1Position[1], this.brownCube1Position[2]);
        this.scene.registerForPick(25, primitivesComponentChildrenIDs);
        this.checkPicked(25);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayBrownCubePiece1(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.brownCube2Position[0], this.brownCube2Position[1], this.brownCube2Position[2]);
        this.scene.registerForPick(26, primitivesComponentChildrenIDs);
        this.checkPicked(26);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }   
    
    displayBrownSpherePiece(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.brownSphere1Position[0], this.brownSphere1Position[1], this.brownSphere1Position[2]);
        this.scene.registerForPick(31, primitivesComponentChildrenIDs);
        this.checkPicked(31);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }   
    
    displayBrownSpherePiece1(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.brownSphere2Position[0], this.brownSphere2Position[1], this.brownSphere2Position[2]);
        this.scene.registerForPick(32, primitivesComponentChildrenIDs);
        this.checkPicked(32);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayBrownCylinderPiece(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.brownCylinder1Position[0], this.brownCylinder1Position[1], this.brownCylinder1Position[2]);
        this.scene.registerForPick(27, primitivesComponentChildrenIDs);
        this.checkPicked(27);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }

    displayBrownCylinderPiece1(primitivesComponentChildrenIDs) {
        this.scene.pushMatrix();
        this.scene.translate(this.brownCylinder2Position[0], this.brownCylinder2Position[1], this.brownCylinder2Position[2]);
        this.scene.registerForPick(28, primitivesComponentChildrenIDs);
        this.checkPicked(28);  
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    } 
}