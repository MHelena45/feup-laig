/**
 * Animation
 * Abstract class that represents an Animation
 */
class KeyframeAnimation extends Animation {
    constructor(scene) {
        super();
        this.scene = scene;

        this.instances = [];
        //map where key is instant and value a array with the 3 transformation [[translation], [rotation], [scale]]
        this.animations = new Map();
        
        this.animationMatrix;               //matrix being apply in the moment         
        this.firstTime;                     //time since animation start
        this.deltaTime;                     
        this.currentAnimationKey = 0;
    }

    sortInstances(){
        if(this.animations.get(0) == null){ //if there isn't a transformation for the instant 0 add one neutral
            this.instances.push(0);
            this.animations.set(0, [[0,0,0], [0,0,0], [1,1,1]]);
        }
        this.instances.sort(this.subtractNumbers); //java script doesn't sort numbers correctly on it's own
    }

    subtractNumbers(number1, number2){
        return number1 - number2;
    }

    update() {
        // update time according to the current time
        this.firstTime = this.firstTime || new Date().getTime(); //when first time isn't instantiated we get the current time
        let currentDate = new Date();
        let currentTime = currentDate.getTime();
        this.deltaTime = (currentTime - this.firstTime) / 1000;
        
        // update currentAnimationKey
        if(this.deltaTime >= this.instances[this.currentAnimationKey + 1]){
            this.currentAnimationKey++;
        }

          // get current animation key
        if(this.deltaTime < this.instances[this.instances.length - 1]) {

            let transformationsNext = this.animations.get(this.instances[this.currentAnimationKey + 1]);
            let transformationsPrevious = this.animations.get(this.instances[this.currentAnimationKey]);

            this.animationMatrix = mat4.create();   
            let timeInterval = this.instances[this.currentAnimationKey + 1] - this.instances[this.currentAnimationKey];
            let periodicDeltaTime = (this.deltaTime - this.instances[this.currentAnimationKey]) / timeInterval;
            
            // translation
            let periodicTranslation = this.subtract2Arrays(transformationsNext[0] , transformationsPrevious[0]);
            periodicTranslation = this.multiplyArray(periodicTranslation, periodicDeltaTime);
            periodicTranslation = this.sum2Arrays(transformationsPrevious[0], periodicTranslation);
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, periodicTranslation);

            // rotation
            let periodicRotation = this.subtract2Arrays(transformationsNext[1], transformationsPrevious[1]);     
            periodicRotation = this.multiplyArray(periodicRotation, periodicDeltaTime);
            this.animationMatrix = mat4.rotateX(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * (periodicRotation[0] + transformationsPrevious[1][0]));
            this.animationMatrix = mat4.rotateY(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * (periodicRotation[1] + transformationsPrevious[1][1]));
            this.animationMatrix = mat4.rotateZ(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * (periodicRotation[2] + transformationsPrevious[1][2]));
          
            /* scale    */
            //calculates ratio
            let periodicScale = this.powArray(this.division2Array(transformationsNext[2], transformationsPrevious[2]), 1/timeInterval) ;
            //ratio ^ n
            periodicScale = this.powArray(periodicScale, this.deltaTime - this.instances[this.currentAnimationKey]);
            //multiplies S0 * r^n
            periodicScale = this.multiply2Array(periodicScale, transformationsPrevious[2]);
            this.animationMatrix = mat4.scale(this.animationMatrix, this.animationMatrix, periodicScale);
        }
        else { //stops the animation the last place defined     
            let transformations = this.animations.get(this.instances[this.instances.length - 1]);
            this.animationMatrix = mat4.create();  
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, transformations[0] );
            this.animationMatrix = mat4.rotateX(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * transformations[1][0]);
            this.animationMatrix = mat4.rotateY(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * transformations[1][1]);
            this.animationMatrix = mat4.rotateZ(this.animationMatrix, this.animationMatrix, DEGREE_TO_RAD * transformations[1][2]);
            this.animationMatrix = mat4.scale(this.animationMatrix, this.animationMatrix, transformations[2]);
        }
        
    }

    /** Operations with arrays, applied to all the elements */
    subtract2Arrays(Array1, Array2) {
        let subtract2Arrays = [];
        for(let i = 0; i < Array1.length; i++) {
            subtract2Arrays.push(Array1[i] - Array2[i]);
        }
        return subtract2Arrays;
    }

    multiplyArray(Array, constant) {
        let multiplicationArray = [];
        for(let i = 0; i < Array.length; i++) {
            multiplicationArray.push(constant * Array[i]);
        }
        return multiplicationArray;
    }

    multiply2Array(Array1, Array2){
        let multiplication2Array = [];
        for(let i= 0; i < Array1.length; i++){
            multiplication2Array.push(Array2[i] * Array1[i]);
        }
        return multiplication2Array;

    }

    division2Array(Array, Array1){
        let div = [];
        for(let i= 0; i < Array.length; i++){
            div.push(Array[i] / Array1[i]);
        }
        return div;
    }

    sum2Arrays(Array, Array1){
        let sum2Arrays = [];
        for(let i= 0; i < Array.length; i++){
            sum2Arrays.push(Array[i] + Array1[i]);
        }
        return sum2Arrays;
    }

    powArray(Array, e){
        let pow = [];
        for(let i = 0; i < Array.length; i++) {
            pow.push(Math.pow(Array[i], e));
        }
        return pow;
    }

    apply() {  
        this.scene.multMatrix(this.animationMatrix);
    }
}


