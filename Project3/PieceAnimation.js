class PieceAnimation extends CGFobject {
    /**
     * Constructor
     * @param {Scene} scene 
     */
    constructor(scene) {
        super(scene);

        //[x, y, z] of the initial visual positions of all pieces
        this.initialPositions = [
            /* White Pieces initial positions */
            [-6, 12, 0], //whiteCube1Position
            [-6, 16, 0], //whiteCube2Position
            [-2, 12, 0], //whiteCylinder1Position
            [-2, 16, 0], //whiteCylinder2Position
            [2, 12, 0], //whiteCone1Position
            [2, 16, 0], //whiteCone2Position
            [6, 12, 0], //whiteSphere1Position
            [6, 16, 0], //whiteSphere2Position

            /* Brown Pieces initial positions */
            [-6, -16, 0], //brownCube2Position
            [-6, -12, 0], //  brownCube1Position
            [-2, -16, 0], //brownCylinder2Position
            [-2, -12, 0], //brownCylinder1Position
            [2, -16, 0], //brownCone2Position
            [2, -12, 0], //brownCone1Position 
            [6, -16, 0], //brownSphere2Position 
            [6, -12, 0] //brownSphere1Position
        ];

        this.positionTile = [
            [-6, 0, -6 ], //row 1 column 1
            [-2, 0, -6],  //row 1 column 2
            [2, 0, -6],  // row 1 column 3
            [6, 0, -6],   // row 1 column 4
            [-6, 0, -2],  // row 2 column 1
            [-2, 0, -2],  // row 2 column 2
            [2, 0, -2],  // row 2 column 3
            [6, 0, -2],  // row 2 column 4
            [-6, 0, 2],  // row 3 column 1
            [-2, 0, 2],  // row 3 column 2
            [2, 0, 2],  // row 3 column 3
            [6, 0, 2],  // row 3 column 4
            [-6, 0, 6],  // row 4 column 1
            [-2, 0, 6],  // row 4 column 2
            [2, 0, 6 ],  // row 4 column 3
            [6, 0, 6]     // row 4 column 4
        ];

        this.currentPosition;
        this.pieceMoving;
        this.piece = new MyPiece(this.scene);
        this.animation;

    }

    calculateFrames(piecePickNumber, boardPickNumber, prologPiece){
        this.animation = new KeyframeAnimation(this.scene);
        this.pieceMoving = prologPiece;
        
        let initialPosition = this.initialPositions[piecePickNumber - 17];

        let finalPosition = this.positionTile[boardPickNumber-1];

        let x_diff = (finalPosition[0] - initialPosition[0]) / 10;
        let y_diff = (finalPosition[2] - initialPosition[1]) / 10;
        let z_diff = 1; //pice will go up 10 units
        let i = 0;

        for(i=0 ; i < 5; i++) {
            let translate = [initialPosition[0] + i * x_diff, i * z_diff, initialPosition[1] + i * y_diff];
            // save matrix and instance
            this.animation.instances.push(i/3);
            // saving transformation on map
            this.animation.animations.set(i/3, [translate, [0,0,0], [1, 1, 1]]);
        }
        for(i=5; i <= 10; i++) {
            let translate = [initialPosition[0] + i * x_diff, 5 -(i-5) * z_diff, initialPosition[1] + i * y_diff];
            // save matrix and instance
            this.animation.instances.push(i/3);
            // saving transformation on map
            this.animation.animations.set(i/3, [translate, [0,0,0], [1, 1, 1]]);
        }        
    }

    update(time){
        this.animation.update();
        if(this.animation.end == true) {
            this.scene.gameOrchestrator.board.boardMatrix = this.scene.gameOrchestrator.board.tempBoard;
            if(this.scene.gameOrchestrator.gameOver == true)
                this.scene.gameOrchestrator.gameState = gameStateEnum.GAME_OVER
            else this.scene.gameOrchestrator.gameState = gameStateEnum.CHANGE_PLAYER;
        }
            
    }

    display() {
        this.scene.pushMatrix();
        this.animation.apply(); 
        this.piece.displayPiece(this.pieceMoving, 0);   
        this.scene.popMatrix();
    }
}