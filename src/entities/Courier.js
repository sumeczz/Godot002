export default class Courier extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Zelený NPC
        super(scene, x, y, 40, 60, 0x00ff88);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true);
        
        // Text nad hlavou
        this.label = scene.add.text(x, y - 40, "KURÝR", {
            fontSize: '16px', fill: '#00ff88', align: 'center'
        }).setOrigin(0.5);
    }

    spawn(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.label.setPosition(x, y - 40).setVisible(true);
        this.body.enable = true;

        // Kurýr zmizí po 30 sekundách, pokud ho nevyužiješ
        this.scene.time.delayedCall(30000, () => {
            if (this.active) this.leave();
        });
    }

    leave() {
        this.setActive(false);
        this.setVisible(false);
        this.label.setVisible(false);
        this.body.enable = false;
    }
}