import Enemy from '../entities/Enemy.js';
import Projectile from '../entities/Projectile.js';
import ExperienceOrb from '../entities/ExperienceOrb.js';
import GoldCoin from '../entities/GoldCoin.js';
import BloodShard from '../entities/BloodShard.js'; // NOVÉ
import Courier from '../entities/Courier.js';       // NOVÉ
import Portal from '../entities/Portal.js';
import { PlayerData } from '../data/PlayerData.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // --- 1. CONFIG & LOADOUT ---
        const loadout = PlayerData.getLoadout();
        console.log("Startuji run s:", loadout);

        // Aplikace Loadoutu (Zjednodušená logika)
        let baseDmg = 10;
        let baseFireRate = 1000;
        let baseSpeed = 200;

        if (loadout.weapon === 'Lovecká Kuše') { baseDmg = 5; baseFireRate = 300; } // Rychlá, slabá
        if (loadout.ability === 'Sprint') { baseSpeed = 250; } // Rychlejší pohyb
        if (loadout.ability === 'Léčení') { this.hasHealPassive = true; }

        // --- 2. HERNÍ DATA (IN-RUN) ---
        this.isGameOver = false;
        this.isGamePaused = false;
        
        // Zdroje v Runu
        this.tempGold = 0;          // Zlato v kapse (ztratíš při smrti)
        this.collectedShards = 0;   // Shards (zůstanou ti)
        this.portalActive = false;

        // Stats Hráče
        this.playerMaxHealth = 100;
        this.playerHealth = 100;
        this.playerSpeed = baseSpeed;
        this.isInvulnerable = false;

        // Stats Střelby
        this.maxAmmo = 5;
        this.currentAmmo = 5;
        this.reloadTime = 2000;
        this.fireRate = baseFireRate;
        this.isReloading = false;
        this.damageMult = 1;
        this.baseDamage = baseDmg;

        // Leveling (Temp)
        this.level = 1;
        this.currentXp = 0;
        this.requiredXp = 50;

        // --- 3. ENTITY & FYZIKA ---
        this.player = this.add.rectangle(640, 360, 40, 40, 0x00ff00);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');

        // Pools
        this.enemies = this.physics.add.group({ classType: Enemy, maxSize: 50 });
        this.projectiles = this.physics.add.group({ classType: Projectile, maxSize: 30 });
        this.expOrbs = this.physics.add.group({ classType: ExperienceOrb, maxSize: 100 });
        this.goldCoins = this.physics.add.group({ classType: GoldCoin, maxSize: 50 });
        this.bloodShards = this.physics.add.group({ classType: BloodShard, maxSize: 10 });

        // Speciální objekty
        this.portal = new Portal(this, -100, -100); 
        this.portal.setVisible(false); this.portal.body.enable = false;

        this.courier = new Courier(this, -100, -100);
        this.courier.leave(); // Skrýt na začátku

        // --- 4. UI ---
        this.createUI();
        this.createUpgradeUI();

        // --- 5. TIMERS ---
        this.shootTimer = this.time.addEvent({ delay: this.fireRate, callback: this.autoShoot, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 1000, callback: this.spawnEnemy, callbackScope: this, loop: true });
        
        // Spawn Kurýra (Bankéře) - Každých 60 sekund 30% šance
        this.time.addEvent({ delay: 60000, callback: this.trySpawnCourier, callbackScope: this, loop: true });

        // Pasivní léčení (pokud je vybráno v loadoutu)
        if (this.hasHealPassive) {
            this.time.addEvent({ delay: 5000, callback: () => {
                if (this.playerHealth < this.playerMaxHealth && !this.isGameOver) {
                    this.playerHealth += 5;
                    this.updateHealthBar();
                }
            }, loop: true });
        }

        // --- 6. KOLIZE ---
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHit, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
        this.physics.add.overlap(this.player, this.expOrbs, this.collectOrb, null, this);
        this.physics.add.overlap(this.player, this.goldCoins, this.collectGold, null, this);
        this.physics.add.overlap(this.player, this.bloodShards, this.collectShard, null, this);
        this.physics.add.overlap(this.player, this.portal, this.extract, null, this);
        this.physics.add.overlap(this.player, this.courier, this.bankGold, null, this);
    }

    createUI() {
        this.healthBarBg = this.add.rectangle(20, 20, 200, 20, 0x000000).setOrigin(0).setScrollFactor(0);
        this.healthBar = this.add.rectangle(20, 20, 200, 20, 0x00ff00).setOrigin(0).setScrollFactor(0);
        this.ammoText = this.add.text(20, 50, `AMMO: 5/5`, { fontSize: '18px', fill: '#fff' }).setScrollFactor(0);

        // Rozšířené UI pro zdroje
        this.goldText = this.add.text(1260, 20, `0 G (Kapsa)`, { fontSize: '24px', fill: '#ffd700', align: 'right' }).setOrigin(1, 0).setScrollFactor(0);
        this.shardText = this.add.text(1260, 50, `0 Shards`, { fontSize: '24px', fill: '#ff0000', align: 'right' }).setOrigin(1, 0).setScrollFactor(0);

        this.xpBarBg = this.add.rectangle(0, 700, 1280, 20, 0x000000).setOrigin(0).setScrollFactor(0);
        this.xpBar = this.add.rectangle(0, 700, 0, 20, 0x0088ff).setOrigin(0).setScrollFactor(0);
        this.levelText = this.add.text(640, 680, 'Level 1', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0);
        
        this.gameOverText = this.add.text(640, 300, 'GAME OVER', { fontSize: '64px', fill: '#f00', align: 'center' }).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(100);
    }

    createUpgradeUI() {
        // Upgrade menu (Dočasný boost)
        this.upgradeContainer = this.add.container(0, 0).setScrollFactor(0).setVisible(false).setDepth(200);
        const bg = this.add.rectangle(640, 360, 800, 500, 0x000000, 0.9);
        const title = this.add.text(640, 150, 'ZVOL DOČASNÉ VYLEPŠENÍ', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
        this.upgradeContainer.add([bg, title]);
        this.upgradeButtons = []; 
    }

    // --- LOGIKA ZDROJŮ ---
    collectGold(player, coin) {
        if (!coin.active) return;
        coin.collect();
        this.tempGold += coin.value;
        this.goldText.setText(`${this.tempGold} G (Kapsa)`);
    }

    collectShard(player, shard) {
        if (!shard.active) return;
        shard.collect();
        this.collectedShards += shard.value;
        // Blood Shards se ukládají "do duše" okamžitě, ale pro efekt je ukážeme v UI
        this.shardText.setText(`${this.collectedShards} Shards`);
    }

    trySpawnCourier() {
        if (Math.random() < 0.4 && !this.courier.active) { // 40% šance
            // Spawn poblíž hráče
            const angle = Math.random() * Math.PI * 2;
            const x = this.player.x + Math.cos(angle) * 300;
            const y = this.player.y + Math.sin(angle) * 300;
            this.courier.spawn(x, y);
            console.log("Kurýr dorazil!");
        }
    }

    bankGold() {
        if (!this.courier.active || this.tempGold <= 0) return;
        
        // Uložení zlata do trvalého úložiště
        PlayerData.addGold(this.tempGold);
        
        // Efekt
        this.add.text(this.courier.x, this.courier.y - 60, `Odesláno: ${this.tempGold} G`, { fontSize: '20px', fill: '#00ff00' }).setOrigin(0.5);
        
        this.tempGold = 0;
        this.goldText.setText(`0 G (Kapsa)`);
        
        // Kurýr odchází
        this.courier.leave();
    }

    // --- LEVELING (TEMP BOOST) ---
    levelUp() {
        this.level++;
        this.currentXp -= this.requiredXp;
        this.requiredXp = Math.floor(this.requiredXp * 1.5);
        this.updateXpUi();
        
        if (this.level === 3 && !this.portalActive) this.openPortal();
        
        this.showUpgradeMenu();
    }

    showUpgradeMenu() {
        this.isGamePaused = true;
        this.physics.pause();
        this.upgradeContainer.setVisible(true);
        this.upgradeButtons.forEach(btn => btn.destroy());
        this.upgradeButtons = [];

        // Generování možností (zde by byly jen dočasné stat boosty)
        const stats = [
            { text: '+10% DMG', action: () => this.damageMult += 0.1 },
            { text: '+10% Speed', action: () => this.playerSpeed += 20 },
            { text: '+20 HP', action: () => { this.playerHealth = Math.min(this.playerHealth + 20, this.playerMaxHealth); this.updateHealthBar(); } },
            { text: '-10% Reload', action: () => this.reloadTime *= 0.9 }
        ];

        // Vybereme 3 náhodné
        const options = stats.sort(() => 0.5 - Math.random()).slice(0, 3);

        options.forEach((opt, index) => {
            const y = 250 + (index * 80);
            const btn = this.add.rectangle(640, y, 400, 60, 0x444444).setInteractive({ useHandCursor: true });
            const txt = this.add.text(640, y, opt.text, { fontSize: '24px' }).setOrigin(0.5);
            
            btn.on('pointerdown', () => {
                opt.action();
                this.closeUpgradeMenu();
            });
            
            this.upgradeContainer.add([btn, txt]);
            this.upgradeButtons.push(btn, txt);
        });
    }

    closeUpgradeMenu() {
        this.upgradeContainer.setVisible(false);
        this.isGamePaused = false;
        this.physics.resume();
    }

    // --- EXTRAKCE (ÚSPĚCH) ---
    openPortal() {
        this.portalActive = true;
        const px = Phaser.Math.Between(100, 1180);
        const py = Phaser.Math.Between(100, 620);
        this.portal.spawn(px, py);
        this.add.text(640, 150, "PORTÁL OTEVŘEN!", { fontSize: '32px', color: '#00ffff' }).setOrigin(0.5).setScrollFactor(0);
    }

    extract() {
        if (!this.portalActive) return;
        this.physics.pause(); this.isGamePaused = true;

        // 1. Uložit zlato z kapsy
        if (this.tempGold > 0) PlayerData.addGold(this.tempGold);
        
        // 2. Uložit Shards (pokud jsme je neukládali průběžně, tady je jistota)
        if (this.collectedShards > 0) PlayerData.addShards(this.collectedShards);

        // 3. Převést In-Run XP na Meta XP
        // Dejme tomu že 1 In-Run Level = 100 Meta XP
        const metaXpGain = this.level * 100;
        PlayerData.addMetaXp(metaXpGain);

        this.add.text(640, 360, `EXTRAKCE!\n+${this.tempGold} Gold\n+${this.collectedShards} Shards\n+${metaXpGain} XP Účtu`, { 
            fontSize: '40px', fill: '#00ff00', align: 'center', backgroundColor: '#000' 
        }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

        this.time.delayedCall(3000, () => this.scene.start('MenuScene'));
    }

    // --- SMRT (NEÚSPĚCH) ---
    gameOver() {
        this.isGameOver = true;
        this.physics.pause();
        this.player.setFillStyle(0x555555);
        this.upgradeContainer.setVisible(false);

        // Ztrácíme tempGold. Blood Shards zůstávají (už jsme je uložili nebo uložíme teď).
        if (this.collectedShards > 0) PlayerData.addShards(this.collectedShards);

        this.gameOverText.setVisible(true);
        this.gameOverText.setText(`ZEMŘEL JSI\nZtratil jsi ${this.tempGold} Zlata.\nZachránil jsi ${this.collectedShards} Shards.`);
        this.gameOverText.setFontSize('32px');

        this.input.once('pointerdown', () => this.scene.start('MenuScene'));
    }

    // --- STANDARD LOOP (Zbytek) ---
    spawnExpOrb(x, y) { const o = this.expOrbs.get(x, y); if(o) o.spawn(x, y, 20); }
    collectOrb(player, orb) { if(!orb.active)return; orb.collect(); this.currentXp+=orb.value; this.updateXpUi(); if(this.currentXp>=this.requiredXp)this.levelUp(); }
    updateXpUi() { this.levelText.setText(`Lvl ${this.level}`); this.xpBar.width = 1280 * Math.min(this.currentXp/this.requiredXp, 1); }
    updateHealthBar() { this.healthBar.width = 200 * Math.max(0, this.playerHealth/this.playerMaxHealth); }
    updateAmmoUi() { this.ammoText.setText(this.isReloading?"RELOADING...":`AMMO: ${this.currentAmmo}/${this.maxAmmo}`); this.ammoText.setColor(this.isReloading?'#f00':'#fff'); }
    spawnEnemy() { if(this.isGameOver||this.isGamePaused)return; const x=Math.random()>.5?-50:1330; const y=Phaser.Math.Between(0,720); const e=this.enemies.get(x,y); if(e)e.spawn(x,y); }
    
    autoShoot() {
        if(this.isGameOver||this.isReloading||this.isGamePaused)return;
        if(this.currentAmmo<=0){this.startReload();return;}
        const nearest=this.getNearestEnemy();
        if(nearest){
            const b=this.projectiles.get(this.player.x,this.player.y);
            if(b){
                b.damage = this.baseDamage * this.damageMult;
                b.fire(this.player.x,this.player.y,nearest);
                this.currentAmmo--; this.updateAmmoUi();
                if(this.currentAmmo<=0)this.startReload();
            }
        }
    }
    startReload(){if(this.isReloading)return;this.isReloading=true;this.updateAmmoUi();this.time.delayedCall(this.reloadTime,()=>{if(this.isGameOver)return;this.currentAmmo=this.maxAmmo;this.isReloading=false;this.updateAmmoUi();});}
    getNearestEnemy(){let n=null;let d=Infinity;this.enemies.getChildren().forEach(e=>{if(e.active){const dist=Phaser.Math.Distance.Between(this.player.x,this.player.y,e.x,e.y);if(dist<d){d=dist;n=e;}}});return n;}
    
    handleProjectileHit(bullet, enemy) {
        if (bullet.active && enemy.active) {
            bullet.die();
            enemy.takeDamage(bullet.damage);
            if (!enemy.active) {
                this.spawnExpOrb(enemy.x, enemy.y);
                // Drop Zlata (30%)
                if (Math.random() < 0.3) { 
                    const c = this.goldCoins.get(enemy.x, enemy.y); 
                    if(c) c.spawn(enemy.x, enemy.y, Phaser.Math.Between(5,15)); 
                }
                // Drop Blood Shards (Vzácné - 5% šance)
                if (Math.random() < 0.05) {
                    const s = this.bloodShards.get(enemy.x, enemy.y);
                    if(s) s.spawn(enemy.x, enemy.y);
                }
            }
        }
    }
    
    handlePlayerHit(player, enemy) {
        if(this.isInvulnerable||this.isGameOver||this.isGamePaused||!enemy.active)return;
        this.playerHealth-=10; this.updateHealthBar(); this.cameras.main.shake(100,0.01);
        if(this.playerHealth<=0)this.gameOver();
        else{this.isInvulnerable=true;this.player.alpha=0.5;this.time.delayedCall(1000,()=>{this.isInvulnerable=false;this.player.alpha=1;});}
    }

    update() {
        if(this.isGameOver||this.isGamePaused)return;
        let vX=0,vY=0;
        if(this.cursors.left.isDown||this.wasd.A.isDown)vX=-1; else if(this.cursors.right.isDown||this.wasd.D.isDown)vX=1;
        if(this.cursors.up.isDown||this.wasd.W.isDown)vY=-1; else if(this.cursors.down.isDown||this.wasd.S.isDown)vY=1;
        if(vX!==0||vY!==0){this.player.body.setVelocity(vX,vY);this.player.body.velocity.normalize().scale(this.playerSpeed);}else{this.player.body.setVelocity(0,0);}
        this.enemies.children.iterate(e=>e?.active&&e.update(this.player));
        this.projectiles.children.iterate(p=>p?.active&&p.update());
    }
}