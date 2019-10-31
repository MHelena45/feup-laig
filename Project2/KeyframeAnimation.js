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
            
            var oldAnimation = mat4.create();
            oldAnimation = mat4.translate(oldAnimation, oldAnimation, this.translation[this.currentAnimationKey]);
            //oldAnimation = mat4.rotate(oldAnimation, oldAnimation, this.rotate[this.currentAnimationKey]);
            //oldAnimation = mat4.scale(oldAnimation, oldAnimation, this.scale[this.currentAnimationKey]);
            this.scene.multMatrix(oldAnimation);
            
            // translation
            var periodicTranslation = this.subtractArray(this.translation[this.currentAnimationKey + 1], this.translation[this.currentAnimationKey]);
            periodicTranslation = this.multiplyArray(periodicTranslation, periodicDeltaTime);
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, periodicTranslation);
            
            // rotation
            var periodicRotation = this.subtractArray(this.rotation[this.currentAnimationKey + 1], this.rotation[this.currentAnimationKey]);
            periodicRotation = this.multiplyArray(periodicRotation, periodicDeltaTime);
            //this.animationMatrix = mat4.rotate(this.animationMatrix, this.animationMatrix, periodicRotation);
            
            // scale
            var periodicScale = this.subtractArray(this.scale[this.currentAnimationKey + 1], this.scale[this.currentAnimationKey]);
            periodicScale = this.multiplyArray(periodicScale, periodicDeltaTime);
            //this.animationMatrix = mat4.scale(this.animationMatrix, this.animationMatrix, periodicScale);

        } else { //stops the animation the last place defined
            this.animationMatrix = mat4.create();  
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, this.translation[this.instances.length - 1] );
            //this.animationMatrix = mat4.rotate(this.animationMatrix, this.animationMatrix, this.rotation[this.instances.length - 1]);
            //this.animationMatrix = mat4.scale(this.animationMatrix, this.animationMatrix, this.scale[this.instances.length - 1]);
        }
        this.scene.multMatrix(this.animationMatrix);  
    }
}


