const gameStateEnum = {
    MENU: 0,                // show menu and handle settings
    LOADING: 1,             // load file, render and request scene, board, pieces, etc
    PLAYER_CHOOSING: 2,     // player is choosing what to play
    ANIMATING_PIECE: 3,     // moving piece for animation
    GAME_OVER: 4,           // game is over play again
    CHANGE_PLAYER: 5,       //used to animate camera and change between players
    ANIMATING_PIECE_MOVIE: 6
}

const playerTurnEnum = {
    PLAYER1_TURN: 0,        // player 1 is playing
    PLAYER2_TURN: 1         // player 2 is playing
}

class MyGameOrchestrator {
    /**
     * Constructor
     * @param {Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;
        /// Prolog interface for communication
        this.prologInterface = new MyPrologInterface();

        /// Board
        this.board = new MyGameBoard(this.scene);
        this.whiteAuxiliaryBoard = new MyAuxiliaryBoard(this.scene, 10, 16);
        this.brownAuxiliaryBoard = new MyAuxiliaryBoard(this.scene, -20, 24);
        this.pieceAnimation = new PieceAnimation(this.scene);

        /// Difficulty Level DropBox
        this.difficultyLevel = 1;
        this.brownPlayer = 1;
        this.whitePlayer = 0;
        this.theme = 0;

        //used for buttons (variable doesn't have a value because is a button)
        this.interface = { interface: function(){ }};

        /// Labels and ID's for object selection on MyInterface
        this.levels = { '1': 1, '2': 2, '3': 3 }; 
        this.playerOptions = { 'human': 0, 'bot' : 1};
        this.themeOptions = {'Christmas': 0, 'Space': 1};

        /// Setup game states and initial arrays
        this.gameState= gameStateEnum.LOADING;
        this.currentPlayer = playerTurnEnum.PLAYER1_TURN;
        this.selectedPieceId;

        //used for animated movement of the camera and not just a change of 2 points
        this.cameraMovement = 100;

        this.gameOver = false;
        this.scoreboard = new MyScoreboard(this.scene);

        this.moves = [];
        this.currentFrame = 0;
        this.setupProlog();
    }

    /**
     * Setup initial board and pieces arrays
     * requested from Prolog Server
     */
    setupProlog() {
        this.gameState = gameStateEnum.LOADING;

        let thisGame = this;
        /// Initialize board
        this.prologInterface.getPrologRequest(
            "init_board",
            function (data) {
                thisGame.board.boardMatrix = JSON.parse(data.target.response);
                /// Initialize white pieces
                thisGame.prologInterface.getPrologRequest(
                    "init_white_pieces",
                    function (data) {
                        thisGame.whiteAuxiliaryBoard.pieces = JSON.parse(data.target.response);
                        /// Initialize brown pieces
                        thisGame.prologInterface.getPrologRequest(
                            "init_brown_pieces",
                            function (data) {
                                thisGame.brownAuxiliaryBoard.pieces = JSON.parse(data.target.response);
                                thisGame.gameState = gameStateEnum.MENU;
                            }
                        );
                    }
                );
            }
        );
    }

    changePlayer(player) {
        if(this.gameState == gameStateEnum.CHANGE_PLAYER) {         
            this.scene.camera.orbit([0, 1, 0], Math.PI/100);
            this.cameraMovement--;
            if(this.cameraMovement == 0){
                this.whiteAuxiliaryBoard.deselect();
                this.brownAuxiliaryBoard.deselect();
                this.gameState = gameStateEnum.PLAYER_CHOOSING;
                this.cameraMovement = 100;
                this.currentPlayer = player;
                this.scoreboard.reset();
            }
        }
    }

    /**
     * moves piece to coordinate column row
     * @param {Number} column column where the piece is going to be moved
     * @param {Number} row row where the piece is going to be moved
     * @param {Number} piece which piece is going to be moved
     */
    move(column, row, piece) {
        // build request
        let thisGame = this;
        let move = [row, column, piece];
        let request = "move(" + JSON.stringify(move) + "," + JSON.stringify(thisGame.board.boardMatrix) + ","
        + JSON.stringify(thisGame.whiteAuxiliaryBoard.pieces) + "," + JSON.stringify(thisGame.brownAuxiliaryBoard.pieces) + ","
        + JSON.stringify(this.currentPlayer + 1) + ")";
        // send request
        this.prologInterface.getPrologRequest(
            request,
            function (data) {
                let response = JSON.parse(data.target.response);
                let validMove = response[0];
                // move is valid
                if (validMove) {
                    thisGame.board.tempBoard = response[1];
                    if(thisGame.currentPlayer == playerTurnEnum.PLAYER1_TURN)
                        thisGame.whiteAuxiliaryBoard.removePiece(thisGame.selectedPieceId);
                    else
                        thisGame.brownAuxiliaryBoard.removePiece(thisGame.selectedPieceId);
                    // add new move to moves array
                    move = [row, column, piece, thisGame.selectedPieceId];
                    thisGame.moves.push(move);
                    thisGame.isGameOver(row, column, piece);
                    
                    thisGame.gameState = gameStateEnum.ANIMATING_PIECE;
                }
                // move is not valid (ask player to play again)
                else {
                    alert("Invalid play! The other player has a piece with the same shape!");
                    thisGame.gameState = gameStateEnum.PLAYER_CHOOSING;
                }
            }
        );
    }

    /**
     * 
     */
    undo() {
        if (this.gameState != gameStateEnum.PLAYER_CHOOSING)
            return;
        // get last move and remove it from the moves array
        let lastMove = this.moves.pop();
        // lastMove => [Row, Column, Piece]
        let lastRow = lastMove[0];
        let lastColumn = lastMove[1];
        let lastPiece = lastMove[2];
        // update game board
        this.board.boardMatrix[lastRow-1][lastColumn-1] = 0;
        // update auxilary board
        let pieceColor = lastPiece % 10;
        switch(pieceColor) {
            // WHITE
            case 1:
                this.whiteAuxiliaryBoard.undo(lastPiece);
                break;
            // BROWN
            case 2:
                this.brownAuxiliaryBoard.undo(lastPiece);
                break;
        }
        // change player
        this.gameState = gameStateEnum.CHANGE_PLAYER;
    }

    /**
     * 
     */
    botMove() {
        // build request
        let thisGame = this;
        let request = "bot_move(" + JSON.stringify(this.difficultyLevel) + "," + JSON.stringify(thisGame.board.boardMatrix) + ","
        + JSON.stringify(thisGame.whiteAuxiliaryBoard.pieces) + "," + JSON.stringify(thisGame.brownAuxiliaryBoard.pieces) + ","
        + JSON.stringify(this.currentPlayer + 1) + ")";
        // send request
        this.prologInterface.getPrologRequest(
            request,
            function (data) {
                let response = JSON.parse(data.target.response);

                // get generated move
                let row = response[3][0];
                let column = response[3][1];
                let piece = response[3][2];
                let piecePickId;
                // get pick id
                if(thisGame.currentPlayer == playerTurnEnum.PLAYER1_TURN)
                    piecePickId = thisGame.whiteAuxiliaryBoard.getPickId(piece);
                else
                    piecePickId = thisGame.brownAuxiliaryBoard.getPickId(piece);

                let tilePickNumber = (column - 1) * 4 + row;
                thisGame.pieceAnimation.calculateFrames(piecePickId, tilePickNumber, piece);  

                // build move for js
                let move = [row, column, piece, piecePickId];
                thisGame.moves.push(move);
                // update baords with response
                thisGame.board.tempBoard = response[0];
                thisGame.whiteAuxiliaryBoard.pieces = response[1];
                thisGame.brownAuxiliaryBoard.pieces = response[2];
      
                thisGame.isGameOver(row, column, piece);

                thisGame.gameState = gameStateEnum.ANIMATING_PIECE;
            }
        );
    }

    /**
     * verifies if game is over
     * @param {Number} row last move row
     * @param {Number} column last move column
     * @param {Number} piece last move piece
     */
    isGameOver(row, column, piece) {
        // build request
        let thisGame = this;
        let move = [row, column, piece];
        let request = "game_over(" + JSON.stringify( thisGame.board.tempBoard )
        + ","+ JSON.stringify(move) + ")";
        // send request
        this.prologInterface.getPrologRequest(
            request,
            function (data) {
                let response = JSON.parse(data.target.response);
                thisGame.gameOver = response[0];
            }
        );
    }

    //Load of new scenes
    updateTheme(){
        let filename;
        if(this.theme == 0){
            filename="LAIG_TP3_XML_T6_G02_Theme_Christmas.xml";
        } else if(this.theme == 1){
            filename="LAIG_TP3_XML_T6_G02_Theme_Space.xml";
        }
        this.scene.graph = new MySceneGraph(filename, this.scene);
        this.scene.sceneInited = false;
    }
 
    updateLevel(){
        console.log("Level change!");
    }

    updateBrownPlayer(){
        if(this.brownPlayer == 1)
            console.log("Play Bot");
        else console.log("Play Human");
    }

    updateWhitePlayer(){
        if(this.whitePlayer == 1)
            console.log("Play Bot");
        else console.log("Play Human");
    }

    update(time) {
        if(this.gameState == gameStateEnum.ANIMATING_PIECE || this.gameState == gameStateEnum.ANIMATING_PIECE_MOVIE) {
            this.pieceAnimation.update(time);
        }

        if (this.gameState == gameStateEnum.PLAYER_CHOOSING) {
            this.scoreboard.update();
        }
    }

    movie() {
        if(this.gameState != gameStateEnum.ANIMATING_PIECE_MOVIE) {
            //changes the camera to a upper position (with camera movement as to slow the movement)
            let views = this.scene.graph.getViews();
            let views_ID = this.scene.graph.getViewsID();
            this.scene.camera = views[views_ID[1]];   
            //during the movie we can move the camera    
            this.scene.interface.setActiveCamera(this.scene.camera);    
        
            this.board.boardMatrix = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            this.board.tempBoard = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            this.whiteAuxiliaryBoard.pieces = [11, 11, 51, 51, 71, 71, 91, 91];
            this.brownAuxiliaryBoard.pieces = [12, 12, 52, 52, 72, 72, 92, 92];
            this.nextFrameMovie();
            this.gameState = gameStateEnum.ANIMATING_PIECE_MOVIE;
        }         
    }

    nextFrameMovie() {
        if(this.currentFrame < this.moves.length) {
            //changes board
            if(this.currentFrame >= 1) {
                let move = this.moves[this.currentFrame - 1];
                this.board.boardMatrix[move[0] - 1][move[1] - 1] = move[2];
            }

            //calculates the nest frames to do the move
            let move = this.moves[this.currentFrame];
            let column = move[0];
            let row = move[1];
            let tilePickNumber = (row - 1) * 4 + column;
            let prologPiece = move[2];
            this.pieceAnimation.calculateFrames(move[3], tilePickNumber, prologPiece);

            if( prologPiece % 2 == 0)
                this.brownAuxiliaryBoard.removePiece(move[3]);
            else this.whiteAuxiliaryBoard.removePiece(move[3]);

            this.currentFrame++;  
        } else {
            this.gameState = gameStateEnum.PLAYER_CHOOSING;
            this.reset();
            alert("Movie Finished");
        }
                
    }

    orchestrate() {
        if(this.gameState == gameStateEnum.PLAYER_CHOOSING) {
            if (this.scene.pickMode == false) {
                if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                    for (let i = 0; i < this.scene.pickResults.length; i++) {
                        let obj = this.scene.pickResults[i][0];
                        if (obj) {
                            let customId = this.scene.pickResults[i][1];
                            console.log("Picked object: " + obj + ", with pick id " + customId);
                            this.selectItems(customId);         			
                        }
                    }
                    this.scene.pickResults.splice(0, this.scene.pickResults.length);
                }
            }

            //checks if there is a piece and a tile selected to move the piece to there
            if(this.currentPlayer == playerTurnEnum.PLAYER1_TURN) {
                // player is human
                if (this.whitePlayer == 0) {
                    if(this.whiteAuxiliaryBoard.isSelected() && this.board.isSelected()) {
                        let piece = this.whiteAuxiliaryBoard.pieceSelected();
                        this.pieceAnimation.calculateFrames(this.selectedPieceId, this.board.pickNumberSelected(), piece);                        
                        let coordinates = this.board.tileSelected();
                        this.move(coordinates[0], coordinates[1], piece) //piece is a prolog number  
                        this.gameState = gameStateEnum.LOADING;     
                        this.whiteAuxiliaryBoard.deselect();
                        this.board.deselect();
                    }
                }
                // player is a bot
                else if (this.whitePlayer == 1) {
                    this.gameState = gameStateEnum.LOADING;     
                    this.botMove();
                }
            }
            else if(this.currentPlayer == playerTurnEnum.PLAYER2_TURN) {
                // player is a human
                if(this.brownPlayer == 0) {
                    if(this.brownAuxiliaryBoard.isSelected() && this.board.isSelected()) {
                        let piece = this.brownAuxiliaryBoard.pieceSelected();
                        let coordinates = this.board.tileSelected();
                        this.move(coordinates[0], coordinates[1], piece) //piece is a prolog number  
                        this.gameState = gameStateEnum.LOADING; 
                        this.pieceAnimation.calculateFrames(this.selectedPieceId, this.board.pickNumberSelected(), piece);       
                        this.brownAuxiliaryBoard.deselect();
                        this.board.deselect();
                    }
                }
                // player is a bot
                else if (this.brownPlayer == 1) {
                    this.gameState = gameStateEnum.LOADING;     
                    this.botMove();
                }
            }
            // check if time per turn is over
            if(this.scoreboard.isTimeOver()) {
                this.gameState = gameStateEnum.CHANGE_PLAYER;
            }
        } else if(this.gameState == gameStateEnum.CHANGE_PLAYER) {
            // update current player (0 -> 1, 1 -> 0)
            this.changePlayer(!this.currentPlayer);
        }
    }

    selectItems(customId) {      
        //white Pieces have pick Number = [17,24]
        if(this.currentPlayer == playerTurnEnum.PLAYER1_TURN && customId >= 17 && customId <= 24){
            //selects piece is there isn't any selected
            if(!this.whiteAuxiliaryBoard.isSelected() ){
                this.selectedPieceId = customId;
                this.whiteAuxiliaryBoard.selected[customId - 17] = 1;	
            } //deselect piece if it is selected
            else if(customId >= 17 && this.whiteAuxiliaryBoard.selected[customId - 17] == 1){
                this.whiteAuxiliaryBoard.selected[customId - 17] = 0;	
            } 
        } else if (this.currentPlayer == playerTurnEnum.PLAYER2_TURN && customId > 24) {
            //selects piece is there isn't any selected
            if(!this.brownAuxiliaryBoard.isSelected() ){
                this.selectedPieceId = customId;
                this.brownAuxiliaryBoard.selected[customId - 25] = 1;	
            } //deselect piece if it is selected
            else if(this.brownAuxiliaryBoard.selected[customId - 25] == 1){
                this.brownAuxiliaryBoard.selected[customId - 25] = 0;	
            } 
        }
        //selected a piece          
        else if(!this.board.isSelected() && customId < 17) {
            //board tile selected
            this.board.selected[customId-1] = 1;
        } else if(customId < 17 && this.board.selected[customId-1] == 1){
            this.board.selected[customId-1] = 0;	
        }         
    }

    start() {    
        if(this.gameState == gameStateEnum.MENU) {
            //makes sure the camera is where it should start
            let views = this.scene.graph.getViews();
            let views_ID = this.scene.graph.getViewsID();
            this.scene.camera = views[views_ID[0]];   
            //during the game we can not move the camera    
            this.scene.interface.setActiveCamera(null);  
            //if we are restarting and the winner was player 2 we have to rotate the camera
            if(this.currentPlayer == playerTurnEnum.PLAYER2_TURN)
                this.scene.camera.orbit([0, 1, 0], Math.PI);
            this.gameState = gameStateEnum.PLAYER_CHOOSING;
            this.currentPlayer = playerTurnEnum.PLAYER1_TURN;
            this.whiteAuxiliaryBoard.deselect();
            this.board.deselect();
            this.scoreboard.reset();
        } else if (this.gameState == gameStateEnum.LOADING) {
            alert("Board is loading. Wait 3 seconds!");
        }

    }

    reset() {
        if (this.gameState != gameStateEnum.PLAYER_CHOOSING)
            return;
        this.setupProlog();
        this.scoreboard.reset();
        this.gameState = gameStateEnum.MENU;
    }

    display() {
        this.board.display();
        this.whiteAuxiliaryBoard.display();
        this.brownAuxiliaryBoard.display();
        this.scoreboard.display();
        if(this.gameState == gameStateEnum.ANIMATING_PIECE || this.gameState == gameStateEnum.ANIMATING_PIECE_MOVIE) {
            this.pieceAnimation.display();
        }
        else if(this.gameState == gameStateEnum.GAME_OVER) {
            if(this.currentPlayer == playerTurnEnum.PLAYER1_TURN)
                this.scoreboard.whitePlayerWins++;
            else this.scoreboard.brownPlayerWins++;
            this.movie();
            alert("Game Over!");
        }
    }

}
