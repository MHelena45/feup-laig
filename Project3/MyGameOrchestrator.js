const gameStateEnum = {
    MENU: 0,                // show menu and handle settings
    LOADING: 1,             // load file, render and request scene, board, pieces, etc
    PLAYER_CHOOSING: 2,     // player is choosing what to play
    ANIMATING_PIECE: 3,     // moving piece for animation
    GAME_OVER: 4            // game is over play again
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

        /// Board
        this.board = new MyGameBoard(this.scene);
        this.whiteAuxiliaryBoard = new MyAuxiliaryBoard(this.scene, 101, this.whiteMaterial, 10, 16);
        this.brownAuxiliaryBoard = new MyAuxiliaryBoard(this.scene, 102, this.brownMaterial, -20, 24);

        //Todo remove this and get it from the Prolog response
        this.whiteAuxiliaryBoard.pieces = [11, 11, 51, 51, 71, 71, 91, 91];
        this.brownAuxiliaryBoard.pieces = [12, 12, 52, 52, 72, 72, 92, 92];

        /// Difficulty Level DropBox
        this.difficultyLevel = 1;
        this.whitePlayer = 0;
        this.blackPlayer = 1;
        this.theme = 0;
        //undo a play
        this.undo = { undo:function(){ console.log("undo") }};
        // Set states to begin playing
        this.startGame = { start: function() {
            this.gameState = gameStateEnum.PLAYER_CHOOSING;
            this.currentPlayer = playerTurnEnum.PLAYER1_TURN;
        }};

        /// Labels and ID's for object selection on MyInterface
        this.levels = { '1': 1, '2': 2, '3': 3 }; 
        this.playerOptions = { 'human': 0, 'bot' : 1};
        this.themeOptions = {'Christmas': 0, 'Space': 1};

        /// Setup game states and initial arrays
        this.gameState = gameStateEnum.LOADING;
        this.currentPlayer = playerTurnEnum.PLAYER1_TURN;
        this.selectedPieceId;

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
                        thisGame.board.whitePieces = JSON.parse(data.target.response);
                        /// Initialize brown pieces
                        thisGame.prologInterface.getPrologRequest(
                            "init_brown_pieces",
                            function (data) {
                                thisGame.board.brownPieces = JSON.parse(data.target.response);
                                thisGame.gameState = gameStateEnum.PLAYER_CHOOSING;
                              //  this.whiteAuxiliaryBoard.pieces = thisGame.board.whitePieces;
                              //  this.brownAuxiliaryBoard.pieces = thisGame.board.brownPieces;
                            }
                        );
                    }
                );
            }
        );
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
        + JSON.stringify(thisGame.board.whitePieces) + "," + JSON.stringify(thisGame.board.brownPieces) + ","
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
                    thisGame.board.whitePieces = response[2];
                    thisGame.board.brownPieces = response[3];
                    thisGame.gameState = gameStateEnum.ANIMATING_PIECE;
                }
                // move is not valid (ask player to play again)
                else {
                    thisGame.gameState = currentPlayer;
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
     * @param {Number} column last move column
     * @param {Number} row last move row
     * @param {Number} piece last move piece
     */
    isGameOver(column, row, piece) {
        // change game state to loading
        this.gameState = gameStateEnum.LOADING;

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
                else {
                    // update game state
                    thisGame.gameState = gameStateEnum.PLAYER_CHOOSING;
                    // update current player (0 -> 1, 1 -> 0)
                    this.currentPlayer = !this.currentPlayer;
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

    updateBlackPlayer(){
        if(this.blackPlayer == 1)
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

    orchestrate() {
        if(gameStateEnum.PLAYER_CHOOSING) {
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
                    this.gameState == gameStateEnum.LOADING;      
                    this.whiteAuxiliaryBoard.deselect();
                    this.board.deselect();
                }
            }
            else if(this.currentPlayer == playerTurnEnum.PLAYER2_TURN) {
                if(this.brownAuxiliaryBoard.isSelected() && this.board.isSelected()) {
                    let piece = this.whiteAuxiliaryBoard.pieceSelected();
                    let coordinates = this.board.tileSelected();
                    this.move(coordinates[0], coordinates[1], piece) //piece is a prolog number  
                    this.gameState == gameStateEnum.LOADING;       
                    this.brownAuxiliaryBoard.deselect();
                    this.board.deselect();
                }
            }

        }
    }

    selectItems(customId) {      
        //white Pieces have pick Number = [17,24]
        if(this.currentPlayer == playerTurnEnum.PLAYER1_TURN && customId >= 17 && customId <= 24){
            if(!this.whiteAuxiliaryBoard.isSelected() ){
                this.selectedPieceId = customId;
                this.whiteAuxiliaryBoard.selected[customId - 17] = 1;	
            } else if(customId >= 17 && this.whiteAuxiliaryBoard.selected[customId - 17] == 1){
                this.whiteAuxiliaryBoard.selected[customId - 17] = 0;	
            } 
        } else if (this.currentPlayer == playerTurnEnum.PLAYER2_TURN && customId > 24) {
            if(!this.brownAuxiliaryBoard.isSelected() ){
                this.selectedPieceId = customId;
                this.brownAuxiliaryBoard.selected[customId - 25] = 1;	
            } else if(this.brownAuxiliaryBoard.selected[customId - 25] == 1){
                this.whiteAuxiliaryBoard.selected[customId - 25] = 0;	
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

    display() {
        this.board.display();
        this.whiteAuxiliaryBoard.display();
        this.brownAuxiliaryBoard.display();
    }

}