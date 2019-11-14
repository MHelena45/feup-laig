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

        //Checkbox element to display Textures
        this.gui.add(this.scene, 'lights1').name('Light of the star');
        this.gui.add(this.scene, 'lights2').name('Light telescope');
        this.gui.add(this.scene, 'lights3').name('Light of the sun');

        //Dropdown for environment
        this.gui.add(this.scene, 'selectedView', this.scene.SceneViewsIds).name('Selected scene View').onChange(this.scene.updateView.bind(this.scene));
        this.gui.add(this.scene, 'securityCameraView', this.scene.securityCameraViewIds).name('Security camera View').onChange(this.scene.updateSecurityCameraView.bind(this.scene));

        // add a group of controls (and open/expand by defult)

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