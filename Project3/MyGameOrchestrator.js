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
        
        this.setupProlog();

        this.game_state_ENUM = {
            Menu: 0, // show menu and handle settings
            Person1_turn: 1, //player 1 turn to play
            Person2_turn: 2, //player 2 turn to play
            Computer1_turn: 3, //player 1 turn to play
            Computer2_turn: 4, //player 2 turn to play            
            Load_scenario: 5, // (keep game state), load file, render scene, board, pieces, etc
            Moving_Piece: 6
        }

    }

    /**
     * Gets initial board and pieces from prolog
     */
    setupProlog() {
        var this_game = this;
        /// Initialize board
        this.prologInterface.getPrologRequest(
            "init_board",
            function (data) {
                this_game.board.boardMatrix = JSON.parse(data.target.response);
            }
        );

        /// Initialize white pieces
        this.prologInterface.getPrologRequest(
            "init_white_pieces",
            function (data) {
                this_game.board.whitePieces = JSON.parse(data.target.response);
            }
        );
        
        /// Initialize brown pieces
        this.prologInterface.getPrologRequest(
            "init_brown_pieces",
            function (data) {
                this_game.board.brownPieces = JSON.parse(data.target.response);
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