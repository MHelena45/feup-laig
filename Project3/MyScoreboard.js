/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyScoreboard extends CGFobject {
	constructor(scene) {
		super(scene);
	
		this.label = new MyRectangle(this.scene, 'label',  -0.25, 0.25, 1, 0.75);
	}

	update(t) {
		
	}

	display() {
        this.scene.pushMatrix();
            // disable depth
            this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
            this.label.display();
            // enable depth
            this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
		this.scene.popMatrix();
	}
		
}

