var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];
        

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse ambient block
            if ((error = this.parseGlobal(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        var children = viewsNode.children;

        this.defaultCameraID = this.reader.getString(viewsNode, "default");

        this.views = [];
        this.views_ID = [];

        // Check if there are any views
        if (children.length == 0)
            return "<views> - you must define at least one perspective/ortho view";

        // Any number of views (perspective or ortho)
        for (var i = 0; i < children.length; i++) {

            // error
            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current view
            var viewID = this.reader.getString(children[i], 'id');
            if (viewID == null)
                this.onXMLMinorError("no ID defined for view");

            // Checks for repeated IDs
            else if (this.views[viewID] != null)
                this.onXMLMinorError("ID must be unique for each view (conflict: ID = " + transformationID + ")");

            // if viewID is not null and not repeat, store him in the view_ID vector
            else this.views_ID[this.views_ID.length] = viewID;

            // near
            var near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near)))
                return "unable to parse 'near' of view ID = " + viewId;
                
            // far
            var far = this.reader.getFloat(children[i], 'far');
            if (!(far != null && !isNaN(far)))
                return "unable to parse 'far' of view ID = " + viewId;

            // perspective
            if (children[i].nodeName == "perspective") {               
                // angle
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse 'angle' of view ID = " + viewId;

                var grandChildren = children[i].children;
                var x, y, z;
                // from
                var from = grandChildren[0];
                x = this.reader.getFloat(from, "x");
                y = this.reader.getFloat(from, "y");
                z = this.reader.getFloat(from, "z");

                if (!(x != null && !isNaN(x)))
                    return "unable to parse 'x' of 'from' tag from view ID = " + viewId;
                if (!(y != null && !isNaN(y)))
                    return "unable to parse 'y' of 'from' tag from view ID = " + viewId;
                if (!(z != null && !isNaN(z)))
                    return "unable to parse 'z' of 'from' tag from view ID = " + viewId;

                var position = vec3.fromValues(x, y, z);

                // to
                var to = grandChildren[1];
                var x = this.reader.getFloat(to, "x");
                var y = this.reader.getFloat(to, "y");
                var z = this.reader.getFloat(to, "z");

                if (!(x != null && !isNaN(x)))
                    return "unable to parse 'x' of 'to' tag from view ID = " + viewId;
                if (!(y != null && !isNaN(y)))
                    return "unable to parse 'y' of 'to' tag from view ID = " + viewId;
                if (!(z != null && !isNaN(z)))
                    return "unable to parse 'z' of 'to' tag from view ID = " + viewId;

                var target = vec3.fromValues(x, y, z);

                this.views[viewID] = new CGFcamera(DEGREE_TO_RAD * angle, near, far, position, target);
            }
            // ortho
            else if (children[i].nodeName == "ortho") {

                // left
                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left)))
                    return "unable to parse 'left' of view ID = " + viewId;

                // right
                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right)))
                    return "unable to parse 'right' of view ID = " + viewId;

                // top
                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse 'top' of view ID = " + viewId;

                // bottom
                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom)))
                    return "unable to parse 'bottom' of view ID = " + viewId;

                var grandChildren = children[i].children;
                var x, y, z;
                // from
                var from = grandChildren[0];
                x = this.reader.getFloat(from, "x");
                y = this.reader.getFloat(from, "y");
                z = this.reader.getFloat(from, "z");

                if (!(x != null && !isNaN(x)))
                    return "unable to parse 'x' of 'from' tag from view ID = " + viewId;
                if (!(y != null && !isNaN(y)))
                    return "unable to parse 'y' of 'from' tag from view ID = " + viewId;
                if (!(z != null && !isNaN(z)))
                    return "unable to parse 'z' of 'from' tag from view ID = " + viewId;

                var position = vec3.fromValues(x, y, z);

                // to
                var to = grandChildren[1];
                var x = this.reader.getFloat(to, "x");
                var y = this.reader.getFloat(to, "y");
                var z = this.reader.getFloat(to, "z");

                if (!(x != null && !isNaN(x)))
                    return "unable to parse 'x' of 'to' tag from view ID = " + viewId;
                if (!(y != null && !isNaN(y)))
                    return "unable to parse 'y' of 'to' tag from view ID = " + viewId;
                if (!(z != null && !isNaN(z)))
                    return "unable to parse 'z' of 'to' tag from view ID = " + viewId;

                var target = vec3.fromValues(x, y, z);

                // up
                var up;
                if (grandChildren[2] != null) {
                    var upXML = grandChildren[2];
                    var x = this.reader.getFloat(upXML, "x");
                    var y = this.reader.getFloat(upXML, "y");
                    var z = this.reader.getFloat(upXML, "z");
               
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse 'x' of 'up' tag from view ID = " + viewId;
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse 'y' of 'up' tag from view ID = " + viewId;
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse 'z' of 'up' tag from view ID = " + viewId;

                    up = vec3.fromValues(x, y, z);
                }
                else
                    up = vec3.fromValues(0, 1, 0);

                
                this.views[viewID] = new CGFcameraOrtho(left, right, bottom, top, near, far, position, target, up);
            }
        }

        this.log("Parsed views");
        return null;
    }

    //used for the dropbox
    getViews(){
        return this.views;
    }

    //used for the dropbox
    getViewsID(){
        return this.views_ID;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseGlobal(globalsNode) {

        var children = globalsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color", "numbers"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position") {
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);

                    }
                    else if (attributeTypes[j] == "numbers") {         //check if attribute attenuation is 0 or greater, not null and numbers               
                        var constant = this.reader.getFloat(grandChildren[attributeIndex], 'constant');
                        var OneAttenuation = false;
                        if (constant != null) {
                            if (isNaN(constant))
                                return "constant in attenuation is a non numeric value on the light block for ID = " + lightId;
                            else if (!(constant == 0 || constant == 1))
                                return "constant attenuation is a valid numeric value on the light block for ID = " + lightId;
                            else if (constant == 1)
                                OneAttenuation = true;
                        }
                        else
                            return "unable to parse attenuation constant of the light position for ID = " + lightId;

                        var linear = this.reader.getFloat(grandChildren[attributeIndex], 'linear');
                        if (linear != null) {
                            if (isNaN(linear))
                                return "linear in attenuation is a non numeric value on the light block for ID = " + lightId;
                            else if (!(linear == 0 || linear == 1))
                                return "linear attenuation is a valid numeric value on the light block for ID = " + lightId;
                            else if (OneAttenuation && linear == 1)
                                return "more than one attenuation is define on the light block for ID = " + lightId;
                            else if (linear == 1)
                                OneAttenuation = true;
                        }
                        else
                            return "unable to parse attenuation linear of the light position for ID = " + lightId;

                        var quadratic = this.reader.getFloat(grandChildren[attributeIndex], 'quadratic');
                        if (quadratic != null) {
                            if (isNaN(quadratic))
                                return "quadratic in attenuation is a non numeric value on the light block for ID = " + lightId;
                            else if (!(quadratic == 0 || quadratic == 1))
                                return "quadratic attenuation is a negative numeric value on the light block for ID = " + lightId;
                            else if (OneAttenuation && quadratic == 1)
                                return "more than one attenuation is define on the light block for ID = " + lightId;
                            else if (quadratic == 1)
                                OneAttenuation = true;
                        }
                        else
                            return "unable to parse attenuation quadratic of the light position for ID = " + lightId;

                        if (!OneAttenuation)
                            return "no attenuation is define on the light block for ID = " + lightId;

                        global.push(...[constant, linear, quadratic]);
                    }
                    else {
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);
                    }

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }


            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        var numTextures = 0;

        this.textures = [];

        // Check if there are any views
        if (children.length == 0)
            return "<textures> - you must define at least one texture";

        //For each texture in textures block, check ID and file URL
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            // Get texture file path
            var textureFileString = this.reader.getString(children[i], 'file');
            var textureFile = new File([""], textureFileString);

            if (textureFile.fileSize == undefined && textureFile.size == undefined)
                return "no file defined for texture ID" + textureID + " - " + textureFileString + " does not exist";            

            this.textures[textureID] = new CGFtexture(this.scene, textureFileString);                     
            numTextures++;
        }

        if (numTextures == 0)
            return "At least one texture must be defined"

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (!(shininess != null && !isNaN(shininess)))
                return "unable to parse 'shininess' of the material for ID = " + materialID;

            grandChildren = children[i].children;

            var parsedMaterial = new CGFappearance(this.scene);

            for (var j = 0; j < grandChildren.length; j++) {
                //emission
                if (grandChildren[j].nodeName == "emission") {
                    var color = this.parseColor(grandChildren[j], "'emission' of material for ID = " + materialID);
                    if (!Array.isArray(color))
                        return color;
                    parsedMaterial.setEmission(color[0], color[1], color[2], color[3]);
                }
                //ambient
                if (grandChildren[j].nodeName == "ambient") {
                    var color = this.parseColor(grandChildren[j], "'ambient' of material for ID = " + materialID);
                    if (!Array.isArray(color))
                        return color;

                    parsedMaterial.setAmbient(color[0], color[1], color[2], color[3]);
                }
                //diffuse
                if (grandChildren[j].nodeName == "diffuse") {
                    var color = this.parseColor(grandChildren[j], "'diffuse' of material for ID = " + materialID);
                    if (!Array.isArray(color))
                        return color;

                    parsedMaterial.setDiffuse(color[0], color[1], color[2], color[3]);
                }
                //specular
                if (grandChildren[j].nodeName == "specular") {
                    var color = this.parseColor(grandChildren[j], "'specular' of material for ID = " + materialID);
                    if (!Array.isArray(color))
                        return color;

                    parsedMaterial.setSpecular(color[0], color[1], color[2], color[3]);
                }
            }
            
            this.materials[materialID] = parsedMaterial;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create(); // creates identity matrix

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'rotate':
                        var axisVector = this.parseRotation(grandChildren[j], "rotate transformation for ID = " + transformationID);
                        if(!Array.isArray(axisVector)){
                            this.onXMLMinorError(axisVector);
                            continue; //ignore that wrong transformation
                        }                      
                        if (axisVector[0] == "x")
                            transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, DEGREE_TO_RAD * axisVector[1]);
                        else if (axisVector[0] == "y")
                            transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, DEGREE_TO_RAD * axisVector[1]);
                        else if (axisVector[0] == "z")
                            transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, DEGREE_TO_RAD * axisVector[1]);

                        break;
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates)){
                            this.onXMLMinorError(coordinates);
                            continue; //ignore that wrong transformation
                        }                            
                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates)){
                            this.onXMLMinorError(coordinates);
                            continue; //ignore that wrong transformation
                        }                            
                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    default:
                        break;

                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null){
                this.onXMLError("no ID defined for texture" + children[i]);
                continue; //object with no id is ignore
            }

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null){
                this.onXMLMinorError("ID must be unique for each primitive (conflict: ID = " + primitiveId + ")");
                continue; //ignore the repeated primitive
            }

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                var triangle = new MyTriangle(this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);

                this.primitives[primitiveId] = triangle;
            }
            else if (primitiveType == 'cylinder') {
                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base) && base >= 0))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top) && top >= 0))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height) && height > 0))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                //stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;


                var cylind = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

                this.primitives[primitiveId] = cylind;
            }
            else if (primitiveType == 'sphere') {
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)) && (radius > 0))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)) && (slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)) && (stacks > 0))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            }
            else if (primitiveType == 'torus') {
                // innerRadius
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)) && (inner > 0))
                    return "unable to parse innerRadius of the primitive coordinates for ID = " + primitiveId;

                // outerRadius
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)) && (outer > 0) && !(inner > outer))
                    return "unable to parse outerRadius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)) && (slices > 1))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)) && (loops > 1))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

                this.primitives[primitiveId] = torus;
            }
            else {
                console.warn("To do: Parse other primitives.");
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;
        var error;
        this.components = [];        

        var grandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null){
                this.onXMLMinorError("ID must be unique for each component (conflict: ID = " + componentID + ")");
                continue;
            }

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");

            if (transformationIndex == null)
                return "no transformation index defined for transformation";
            else if (transformationIndex < 0)
                return "negative transformation index defined for transformation";

            var materialsIndex = nodeNames.indexOf("materials");
            if (materialsIndex == null)
                return "no materials index defined for materials";
            else if (materialsIndex < 0)
                return "negative materials index defined for materials";

            var textureIndex = nodeNames.indexOf("texture");
            if (textureIndex == null)
                return "no texture index defined for texture";
            else if (textureIndex < 0)
                return "negative texture index defined for texture";

            var childrenIndex = nodeNames.indexOf("children");
            if (childrenIndex == null)
                return "no children index defined for children";
            else if (childrenIndex < 0)
                return "negative children index defined for children";

            // Create component
            var component = new MyComponent(componentID);

            // Transformations
            var transformationsNode = grandChildren[transformationIndex];
            error = this.parseComponentTransformation(component, transformationsNode);
            if (error != null)
                return error;

            // Materials
            var materialsNode = grandChildren[materialsIndex];
            error = this.parseComponentMaterials(component, materialsNode);
            if (error != null)
                return error;

            // Texture
            var textureNode = grandChildren[textureIndex];
            error = this.parseComponentTextures(component, textureNode);
            if (error != null)
                return error;

            // Children
            var childrenNode = grandChildren[childrenIndex];
            error = this.parseComponentChildren(component, childrenNode);
            if (error != null)
                return error;

            // Set component
            this.components[componentID] = component;
        }
    }

    /**
     * Parse the transformation of component with ID = componentID
     * @param {block element} component
     * @param {block element} transformationsNode
     */
    parseComponentTransformation(component, transformationsNode) {
        var children = transformationsNode.children;
        var transformationMatrix = mat4.create(); // creates identity matrix

        // Any number of transformations
        //debugger;
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformationref" && children[i].nodeName != "translate" &&
                children[i].nodeName != "rotate" && children[i].nodeName != "scale") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // tranformationref
            if (children[i].nodeName == "transformationref") {
                var transformationID = this.reader.getString(children[i], "id");
                transformationMatrix = mat4.multiply(transformationMatrix, this.transformations[transformationID], transformationMatrix);
                //debugger;
                if (transformationMatrix == null)
                    return "No tranformation set with id " + transformationID;
            }
            else {
                switch (children[i].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(children[i], "translate transformation for Component with ID = " + component.componentID);
                        if (!Array.isArray(coordinates)){
                            this.onXMLMinorError(coordinates);
                            continue; //ignore that wrong transformation
                        }
                        transformationMatrix = mat4.translate(transformationMatrix, transformationMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(children[i], "scale transformation for Component with ID = " + component.componentID);
                        if (!Array.isArray(coordinates)){
                            this.onXMLMinorError(coordinates);
                            continue; //ignore that wrong transformation
                        }
                        transformationMatrix = mat4.scale(transformationMatrix, transformationMatrix, coordinates);
                        break;
                    case 'rotate':
                        var axisVector = this.parseRotation(children[i], "rotate transformation for Component with ID = " + component.componentID);
                        if(!Array.isArray(axisVector)){
                            this.onXMLMinorError(axisVector);
                            continue; //ignore that wrong transformation
                        }                        
                        if (axisVector[0] == "x")
                            transformationMatrix = mat4.rotateX(transformationMatrix, transformationMatrix, DEGREE_TO_RAD * axisVector[1]);
                        else if (axisVector[0] == "y")
                            transformationMatrix = mat4.rotateY(transformationMatrix, transformationMatrix, DEGREE_TO_RAD * axisVector[1]);
                        else if (axisVector[0] == "z")
                            transformationMatrix = mat4.rotateZ(transformationMatrix, transformationMatrix, DEGREE_TO_RAD * axisVector[1]);
                        break;
                    default:
                        break;
                }
            }
        }
        // Set transformation matrix
        component.transformationMatrix = transformationMatrix;
    }

    /**
     * Parse the transformation of component with ID = componentID
     * @param {block element} component
     * @param {block element} transformationsNode
     */
    parseComponentMaterials(component, materialsNode) {
        var children = materialsNode.children;

        var materials = [];

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            materials.push(...[materialID]);
        }
        component.materialIDs = materials;
    }

    /**
     * Parse the transformation of component with ID = componentID
     * @param {block element} component
     * @param {block element} transformationsNode
     */
    parseComponentTextures(component, textureNode) {

        if (textureNode.nodeName != "texture") {
            this.onXMLMinorError("unknown tag <" + textureNode.nodeName + ">");
            return;
        }

        // Get id of the current texture.
        var textureID = this.reader.getString(textureNode, 'id');
        if (textureID == null)
            return "no ID defined for texture";

        // SEE IF TEXTURE EXISTS
        if( textureID != "none" && textureID != "inherit" ){
            // Get s of the current texture.
            var length_s = this.reader.getFloat(textureNode, 'length_s');
            if (length_s == null) {
                return "no length_s defined for texture " + textureID;
            }
            else if (isNaN(length_s)) {
                return "length_s is not a number " + textureID;
            }

            // Get t of the current texture.
            var length_t = this.reader.getFloat(textureNode, 'length_t');
            if (length_t == null)
                return "no length_t defined for texture" + textureID;
            else if (isNaN(length_t)) {
                return "length_s is not a number " + textureID;
            }

            component.textureID = textureID;
            component.length_s = length_s;
            component.length_t = length_t;
        } else {
            component.textureID = textureID;
        }
        /*  if a length_s ou length_t is apply to a inherit ou none, it's ignore */
       
    }

    /**
     * Parse the transformation of component with ID = componentID
     * @param {block element} component
     * @param {block element} transformationsNode
     */
    parseComponentChildren(component, childrenNode) {
        var grandChildren = childrenNode.children;

        var componentChildren = [];

        for (var i = 0; i < grandChildren.length; i++) {

            if (grandChildren[i].nodeName != "primitiveref" && grandChildren[i].nodeName != "componentref") {
                this.onXMLMinorError("unknown tag <" + grandChildren[i].nodeName + ">");
                continue;
            }

            // NOT NECESSARY TO DO IF (DELET THIS LATER)

            // primitiveref
            if (grandChildren[i].nodeName == "primitiveref") {
                var primitiveID = this.reader.getString(grandChildren[i], "id");
                // TEST IF ID EXISTS
                componentChildren.push(...[primitiveID]);
            }
            // componentref
            else if (grandChildren[i].nodeName == "componentref") {
                var componentID = this.reader.getString(grandChildren[i], "id");
                // TEST IF ID EXISTS
                componentChildren.push(...[componentID]);
            }
        }
        component.childrenIDs = componentChildren;
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;
        
        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;       
        
        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;

        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Parse the rotation parameters from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseRotation(node, messageError) {
        var axisVector = [];
        var axis = this.reader.getString(node, 'axis');
        if (axis == null)
            return "unable to parse 'axis' component of the " + messageError;
        if(!(axis == "x" || axis == "y" ||axis == "z"))
            return "unable to parse invalid 'axis' component of the " + messageError;
        // angle
        var angle = this.reader.getFloat(node, 'angle');
        if (!(angle != null && !isNaN(angle)))
            return "unable to parse 'angle' component of the " + messageError;

        axisVector.push(...[axis,angle]);      

        return axisVector;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        var root = this.components[this.idRoot];
        this.processNode(root.componentID, root.materialIDs[0], root.textureID, root.length_s, root.length_t);

    }


    /**
     * 
     */
    processNode(id, parentMaterialID, parentTextureID, parentLength_s, parentLength_t) {
        console.log(id);
        // Check if id exists
        var component = this.components[id];
        if (component == null) {
            this.onXMLMinorError("element without id! ");
            return; //jumps that element
        }

       // get material
        var materials = component.materialIDs;
        var appliedMaterial;
        var childMaterialID;
      
        if (materials[this.scene.getM() % materials.length] == "inherit") {            
            childMaterialID = parentMaterialID;
            appliedMaterial = this.materials[parentMaterialID];            
            appliedMaterial.apply();
        }
        else {
            childMaterialID = materials[this.scene.getM() % materials.length];
            appliedMaterial = this.materials[materials[this.scene.getM() % materials.length]];
            appliedMaterial.apply();
        }

        // get texture
        var textureID = component.textureID;
        var length_s;
        var length_t;
      
       if (textureID == "inherit"){
           if(parentTextureID == "none"){ //only if root doesn't have texture
            appliedMaterial.setTexture(null);
           }
            length_s = parentLength_s;
            length_t = parentLength_t;
            textureID = parentTextureID;
            
            appliedMaterial.setTexture(this.textures[textureID]);
            appliedMaterial.apply();
       }            
        else if (textureID == "none"){
            //the texture apply is none but passes de ancestor texture to the son
            length_s = parentLength_s;
            length_t = parentLength_t;
            textureID = parentTextureID;
            appliedMaterial.setTexture(null);
            appliedMaterial.apply();
        }            
        else{
            appliedMaterial.setTexture(this.textures[textureID]);
            appliedMaterial.apply();
        }
            
        
        // get matrix
        var matrix = component.transformationMatrix;
        this.scene.pushMatrix();
        this.scene.multMatrix(matrix);
        // loop children
        for (var i = 0; i < component.childrenIDs.length; i++) {
            // if primitive
            if (this.primitives[component.childrenIDs[i]] != null) {
                var scaleFactor = [length_s, length_t ];
                this.primitives[component.childrenIDs[i]].display();
            }
            else{
                this.processNode(component.childrenIDs[i],
                    childMaterialID,
                    textureID,
                    component.length_s,
                    component.length_t);
            }               
        }
        
        this.scene.popMatrix();

    }

    incrementM(){
        clickM++;
    }
}