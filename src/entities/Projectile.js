export default class Projectile extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Vytvoříme malý žlutý čtvereček (střela)
        super(scene, x, y, 10, 10, 0xffff00);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.speed = 400;
    }

    fire(x, y, target) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.body.enable = true;

        // Výpočet směru k cíli
        this.scene.physics.moveToObject(this, target, this.speed);
    }

    die() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
        this.body.setVelocity(0, 0);
    }

    update() {
        // Pokud střela vyletí z hranic herního světa, "zabijeme" ji
        if (this.x < 0 || this.x > 1280 || this.y < 0 || this.y > 720) {
            this.die();
        }
    }
}
