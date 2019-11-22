/**
 * Animation
 * Abstract class that represents an Animation
 */
class Animation {
    constructor() {
        if (this.constructor === Animation) {
            throw new TypeError("Abstract class 'Animation' cannot be instantiated directly."); 
        }
    }

    update() {
        throw new TypeError("Abstract method 'update' not defined."); 
    }

    apply() {
        throw new TypeError("Abstract method 'apply' not defined."); 
    }

}


