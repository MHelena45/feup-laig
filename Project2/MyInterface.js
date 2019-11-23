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

        //Dropdown for scene view
        this.gui.add(this.scene, 'selectedView', this.scene.SceneViewsIds).name('View scene').onChange(this.scene.updateView.bind(this.scene));
   
        this.gui.add(this.scene.securityCamera, 'lineSpacing', 0.1, 3).name('Line spacing');
        this.gui.add(this.scene.securityCamera, 'lineThickness', 0.5, 8).name('Line thickness');    
        this.gui.add(this.scene.securityCamera, 'linesMovement', 30, 1000).name('Line movement');           

        //Dropdown for security camera view        
        this.gui.add(this.scene, 'securityCameraView', this.scene.SceneViewsIds).name('View sec camera').onChange(this.scene.updateSecurityCameraView.bind(this.scene.securityCamera));

        //change color of the lines of the security camera
        this.gui.add(this.scene.securityCamera, 'lineComponentR', 0, 1.0).name('Line comp R');
        this.gui.add(this.scene.securityCamera, 'lineComponentG', 0, 1.0).name('Line comp G');
        this.gui.add(this.scene.securityCamera, 'lineComponentB', 0, 1.0).name('Line comp B');

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