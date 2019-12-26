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

        this.lineComponentR = 1.0;
		this.lineComponentG = 1.0;
		this.lineComponentB = 1.0;		
        this.lineThickness = 1.0;
		this.lineSpacing = 1.0;
		this.linesMovement = 100;
	
		this.rectangle = new MyRectangle(this.scene, id, x1, x2, y1, y2);
		
		this.cameraShader = new CGFshader(this.scene.gl, "shaders/camera.vert", "shaders/camera.frag");
		this.cameraShader.setUniformsValues({ timeFactor: 0 });
	}

	update(t) {
		this.cameraShader.setUniformsValues({
			timeFactor: (t / this.linesMovement) % 1000,
			lineThickness: this.lineThickness,
			lineSpacing: this.lineSpacing,
			lineComponentR: this.lineComponentR,
			lineComponentG: this.lineComponentG,
			lineComponentB: this.lineComponentB
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

