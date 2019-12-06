/**
 * MyCircle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - radius of the circle
 * @param slices - number of divisions around the circumference
 *
 */
class MyCircle extends CGFobject {
    constructor(scene, radius, slices) {
        super(scene);
        this.radius = radius;
        this.slices = slices;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let div = 2 * Math.PI / this.slices;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);
        this.texCoords.push(0.5, 0.5);

        for (let i = 0; i <= this.slices; i++) {
            this.vertices.push(this.radius * Math.cos(i * div), this.radius * Math.sin(i * div), 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(0.5 + 0.5 * Math.cos(i * div), 0.5 + 0.5 * Math.sin(i * div));
        }

        for (let i = 0; i < this.slices; i++) {
            this.indices.push(0, i + 1, i);
        }

        this.indices.push(0, 1, this.slices);

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