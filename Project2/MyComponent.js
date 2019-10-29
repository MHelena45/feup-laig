/**
 *
 */
class MyComponent {
	constructor(componentID) {
                this.componentID = componentID;
                // transformation
                this.transformationMatrix;
                // materials
                this.materialIDs = [];
                // textures
                this.textureID;
                this.lenght_s;
                this.lenght_t;
                // animation
                this.keyframeAnimation = new KeyframeAnimation();
                // children
                this.childrenIDs = [];
	}
}
