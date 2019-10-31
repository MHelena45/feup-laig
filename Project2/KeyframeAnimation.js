/**
 * Animation
 * Abstract class that represents an Animation
 */
class KeyframeAnimation extends Animation {
    constructor(scene) {
        super();
        this.keys = [];
        this.keys.push(...[[0]]);
        this.animationTranslation = [];
        this.animationTranslation.push(...[[0,0,0]]);
        this.animationRotationX =[];
        this.animationRotationX.push(...[[0]]);
        this.animationRotationY =[];
        this.animationRotationY.push(...[[0]]);
        this.animationRotationZ =[];
        this.animationRotationZ.push(...[[0]]);
        this.animationScales = [];
        this.animationScales.push(...[[1,1,1]]);

        this.periodicAnimationMatrix = mat4.create();

        this.scene = scene;
        this.lastDate = new Date();
        this.lastTime;
        this.deltaTime;

        this.currentAnimationKey = 0;
        this.nextAnimationKey = 1;
        this.numberIncrements = 0;
    
    }

    update() {
        // get current time
        this.lastTime = this.lastTime || this.lastDate.getTime();
        var currentDate = new Date();
        var currentTime = currentDate.getTime();
        this.deltaTime = (currentTime - this.lastTime) / 1000;

    }

    apply() {
        
        // get current animation key
        if(this.deltaTime < this.keys[this.keys.length - 2]){
            if(this.deltaTime > this.keys[this.currentAnimationKey]){
                this.currentAnimationKey++;
                this.numberIncrements = 0;
            }
            if(this.deltaTime == this.keys[this.currentAnimationKey] ){                 
                this.periodicAnimationMatrix = mat4.create();      
                var translate = this.animationTranslation[this.currentAnimationKey];
                this.periodicAnimationMatrix = mat4.translate(this.periodicAnimationMatrix, this.periodicAnimationMatrix, translate );
                var scale = this.animationScales[this.currentAnimationKey];
                this.periodicAnimationMatrix = mat4.scale(this.periodicAnimationMatrix, this.periodicAnimationMatrix, scale);
                this.scene.multMatrix(this.periodicAnimationMatrix); 
            } else {
                var scale = [];
                var translate = [];
                this.periodicAnimationMatrix = mat4.create();
                this.numberIncrements++;
                console.log(this.numberIncrements);
                var difference = this.keys[this.currentAnimationKey + 1] - this.keys[this.currentAnimationKey];
                translate[0] = this.animationTranslation[this.currentAnimationKey][0];
                translate[0] += (this.numberIncrements * ( (this.animationTranslation[this.currentAnimationKey+1][0] - this.animationTranslation[this.currentAnimationKey][0])/ (difference * 28)));
                translate[1] = this.animationTranslation[this.currentAnimationKey][1];
                translate[1] += (this.numberIncrements * ((this.animationTranslation[this.currentAnimationKey+1][1] - this.animationTranslation[this.currentAnimationKey][1])/ (difference * 28)));
                translate[2] = this.animationTranslation[this.currentAnimationKey][2];
                translate[2] += (this.numberIncrements *((this.animationTranslation[this.currentAnimationKey+1][2] - this.animationTranslation[this.currentAnimationKey][2])/ (difference * 28)));
                this.periodicAnimationMatrix = mat4.translate(this.periodicAnimationMatrix, this.periodicAnimationMatrix, translate);

                scale[0] = this.animationScales[this.currentAnimationKey][0];
                scale[0] += this.numberIncrements *( (this.animationScales[this.currentAnimationKey+1][0] - this.animationScales[this.currentAnimationKey][0])/ (difference * 28));
                scale[1] = this.animationScales[this.currentAnimationKey][1];
                scale[1] += this.numberIncrements * ((this.animationScales[this.currentAnimationKey+1][1] - this.animationScales[this.currentAnimationKey][1])/ (difference * 28));
                scale[2] = this.animationScales[this.currentAnimationKey][2];
                scale[2] += this.numberIncrements *((this.animationScales[this.currentAnimationKey+1][2] - this.animationScales[this.currentAnimationKey][2])/ (difference * 28)) ;
 
                this.periodicAnimationMatrix = mat4.scale(this.periodicAnimationMatrix, this.periodicAnimationMatrix, scale);
                this.scene.multMatrix(this.periodicAnimationMatrix); 
            } 

        } else { //stops the animation the last place defined    
            this.periodicAnimationMatrix = mat4.create();    
            this.periodicAnimationMatrix = mat4.translate(this.periodicAnimationMatrix, this.periodicAnimationMatrix, this.animationTranslation[this.keys.length - 1] );
            this.periodicAnimationMatrix = mat4.scale(this.periodicAnimationMatrix, this.periodicAnimationMatrix, this.animationScales[this.keys.length - 1]);
            this.scene.multMatrix(this.periodicAnimationMatrix);  
        }
    }
}


