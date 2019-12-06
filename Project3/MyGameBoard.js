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
        this.boardMatrix = []
        /// white pieces not in the board
        this.whitePieces = []
        /// brown pieces not it the board
        this.brownPieces = []
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

    display() {

    }

}
