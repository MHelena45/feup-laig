/**
 * Animation
 * Abstract class that represents an Animation
 */
class KeyframeAnimation extends Animation {
    constructor() {
        super();
        this.animationMatrix;
    }

    update() {
        // get current time
        // subtract with previous animation time
        // animationMatrix = time * animationMatrix
    }

    apply() {
        // scene.pushMatrix();
        // scene.multMatrix(matrix);
        // scene.mulMatrix(animationMatrix);
    }
}


