var DEGREE_TO_RAD = Math.PI / 180;
var CLICK_M = 0;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();
        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;        

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        //checkboxes
        this.lights1 = true; 
        this.lights2 = true;
        this.lights3 = true;

        this.mClick = false; //used to now when M/m is being press  

        /* Start of components of Interface */
        //DropBox
        this.selectedView = 0;
		// Labels and ID's for object selection on MyInterface
		this.SceneViewsIds = { 'Front': 0, 'Behind': 1, 'Up': 2, 'Right Side' : 3 };

        this.selectedColor = 0;
        this.colors = { 'White': 0, 'Red': 1, 'Green': 2, 'Blue' : 3 };
        //DropBox of the security camera
        this.securityCameraView = 1;

        /* End of components of Interface */
        
        this.axis = new CGFaxis(this);

        this.setUpdatePeriod(100);
       
        this.securityCameraTexture = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
        this.securityCamera = new MySecurityCamera( this, 'securityCamera', 0.5, 1, -1, -0.5);
    }

    update(t) {
        if(this.sceneInited)
            this.graph.update(t);
        this.securityCamera.update(t);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene camera with id="defaultCamera"
     */
    initDefaultCamera() {
        this.camera = this.graph.views[this.graph.defaultCameraID];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * used for the dropbox
     * updates the view according to the selected view
     */
    updateView() {
        let views = this.graph.getViews();
        let views_ID = this.graph.getViewsID();
        this.camera = views[views_ID[this.selectedView]];       
        this.interface.setActiveCamera(this.camera);
    }
    
    /**
     * used for the dropbox
     * updates the view according to the selected view
     */
    updateSecurityCameraView() {
        let views = this.graph.getViews();
        let views_ID = this.graph.getViewsID();
        this.camera = views[views_ID[this.securityCameraView]];       
        this.interface.setActiveCamera(this.camera);
    }
    
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        let i = 0; 
        // Lights index.

        // Reads the lights from the scene graph.
        for (let key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                let light = this.graph.lights[key];
  
                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);
  
                if (light[1] == "spot") {              
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0], light[9][1], light[9][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();
                i++;
            }
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.sceneInited = true;

        this.initDefaultCamera();
    }
    
    // controls if M/m is release
	checkKeys() {
		if (this.gui.isKeyPressed("KeyM")) {
            this.mClick = true;        
		} else if(this.mClick) { /*increments when button is released */
            this.mClick = false;
            CLICK_M++;
        }
    }
    
    /**
     * return de number of M click releases
     */
    getM(){
        return CLICK_M;
    }
    
    /**
     * Displays the scene.
     */
    render(wantedCamera) {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.axis.display();

        this.checkKeys();

        //At program startup, the default camera should be used in both situations.
        if(this.sceneInited) {
            //Set requested camera
            if(wantedCamera)
                this.updateSecurityCameraView();
            else
                this.updateView();
        }

        //Update lights
        this.displayLights(); 

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Displays the lights according to the checkbox and the xml
     */
    displayLights(){
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            switch(i)
            {
                case(1):
                    if(this.lights1)
                        this.lights[i].enable();
                    else this.lights[i].disable();
                break;
                case(2):
                    if(this.lights2)
                        this.lights[i].enable();
                    else this.lights[i].disable();
                break;
                case(3):
                    if(this.lights3)
                        this.lights[i].enable();
                    else this.lights[i].disable();
                break;
                default:
                    this.lights[i].enable();
                break;
            }
            this.lights[i].update();
        }
    }

    display(){    
        this.render(1);         //render scene to canvas     
        this.securityCameraTexture.attachToFrameBuffer();           
        this.render(0);         //Render scene to CGFtextureRTT texture using different camera
        this.securityCameraTexture.detachFromFrameBuffer();   
        this.gl.disable(this.gl.DEPTH_TEST);
        this.securityCamera.display();
        this.gl.enable(this.gl.DEPTH_TEST);       
    }

}

