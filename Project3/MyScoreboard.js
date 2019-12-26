/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyScoreboard extends CGFobject {
	constructor(scene) {
        super(scene);
        // scoreboard
        this.whitePlayerWins = 0;
        this.brownPlayerWins = 0;
        this.timePerPlay = 20;
        this.time;

        // ---- scoreboard primitives
        // label
        this.label = new MyRectangle(this.scene, 'label',  0.15, -0.25, 1, 0.70);
        // time
        this.timeTens = new MyRectangle(this.scene, 'timeTens',  0.20, 0.15, 0.80, 0.70);
        this.timeUnits = new MyRectangle(this.scene, 'timeUnits',  0.25, 0.20, 0.80, 0.70);
        // white player score
        this.whiteTens = new MyRectangle(this.scene, 'whiteTens',  0.20, 0.15, 0.90, 0.80);
        this.whiteUnits = new MyRectangle(this.scene, 'whiteUnits',  0.25, 0.20, 0.90, 0.80);
        // brown player score
        this.brownTens = new MyRectangle(this.scene, 'brownTens',  0.20, 0.15, 1.0, 0.90);
        this.brownUnits = new MyRectangle(this.scene, 'brownUnits',  0.25, 0.20, 1.0, 0.90);

        // ---- material
        // label
        this.labelMaterial = new CGFappearance(this.scene);
        // time
        this.timeTensMaterial = new CGFappearance(this.scene);
        this.timeUnitsMaterial = new CGFappearance(this.scene);
        // white player
        this.whiteTensMaterial = new CGFappearance(this.scene);
        this.whiteUnitsMaterial = new CGFappearance(this.scene);
        // brown player
        this.brownTensMaterial = new CGFappearance(this.scene);
        this.brownUnitsMaterial = new CGFappearance(this.scene);
        // ---- textures
        this.labelTexture = new CGFtexture(this.scene, "scenes/scoreboard/scoreboard_label.jpg");
        this.numbersTextures = [
            new CGFtexture(this.scene, "scenes/scoreboard/number_0.jpg"),
            new CGFtexture(this.scene, "scenes/scoreboard/number_1.jpg"),
            new CGFtexture(this.scene, "scenes/scoreboard/number_2.jpg"),
            new CGFtexture(this.scene, "scenes/scoreboard/number_3.jpg"),
            new CGFtexture(this.scene, "scenes/scoreboard/number_4.jpg"),
            new CGFtexture(this.scene, "scenes/scoreboard/number_5.jpg"),
            new CGFtexture(this.scene, "scenes/scoreboard/number_6.jpg"),
            new CGFtexture(this.scene, "scenes/scoreboard/number_7.jpg"),
            new CGFtexture(this.scene, "scenes/scoreboard/number_8.jpg"),
            new CGFtexture(this.scene, "scenes/scoreboard/number_9.jpg")
        ];
        // ---- set texture for label material
        this.labelMaterial.setTexture(this.labelTexture);

        // ---- shaders
        this.scoreboardShader = new CGFshader(this.scene.gl, "shaders/scoreboard.vert", "shaders/scoreboard.frag");
    }

    update(t) {
        this.time = Math.floor(t % 20);
        // time
        this.timeTensMaterial.setTexture(this.numbersTextures[Math.floor(this.time / 10)]);
        this.timeUnitsMaterial.setTexture(this.numbersTextures[this.time % 10]);
        // white player wins
        this.whiteTensMaterial.setTexture(this.numbersTextures[Math.floor(this.whitePlayerWins / 10)]);
        this.whiteUnitsMaterial.setTexture(this.numbersTextures[this.whitePlayerWins % 10]);
        // brown player wins
        this.brownTensMaterial.setTexture(this.numbersTextures[Math.floor(this.brownPlayerWins / 10)]);
        this.brownUnitsMaterial.setTexture(this.numbersTextures[this.brownPlayerWins % 10]);
    }
    
    reset() {
        this.time = this.timePerPlay;
    }

	display() {
        this.scene.pushMatrix();

        // disable depth
        this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
        // set scoreboard shader as active shader
        this.scene.setActiveShader(this.scoreboardShader);
        
        // label
        this.labelMaterial.apply();
        this.label.display();
        // time
        this.timeTensMaterial.apply();
        this.timeTens.display();
        this.timeUnitsMaterial.apply();
        this.timeUnits.display();
        // white player score
        this.whiteTensMaterial.apply();
        this.whiteTens.display();
        this.whiteUnitsMaterial.apply();
        this.whiteUnits.display();
        // brown player score
        this.brownTensMaterial.apply();
        this.brownTens.display();
        this.brownUnitsMaterial.apply();
        this.brownUnits.display();

        // set default shader as active shader
        this.scene.setActiveShader(this.scene.defaultShader);
        // enable depth
        this.scene.gl.enable(this.scene.gl.DEPTH_TEST);

        this.scene.popMatrix();

	}
		
}

