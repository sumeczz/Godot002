export default class Projectile extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y, 10, 10, 0xffff00);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.speed = 400;
        this.damage = 10; // Síla střely (zatím zabije na jednu ránu, pokud má nepřítel 10 HP)
    }

    fire(x, y, target) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.body.enable = true;

        this.scene.physics.moveToObject(this, target, this.speed);
    }

    die() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
        this.body.setVelocity(0, 0);
    }

    update() {
        if (this.x < 0 || this.x > 1280 || this.y < 0 || this.y > 720) {
            this.die();
        }
    }
}