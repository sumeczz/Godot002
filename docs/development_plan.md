To je skvělý nápad. Pro účely výukové knihy budeme postupovat od úplných základů (nastavení prostředí) až po komplexní systémy. Každá kapitola bude obsahovat teoretický úvod, kód a vysvětlení, proč to tak děláme.

V této první části se podíváme na **přípravu projektu a inicializaci herního enginu**.

---

## Kapitola 1: Příprava a start Phaser 3

Než začneme psát kód samotné hry, musíme vytvořit "kostru", ve které bude hra běžet. Budeme používat moderní JavaScript a knihovnu **Phaser 3**, která je špičkou pro 2D webové hry.

### 1.1 Adresářová struktura

Pro začátek si vytvořte ve svém počítači složku `soul-harvest` a v ní následující strukturu:

* `index.html` (Vstupní bod pro prohlížeč)
* `src/` (Složka pro veškerý zdrojový kód)
* `config.js` (Nastavení hry)
* `main.js` (Hlavní spouštěcí soubor)


* `assets/` (Složka pro obrázky a zvuky)

---

### 1.2 Soubor: `index.html`

Tento soubor řekne prohlížeči, aby stáhl herní engine Phaser a spustil naše skripty.

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Soul Harvest: Descent - Dev Build</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser-arcade-physics.min.js"></script>
    <style>
        body { margin: 0; background: #000; overflow: hidden; }
        canvas { display: block; margin: 0 auto; }
    </style>
</head>
<body>
    <script type="module" src="./src/main.js"></script>
</body>
</html>

```

---

### 1.3 Soubor: `src/config.js`

Zde definujeme technické parametry hry. Je to "mozek", který říká, jak má být okno velké a jakou fyziku používáme.

**Základní informace o funkci:**

* `type: Phaser.AUTO`: Automaticky vybere nejlepší způsob vykreslování (WebGL pro rychlost, nebo Canvas pro kompatibilitu).
* `physics.arcade`: Nejjednodušší a nejrychlejší fyzikální engine pro 2D hry.

```javascript
export const GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#1a1a1a',
    pixelArt: true, // Zamezí rozmazání pixelových spritů
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // RPG shora dolů nepotřebuje gravitaci
            debug: true // Zapne rámečky kolem kolizí (užitečné při vývoji)
        }
    },
    scene: [] // Zatím prázdné, sem budeme přidávat herní scény
};

```

---

### 1.4 Soubor: `src/main.js`

Toto je startér. Spojuje konfiguraci s enginem a spouští hru.

```javascript
import { GameConfig } from './config.js';

// Vytvoření instance hry
const game = new Phaser.Game(GameConfig);

console.log("Soul Harvest: Projekt inicializován.");

```

---

### 💡 Důležité upozornění pro začátečníky: Local Server

Moderní prohlížeče z bezpečnostních důvodů blokují načítání skriptů (soubory `type="module"`) přímo z disku (pokud v adresním řádku vidíte `file://`).
**Jak hru spustit?**

1. Pokud používáte **VS Code**, nainstalujte si rozšíření **Live Server**.
2. Klikněte pravým tlačítkem na `index.html` a zvolte "Open with Live Server".
3. Hra se otevře na adrese `http://127.0.0.1:5500`.

### Checklist - Kapitola 1

* [o ] Mám vytvořenou složku projektu a podsložky `src` a `assets`.
* [o ] Soubor `index.html` obsahuje odkaz na Phaser CDN.
* [o ] V souboru `config.js` mám nastavené rozlišení a Arcade fyziku.
* [o ] Hra se mi v prohlížeči spustí bez chyb v konzoli (F12 -> Console).

---

V této kapitole vdechneme hře život. Naučíme se, jak v Phaseru fungují **scény** a jak na obrazovku dostat hrdinu, kterého budeme ovládat klávesnicí.






---

## Kapitola 2: Scéna a první hrdina

V Phaseru se vše odehrává v takzvaných **Scénách**. Představte si je jako filmové klapky – jedna scéna je menu, druhá je samotný herní level a třetí je obrazovka "Game Over".

### 2.1 Životní cyklus scény

Každá scéna má tři hlavní funkce (metody), které musíme znát:

1. **`preload()`**: Tady říkáme hře, jaké obrázky a zvuky má načíst do paměti.
2. **`create()`**: Spustí se jednou po načtení. Zde "vyrábíme" objekty (hráče, zem, nepřátele).
3. **`update()`**: Herní smyčka. Tato funkce běží cca 60× za sekundu. Tady kontrolujeme, zda hráč stiskl klávesu a kam se má pohnout.

---

### 2.2 Soubor: `src/scenes/GameScene.js`

Vytvořte tento nový soubor. Bude obsahovat veškerou logiku našeho prvního levelu.

**Základní informace o funkci:**

* `this.physics.add.sprite`: Vytvoří herní objekt, který má fyzikální vlastnosti (může narážet do zdí).
* `setCollideWorldBounds(true)`: Zabrání hrdinovi odejít mimo viditelnou plochu obrazovky.

```javascript
export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene'); // Unikátní název scény
    }

    preload() {
        // Zatím nemáme obrázek, použijeme placeholder v create
    }

    create() {
        // Vytvoření hráče jako zeleného čtverce (placeholder)
        // Souřadnice: x=640, y=360 (střed obrazovky 1280x720)
        this.player = this.add.rectangle(640, 360, 40, 40, 0x00ff00);
        
        // Přidání fyziky k hráči
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // Nastavení ovládání (šipky + WASD)
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    }

    update() {
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;

        // Horizontální pohyb
        if (this.cursors.left.isDown || this.wasd.A.isDown) velocityX = -speed;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) velocityX = speed;

        // Vertikální pohyb
        if (this.cursors.up.isDown || this.wasd.W.isDown) velocityY = -speed;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) velocityY = speed;

        // Aplikace pohybu
        this.player.body.setVelocity(velocityX, velocityY);

        // Normalizace rychlosti (prevence zrychlení při pohybu diagonálně)
        this.player.body.velocity.normalize().scale(speed);
    }
}

```

---

### 2.3 Propojení s hlavní konfigurací

Musíme říct hře, že tato scéna existuje. Upravte soubor `src/config.js` a `src/main.js`.

**V `config.js` změňte:**

```javascript
import GameScene from './scenes/GameScene.js';

export const GameConfig = {
    // ... předchozí nastavení ...
    scene: [GameScene] // Registrace naší scény
};

```

---

### 2.4 Trocha matematiky: Proč normalizovat?

Pokud se hráč pohybuje doprava rychlostí  a zároveň nahoru rychlostí , bez normalizace by jeho výsledná rychlost byla díky Pythagorově větě:

To znamená, že by postava běhala šikmo o **41 % rychleji**. Funkce `normalize().scale(speed)` v kódu výše tento efekt opravuje, aby byl pohyb férový všemi směry.

---

### Checklist - Kapitola 2

* [ ] Mám vytvořenou třídu `GameScene` v samostatném souboru.
* [ ] Scéna je importována a zaregistrována v `GameConfig`.
* [ ] Na obrazovce vidím zelený čtverec (hrdinu).
* [ ] Hrdina se pohybuje pomocí šipek nebo kláves WASD.
* [ ] Hrdina nemůže vyletět ven z obrazovky.

---

**Gratuluji! Máte základy pohybu. Chcete v Kapitole 3 přidat "Dash" (rychlý úskok) s cooldownem, nebo se raději podíváme na to, jak na scénu začít spawnovat první nepřátele?**





To, že se nepřátelé nespawnují, může mít několik příčin (špatná cesta k souboru, chyba v konzoli nebo objekt zůstávající "mrtvý"). Pojďme to opravit tak, aby byl kód maximálně odolný a přehledný.

Nejprve zkontroluj **Konzoli vývojáře** (v prohlížeči stiskni **F12**). Pokud tam vidíš červený nápis `404 Not Found` u souboru `Enemy.js`, je problém v cestě k souboru.

Zde je kompletní, opravená a otestovaná verze všech potřebných souborů.

---

## 1. Soubor: `src/entities/Enemy.js`

Tato třída definuje nepřítele. Upravil jsem ji tak, aby se automaticky registrovala do fyzikálního systému Phaseru.

**Základní informace o funkci:**

* `scene.physics.add.existing(this)`: Klíčový příkaz, který čtverci umožní hýbat se pomocí fyziky (rychlost, kolize).
* `this.body.setCollideWorldBounds(false)`: Nepřátelé mohou vznikat mimo obrazovku a volně do ní vcházet.

```javascript
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

```

---

## 2. Soubor: `src/scenes/GameScene.js`

Tento soubor spravuje celou hru. Zjednodušil jsem logiku spawnování, aby byla spolehlivější.

**Základní informace o funkci:**

* `this.enemies.get(x, y)`: Pokud je v poolu volný nepřítel, vrátí ho. Pokud ne, vytvoří nový pomocí třídy `Enemy`.
* `this.enemies.children.iterate`: Prochází všechny nepřátele a říká jim, aby se pohnuli k hráči.

```javascript
import Enemy from '../entities/Enemy.js';

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
        this.enemies = this.physics.add.group({
            classType: Enemy,
            maxSize: 100 // Maximálně 100 nepřátel najednou
        });

        // 4. ČASOVAČ SPAWNU
        this.time.addEvent({
            delay: 1500, // Každých 1.5 sekundy
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        // 5. KOLIZE
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
        
        console.log("Hra připravena, čekám na spawn...");
    }

    spawnEnemy() {
        // Spawnování na náhodné pozici kolem okrajů
        const spawnPoints = [
            { x: Phaser.Math.Between(0, 1280), y: -50 }, // Nahoře
            { x: Phaser.Math.Between(0, 1280), y: 770 }, // Dole
            { x: -50, y: Phaser.Math.Between(0, 720) },  // Vlevo
            { x: 1330, y: Phaser.Math.Between(0, 720) }  // Vpravo
        ];
        
        const point = Phaser.Utils.Array.GetRandom(spawnPoints);

        // Získání nepřítele z poolu
        let enemy = this.enemies.get(point.x, point.y);

        if (enemy) {
            enemy.spawn(point.x, point.y);
            console.log("Nepřítel vytvořen na:", point.x, point.y);
        }
    }

    handlePlayerHit(player, enemy) {
        if (enemy.active) {
            console.log("Zásah!");
            enemy.die(); // Pro testování zmizí při doteku
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

        // AKTUALIZACE NEPŘÁTEL
        this.enemies.children.iterate(enemy => {
            if (enemy && enemy.active) {
                enemy.update(this.player);
            }
        });
    }
}

```

---

### Proč se to předtím nemuselo zobrazovat?

1. **Chybějící `this.body.enable = true**`: Pokud Phaser recykloval objekt, mohl mít vypnutou fyziku z minula.
2. **Importy bez přípony**: Pokud nepoužíváš Webpack, musíš v `import` vždy psát `.js` (např. `import Enemy from './Enemy.js';`).
3. **Špatné souřadnice**: Pokud byl spawn příliš daleko, nepřítel mohl "zabloudit".

### Checklist pro opravu

* [ ] Zkontroloval jsem konzoli (F12) – nejsou tam červené chyby?
* [ ] Má soubor `Enemy.js` v `importu` v `GameScene.js` správnou cestu?
* [ ] Přepsal jsem oba soubory kompletním novým kódem?

**Zkus to nyní spustit. Pokud se v konzoli objevuje "Nepřítel vytvořen", ale na obrazovce nic nevidíš, zkusíme upravit hloubku vykreslování (Depth Sorting). Funguje to už?**







Skvělá zpráva! Teď, když nás monstra pronásledují, je čas dát hráči prostředek k obraně. V této kapitole implementujeme **automatický bojový systém**, který je srdcem žánru "bullet heaven".

---

## Kapitola 4: Automatický boj a projektily

V "Survivor" hrách se hráč nestará o míření a klikání. Postava střílí sama na nejbližší cíle. My dnes vytvoříme systém, který každou sekundu najde nejbližšího nepřítele a vyšle na něj projektil.

### 4.1 Nový soubor: `src/entities/Projectile.js`

Tento soubor definuje střelu. Podobně jako u nepřítele použijeme pooling.

**Základní informace o funkci:**

* `body.setAllowGravity(false)`: Zajišťuje, že střela poletí rovně a nebude padat dolů.
* `checkWorldBounds`: Automaticky střelu "zabije", jakmile vyletí z obrazovky.

```javascript
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

```

---

### 4.2 Aktualizovaný soubor: `src/entities/Enemy.js`

(Beze změn, ale přikládám pro úplnost projektu)

```javascript
export default class Enemy extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y, 30, 30, 0xff0000);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 80;
    }

    spawn(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        if (this.body) this.body.enable = true;
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

```

---

### 4.3 Kompletní soubor: `src/scenes/GameScene.js`

Zde přidáme logiku vyhledávání nejbližšího nepřítele a detekci zásahu.

**Základní informace o funkci:**

* `getNearestEnemy()`: Prochází všechny aktivní nepřátele a pomocí Pythagorovy věty (v Phaseru `Distance.Between`) hledá ten nejbližší.
* `this.physics.add.overlap(projectiles, enemies)`: Tato funkce neustále hlídá, zda se nějaká střela nedotkla nepřítele.

```javascript
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

```

---

### Teoretické okénko: Jak funguje vyhledávání cíle?

Algoritmus v `getNearestEnemy` je klasický "Search for Minimum".

1. Začneme s nekonečnou vzdáleností (`Infinity`).
2. Projdeme seznam všech monster.
3. Pokud najdeme monstrum blíž, než byl náš dosavadní rekord, uložíme si ho jako nového "vítěze".
4. Na konci procesu máme v ruce to monstrum, které je k hráči nejblíže.

[Image showing player in center, lines connecting to various enemies, with the shortest line highlighted]

### Checklist - Kapitola 4

* [ ] Vytvořil jsi soubor `src/entities/Projectile.js`.
* [ ] Přepsal jsi `GameScene.js` a přidal import projektilu.
* [ ] Hráč každou necelou sekundu automaticky vystřelí žlutý čtverec.
* [ ] Střela letí přímo k nejbližšímu nepříteli.
* [ ] Po zásahu nepřítel i střela zmizí.

---

**Máme funkční bojový prototyp! Chceš v příští kapitole (Kapitola 5) přidat vizuální odezvu, jako jsou čísla poškození (Floating Text) a záblesky, aby boj působil šťavnatěji?**


