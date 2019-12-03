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
        this.sphere = new MySphere(scene, id, 0.5, 10, 10)
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
        
        /* Upper spheres */
        for(let i = 1; i <= 2; i++){
            for(let j= 3; j <= 4; j++){
                this.scene.pushMatrix();
                this.scene.translate(-9.8 + i * 3.9, 0.5, -9.8 + j * 3.9);
                this.scene.scale(1,0.6,1);
                this.sphere.display();
                this.scene.popMatrix();
            }           
        } 

        for(let i = 3; i <= 4; i++){
            for(let j=1; j <= 2; j++){
                this.scene.pushMatrix();
                this.scene.translate(-9.8 + i * 3.9, 0.5, -9.8 + j * 3.9);
                this.scene.scale(1,0.6,1);
                this.sphere.display();
                this.scene.popMatrix();
            }           
        } 

        /* Down spheres */
        for(let i = 1; i <= 2; i++){
            for(let j= 1; j <= 2; j++){
                this.scene.pushMatrix();
                this.scene.translate(-9.8 + i * 3.9, 0, -9.8 + j * 3.9);
                this.scene.scale(1,0.6,1);
                this.sphere.display();
                this.scene.popMatrix();
            }           
        } 

        for(let i = 3; i <= 4; i++){
            for(let j = 3; j <= 4; j++){
                this.scene.pushMatrix();
                this.scene.translate(-9.8 + i * 3.9, 0, -9.8 + j * 3.9);
                this.scene.scale(1,0.6,1);
                this.sphere.display();
                this.scene.popMatrix();
            }           
        } 
    }

    /**
     * In this work doesn't have to be implemented
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
    updateTexCoords(length_u, length_v) { }
}