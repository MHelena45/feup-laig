/*
 - Create a gameboard instance
 - Add piece to a given tile
 - Remove piece from a given tile
 - Get piece on a given tile
 - Get tile given a piece
 - Get tile by board coordinate system (A..H;1..8 on chess or 0..7;0..7)
 - Move piece (piece, starting tile, destination tile)
 - Display the gameboard (render). Calls display of tiles and of pieces.
*/

class MyGameBoard {
    /**
     * Constructor
     * @param {Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;
        /// internal matrix representation of the board
        this.boardMatrix;
        this.tempBoard; //used for piece animation
        
        this.sphere = new MySphere(scene, 1, 0.15, 10, 10);
        this.square = new Plane(this.scene, 2, 2);   
        
        this.piece = new MyPiece(this.scene);

        this.specialTile = new MyTile(scene);
        this.specialTile.initBuffers();
    
        // red Material
        this.selectMaterial = new CGFappearance(this.scene);
        this.selectMaterial.setAmbient(1, 0, 0, 1);
        this.selectMaterial.setDiffuse(1, 0, 0, 1);
        this.selectMaterial.setSpecular(0.9, 0.1, 0.1, 1);
        this.selectMaterial.setShininess(10.0);  
        
        // black Material
        this.notSelectMaterial = new CGFappearance(this.scene);
        this.notSelectMaterial.setAmbient(0, 0, 0, 1);
        this.notSelectMaterial.setDiffuse(0.1, 0.1, 0.1, 1);
        this.notSelectMaterial.setSpecular(0, 0, 0, 1);
        this.notSelectMaterial.setShininess(1.0); 

        this.selected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        this.board = new MyBoardLaterals(scene);
        this.board.initBuffers();

    }

    /**
     * deselects piece selected
     */
    deselect(){
        for(let i = 0; i < this.selected.length; i++)
            this.selected[i] = 0;
    }

    /**
     * returns the row and column of the tile selected
     */
    tileSelected() {
        let i;
        for(i = 0; i < this.selected.length; i++) {
            if(this.selected[i] == 1)
                break;
        }
        let row = Math.floor(i/4) + 1;
        let column = i - (Math.floor(i/4) * 4) + 1;
        return [row, column];
    }

    /**
     * return the pick number of the tile selected
     */
    pickNumberSelected() {
        let i;
        for(i = 0; i < this.selected.length; i++) {
            if(this.selected[i] == 1)
                break;
        }
        i++;
        return i;
    }

    /**
     * return true if a tile is selected and false if there isn't a tile select
     */
    isSelected() {
        for(let i = 0; i < this.selected.length; i++)
            if(this.selected[i] == 1)
                return true;
        return false;
    }

    display(){
        //start display of the board sides
        this.notSelectMaterial.apply();
        this.board.display();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.board.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.board.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(3 * Math.PI /2, 0, 1, 0);
        this.board.display();
        this.scene.popMatrix();
        //end display of the board side

        let h = 1;
        /* Down squares */
        for(let j = 1; j <= 2; j++){
            for(let i = 1; i <= 2; i++){
                if(this.selected[h-1] == 1)
                    this.selectMaterial.apply();
                this.scene.pushMatrix();
                if(i == 1 && j == 1){
                    this.scene.pushMatrix();
                    this.scene.rotate(Math.PI, 0, 1, 0);
                    if(this.boardMatrix == null || this.boardMatrix[i-1][j-1] == 0){
                        this.scene.registerForPick(h, this.specialTile);
                    } 
                    this.specialTile.display();
                    this.scene.popMatrix();
                    this.scene.translate(-10 + i * 4, 0, -10 + j * 4);   
                    if(this.boardMatrix != null && this.boardMatrix[i-1][j-1] != 0) {//there is a piece to display                 
                        this.piece.displayPiece(this.boardMatrix[i-1][j-1], this.selected[h-1]);   
                        this.notSelectMaterial.apply(); 
                    }                   
                    this.scene.scale(4, 1.5, 4);
                }
                else {
                    this.scene.translate(-10 + i * 4, 0, -10 + j * 4); 
                    if(this.boardMatrix == null || this.boardMatrix[i-1][j-1] == 0)
                    //Id for pickable objects is >= 1
                        this.scene.registerForPick(h, this.square);
                    else {
                        this.piece.displayPiece(this.boardMatrix[i-1][j-1], this.selected[h-1]); 
                        this.notSelectMaterial.apply(); 
                    } 
                    this.scene.scale(4, 1.5, 4);
                    this.square.display();
                }      
                this.sphere.display(); 
                h++;
                this.scene.popMatrix();
                this.notSelectMaterial.apply(); //if a tile is selected only that should be red 
                //used because if there is a piece in the previous other tile of the board can have a wrong pick id
                this.scene.clearPickRegistration();
            }       
            h += 2;    
        } 

        h = 3;

        /* Upper squares */
        for(let j = 1; j <= 2; j++){
            for(let i= 3; i <= 4; i++){
                if(this.selected[h-1] == 1)
                    this.selectMaterial.apply();
                this.scene.pushMatrix();                
                if(j == 1 && i == 4){ 
                    this.scene.pushMatrix();
                    this.scene.rotate(Math.PI/2, 0, 1, 0);
                    this.scene.translate(0, 0.5, 0);
                    if(this.boardMatrix == null || this.boardMatrix[i-1][j-1] == 0)
                        this.scene.registerForPick(h, this.specialTile);
                    this.specialTile.display();
                    this.scene.popMatrix();
                    this.scene.translate(-10 + i * 4, 0.5, -10 + j * 4); 
                    if(this.boardMatrix != null && this.boardMatrix[i-1][j-1] != 0) { //there is a piece to display
                        this.piece.displayPiece(this.boardMatrix[i-1][j-1], this.selected[h-1]); 
                        this.notSelectMaterial.apply(); //display of the piece change material being applied
                    } 
                    this.scene.scale(4, 1.5, 4);
                }
                else {
                    this.scene.translate(-10 + i * 4, 0.5, -10 + j * 4); 
                    if( this.boardMatrix == null ||this.boardMatrix[i-1][j-1] == 0)
                    //Id for pickable objects is >= 1
                        this.scene.registerForPick(h, this.square);
                    else {
                        this.piece.displayPiece(this.boardMatrix[i-1][j-1], this.selected[h-1]); 
                        this.notSelectMaterial.apply();
                    }
                    this.scene.scale(4, 1.5, 4);
                    this.square.display();
                }
                          
                this.sphere.display(); 
                h++;
                this.scene.popMatrix();
                this.notSelectMaterial.apply(); //if a tile is selected only that should be red 
                //used because if there is a piece in the previous other tile of the board can have a wrong pick id
                this.scene.clearPickRegistration();
            }     
            h += 2;      
        } 

        h = 9;
        
        for(let j = 3; j <= 4; j++){
            for(let i= 1; i <= 2; i++) {
                if(this.selected[h-1] == 1)
                    this.selectMaterial.apply();
                this.scene.pushMatrix();                
                if(j == 4 && i == 1){ 
                    this.scene.pushMatrix();
                    this.scene.rotate(-Math.PI/2, 0, 1, 0);
                    this.scene.translate(0, 0.5, 0);
                    if(this.boardMatrix == null || this.boardMatrix[i-1][j-1] == 0)
                        this.scene.registerForPick(h, this.specialTile);
                    this.specialTile.display();
                    this.scene.popMatrix();
                    this.scene.translate(-10 + i * 4, 0.5, -10 + j * 4); 
                    if(this.boardMatrix != null && this.boardMatrix[i-1][j-1] != 0) { //there is a piece to display
                        this.piece.displayPiece(this.boardMatrix[i-1][j-1], this.selected[h-1]); 
                        this.notSelectMaterial.apply(); //display of the piece change material being applied
                    }
                    this.scene.scale(4, 1.5, 4);
                }
                else {
                    this.scene.translate(-10 + i * 4, 0.5, -10 + j * 4); 
                    if(this.boardMatrix == null || this.boardMatrix[i-1][j-1] == 0)
                    //Id for pickable objects is >= 1
                        this.scene.registerForPick(h, this.square);
                    else {
                        this.piece.displayPiece(this.boardMatrix[i-1][j-1], this.selected[h-1]); 
                        this.notSelectMaterial.apply();
                    }
                    this.scene.scale(4, 1.5, 4);
                    this.square.display();
                }
                          
                this.sphere.display(); 
                h++;
                this.scene.popMatrix();
                this.notSelectMaterial.apply(); //if a tile is selected only that should be red 
                //used because if there is a piece in the previous other tile of the board can have a wrong pick id
                this.scene.clearPickRegistration();
            }   
            h += 2;        
        } 
        
        h = 11;


        for(let j = 3; j <= 4; j++){
            for(let i = 3; i <= 4; i++){
                if(this.selected[h-1] == 1)
                    this.selectMaterial.apply();
                this.scene.pushMatrix();
                  if(i == 4 && j == 4){ 
                    this.scene.pushMatrix();
                    if(this.boardMatrix == null || this.boardMatrix[i-1][j-1] == 0)
                        this.scene.registerForPick(h, this.specialTile);
                    this.specialTile.display();
                    this.scene.popMatrix();
                    this.scene.translate(-10 + i * 4, 0, -10 + j * 4); 
                    if(this.boardMatrix != null && this.boardMatrix[i-1][j-1] != 0) { //there is a piece to display
                        this.piece.displayPiece(this.boardMatrix[i-1][j-1], this.selected[h-1]);  
                        this.notSelectMaterial.apply();
                    }
                    this.scene.scale(4, 1.5, 4);
                }
                else {
                    this.scene.translate(-10 + i * 4, 0, -10 + j * 4); 
                    if(this.boardMatrix == null || this.boardMatrix[i-1][j-1] == 0)
                    //Id for pickable objects is >= 1
                        this.scene.registerForPick(h, this.square);
                    else {
                        this.piece.displayPiece(this.boardMatrix[i-1][j-1], this.selected[h-1]); 
                        this.notSelectMaterial.apply();
                    }
                    this.scene.scale(4, 1.5, 4);
                    this.square.display();
                }
                          
                this.sphere.display(); 
                h++;
                this.scene.popMatrix();
                this.notSelectMaterial.apply(); //if a tile is selected only that should be red 
                //used because if there is a piece in the previous other tile of the board can have a wrong pick id
                this.scene.clearPickRegistration();
            }     
            h += 2;      
        }  
    }
   
}
