/**
 * MyTile
 * @constructor
 * @param scene - Reference to MyScene object
 *
 */
class MyTile extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        /* Up part of the board */
        this.vertices.push(4, 0, 4);
        this.normals.push(0, 1, 0);

        this.vertices.push(8, 0, 4);
        this.normals.push(0, 1, 0);

        //circle part
        for (let i = 0; i < 5; i++) {
            this.vertices.push(7 + Math.cos(i * (Math.PI / 8)), 0,  7 + Math.sin(i * (Math.PI / 8)));
            this.normals.push(0, 1, 0);
        }

        this.vertices.push(4, 0, 8);
        this.normals.push(0, 1, 0);

        //circle part
        for (let i = 0; i < 5; i++) {
            this.vertices.push(7 + Math.cos(i * (Math.PI / 8)), -1,  7 + Math.sin(i * (Math.PI / 8)));
            this.normals.push(0, 1, 0);

        }

        this.vertices.push( 0, -1, 8);
        this.normals.push(0, 1, 0);

        for(let i = 0; i < 6 ; i++){
            this.indices.push(0, i+2, i+1);
        }

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