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
        this.boardMatrix = [];
        /// white pieces not in the board
        this.whitePieces = [];
        /// brown pieces not it the board
        this.brownPieces = [];
        
        this.sphere = new MySphere(scene, 1, 0.15, 10, 10);

        this.square = new Plane(this.scene, 2, 2);
        this.specialTile = new MyTile(scene);
        this.specialTile.initBuffers();

    }

    init() {
        
    }

    getPieceOnTile(tile) {
        
    }

    getTileByPiece(piece) {

    }

    getTileByCoords(piece) {
        
    }

    movePiece(piece, startingTile, destinationTile) {
        // remove piece from starting tile

        // add piece on destination tile

        // update piece tile pointer
    }


    display(){

        let h = 0;
        /* Down squares */
        for(let i = 1; i <= 2; i++){
            for(let j= 1; j <= 2; j++){
                this.scene.pushMatrix();
                if(i == 1 && j == 1){
                    this.scene.registerForPick(h + 1, this.specialTile);
                    this.scene.pushMatrix();
                    this.scene.rotate(Math.PI, 0, 1, 0);
                    this.specialTile.display();
                    this.scene.popMatrix();
                    this.scene.translate(-10 + i * 4, 0, -10 + j * 4); 
                    this.scene.scale(4, 1.5, 4);
                }
                else {
                    this.scene.translate(-10 + i * 4, 0, -10 + j * 4); 
                    this.scene.scale(4, 1.5, 4);
                    //Id for pickable objects is >= 1
                    this.scene.registerForPick(h + 1, this.square);
                    this.square.display();
                }
                          
                this.sphere.display(); 
                h++;
                this.scene.popMatrix();
            }           
        } 

        /* Upper squares */
        for(let i = 1; i <= 2; i++){
            for(let j= 3; j <= 4; j++){
                this.scene.pushMatrix();                
                if(i == 1 && j == 4){
                    this.scene.registerForPick(h + 1, this.specialTile);
                    this.scene.pushMatrix();
                    this.scene.rotate(-Math.PI/2, 0, 1, 0);
                    this.scene.translate(0, 0.5, 0);
                    this.specialTile.display();
                    this.scene.popMatrix();
                    this.scene.translate(-10 + i * 4, 0.5, -10 + j * 4); 
                    this.scene.scale(4, 1.5, 4);
                }
                else {
                    this.scene.translate(-10 + i * 4, 0.5, -10 + j * 4); 
                    this.scene.scale(4, 1.5, 4);
                    //Id for pickable objects is >= 1
                    this.scene.registerForPick(h + 1, this.square);
                    this.square.display();
                }
                          
                this.sphere.display(); 
                h++;
                this.scene.popMatrix();
            }           
        } 

        for(let i = 3; i <= 4; i++){
            for(let j=1; j <= 2; j++){
                this.scene.pushMatrix();                
                if(i == 4 && j == 1){
                    this.scene.registerForPick(h + 1, this.specialTile);
                    this.scene.pushMatrix();
                    this.scene.rotate(Math.PI/2, 0, 1, 0);
                    this.scene.translate(0, 0.5, 0);
                    this.specialTile.display();
                    this.scene.popMatrix();
                    this.scene.translate(-10 + i * 4, 0.5, -10 + j * 4); 
                    this.scene.scale(4, 1.5, 4);
                }
                else {
                    this.scene.translate(-10 + i * 4, 0.5, -10 + j * 4); 
                    this.scene.scale(4, 1.5, 4);
                    //Id for pickable objects is >= 1
                    this.scene.registerForPick(h + 1, this.square);
                    this.square.display();
                }
                          
                this.sphere.display(); 
                h++;
                this.scene.popMatrix();
            }           
        } 

    for(let i = 3; i <= 4; i++){
            for(let j = 3; j <= 4; j++){
                this.scene.pushMatrix();
                  if(i == 4 && j == 4){
                    this.scene.registerForPick(h + 1, this.specialTile);
                    this.scene.pushMatrix();
                    this.specialTile.display();
                    this.scene.popMatrix();
                    this.scene.translate(-10 + i * 4, 0, -10 + j * 4); 
                    this.scene.scale(4, 1.5, 4);
                }
                else {
                    this.scene.translate(-10 + i * 4, 0, -10 + j * 4); 
                    this.scene.scale(4, 1.5, 4);
                    //Id for pickable objects is >= 1
                    this.scene.registerForPick(h + 1, this.square);
                    this.square.display();
                }
                          
                this.sphere.display(); 
                h++;
                this.scene.popMatrix();
            }           
        } 
    }
}
