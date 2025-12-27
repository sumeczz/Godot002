export default class BloodShard extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Červený kosočtverec (reprezentován čtvercem otočeným o 45 stupňů)
        super(scene, x, y, 16, 16, 0xff0000);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setAngle(45); // Otočení
        this.value = 1;
        
        // Pulzující animace
        scene.tweens.add({
            targets: this,
            scale: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    spawn(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.body.enable = true;
    }

    collect() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }
}