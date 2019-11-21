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
	}

	update(t) {
		var lineColorR = 0.0;
		var lineColorG = 0.0;
		var lineColorB = 0.0;

		if (this.scene.selectedColor == 0) { // white
			lineColorR = 1.0;
			lineColorG = 1.0;
			lineColorB = 1.0;
		}
		else if (this.scene.selectedColor == 1) // red
			lineColorR = 1.0;
		else if (this.scene.selectedColor == 2) // green
			lineColorG = 1.0;
		else if (this.scene.selectedColor == 3) // blue
			lineColorB = 1.0;
		else
			console.log('dumbass');

		this.cameraShader.setUniformsValues({
			timeFactor: t / 100 % 1000,
			lineThickness: this.scene.lineThickness,
			lineSpacing: this.scene.lineSpacing,
			lineColorR: lineColorR,
			lineColorG: lineColorG,
			lineColorB: lineColorB
		});
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

