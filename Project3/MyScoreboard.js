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
        this.timePerTurn = 20;
        this.firstTime;

        // ---- scoreboard primitives
        // label
        this.label = new MyRectangle(this.scene, 'label',  0.15, -0.25, 1, 0.70);
        // deltaTime
        this.timeTens = new MyRectangle(this.scene, 'timeTens',  0.20, 0.15, 0.80, 0.70);
        this.timeUnits = new MyRectangle(this.scene, 'timeUnits',  0.25, 0.20, 0.80, 0.70);
        // brown player score
        this.brownTens = new MyRectangle(this.scene, 'brownTens',  0.20, 0.15, 0.90, 0.80);
        this.brownUnits = new MyRectangle(this.scene, 'brownUnits',  0.25, 0.20, 0.90, 0.80);
        // white player score
        this.whiteTens = new MyRectangle(this.scene, 'whiteTens',  0.20, 0.15, 1.00, 0.90);
        this.whiteUnits = new MyRectangle(this.scene, 'whiteUnits',  0.25, 0.20, 1.00, 0.90);

        // ---- material
        // label
        this.labelMaterial = new CGFappearance(this.scene);
        // deltaTime
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

         // deltaTime
         this.timeTensMaterial.setTexture(this.numbersTextures[0]);
         this.timeUnitsMaterial.setTexture(this.numbersTextures[0]);
         // white player wins
         this.whiteTensMaterial.setTexture(this.numbersTextures[0]);
         this.whiteUnitsMaterial.setTexture(this.numbersTextures[0]);
         // brown player wins
         this.brownTensMaterial.setTexture(this.numbersTextures[0]);
         this.brownUnitsMaterial.setTexture(this.numbersTextures[0]);

        // ---- shaders
        this.scoreboardShader = new CGFshader(this.scene.gl, "shaders/scoreboard.vert", "shaders/scoreboard.frag");
    }

    isTimeOver() {
        let currentTime = new Date().getTime();
        if((currentTime - this.firstTime) / 1000 >= this.timePerTurn) {
            // set texture to 0's
            this.timeTensMaterial.setTexture(this.numbersTextures[0]);
            this.timeUnitsMaterial.setTexture(this.numbersTextures[0]);
            return true;
        }
        else return false;
    }

    update() {
       this.updateStopWatch();
       this.updateScore();
    }

    updateStopWatch() {
        this.firstTime = this.firstTime || new Date().getTime();
        let currentTime = new Date().getTime();
        let deltaTime = (currentTime - this.firstTime) / 1000;
        let stopwatch = this.timePerTurn - Math.floor(deltaTime);
        // deltaTime
        this.timeTensMaterial.setTexture(this.numbersTextures[Math.floor(stopwatch / 10)]);
        this.timeUnitsMaterial.setTexture(this.numbersTextures[stopwatch % 10]);
    }

    updateScore() {
        // white player wins
        this.whiteTensMaterial.setTexture(this.numbersTextures[Math.floor(this.whitePlayerWins / 10)]);
        this.whiteUnitsMaterial.setTexture(this.numbersTextures[this.whitePlayerWins % 10]);
        // brown player wins
        this.brownTensMaterial.setTexture(this.numbersTextures[Math.floor(this.brownPlayerWins / 10)]);
        this.brownUnitsMaterial.setTexture(this.numbersTextures[this.brownPlayerWins % 10]);
    }
    
    reset() {
        this.firstTime = new Date().getTime();
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
        // deltaTime
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

