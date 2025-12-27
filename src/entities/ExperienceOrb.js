export default class ExperienceOrb extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Modrý malý čtvereček (XP)
        super(scene, x, y, 15, 15, 0x00ffff);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.value = 10; // Kolik XP dá jedna kulička
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