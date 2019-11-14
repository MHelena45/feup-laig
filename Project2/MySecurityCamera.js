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
		
		this.initBuffers();
	}

	display() {
	//	this.scene.securityCameraTexture.bind(1); 
		this.rectangle.display();
	//	this.scene.securityCameraTexture.unbind(1); 
	}
	
	
	
}

