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

        this.setupProlog();
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


}