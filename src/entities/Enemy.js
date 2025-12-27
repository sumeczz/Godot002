export default class Enemy extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y, 30, 30, 0xff0000);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.speed = 80;
        this.health = 10; // Základní životy nepřítele
        this.maxHealth = 10;
    }

    spawn(x, y) {
        this.health = this.maxHealth; // Reset životů při respawnu
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        if (this.body) this.body.enable = true;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        } else {
            // Vizuální efekt zásahu (bliknutí bíle - jednoduchá verze přes tint)
            this.setFillStyle(0xffffff);
            this.scene.time.delayedCall(100, () => {
                if (this.active) this.setFillStyle(0xff0000);
            });
        }
    }

    update(player) {
        if (!this.active || !player) return;
        this.scene.physics.moveToObject(this, player, this.speed);
    }

    die() {
        this.setActive(false);
        this.setVisible(false);
        if (this.body) {
            this.body.enable = false;
            this.body.setVelocity(0, 0);
        }
    }
}