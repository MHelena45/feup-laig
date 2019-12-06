/**
 * MyBoardQuarter
 * @constructor
 * @param scene - Reference to MyScene object
 *
 */
class MyBoardQuarter extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        /* Up part of the board */
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0, 0, 0);

        this.vertices.push(8, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(8, 0, 0); 

        //circle part
        for (let i = 0; i < 5; i++) {
            this.vertices.push(7 + Math.cos(i * (Math.PI / 8)), 0,  7 + Math.sin(i * (Math.PI / 8)));
            this.normals.push(0, 0, 1);
            this.texCoords.push(7 + Math.cos(i * (Math.PI / 8)), 0, 7 + Math.sin(i * (Math.PI / 8)));
        }

        this.vertices.push( 0, 0, 8);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0, 0, 8);

        /* Down part of the board */
        this.vertices.push(0, -1, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0, 0, 0);

        this.vertices.push(8, -1, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(8, 1, 0); 

        //circle part
        for (let i = 0; i < 5; i++) {
            this.vertices.push(7 + Math.cos(i * (Math.PI / 8)), -1,  7 + Math.sin(i * (Math.PI / 8)));
            this.normals.push(0, 1, 0);
            this.texCoords.push(7 + Math.cos(i * (Math.PI / 8)), -1, 7 + Math.sin(i * (Math.PI / 8)));
        }

        this.vertices.push( 0, -1, 8);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0, 1, 8); 

        for(let i = 0; i < 6 ; i++){
            this.indices.push(0, i+2, i+1);
        }

        /* side of the board */
        for(let j = 0; j < 7; j++){
            this.indices.push(j, j + 9, j + 8);
            this.indices.push(j, j + 1, j + 9);
        }

        this.indices.push(0, 8, 7);
        this.indices.push(7, 8, 15);
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * In this work doesn't have to be implemented
     * @param {value of the length_u in texture} length_u 
     * @param {value of the length_v in texture} length_v 
     */
    updateTexCoords(length_u, length_v) { }
}