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
        this.gui.add(this.scene.gameOrchestrator, 'difficultyLevel', this.scene.gameOrchestrator.levels).name('Difficulty level').onChange(this.scene.gameOrchestrator.updateLevel.bind(this.scene.gameOrchestrator));
        this.gui.add(this.scene.gameOrchestrator, 'brownPlayer', this.scene.gameOrchestrator.playerOptions).name('Brown Player').onChange(this.scene.gameOrchestrator.updateBrownPlayer.bind(this.scene.gameOrchestrator));  
        this.gui.add(this.scene.gameOrchestrator, 'whitePlayer', this.scene.gameOrchestrator.playerOptions).name('White Player').onChange(this.scene.gameOrchestrator.updateWhitePlayer.bind(this.scene.gameOrchestrator));  
        this.gui.add(this.scene.gameOrchestrator, 'theme', this.scene.gameOrchestrator.themeOptions).name('Theme').onChange(this.scene.gameOrchestrator.updateTheme.bind(this.scene.gameOrchestrator));  

        this.gui.add(this.scene.gameOrchestrator.undo,'undo').name('Undo');
        this.gui.add(this.scene.gameOrchestrator.startGame , 'start').name('Start').onChange(this.scene.gameOrchestrator.start.bind(this.scene.gameOrchestrator));
        this.gui.add(this.scene.gameOrchestrator.startGame , 'start').name('Reset').onChange(this.scene.gameOrchestrator.reset.bind(this.scene.gameOrchestrator));

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