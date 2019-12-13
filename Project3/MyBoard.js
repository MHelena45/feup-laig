/**
 * MyBoard
 * @constructor
 * @param scene - Reference to MyScene object
 *
 */
class MyBoard extends CGFobject {
    constructor(scene, id) {
        super(scene);
        this.board = new MyBoardQuarter(scene);
        this.board.initBuffers();
    }

    display(){
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
        
    
    }

    /**
     * In this work doesn't have to be implemented
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
    updateTexCoords(length_u, length_v) { }
}