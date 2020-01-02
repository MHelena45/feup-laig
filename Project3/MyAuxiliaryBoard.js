/**
 * MyAuxiliaryBoard is a class used to hold the pieces that can be play
 */
class MyAuxiliaryBoard extends CGFobject {
    /**
     * Constructor
     * @param {Scene} scene 
     */
    constructor(scene, beginningPosition, firstPickNumber) {
        super(scene); 
        this.pieces = [];
        this.tempPieces = [];
        this.beginningPosition = beginningPosition;
        this.firstPickNumber = firstPickNumber;
        this.piece = new MyPiece(this.scene);

        this.selected = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    deselect() {
        for(let i = 0; i < this.selected.length; i++)
            this.selected[i] = 0;
    }

    isSelected() {
        for(let i = 0; i < this.selected.length; i++)
            if(this.selected[i] == 1)
                return true;
        return false;
    }

    removePiece(piece) {
        this.pieces[piece - this.firstPickNumber - 1] = 0;
    }

    pieceSelected() {
        for(let i = 0; i < this.selected.length; i++)
            if(this.selected[i] == 1)
                return this.pieces[i];
    }

    getPickId(prologPiece) {
        for(let j = 0; j < this.pieces.length; j++)
            if(this.pieces[j] == prologPiece)
                return (this.firstPickNumber + j + 1);
        return null; //piece doesn't exist in auxiliary board
    }

    /**
     * checks if there aren't any pieces left. 
     * The game ends when one player doesn't have any pieces left.
     */
    isEmpty() {
        if(this.pieces != null) {
            for(let i = 0; i < this.pieces.length; i++){
                if(this.pieces[i] != 0)
                    return false;
            }
            return true;
        }
        return false;
    }

    /**
     * Places piece in correct position of pieces array
     * @param {int} piece two digit number containing information about the piece
     */
    undo(piece) {
        let pieceCode = Math.floor(piece / 10);

        switch(pieceCode) {
            // CONE - first and second position
            case 1:
                if (this.pieces[1] == 0) this.pieces[1] = piece;
                else this.pieces[0] = piece;
                break;
            // CUBE - third and fourth position
            case 5:
                if (this.pieces[3] == 0) this.pieces[3] = piece;
                else this.pieces[2] = piece;
                break;
            // CYLINDER - fifth and sixth position
            case 7:
                if (this.pieces[5] == 0) this.pieces[5] = piece;
                else this.pieces[4] = piece;
                break;
            // SPHERE - seventh and eighth position
            case 9:
                if (this.pieces[7] == 0) this.pieces[7] = piece;
                else this.pieces[6] = piece;
                break;
        }
    }

    display() {
        let h = 1;
        //display pieces in 2 lines
        for(let j = 1; j <= 2; j++){
            for(let i = 1; i <= 4; i++){   
                //checks if the piece i
                if(this.pieces[h-1] != null && this.pieces[h-1] != 0){             
                    this.scene.pushMatrix();
                    this.scene.translate(-10 + i * 4, 0, this.beginningPosition + j * 4); 
                    //Id for pickable objects is >= 1
                    this.scene.registerForPick(h + this.firstPickNumber, this.piece.getPiece(this.pieces[h-1]));
                    this.piece.displayPiece(this.pieces[h-1], this.selected[h-1]);       
                    this.scene.popMatrix();                         
                }
                h += 2;
            }       
            h = 2;    
        } 
        //prevents other item to have the pick number of the last piece
        this.scene.clearPickRegistration();
    }
   

}
