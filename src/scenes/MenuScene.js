import { PlayerData } from '../data/PlayerData.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a0505'); // Temně rudé pozadí

        // --- HORNÍ LIŠTA ---
        const level = PlayerData.data.accountLevel;
        const metaXp = PlayerData.data.metaXp;
        const gold = PlayerData.data.totalGold;
        const shards = PlayerData.data.bloodShards;

        this.add.text(20, 20, `Účet Lvl: ${level} (XP: ${metaXp})`, { fontSize: '20px', fill: '#aaa' });
        this.add.text(1260, 20, `${gold} G | ${shards} Shards`, { fontSize: '20px', fill: '#ffd700', align: 'right' }).setOrigin(1, 0);

        // --- NÁZEV ---
        this.add.text(640, 100, 'SOUL HARVEST', { fontSize: '80px', fill: '#880000', fontFamily: 'Impact' }).setOrigin(0.5);

        // --- LOADOUT SELECTION ---
        this.createLoadoutUI();

        // --- START ---
        const startBtn = this.add.rectangle(640, 600, 300, 80, 0x333333).setInteractive({ useHandCursor: true });
        const startText = this.add.text(640, 600, 'ZAČÍT RUN', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        startBtn.on('pointerdown', () => this.scene.start('GameScene'));
        startBtn.on('pointerover', () => startBtn.setFillStyle(0x555555));
        startBtn.on('pointerout', () => startBtn.setFillStyle(0x333333));
    }

    createLoadoutUI() {
        // Načteme odemčené věci
        const weapons = PlayerData.data.unlockedWeapons;
        const abilities = PlayerData.data.unlockedAbilities;
        let currentWepIdx = weapons.indexOf(PlayerData.data.currentLoadout.weapon);
        let currentAbiIdx = abilities.indexOf(PlayerData.data.currentLoadout.ability);

        if (currentWepIdx === -1) currentWepIdx = 0;
        if (currentAbiIdx === -1) currentAbiIdx = 0;

        // UI pro Zbraň
        this.add.text(440, 300, "ZBRAŇ:", { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.wepText = this.add.text(440, 350, weapons[currentWepIdx], { fontSize: '28px', fill: '#00ff00' }).setOrigin(0.5);
        
        const wepNext = this.add.text(550, 350, ">", { fontSize: '40px', fill: '#fff' }).setInteractive();
        wepNext.on('pointerdown', () => {
            currentWepIdx = (currentWepIdx + 1) % weapons.length;
            this.updateSelection(weapons[currentWepIdx], abilities[currentAbiIdx]);
        });

        // UI pro Schopnost
        this.add.text(840, 300, "SCHOPNOST:", { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.abiText = this.add.text(840, 350, abilities[currentAbiIdx], { fontSize: '28px', fill: '#00ffff' }).setOrigin(0.5);

        const abiNext = this.add.text(950, 350, ">", { fontSize: '40px', fill: '#fff' }).setInteractive();
        abiNext.on('pointerdown', () => {
            currentAbiIdx = (currentAbiIdx + 1) % abilities.length;
            this.updateSelection(weapons[currentWepIdx], abilities[currentAbiIdx]);
        });
    }

    updateSelection(weapon, ability) {
        this.wepText.setText(weapon);
        this.abiText.setText(ability);
        PlayerData.setLoadout(weapon, ability);
    }
}