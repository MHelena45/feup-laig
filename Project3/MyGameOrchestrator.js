const gameStateEnum = {
    /// --- show game menu
    MENU: 0,            // show menu and handle settings
    /// --- loading an asset of waiting for prolog reply
    LOADING: 1,   // (keep game state), load file, render scene, board, pieces, etc
    /// --- game is playable
    PLAYER1_TURN: 2,    // player 1 turn to play
    PLAYER2_TURN: 3,    // player 2 turn to play         
    MOVING_PIECE: 4     // moving piece for animation
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
        this.board = new MyGameBoard(scene);
        this.pieces = new MyPiece(this.scene);  //All the pieces

         //Difficulty Level DropBox
        this.difficultyLevel = 1;
        this.whitePlayer = 0;
        this.blackPlayer = 1;
        this.theme = 0;

        // Labels and ID's for object selection on MyInterface
        this.levels = { '1': 1, '2': 2, '3': 3 }; 
        this.playerOptions = { 'human': 0, 'bot' : 1};
        this.themeOptions = {'Christmas': 0, 'Indoor': 1};

        this.gameState;
        
        this.setupProlog();
    }

    /**
     * Gets initial board and pieces from prolog
     */
    setupProlog() {
        this.gameState = gameStateEnum.LOADING;

        var this_game = this;
        /// Initialize board
        this.prologInterface.getPrologRequest(
            "init_board",
            function (data) {
                this_game.board.boardMatrix = JSON.parse(data.target.response);
                /// Initialize white pieces
                this_game.prologInterface.getPrologRequest(
                    "init_white_pieces",
                    function (data) {
                        this_game.board.whitePieces = JSON.parse(data.target.response);
                        /// Initialize brown pieces
                        this_game.prologInterface.getPrologRequest(
                            "init_brown_pieces",
                            function (data) {
                                this_game.board.brownPieces = JSON.parse(data.target.response);
                                this_game.gameState = gameStateEnum.PLAYER1_TURN;
                            }
                        );
                    }
                );
            }
        );
    }

    /**
     * Testing purposes
     */
    move() {
        var this_game = this;
        var move = [1,1,11]; // move piece 11 (white-cone) to position 1-1 (top-left corner)
        var request = "move(" + JSON.stringify(move) + "," + JSON.stringify(this_game.board.boardMatrix) + ","
        + JSON.stringify(this_game.board.whitePieces) + "," + JSON.stringify(this_game.board.brownPieces) + "," + JSON.stringify(1) + ")";

        this.prologInterface.getPrologRequest(
            request,
            function (data) {
                var response = JSON.parse(data.target.response);
                var validMove = response[0];
                if (validMove) {
                    this_game.board.boardMatrix = response[1];
                    this_game.board.whitePieces = response[2];
                    this_game.board.brownPieces = response[3];
                }
            }
        );
    }

    //Load of new scenes
    updateTheme(){
        let filename;
        if(this.theme == 0){
            filename="LAIG_TP1_XML_T6_G02_Theme_Christmas.xml";
        } else if(this.theme == 1){
            filename="LAIG_TP1_XML_T6_G02_Theme_Indoor.xml";
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

    display() {
        this.board.display();
    }

}