class PieceAnimation {
    constructor(scene) {
        super(scene);
        this.animation = new KeyframeAnimation(scene);

    }

    calculateFrames(initialPosition, finalPosition){
        this.animation.restart();
        let x_diff = abs(finalPosition[0] - initialPosition[0]) / 10;
        let z_diff = abs(finalPosition[2] - initialPosition[2]) / 10;
        for(let i=0; i < 10; i++) {
            let translate = [i * x_diff, 0, i * z_diff];
            // save matrix and instance
            this.animation.instances.push(i);
            // saving transformation on map
            animation.animations.set(i, [translate, [0, 0, 0], 0]);
        }
    }

    update(time){
        this.animation.update();
    }



}