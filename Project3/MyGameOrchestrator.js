const gameStateEnum = {
    MENU: 0,                // show menu and handle settings
    LOADING: 1,             // load file, render and request scene, board, pieces, etc
    PLAYER_CHOOSING: 2,     // player is choosing what to play
    ANIMATING_PIECE: 3,     // moving piece for animation
    GAME_OVER: 4,           // game is over play again
    CHANGE_PLAYER: 5,       //used to animate camera and change between players
    ANIMATING_PIECE_MOVIE: 6 //used when movie is being display
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
        this.brownPlayer = 0;
        this.whitePlayer = 0;
        this.theme = 0;

        //used for buttons (variable doesn't have a value because is a button)
        this.interface = { interface: function () { } };

        /// Labels and ID's for object selection on MyInterface
        this.levels = { '1': 1, '2': 2, '3': 3 };
        this.playerOptions = { 'human': 0, 'bot': 1 };
        this.themeOptions = { 'Christmas': 0, 'Space': 1, 'Indoor': 2 };

        /// Setup game states and initial arrays
        this.gameState = gameStateEnum.LOADING;
        this.currentPlayer = playerTurnEnum.PLAYER1_TURN;
        this.selectedPieceId; //attribute of the move vector to do the film

        //used for animated movement of the camera and not just a change of 2 points
        this.cameraMovement = 100; //camera moves Pi/100 each time

        this.gameOver = false; //change to true when game is over by the prolog response
        this.scoreboard = new MyScoreboard(this.scene);

        this.moves = []; //olds the moves done in this game
        this.currentFrame = 0; //current frame/move being display in the movie of the game

        this.set_event_handler(); //used when user clicks start in the instructions
        this.setupProlog();
    }

    /**
     * sets a event handler to the button start of the instruction
     */
    set_event_handler() {
        let menu = document.querySelector('input[value="START"]');
        menu.addEventListener('click', this.stop_display.bind(this));
    }

    /**
     * menu display is stopped when press start
     * @param {*} event 
     */
    stop_display(event) {
        let x = document.querySelector("#menu");
        x.style.display = "none";

        event.preventDefault();
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

    /**
     * changes the player after the end of the animated camera rotation
     */
    changePlayer() {
        if (this.gameState == gameStateEnum.CHANGE_PLAYER) {
            this.scene.camera.orbit([0, 1, 0], Math.PI / 100); //rotates the camera
            this.cameraMovement--;
            if (this.cameraMovement == 0) { //camera is already in the correct position
                this.deselectAll();
                this.gameState = gameStateEnum.PLAYER_CHOOSING;
                this.cameraMovement = 100;
                this.currentPlayer = !this.currentPlayer; //change the player to the next one playing
                this.scoreboard.reset(); //resets time in the board
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
                    // add new move to moves array
                    move = [row, column, piece, thisGame.selectedPieceId];
                    thisGame.moves.push(move);
                    thisGame.isGameOver(row, column, piece);

                    thisGame.gameState = gameStateEnum.ANIMATING_PIECE;
                    thisGame.removePiece(); //removes piece being played/animate in the moment
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
     * undo the last play (can be done multiple time)
     */
    undo() {
        //if the game is not in this states, a game is not being played ate the moment
        if (this.gameState == gameStateEnum.ANIMATING_PIECE || this.gameState == gameStateEnum.CHANGE_PLAYER
            || this.gameState == gameStateEnum.PLAYER_CHOOSING) {
            //game was in fact at least one movement to undo
            if (this.moves.length > 0) {
                // get last move and remove it from the moves array
                let lastMove = this.moves.pop();
                // lastMove => [Row, Column, Piece]
                let lastRow = lastMove[0];
                let lastColumn = lastMove[1];
                let lastPiece = lastMove[2];
                // update game board
                this.board.boardMatrix[lastRow - 1][lastColumn - 1] = 0;
                // update auxilary board
                let pieceColor = lastPiece % 10;
                switch (pieceColor) {
                    // WHITE
                    case 1:
                        this.whiteAuxiliaryBoard.undo(lastPiece);
                        break;
                    // BROWN
                    case 2:
                        this.brownAuxiliaryBoard.undo(lastPiece);
                        break;
                }
                this.scoreboard.reset();
            }

            //if the other player was choosing we have to change player
            if (this.gameState == gameStateEnum.PLAYER_CHOOSING) {
                // change player
                this.scene.camera.orbit([0, 1, 0], Math.PI); //rotates the camera
                this.currentPlayer = !this.currentPlayer;
            } //if it was changing the player, was to go to the same position it was
            else if (this.cameraMovement != 100) {
                this.scene.camera.orbit([0, 1, 0], (this.cameraMovement - 100) * (Math.PI / 100));
                this.cameraMovement = 100;
            } //if it was animating the piece was to change state only (board doesn't have the piece yet, only temp board has it)
            this.gameState = gameStateEnum.PLAYER_CHOOSING;
        }

    }

    /**
     * get the computer move (row, column and prolog piece number)
     */
    botMove() {
        // build request
        let thisGame = this;
        let request = "bot_move(" + JSON.stringify(parseInt(thisGame.difficultyLevel)) + "," + JSON.stringify(thisGame.board.boardMatrix) + ","
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
                if (thisGame.currentPlayer == playerTurnEnum.PLAYER1_TURN)
                    piecePickId = thisGame.whiteAuxiliaryBoard.getPickId(piece);
                else
                    piecePickId = thisGame.brownAuxiliaryBoard.getPickId(piece);

                let tilePickNumber = (column - 1) * 4 + row;
                thisGame.pieceAnimation.calculateFrames(piecePickId, tilePickNumber, piece);  //calculates thr frames to a keyframeAnimation

                // build move for js
                let move = [row, column, piece, piecePickId]; //used in the movie of the last game
                thisGame.moves.push(move);
                // update baords with response
                thisGame.board.tempBoard = response[0];
                thisGame.whiteAuxiliaryBoard.pieces = response[1];
                thisGame.brownAuxiliaryBoard.pieces = response[2];

                thisGame.isGameOver(row, column, piece); //check if the game ended and change the boolean this.gameOver to true if necessary

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
        let request = "game_over(" + JSON.stringify(thisGame.board.tempBoard)
            + "," + JSON.stringify(move) + ")";
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
    updateTheme() {
        let state = this.gameState;
        this.gameState = gameStateEnum.LOADING;
        let filename;
        switch (this.theme) {
            case "0":
                filename = "LAIG_TP3_XML_T6_G02_Theme_Christmas.xml";
                break;
            case "1":
                filename = "LAIG_TP3_XML_T6_G02_Theme_Space.xml";
                break;
            case "2":
                filename = "LAIG_TP3_XML_T6_G02_Theme_Indoor.xml";
                break;
        }
        this.scene.graph = new MySceneGraph(filename, this.scene);
        this.scene.sceneInited = false;
        this.gameState = state;
    }

    update(time) {
        if (this.gameState == gameStateEnum.ANIMATING_PIECE || this.gameState == gameStateEnum.ANIMATING_PIECE_MOVIE) {
            this.pieceAnimation.update(time);
        }

        if (this.gameState == gameStateEnum.PLAYER_CHOOSING) {
            this.scoreboard.update();
        }
    }

    removePiece() {
        if (this.currentPlayer == playerTurnEnum.PLAYER1_TURN)
            this.whiteAuxiliaryBoard.removePiece(this.selectedPieceId);
        else
            this.brownAuxiliaryBoard.removePiece(this.selectedPieceId);

    }

    movie() {
        if (this.gameState != gameStateEnum.ANIMATING_PIECE_MOVIE) {
            //changes the camera to a upper position (with camera movement as to slow the movement)
            let views = this.scene.graph.getViews();
            let views_ID = this.scene.graph.getViewsID();
            this.scene.camera = views[views_ID[1]];
            //during the movie we can move the camera    
            this.scene.interface.setActiveCamera(this.scene.camera);
            this.currentFrame = 0;

            //reset the board and auxiliary boards to the initial state
            this.board.boardMatrix = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            this.board.tempBoard = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            this.whiteAuxiliaryBoard.pieces = [11, 11, 51, 51, 71, 71, 91, 91];
            this.brownAuxiliaryBoard.pieces = [12, 12, 52, 52, 72, 72, 92, 92];
            this.nextFrameMovie();
            this.gameState = gameStateEnum.ANIMATING_PIECE_MOVIE;
        }
    }

    nextFrameMovie() {
        if (this.currentFrame < this.moves.length) {
            //changes board
            if (this.currentFrame >= 1) {
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

            if (prologPiece % 2 == 0)
                this.brownAuxiliaryBoard.removePiece(move[3]);
            else this.whiteAuxiliaryBoard.removePiece(move[3]);

            this.currentFrame++;
        } else if (this.moves.length == 0) { //no game has been played
            alert("No movie available.");
            this.gameState = gameStateEnum.PLAYER_CHOOSING;
        } else {
            this.currentFrame = 0;
            this.gameState = gameStateEnum.MENU;
            this.reset();
            alert("Movie Finished");
        }

    }

    /**
     * responsible to pick check if objects were picked
     */
    orchestrate() {
        //if state is player_choosing, objects can be pick
        if (this.gameState == gameStateEnum.PLAYER_CHOOSING) {
            if (this.scene.pickMode == false) {
                if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                    for (let i = 0; i < this.scene.pickResults.length; i++) {
                        let obj = this.scene.pickResults[i][0];
                        if (obj) {
                            let customId = this.scene.pickResults[i][1];
                            this.selectItems(customId);
                        }
                    }
                    this.scene.pickResults.splice(0, this.scene.pickResults.length);
                }
            }

            //checks if there is a piece and a tile selected to move the piece to there
            if (this.currentPlayer == playerTurnEnum.PLAYER1_TURN) {
                //if a player doesn't have pieces available the game ends
                if(this.whiteAuxiliaryBoard.isEmpty() == true) {
                    alert("There aren't pieces available!");
                    this.reset();
                }
                // player is human
                if (this.whitePlayer == 0) {
                    if (this.whiteAuxiliaryBoard.isSelected() && this.board.isSelected()) {
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
            else if (this.currentPlayer == playerTurnEnum.PLAYER2_TURN) {
                //if a player doesn't have pieces available the game ends
                if(this.brownAuxiliaryBoard.isEmpty() == true) {
                    alert("There aren't pieces available!");
                    this.reset();
                }
                // player is a human
                if (this.brownPlayer == 0) {
                    if (this.brownAuxiliaryBoard.isSelected() && this.board.isSelected()) {
                        let piece = this.brownAuxiliaryBoard.pieceSelected();
                        this.pieceAnimation.calculateFrames(this.selectedPieceId, this.board.pickNumberSelected(), piece);
                        let coordinates = this.board.tileSelected();
                        this.move(coordinates[0], coordinates[1], piece) //piece is a prolog number  
                        this.gameState = gameStateEnum.LOADING;
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
            if (this.scoreboard.isTimeOver()) {
                this.gameState = gameStateEnum.CHANGE_PLAYER;
            }
        }  //if the state is change_player call the function that rotates the camera
        else if (this.gameState == gameStateEnum.CHANGE_PLAYER) {
            // update current player (0 -> 1, 1 -> 0)
            this.changePlayer();
        }
    }

    /**
     * when a piece/board was pick, select internally that thing
     * @param {*} customId 
     */
    selectItems(customId) {
        //white Pieces have pick Number = [17,24]
        if (this.currentPlayer == playerTurnEnum.PLAYER1_TURN && customId >= 17 && customId <= 24) {
            //selects piece is there isn't any selected
            if (!this.whiteAuxiliaryBoard.isSelected()) {
                this.selectedPieceId = customId;
                this.whiteAuxiliaryBoard.selected[customId - 17] = 1;
            } //deselect piece if it is selected
            else if (customId >= 17 && this.whiteAuxiliaryBoard.selected[customId - 17] == 1) {
                this.whiteAuxiliaryBoard.selected[customId - 17] = 0;
            }
        } else if (this.currentPlayer == playerTurnEnum.PLAYER2_TURN && customId > 24) {
            //selects piece is there isn't any selected
            if (!this.brownAuxiliaryBoard.isSelected()) {
                this.selectedPieceId = customId;
                this.brownAuxiliaryBoard.selected[customId - 25] = 1;
            } //deselect piece if it is selected
            else if (this.brownAuxiliaryBoard.selected[customId - 25] == 1) {
                this.brownAuxiliaryBoard.selected[customId - 25] = 0;
            }
        }
        //selected a tile of the board          
        else if (!this.board.isSelected() && customId < 17) {
            //board tile selected
            this.board.selected[customId - 1] = 1;
        } else if (customId < 17 && this.board.selected[customId - 1] == 1) {
            this.board.selected[customId - 1] = 0;
        }
    }

    /**
     * puts the camera in the initially position, to the white player start
     */
    setPlayer1View() {
        let views = this.scene.graph.getViews();
        let views_ID = this.scene.graph.getViewsID();
        this.scene.camera = views[views_ID[0]];
        //during the game we can not move the camera    
        this.scene.interface.setActiveCamera(null);

        if (this.cameraMovement != 100) {
            this.scene.camera.orbit([0, 1, 0], (this.cameraMovement - 100) * (Math.PI / 100));
            this.cameraMovement = 100;
        }
        if (this.currentPlayer == playerTurnEnum.PLAYER2_TURN) {
            this.currentPlayer = !this.currentPlayer;
            this.scene.camera.orbit([0, 1, 0], Math.PI);
        }

    }

    /**
     * deselects all selected pieces on board and auxiliary board
     */
    deselectAll() {
        this.whiteAuxiliaryBoard.deselect();
        this.brownAuxiliaryBoard.deselect();
        this.board.deselect();
    }

    /**
     * function call on press of start button in interface
     */
    start() {
        if (this.gameState == gameStateEnum.LOADING) {
            alert("Board is loading. Don't forget to open SICStus server!");
        } else if (this.gameState == gameStateEnum.MENU) {
            //makes sure the camera is where it should start
            this.setPlayer1View();
            this.gameState = gameStateEnum.PLAYER_CHOOSING;
            this.currentPlayer = playerTurnEnum.PLAYER1_TURN;
            this.deselectAll();
            this.scoreboard.reset();
            this.moves = []; //reset moves
        } else {
            this.reset();
            alert("Restarting game! Press Start again to begin")
        }
    }

    /**
     * function call on press of reset button in interface
     */
    reset() {
        this.setupProlog(); //gets the pieces of the board and auxiliary board
        this.scoreboard.reset(); //resets the time in the scoreboard
        this.gameState = gameStateEnum.MENU;
        //makes sure the camera is where it should start
        this.setPlayer1View();
        this.deselectAll();
    }

    display() {
        this.scoreboard.display();
        this.whiteAuxiliaryBoard.display();
        this.brownAuxiliaryBoard.display();
        this.board.display();

        //if there is a piece moving, display the pice with the apply animation matrix
        if (this.gameState == gameStateEnum.ANIMATING_PIECE || this.gameState == gameStateEnum.ANIMATING_PIECE_MOVIE) {
            this.pieceAnimation.display();
        }
        //if the game is in gameOver state, display new score
        else if (this.gameState == gameStateEnum.GAME_OVER) {
            if (this.currentPlayer == playerTurnEnum.PLAYER1_TURN)
                this.scoreboard.whitePlayerWins++;
            else
                this.scoreboard.brownPlayerWins++;
            // update current score before playing movie
            this.scoreboard.updateScore();
            this.scoreboard.display();
            this.movie(); //starts the movie
            alert("Game Over!");
        }
    }

}
