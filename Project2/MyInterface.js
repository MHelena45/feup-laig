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
          
        this.gui.add(this.scene.securityCamera, 'lineColorR', 0, 1.0).name('Line component R');
        this.gui.add(this.scene.securityCamera, 'lineColorG', 0, 1.0).name('Line component G');
        this.gui.add(this.scene.securityCamera, 'lineColorB', 0, 1.0).name('Line component B');

        //Dropdown for views
        this.gui.add(this.scene, 'selectedView', this.scene.SceneViewsIds).name('Selected scene View').onChange(this.scene.updateView.bind(this.scene));
        this.gui.add(this.scene, 'securityCameraView', this.scene.SceneViewsIds).name('Security camera View').onChange(this.scene.updateSecurityCameraView.bind(this.scene.securityCamera));

        this.gui.add(this.scene.securityCamera, 'lineSpacing', 0.1, 3).name('Line spacing');
        this.gui.add(this.scene.securityCamera, 'lineSpacing', 0.1, 3).name('Line spacing');

        this.gui.add(this.scene.securityCamera, 'lineSpacing', 0.1, 3).name('Line spacing');
        this.gui.add(this.scene.securityCamera, 'lineThickness', 0.5, 8).name('Line thickness');

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