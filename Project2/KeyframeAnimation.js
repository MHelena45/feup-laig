/**
 * Animation
 * Abstract class that represents an Animation
 */
class KeyframeAnimation extends Animation {
    constructor(scene) {
        super();
        this.instances = [0];
        this.translation = [[0, 0, 0]];
        this.rotation = [[0, 0, 0]];
        this.scale = [[1, 1, 1]];

        this.animationMatrix = mat4.create();

        this.scene = scene;
        this.firstDate = new Date();
        this.firstTime;
        this.deltaTime;

        this.currentAnimationKey = 0;
    }

    update() {
        // get current time
        this.firstTime = this.firstTime || this.firstDate.getTime();
        var currentDate = new Date();
        var currentTime = currentDate.getTime();
        this.deltaTime = (currentTime - this.firstTime) / 1000;
        // update currentAnimationKey
        if(this.deltaTime >= this.instances[this.currentAnimationKey + 1]){
            this.currentAnimationKey++;
        }
    }

    subtractArray(A, B) {
        var sub = [];
        for(var i = 0; i < B.length; i++) {
            sub.push(...[A[i] - B[i]]);
        }
        return sub;
    }

    sumArray(A, B) {
        var sum = [];
        for(var i = 0; i < B.length; i++) {
            sum.push(...[A[i] + B[i]]);
        }
        return sum;
    }

    multiplyArray(Arr, a) {
        var mul = [];
        for(var i = 0; i < Arr.length; i++) {
            mul.push(...[a * Arr[i]]);
        }
        return mul;
    }

    apply() {
        // get current animation key
        if(this.deltaTime < this.instances[this.instances.length - 1]) {
            this.animationMatrix = mat4.create();  
            var timeInterval = this.instances[this.currentAnimationKey + 1] - this.instances[this.currentAnimationKey];
            var periodicDeltaTime = (this.deltaTime - this.instances[this.currentAnimationKey]) / timeInterval;
            
            // translation
            var periodicTranslation = this.subtractArray(this.translation[this.currentAnimationKey + 1], this.translation[this.currentAnimationKey]);
            periodicTranslation = this.multiplyArray(periodicTranslation, periodicDeltaTime);
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, this.translation[this.currentAnimationKey]);
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, periodicTranslation);

            // rotation
            var periodicRotation = this.subtractArray(this.rotation[this.currentAnimationKey + 1], this.rotation[this.currentAnimationKey]);
            periodicRotation = this.multiplyArray(periodicRotation, periodicDeltaTime);
            this.animationMatrix = mat4.rotateX(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * this.rotation[this.currentAnimationKey][0]);
            this.animationMatrix = mat4.rotateX(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * periodicRotation[0]);
            this.animationMatrix = mat4.rotateY(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * this.rotation[this.currentAnimationKey][1]);
            this.animationMatrix = mat4.rotateY(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * periodicRotation[1]);
            this.animationMatrix = mat4.rotateZ(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * this.rotation[this.currentAnimationKey][2]);
            this.animationMatrix = mat4.rotateZ(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * periodicRotation[2]);
          
            // scale
            var periodicScale = this.subtractArray(this.scale[this.currentAnimationKey + 1], this.scale[this.currentAnimationKey]);
            periodicScale = this.sumArray(this.multiplyArray(periodicScale, periodicDeltaTime), this.scale[this.currentAnimationKey]);
            this.animationMatrix = mat4.scale(this.animationMatrix, this.animationMatrix, this.scale[this.currentAnimationKey]);
            this.animationMatrix = mat4.scale(this.animationMatrix, this.animationMatrix, periodicScale);
        }
        else { //stops the animation the last place defined
            this.animationMatrix = mat4.create();  
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, this.translation[this.instances.length - 1] );
            this.animationMatrix = mat4.rotateX(this.animationMatrix, this.animationMatrix, this.rotation[this.instances.length - 1][0]);
            this.animationMatrix = mat4.rotateY(this.animationMatrix, this.animationMatrix, this.rotation[this.instances.length - 1][1]);
            this.animationMatrix = mat4.rotateZ(this.animationMatrix, this.animationMatrix, this.rotation[this.instances.length - 1][2]);
            this.animationMatrix = mat4.scale(this.animationMatrix, this.animationMatrix, this.scale[this.instances.length - 1]);
        }
        this.scene.multMatrix(this.animationMatrix);
    }
}


