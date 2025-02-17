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

        // gets the difference of x and y of both position (x is 0 in both positions)
        let x_diff = finalPosition[0] - initialPosition[0];
        let y_diff = finalPosition[2] - initialPosition[1];

        //defines a lot of keyframes to do a arc form (good approximation of a curve)
        let x_increment = x_diff / 10;
        let y_increment = y_diff / 10;

        //trajectory in arc
        let ang = Math.PI / 10; //because the movement as 10 frames
        let radius = Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
        let i = 0;   

        for( i=0 ; i < 5; i++) {
            let translate = [initialPosition[0] + i * x_increment, radius * Math.sin(ang * i), initialPosition[1] + i * y_increment];
            // save matrix and instance
            this.animation.instances.push(i/3);
            // saving transformation on map
            this.animation.animations.set(i/3, [translate, [0,0,0], [1, 1, 1]]);
            if(i == 3)
                this.animation.update(); //to create the matrix as soon as it can
        }

        for(i=5; i <= 10; i++) {
            let translate = [initialPosition[0] + i * x_increment, radius * Math.sin(ang * i), initialPosition[1] + i * y_increment];
            // save matrix and instance
            this.animation.instances.push(i/3);
            // saving transformation on map
            this.animation.animations.set(i/3, [translate, [0,0,0], [1, 1, 1]]);
        } 

    }

    update(time){
        this.animation.update();
        //if animation end, change player and check if the game ended with that play
        if(this.animation.end == true) {
            if(this.scene.gameOrchestrator.gameState == gameStateEnum.ANIMATING_PIECE) {
                this.scene.gameOrchestrator.board.boardMatrix = this.scene.gameOrchestrator.board.tempBoard;
                //before changing the player checks if game is over or tied
                this.scene.gameOrchestrator.gameState = gameStateEnum.CHANGE_PLAYER;
            } else { //when gameStateEnum.ANIMATING_PIECE_MOVIE
                this.scene.gameOrchestrator.nextMoveOfTheMovie();
            }
        }
    }

    display() {
        this.scene.pushMatrix();
        this.animation.apply(); 
        this.piece.displayPiece(this.pieceMoving, 0);   
        this.scene.popMatrix();
    }
}