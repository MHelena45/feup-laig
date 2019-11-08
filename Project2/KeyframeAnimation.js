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
        let currentDate = new Date();
        let currentTime = currentDate.getTime();
        this.deltaTime = (currentTime - this.firstTime) / 1000;
        
        // update currentAnimationKey
        if(this.deltaTime >= this.instances[this.currentAnimationKey + 1]){
            this.currentAnimationKey++;
        }
          // get current animation key
          if(this.deltaTime < this.instances[this.instances.length - 1]) {
            this.animationMatrix = mat4.create();   
            let timeInterval = this.instances[this.currentAnimationKey + 1] - this.instances[this.currentAnimationKey];
            let periodicDeltaTime = (this.deltaTime - this.instances[this.currentAnimationKey]) / timeInterval;
            
            // translation
            let periodicTranslation = this.subtractArray(this.translation[this.currentAnimationKey + 1], this.translation[this.currentAnimationKey]);
            periodicTranslation = this.multiplyArray(periodicTranslation, periodicDeltaTime);
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, this.translation[this.currentAnimationKey]);
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, periodicTranslation);

            // rotation
            let periodicRotation = this.subtractArray(this.rotation[this.currentAnimationKey + 1], this.rotation[this.currentAnimationKey]);     
            periodicRotation = this.multiplyArray(periodicRotation, periodicDeltaTime);
            this.animationMatrix = mat4.rotateX(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * (periodicRotation[0] + this.rotation[this.currentAnimationKey][0]));
            this.animationMatrix = mat4.rotateY(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * (periodicRotation[1] + this.rotation[this.currentAnimationKey][1]));
            this.animationMatrix = mat4.rotateZ(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * (periodicRotation[2] + this.rotation[this.currentAnimationKey][2]));
          
            /* scale    */
            //calculates ratio
            let periodicScale = this.powArray(this.division2Array(this.scale[this.currentAnimationKey + 1], this.scale[this.currentAnimationKey]), 1/timeInterval) ;
            //ratio ^ n
            periodicScale = this.powArray(periodicScale, this.deltaTime - this.instances[this.currentAnimationKey]);
            //multiplies S0 * r^n
            periodicScale = this.multiply2Array(periodicScale, this.scale[this.currentAnimationKey]);
            this.animationMatrix = mat4.scale(this.animationMatrix, this.animationMatrix, periodicScale);
        }
        else { //stops the animation the last place defined
            this.animationMatrix = mat4.create();  
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, this.translation[this.instances.length - 1] );
            this.animationMatrix = mat4.rotateX(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * this.rotation[this.instances.length - 1][0]);
            this.animationMatrix = mat4.rotateY(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * this.rotation[this.instances.length - 1][1]);
            this.animationMatrix = mat4.rotateZ(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * this.rotation[this.instances.length - 1][2]);
            this.animationMatrix = mat4.scale(this.animationMatrix, this.animationMatrix, this.scale[this.instances.length - 1]);
        }
        
    }

    subtractArray(A, B) {
        let sub = [];
        for(let i = 0; i < B.length; i++) {
            sub.push(A[i] - B[i]);
        }
        return sub;
    }

    multiplyArray(Arr, constant) {
        let multiplicationArray = [];
        for(let i = 0; i < Arr.length; i++) {
            multiplicationArray.push(constant * Arr[i]);
        }
        return multiplicationArray;
    }

    multiply2Array(Arr, Arr1){
        let multiplication2Array = [];
        for(let i= 0; i < Arr.length; i++){
            multiplication2Array.push(Arr[i] * Arr1[i]);
        }
        return multiplication2Array;

    }

    division2Array(Arr, Arr1){
        let div = [];
        for(let i= 0; i < Arr.length; i++){
            div.push(Arr[i] / Arr1[i]);
        }
        return div;
    }

    powArray(Arr, e){
        let pow = [];
        for(let i = 0; i < Arr.length; i++) {
            pow.push(Math.pow(Arr[i], e));
        }
        return pow;
    }

    apply() {
      
        this.scene.multMatrix(this.animationMatrix);
    }
}


