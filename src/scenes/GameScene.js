import Enemy from '../entities/Enemy.js';
import Projectile from '../entities/Projectile.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // 1. HRÁČ
        this.player = this.add.rectangle(640, 360, 40, 40, 0x00ff00);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // 2. OVLÁDÁNÍ
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');

        // 3. SKUPINA NEPŘÁTEL
        this.enemies = this.physics.add.group({ classType: Enemy, maxSize: 50 });

        // 4. SKUPINA PROJEKTILŮ
        this.projectiles = this.physics.add.group({ classType: Projectile, maxSize: 30 });

        // 5. ČASOVAČE
        // Spawn nepřátel
        this.time.addEvent({ delay: 1000, callback: this.spawnEnemy, callbackScope: this, loop: true });
        
        // Automatická střelba (každých 800ms)
        this.time.addEvent({ delay: 800, callback: this.autoShoot, callbackScope: this, loop: true });

        // 6. KOLIZE A PŘEKRYVY
        // Střela zasáhne nepřítele
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHit, null, this);
        // Nepřítel zasáhne hráče
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
    }

    spawnEnemy() {
        const x = Math.random() > 0.5 ? -50 : 1330;
        const y = Phaser.Math.Between(0, 720);
        const enemy = this.enemies.get(x, y);
        if (enemy) enemy.spawn(x, y);
    }

    autoShoot() {
        const nearestEnemy = this.getNearestEnemy();
        if (nearestEnemy) {
            const bullet = this.projectiles.get(this.player.x, this.player.y);
            if (bullet) {
                bullet.fire(this.player.x, this.player.y, nearestEnemy);
            }
        }
    }

    getNearestEnemy() {
        let nearest = null;
        let minDistance = Infinity;

        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
                if (dist < minDistance) {
                    minDistance = dist;
                    nearest = enemy;
                }
            }
        });
        return nearest;
    }

    handleProjectileHit(bullet, enemy) {
        if (bullet.active && enemy.active) {
            bullet.die();
            enemy.die();
            console.log("Nepřítel zničen!");
        }
    }

    handlePlayerHit(player, enemy) {
        if (enemy.active) {
            enemy.die();
            console.log("Hráč dostal zásah!");
        }
    }

    update() {
        // POHYB HRÁČE
        const speed = 250;
        let vX = 0, vY = 0;
        if (this.cursors.left.isDown || this.wasd.A.isDown) vX = -speed;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) vX = speed;
        if (this.cursors.up.isDown || this.wasd.W.isDown) vY = -speed;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) vY = speed;

        this.player.body.setVelocity(vX, vY);
        this.player.body.velocity.normalize().scale(speed);

        // AKTUALIZACE ENTIT
        this.enemies.children.iterate(enemy => { if (enemy?.active) enemy.update(this.player); });
        this.projectiles.children.iterate(bullet => { if (bullet?.active) bullet.update(); });
    }
}