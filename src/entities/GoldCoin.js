export default class GoldCoin extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Žluté kolečko (reprezentované čtvercem pro zjednodušení, později sprite)
        super(scene, x, y, 12, 12, 0xffd700);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.value = 1; // Hodnota mince
    }

    spawn(x, y, value) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.body.enable = true;
        this.value = value;
    }

    collect() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }
}