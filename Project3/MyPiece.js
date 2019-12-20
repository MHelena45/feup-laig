/**
 * MyPiece
 * @constructor
 * @param scene - Reference to MyScene object
 *
 */
class MyPiece extends CGFobject {
    constructor(scene) {
        super(scene);

        //[x, y, z] of the initial visual positions of all pieces
        this.initialPositions = [
            /* White Pieces initial positions */
            [-6, -12, 0], //whiteCube1Position
            [-6, -16, 0], //whiteCube2Position
            [-2, -12, 0], //whiteCylinder1Position
            [-2, -16, 0], //whiteCylinder2Position
            [2, -12, 0], //whiteCone1Position
            [2, -16, 0], //whiteCone2Position
            [6, -12, 0], //whiteSphere1Position
            [6, -16, 0], //whiteSphere2Position

            /* Brown Pieces initial positions */
            [-6, 12, 0], //  brownCube1Position
            [-6, 16, 0], //brownCube2Position
            [-2, 12, 0], //brownCylinder1Position
            [-2, 16, 0], //brownCylinder2Position
            [2, 12, 0], //brownCone1Position 
            [2, 16, 0], //brownCone2Position
            [6, 12, 0], //brownSphere1Position
            [6, 16, 0] //brownSphere2Position 
        ];

        this.currentPositions = [
            /* White Pieces initial positions */
            [-6, -12, 0], // whiteCube1Position
            [-6, -16, 0], // whiteCube2Position 
            [-2, -12, 0], // whiteCylinder1Position
            [-2, -16, 0], // whiteCylinder2Position 
            [2, -12, 0], // whiteCone1Position
            [2, -16, 0], // whiteCone2Position
            [6, -12, 0], // whiteSphere1Position
            [6, -16, 0], // whiteSphere2Position 

            /* Brown Pieces initial positions */
            [-6, 12, 0], //brownCube1Position
            [-6, 16, 0], //brownCube2Position
            [-2, 12, 0], //brownCylinder1Position
            [-2, 16, 0], //brownCylinder2Position
            [2, 12, 0], //brownCone1Position 
            [2, 16, 0], //brownCone2Position
            [6, 12, 0], //brownSphere1Position 
            [6, 16, 0] //brownSphere2Position 
        ];

        this.positionTile = [
            [-6, 6, 0 ], //row 1 column 1
            [-2, 6, 0],  //row 1 column 2
            [2, 6, 0 ],  // row 1 column 3
            [6, 6, 0],   // row 1 column 4
            [-6, 2, 0],  // row 2 column 1
            [-2, 2, 0],  // row 2 column 2
            [2, 2, 0 ],  // row 2 column 3
            [6, 2, 0],  // row 2 column 4
            [-6, -2, 0 ],  // row 3 column 1
            [-2, -2, 0],  // row 3 column 2
            [2, -2, 0 ],  // row 3 column 3
            [6, -2, 0],  // row 3 column 4
            [-6, -6 , 0 ],  // row 4 column 1
            [-2, -6, 0],  // row 4 column 2
            [2, -6, 0 ],  // row 4 column 3
            [6, -6, 0]     // row 4 column 4
        ];

        this.selected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        this.selectMaterial = new CGFappearance(this.scene);
        this.selectMaterial.setAmbient(1, 0, 0, 1);
        this.selectMaterial.setDiffuse(1, 0, 0, 1);
        this.selectMaterial.setSpecular(0.9, 0.1, 0.1, 1);
        this.selectMaterial.setShininess(10.0);       
    }

    /**
     * restart puts all the pieces in the initial positions
     */
    restart(){
        for(let i=0; i< this.initialPositions.length; i++){
            this.currentPositions[i] = this.initialPositions[i];
        }
    }

    /**
     * checks if there is a pieces selected
     */
    isSelected() {
        for(let i = 0; i < this.selected.length; i++)
            if(this.selected[i] == 1)
                return true;
        return false;
    }

    deselect(){
        for(let j = 0; j < this.selected.length; j++)
            this.selected[j] = 0;
    }

    pieceSelected() {
        if((this.selected[0] == 1) || (this.selected[1] == 1)) {
            return 51;
        }
        if(this.selected[2] == 1 || this.selected[3] == 1){
            return 71;
        }
        if(this.selected[4] == 1 || this.selected[5] == 1)
            return 11;
        if(this.selected[6] == 1 || this.selected[7] == 1)
            return 91;
        if(this.selected[7] || this.selected[8])
            return 52;
        if(this.selected[9] || this.selected[10])
            return 72;
        if(this.selected[11] || this.selected[12])
            return 12;
        if(this.selected[13] || this.selected[14])
            return 92;
    }

    movePiece(piece, row, column) {
        let calc = (4 * (row - 1)) + (column - 1);
        //first piece id is 17 an the others are sequential
        this.currentPositions[piece-17] = this.positionTile[calc];

    }

    checkPicked(piece) {
        if(this.selected[piece - 17])
            this.selectMaterial.apply();
    }

    displayPiece(primitivesComponentChildrenIDs, pickNumber){
        this.scene.pushMatrix();
        this.scene.translate(this.currentPositions[pickNumber-17][0], this.currentPositions[pickNumber-17][1], this.currentPositions[pickNumber-17][2]);
        this.scene.registerForPick(pickNumber, primitivesComponentChildrenIDs);    
        this.checkPicked(pickNumber);   
        primitivesComponentChildrenIDs.display();
        this.scene.popMatrix();
    }   

}