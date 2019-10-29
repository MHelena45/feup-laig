/**
 * Animation
 * Abstract class that represents an Animation
 */
class KeyframeAnimation extends Animation {
    constructor(scene) {
        super();
        this.keys = [];
        this.animationMatrices = [];

        this.periodicAnimationMatrix = mat4.create();

        this.scene = scene;
        this.lastDate = new Date();
        this.lastTime;

        this.currentAnimationKey = 0;
    }

    update() {
        // get current time
        this.lastTime = this.lastTime || this.lastDate.getTime();
        var currentDate = new Date();
        var currentTime = currentDate.getTime();

        var deltaTime = (currentTime - this.lastTime) / 1000;

        // get current animation key
        if(deltaTime < this.keys[this.keys.length - 1])
            while(deltaTime > this.keys[this.currentAnimationKey])
            this.currentAnimationKey++;
        

        this.periodicAnimationMatrix = this.animationMatrices[this.keys[this.currentAnimationKey]];

        debugger;

        /*
        this.periodicAnimationMatrix[0] = this.animationMatrix[0] * deltaTime;
        this.periodicAnimationMatrix[1] = this.animationMatrix[1] * deltaTime;
        this.periodicAnimationMatrix[2] = this.animationMatrix[2] * deltaTime;
        this.periodicAnimationMatrix[3] = this.animationMatrix[3] * deltaTime;
        this.periodicAnimationMatrix[4] = this.animationMatrix[4] * deltaTime;
        this.periodicAnimationMatrix[5] = this.animationMatrix[5] * deltaTime;
        this.periodicAnimationMatrix[6] = this.animationMatrix[6] * deltaTime;
        this.periodicAnimationMatrix[7] = this.animationMatrix[7] * deltaTime;
        this.periodicAnimationMatrix[8] = this.animationMatrix[8] * deltaTime;
        this.periodicAnimationMatrix[9] = this.animationMatrix[9] * deltaTime;
        this.periodicAnimationMatrix[10] = this.animationMatrix[10] * deltaTime;
        this.periodicAnimationMatrix[11] = this.animationMatrix[11] * deltaTime;
        this.periodicAnimationMatrix[12] = this.animationMatrix[12] * deltaTime;
        this.periodicAnimationMatrix[13] = this.animationMatrix[13] * deltaTime;
        this.periodicAnimationMatrix[14] = this.animationMatrix[14] * deltaTime;
        this.periodicAnimationMatrix[15] = this.animationMatrix[15] * deltaTime;
        */
    }

    apply() {
        this.scene.pushMatrix();
        debugger;
        this.scene.multMatrix(this.periodicAnimationMatrix);
        this.scene.popMatrix();
    }
}


