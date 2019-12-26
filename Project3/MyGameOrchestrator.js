const gameStateEnum = {
    MENU: 0,                // show menu and handle settings
    LOADING: 1,             // load file, render and request scene, board, pieces, etc
    PLAYER_CHOOSING: 2,     // player is choosing what to play
    ANIMATING_PIECE: 3,     // moving piece for animation
    GAME_OVER: 4,           // game is over play again
    CHANGE_PLAYER: 5        //used to animate camera and change between players
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
        this.tempBoard;
        this.whiteAuxiliaryBoard = new MyAuxiliaryBoard(this.scene, 10, 16);
        this.brownAuxiliaryBoard = new MyAuxiliaryBoard(this.scene, -20, 24);
        this.pieceAnimation = new PieceAnimation(this.scene);

        /// Difficulty Level DropBox
        this.difficultyLevel = 1;
        this.brownPlayer = 1;
        this.whitePlayer = 0;
        this.theme = 0;
        //undo a play
        this.undo = { undo:function(){ console.log("undo") }};
        // Set states to begin playing
        this.startGame = { start: function() {
            console.log("Start");
        }};

        /// Labels and ID's for object selection on MyInterface
        this.levels = { '1': 1, '2': 2, '3': 3 }; 
        this.playerOptions = { 'human': 0, 'bot' : 1};
        this.themeOptions = {'Christmas': 0, 'Space': 1};

        /// Setup game states and initial arrays
        this.gameState;
        this.currentPlayer = playerTurnEnum.PLAYER1_TURN;
        this.selectedPieceId;

        //used for animated movement of the camera and not just a change of 2 points
        this.cameraMovement = 100;

        this.moves = [];
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
                thisGame.tempBoard = JSON.parse(data.target.response);
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
                this.gameState = gameStateEnum.PLAYER_CHOOSING;
                this.cameraMovement = 100;
                this.currentPlayer = player;
            }
        }
    }

    /**
     * moves piece to coordinate column row
     * @param {Number} column column where the piece is going to be moved
     * @param {Number} row row where the piece is going to be moved
     * @param {Number} piece which piece is going to be moved
     */
    move(row, column, piece) {
        // build request
        let thisGame = this;
        let move = [column, row, piece];
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
                    thisGame.board.boardMatrix = response[1];
                    thisGame.whiteAuxiliaryBoard.pieces = response[2];
                    thisGame.brownAuxiliaryBoard.pieces = response[3];
                    thisGame.gameState = gameStateEnum.ANIMATING_PIECE;
                   // thisGame.gameState = gameStateEnum.CHANGE_PLAYER;
                    thisGame.moves.push(...move);
                    // thisGame.isGameOver(row, column, piece);
                
                }
                // move is not valid (ask player to play again)
                else {
                    alert("Invalid play! The other player have a piece with the same form!");
                }
            }
        );
    }

    /**
     * animates piece
     */
    animate(initialPosition, finalPosition) {
        
    }


    /**
     * verifies if game is over
     * @param {Number} row last move row
     * @param {Number} column last move column
     * @param {Number} piece last move piece
     */
    isGameOver(row, column, piece) {
        // change game state to loading
        //this.gameState = gameStateEnum.LOADING;

        // build request
        let thisGame = this;
        let move = [column, row, piece];
        let request = "game_over(" + JSON.stringify(thisGame.board.boardMatrix)
        + ","+ JSON.stringify(move) + ")";
        // send request
        this.prologInterface.getPrologRequest(
            request,
            function (data) {
                let response = JSON.parse(data.target.response);
                let gameOver = response[0];
                // game is over
                if (gameOver) {
                    thisGame.gameState = gameStateEnum.GAME_OVER;
                } 
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

    undo(){
        console.log("Undo");
    }

    update(time) {
        if(this.gameState == gameStateEnum.ANIMATING_PIECE) {
            this.pieceAnimation.update(time);
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
                if(this.whiteAuxiliaryBoard.isSelected() && this.board.isSelected()) {
                    let piece = this.whiteAuxiliaryBoard.pieceSelected();
                    let coordinates = this.board.tileSelected();
                    this.move(coordinates[0], coordinates[1], piece) //piece is a prolog number  
                    this.gameState = gameStateEnum.ANIMATING_PIECE;     
                    this.pieceAnimation.calculateFrames(this.selectedPieceId, this.board.pickNumberSelected(), piece);
                    this.whiteAuxiliaryBoard.deselect();
                    this.board.deselect();
                }
            }
            else if(this.currentPlayer == playerTurnEnum.PLAYER2_TURN) {
                if(this.brownAuxiliaryBoard.isSelected() && this.board.isSelected()) {
                    let piece = this.brownAuxiliaryBoard.pieceSelected();
                    let coordinates = this.board.tileSelected();
                    this.move(coordinates[0], coordinates[1], piece) //piece is a prolog number  
                    this.gameState = gameStateEnum.ANIMATING_PIECE; 
                    this.pieceAnimation.calculateFrames(this.selectedPieceId, this.board.pickNumberSelected(), piece);       
                    this.brownAuxiliaryBoard.deselect();
                    this.board.deselect();
                }
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
            this.gameState = gameStateEnum.PLAYER_CHOOSING;
            this.currentPlayer = playerTurnEnum.PLAYER1_TURN;
            this.whiteAuxiliaryBoard.deselect();
            this.board.deselect();
        } else {
            alert("Board is loading. Wait 3 seconds!");
        }

    }

    reset() {
        this.setupProlog();
    }

    display() {
        this.board.display();
        this.whiteAuxiliaryBoard.display();
        this.brownAuxiliaryBoard.display();
        if(this.gameState == gameStateEnum.ANIMATING_PIECE) {
            this.pieceAnimation.display();
        }
    }

}