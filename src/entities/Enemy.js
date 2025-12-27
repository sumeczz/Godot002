export default class Enemy extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Vytvoříme červený čtverec 30x30
        super(scene, x, y, 30, 30, 0xff0000);
        
        // Přidáme objekt do scény
        scene.add.existing(this);
        
        // Přidáme fyzikální tělo
        scene.physics.add.existing(this);
        
        this.speed = 80; // Trochu jsme zpomalili, aby tě hned nezabili
    }

    // Volá se při každém spawnu z poolu
    spawn(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        
        // Důležité: Znovu zapnout fyziku, pokud byla vypnutá
        if (this.body) {
            this.body.enable = true;
        }
    }

    // Logika pohybu k hráči
    update(player) {
        if (!this.active || !player) return;

        // Nastaví pohyb směrem k hráči
        this.scene.physics.moveToObject(this, player, this.speed);
    }

    // "Deaktivace" místo smazání
    die() {
        this.setActive(false);
        this.setVisible(false);
        if (this.body) {
            this.body.enable = false;
            this.body.setVelocity(0, 0); // Zastavit pohyb
        }
    }
}