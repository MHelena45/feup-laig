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

         //Difficulty Level DropBox
        this.difficultyLevel = 1;
        this.whitePlayer = 0;
        this.blackPlayer = 1;
        this.theme = 0;

        // Labels and ID's for object selection on MyInterface
        this.levels = { '1': 1, '2': 2, '3': 3 }; 
        this.playerOptions = { 'human': 0, 'bot' : 1};
        this.themeOptions = {'Christmas': 0, 'Indoor': 1};

        this.objects = [
            new Plane(this.scene, 2, 2),
			new CGFplane(this.scene),
            new CGFplane(this.scene),
            new CGFplane(this.scene),
			new CGFplane(this.scene),
			new CGFplane(this.scene),
            new CGFplane(this.scene),
            new Plane(this.scene, 2, 2),
            new Plane(this.scene, 2, 2),
			new CGFplane(this.scene),
            new CGFplane(this.scene),
            new CGFplane(this.scene),
			new CGFplane(this.scene),
			new CGFplane(this.scene),
            new CGFplane(this.scene),
            new Plane(this.scene, 2, 2)
		];

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

    display(){

        let h = 0;
        
        /* Down spheres */
        for(let i = 1; i <= 2; i++){
            for(let j= 1; j <= 2; j++){
                this.scene.pushMatrix();
                this.scene.translate(-9.8 + i * 3.9, 0.01, -9.8 + j * 3.9);
                this.scene.scale(3.8, 3.8, 3.8);
                //Id for pickable objects must be >= 1
                this.scene.registerForPick(h + 1, this.objects[h]);
                this.objects[h].display();
                h++;
                this.scene.popMatrix();
            }           
        } 

        /* Upper spheres */
        for(let i = 1; i <= 2; i++){
            for(let j= 3; j <= 4; j++){
                this.scene.pushMatrix();
                    this.scene.translate(-9.8 + i * 3.9, 0.51, -9.8 + j * 3.9);
                    this.scene.scale(3.8, 3.8, 3.8);
                    //Id for pickable objects must be >= 1
                    this.scene.registerForPick(h + 1, this.objects[h]);
                    this.objects[h].display();
                    h++;
                this.scene.popMatrix();
            }           
        } 

        for(let i = 3; i <= 4; i++){
            for(let j=1; j <= 2; j++){
                this.scene.pushMatrix();
                    this.scene.translate(-9.8 + i * 3.9, 0.51, -9.8 + j * 3.9);
                    this.scene.scale(3.8, 3.8, 3.8);
                    //Id for pickable objects must be >= 1
                    this.scene.registerForPick(h + 1, this.objects[h]);
                    this.objects[h].display();
                    h++;
                this.scene.popMatrix();
            }           
        } 

        for(let i = 3; i <= 4; i++){
            for(let j = 3; j <= 4; j++){
                this.scene.pushMatrix();
                this.scene.translate(-9.8 + i * 3.9, 0.1, -9.8 + j * 3.9);
                this.scene.scale(3.8, 3.8, 3.8);
                //Id for pickable objects must be >= 1
                this.scene.registerForPick(h + 1, this.objects[h]);
                this.objects[h].display();
                h++;
                this.scene.popMatrix();
            }           
        } 
    }

}