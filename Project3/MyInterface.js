/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        //Dropdown for  difficulty level
        this.gui.add(this.scene, 'difficultyLevel', this.scene.levels).name('Difficulty level').onChange(this.scene.updateLevel.bind(this.scene));
        this.gui.add(this.scene, 'whitePlayer', this.scene.playerOptions).name('White Player').onChange(this.scene.updateWhitePlayer.bind(this.scene));
        this.gui.add(this.scene, 'blackPlayer', this.scene.playerOptions).name('Black Player').onChange(this.scene.updateBlackPlayer.bind(this.scene));  

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}