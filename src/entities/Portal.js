export default class Portal extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Modrý "mystický" obdélník
        super(scene, x, y, 50, 80, 0x0000ff);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true); // Hráč ho nemůže odtlačit
        
        // Jednoduchá animace "pulzování" (změna průhlednosti)
        scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 1000,
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
}