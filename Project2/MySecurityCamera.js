/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject {
	constructor(scene, id, x1, x2, y1, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
	
		this.rectangle = new MyRectangle(this.scene, id, x1, x2, y1, y2);
		
		this.cameraShader = new CGFshader(this.scene.gl, "shaders/camera.vert", "shaders/camera.frag");
		this.cameraShader.setUniformsValues({ timeFactor: 0 });

		this.lineColorR = 1.0;
		this.lineColorG = 1.0;
		this.lineColorB = 1.0;
	}

	update(t) {
		this.cameraShader.setUniformsValues({
			timeFactor: t / 100 % 1000,
			lineThickness: this.scene.lineThickness,
			lineSpacing: this.scene.lineSpacing,
			lineColorR: this.lineColorR,
			lineColorG: this.lineColorG,
			lineColorB: this.lineColorB
		});
	}
	
	/**
     * used for the dropbox
     * updates the color of the lines according to the selected color selected
     */
    updateColors(){
        switch(this.selectedColor){
            case "0":   // white
            {
                this.securityCamera.lineColorR = 1.0;
			    this.securityCamera.lineColorG = 1.0;
			    this.securityCamera.lineColorB = 1.0;
                break;
            }
            case "1":   // red
            {
                this.securityCamera.lineColorR = 1.0;
			    this.securityCamera.lineColorG = 0.0;
                this.securityCamera.lineColorB = 0.0;
                break;
            }
            case "2":  // green
            {
                this.securityCamera.lineColorR = 0.0;
			    this.securityCamera.lineColorG = 1.0;
			    this.securityCamera.lineColorB = 0.0;
                break;
            }
            case "3": // blue
            {
                this.securityCamera.lineColorR = 0.0;
			    this.securityCamera.lineColorG = 0.0;
			    this.securityCamera.lineColorB = 1.0;
                break;
            }
        }    
    }

	display() {
		this.scene.pushMatrix();

		this.scene.securityCameraTexture.bind(0);

		this.scene.setActiveShader(this.cameraShader);
		this.rectangle.display();

		this.scene.setActiveShader(this.scene.defaultShader);
		
		this.scene.securityCameraTexture.unbind(0); 
	
		this.scene.popMatrix();
	}
		
}

