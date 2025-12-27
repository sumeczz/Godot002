import Enemy from '../entities/Enemy.js';
import Projectile from '../entities/Projectile.js';
import ExperienceOrb from '../entities/ExperienceOrb.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // --- 1. NASTAVENÍ HRY A STATISTIK ---
        this.isGameOver = false;
        
        // Stats Hráče
        this.playerMaxHealth = 100;
        this.playerHealth = 100;
        this.isInvulnerable = false;

        // Stats Střelby
        this.maxAmmo = 5;
        this.currentAmmo = 5;
        this.reloadTime = 2000;
        this.isReloading = false;

        // Stats Levelování (NOVÉ)
        this.level = 1;
        this.currentXp = 0;
        this.requiredXp = 100; // XP potřebné na první level

        // --- 2. FYZIKA A ENTITY ---
        this.player = this.add.rectangle(640, 360, 40, 40, 0x00ff00);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');

        // Skupiny (Pools)
        this.enemies = this.physics.add.group({ classType: Enemy, maxSize: 50 });
        this.projectiles = this.physics.add.group({ classType: Projectile, maxSize: 30 });
        this.expOrbs = this.physics.add.group({ classType: ExperienceOrb, maxSize: 100 }); // (NOVÉ)

        // --- 3. UI ---
        this.createUI();

        // --- 4. ČASOVAČE ---
        this.time.addEvent({ delay: 1000, callback: this.spawnEnemy, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 1000, callback: this.autoShoot, callbackScope: this, loop: true });

        // --- 5. KOLIZE ---
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHit, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
        // Kolize hráč sbírá XP (NOVÉ)
        this.physics.add.overlap(this.player, this.expOrbs, this.collectOrb, null, this);
    }

    createUI() {
        // Fixace UI (ScrollFactor 0)
        const uiConfig = { scrollFactor: 0 };

        // 1. Health Bar (Nahoře vlevo)
        this.healthBarBg = this.add.rectangle(20, 20, 200, 20, 0x000000).setOrigin(0, 0).setScrollFactor(0);
        this.healthBar = this.add.rectangle(20, 20, 200, 20, 0x00ff00).setOrigin(0, 0).setScrollFactor(0);
        
        // 2. Ammo (Pod HP)
        this.ammoText = this.add.text(20, 50, `AMMO: 5 / 5`, { fontSize: '18px', fill: '#fff' }).setScrollFactor(0);

        // 3. XP Bar (Dole přes celou obrazovku) - NOVÉ
        // Pozadí
        this.xpBarBg = this.add.rectangle(0, 700, 1280, 20, 0x000000).setOrigin(0, 0).setScrollFactor(0);
        // Samotný bar (Modrý)
        this.xpBar = this.add.rectangle(0, 700, 0, 20, 0x0088ff).setOrigin(0, 0).setScrollFactor(0);
        // Text Levelu
        this.levelText = this.add.text(640, 680, 'Level 1', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0);

        // 4. Game Over
        this.gameOverText = this.add.text(640, 300, 'GAME OVER', { fontSize: '64px', fill: '#f00' }).setOrigin(0.5).setScrollFactor(0).setVisible(false);
    }

    // --- XP SYSTÉM (NOVÉ) ---
    spawnExpOrb(x, y) {
        const orb = this.expOrbs.get(x, y);
        if (orb) {
            orb.spawn(x, y, 20); // 20 XP za orb
        }
    }

    collectOrb(player, orb) {
        if (!orb.active) return;
        
        orb.collect(); // Skryje orb
        this.currentXp += orb.value;
        
        // Kontrola Level Up
        if (this.currentXp >= this.requiredXp) {
            this.levelUp();
        }
        
        this.updateXpUi();
    }

    levelUp() {
        this.level++;
        this.currentXp -= this.requiredXp; // Převedení přebytku XP do dalšího levelu
        this.requiredXp = Math.floor(this.requiredXp * 1.5); // Další level je o 50% těžší
        
        // Efekt při level up (Text zazáří)
        this.levelText.setColor('#ffff00');
        this.time.delayedCall(500, () => this.levelText.setColor('#ffffff'));
        
        console.log("LEVEL UP! Nová úroveň:", this.level);
    }

    updateXpUi() {
        this.levelText.setText(`Level ${this.level}`);
        
        const percent = this.currentXp / this.requiredXp;
        // Ošetření přetečení (aby bar nebyl delší než obrazovka)
        const width = Phaser.Math.Clamp(1280 * percent, 0, 1280);
        this.xpBar.width = width;
    }

    // --- HERNÍ LOGIKA ---
    // (Zbytek zůstává stejný, jen přidáme spawn orbu při smrti nepřítele)

    spawnEnemy() {
        if (this.isGameOver) return;
        const x = Math.random() > 0.5 ? -50 : 1330;
        const y = Phaser.Math.Between(0, 720);
        const enemy = this.enemies.get(x, y);
        if (enemy) enemy.spawn(x, y);
    }

    autoShoot() {
        if (this.isGameOver || this.isReloading) return;
        if (this.currentAmmo <= 0) { this.startReload(); return; }

        const nearest = this.getNearestEnemy();
        if (nearest) {
            const b = this.projectiles.get(this.player.x, this.player.y);
            if (b) {
                b.fire(this.player.x, this.player.y, nearest);
                this.currentAmmo--;
                this.updateAmmoUi();
                if (this.currentAmmo <= 0) this.startReload();
            }
        }
    }

    startReload() {
        if (this.isReloading) return;
        this.isReloading = true;
        this.updateAmmoUi();
        this.time.delayedCall(this.reloadTime, () => {
            if (this.isGameOver) return;
            this.currentAmmo = this.maxAmmo;
            this.isReloading = false;
            this.updateAmmoUi();
        });
    }

    updateAmmoUi() {
        this.ammoText.setText(this.isReloading ? "RELOADING..." : `AMMO: ${this.currentAmmo} / ${this.maxAmmo}`);
        this.ammoText.setColor(this.isReloading ? '#f00' : '#fff');
    }

    getNearestEnemy() {
        let nearest = null;
        let dist = Infinity;
        this.enemies.children.iterate(e => {
            if (e.active) {
                const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
                if (d < dist) { dist = d; nearest = e; }
            }
        });
        return nearest;
    }

    handleProjectileHit(bullet, enemy) {
        if (bullet.active && enemy.active) {
            bullet.die();
            enemy.takeDamage(bullet.damage);
            
            // Pokud nepřítel zemřel po zásahu (hp <= 0 je řešeno v Enemy.js, ale musíme vědět, kdy dropnout)
            // Tady je malý trik: Enemy.js řeší smrt uvnitř takeDamage.
            // Abychom věděli, že PŘÁVĚ teď zemřel, musíme zkontrolovat jeho stav.
            if (!enemy.active) {
                this.spawnExpOrb(enemy.x, enemy.y);
            }
        }
    }

    handlePlayerHit(player, enemy) {
        if (this.isInvulnerable || this.isGameOver || !enemy.active) return;
        
        this.playerHealth -= 20;
        
        // Update Health Bar (inline pro úsporu místa v ukázce)
        const pct = this.playerHealth / this.playerMaxHealth;
        this.healthBar.width = 200 * pct;
        this.healthBar.setFillStyle(pct < 0.3 ? 0xff0000 : 0x00ff00);

        this.cameras.main.shake(100, 0.01);

        if (this.playerHealth <= 0) {
            this.isGameOver = true;
            this.physics.pause();
            this.player.setFillStyle(0x555555);
            this.gameOverText.setVisible(true);
            this.input.once('pointerdown', () => this.scene.restart());
        } else {
            this.isInvulnerable = true;
            this.player.alpha = 0.5;
            this.time.delayedCall(1000, () => {
                this.isInvulnerable = false;
                this.player.alpha = 1;
            });
        }
    }

update() {
        if (this.isGameOver) return;
        
        // --- POHYB HRÁČE (OPRAVENO) ---
        const speed = 250;
        let vX = 0;
        let vY = 0;

        // Zjištění směru (nastavujeme jen směr -1, 0, 1, ne rychlost)
        if (this.cursors.left.isDown || this.wasd.A.isDown) vX = -1;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) vX = 1;

        if (this.cursors.up.isDown || this.wasd.W.isDown) vY = -1;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) vY = 1;

        // Aplikace pohybu
        if (vX !== 0 || vY !== 0) {
            // Pokud se hýbeme, nastavíme rychlost
            // 1. Nastavíme vektor na směry (např. 1, 1 pro diagonálu)
            this.player.body.setVelocity(vX, vY);
            
            // 2. Normalizujeme (aby délka vektoru byla 1) a vynásobíme rychlostí
            // Tím se opraví zrychlení při diagonálním pohybu
            this.player.body.velocity.normalize().scale(speed);
        } else {
            // Pokud se nehýbeme, zastavíme hráče
            this.player.body.setVelocity(0, 0);
        }

        // --- UPDATE OSTATNÍCH ENTIT ---
        // Používáme otazník ?. (optional chaining) pro případ, že by objekt už neexistoval
        this.enemies.children.iterate(e => {
            if (e && e.active) e.update(this.player);
        });
        
        this.projectiles.children.iterate(p => {
            if (p && p.active) p.update();
        });
        
        // XP orby se hýbat nemusí, takže je v update nevoláme
    }
}