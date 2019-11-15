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

        this.gui = new dat.GUI();

        //Checkbox element to display or not lights
        this.gui.add(this.scene, 'lights1').name('Light of the star');
        this.gui.add(this.scene, 'lights2').name('Light telescope');
        this.gui.add(this.scene, 'lights3').name('Light of the sun');

        //Dropdown for views
        this.gui.add(this.scene, 'selectedView', this.scene.SceneViewsIds).name('Selected scene View').onChange(this.scene.updateView.bind(this.scene));
        this.gui.add(this.scene, 'securityCameraView', this.scene.securityCameraViewIds).name('Security camera View').onChange(this.scene.updateSecurityCameraView.bind(this.scene));

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