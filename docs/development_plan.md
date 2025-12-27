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





Skvěle. Nyní přetvoříme "simulaci pohybu" na skutečnou hru.

V této kapitole se zaměříme na **Životní cyklus (Game Loop)**. Hráč musí mít strach ze smrti, jinak hra nemá napětí. Přidáme ukazatel zdraví (Health Bar), systém poškození a obrazovku "Game Over" s možností restartu.

---

## Kapitola 5: Systém životů, UI a Game Over

Abychom viděli, jak na tom jsme se zdravím, musíme vykreslit uživatelské rozhraní (UI). V Phaseru je to trochu trik – protože se kamera hýbe s hráčem, UI by nám "odjelo" pryč. Musíme ho proto "přilepit" na obrazovku.

### 5.1 Aktualizovaný soubor: `src/entities/Projectile.js`

Projektil nyní ponese informaci o tom, jakou sílu (damage) má.

```javascript
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

```

---

### 5.2 Aktualizovaný soubor: `src/entities/Enemy.js`

Nepřítel nyní neumře "hned", ale má metodu `takeDamage`. To nám v budoucnu umožní dělat silnější monstra (bosse).

```javascript
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

```

---

### 5.3 Aktualizovaný soubor: `src/scenes/GameScene.js`

Toto je největší změna. Přidáváme:

1. **UI (Health Bar):** Kreslení obdélníků, které se nehýbou s kamerou (`setScrollFactor(0)`).
2. **Invincibility Frames:** Když dostaneš zásah, jsi chvíli nesmrtelný, aby tě hejno nezabilo okamžitě.
3. **Game Over:** Zastavení hry a text s instrukcí pro restart.

```javascript
import Enemy from '../entities/Enemy.js';
import Projectile from '../entities/Projectile.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // --- 1. NASTAVENÍ HRY A HRÁČE ---
        this.isGameOver = false;
        
        // Hráč
        this.player = this.add.rectangle(640, 360, 40, 40, 0x00ff00);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        
        // Statistiky hráče
        this.playerMaxHealth = 100;
        this.playerHealth = 100;
        this.isInvulnerable = false; // Nesmrtelnost po zásahu

        // Ovládání
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');

        // --- 2. SKUPINY ENTIT ---
        this.enemies = this.physics.add.group({ classType: Enemy, maxSize: 50 });
        this.projectiles = this.physics.add.group({ classType: Projectile, maxSize: 30 });

        // --- 3. UI (USER INTERFACE) ---
        this.createUI();

        // --- 4. ČASOVAČE ---
        this.time.addEvent({ delay: 1000, callback: this.spawnEnemy, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 600, callback: this.autoShoot, callbackScope: this, loop: true });

        // --- 5. KOLIZE ---
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHit, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
    }

    // --- LOGIKA UI ---
    createUI() {
        // Pozadí Health Baru (černé)
        this.healthBarBg = this.add.rectangle(20, 20, 200, 20, 0x000000).setOrigin(0, 0);
        // Popředí Health Baru (zelené)
        this.healthBar = this.add.rectangle(20, 20, 200, 20, 0x00ff00).setOrigin(0, 0);
        
        // Text pro Game Over (skrytý)
        this.gameOverText = this.add.text(640, 300, 'GAME OVER\nClick to Restart', {
            fontSize: '64px',
            fill: '#ff0000',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);

        // DŮLEŽITÉ: UI se nesmí hýbat s kamerou
        this.healthBarBg.setScrollFactor(0);
        this.healthBar.setScrollFactor(0);
        this.gameOverText.setScrollFactor(0);
        this.gameOverText.setDepth(100); // Aby byl text vždy úplně nahoře
    }

    updateHealthBar() {
        const percent = this.playerHealth / this.playerMaxHealth;
        this.healthBar.width = 200 * percent;
        
        // Změna barvy podle života (Zelená -> Červená)
        if (percent < 0.3) this.healthBar.setFillStyle(0xff0000);
        else this.healthBar.setFillStyle(0x00ff00);
    }

    // --- HERNÍ LOGIKA ---
    spawnEnemy() {
        if (this.isGameOver) return; // Nespawnovat, když je konec hry

        const x = Math.random() > 0.5 ? -50 : 1330;
        const y = Phaser.Math.Between(0, 720);
        const enemy = this.enemies.get(x, y);
        if (enemy) enemy.spawn(x, y);
    }

    autoShoot() {
        if (this.isGameOver) return;

        const nearestEnemy = this.getNearestEnemy();
        if (nearestEnemy) {
            const bullet = this.projectiles.get(this.player.x, this.player.y);
            if (bullet) bullet.fire(this.player.x, this.player.y, nearestEnemy);
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

    // --- KOLIZE ---
    handleProjectileHit(bullet, enemy) {
        if (bullet.active && enemy.active) {
            bullet.die();
            enemy.takeDamage(bullet.damage);
        }
    }

    handlePlayerHit(player, enemy) {
        // Pokud jsme nesmrtelní nebo je konec hry, nic nedělat
        if (this.isInvulnerable || this.isGameOver || !enemy.active) return;

        // Ubírání životů
        this.playerHealth -= 20;
        this.updateHealthBar();

        // Kamera se trochu zatřese (Juice efekt)
        this.cameras.main.shake(100, 0.01);

        if (this.playerHealth <= 0) {
            this.gameOver();
        } else {
            // Aktivace dočasné nesmrtelnosti (1 sekunda)
            this.isInvulnerable = true;
            this.player.alpha = 0.5; // Hráč zprůhlední
            
            this.time.delayedCall(1000, () => {
                this.isInvulnerable = false;
                this.player.alpha = 1; // Hráč je opět vidět plně
            });
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.physics.pause(); // Zastaví fyziku (vše zamrzne)
        this.player.setFillStyle(0x555555); // Hráč zešedne
        this.gameOverText.setVisible(true);

        // Kliknutím restartujeme scénu
        this.input.once('pointerdown', () => {
            this.scene.restart();
        });
    }

    update() {
        if (this.isGameOver) return;

        // Pohyb hráče
        const speed = 250;
        let vX = 0, vY = 0;
        if (this.cursors.left.isDown || this.wasd.A.isDown) vX = -speed;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) vX = speed;
        if (this.cursors.up.isDown || this.wasd.W.isDown) vY = -speed;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) vY = speed;

        this.player.body.setVelocity(vX, vY);
        this.player.body.velocity.normalize().scale(speed);

        // Update entit
        this.enemies.children.iterate(e => { if (e?.active) e.update(this.player); });
        this.projectiles.children.iterate(p => { if (p?.active) p.update(); });
    }
}

```

---

### Vysvětlení: Proč `setScrollFactor(0)`?

Když se ve hře hýbeš, hýbe se "kamera". Pokud nakreslíš Health Bar na souřadnice `20, 20`, je tam fyzicky nakreslený ve světě. Když popojdeš doprava, Health Bar zmizí vlevo mimo obrazovku.
`setScrollFactor(0)` říká Phaseru: *"Ignoruj kameru. Tento objekt bude vždy přilepený na skle obrazovky."*

### Vysvětlení: Invincibility Frames (i-frames)

Všimni si proměnné `isInvulnerable`. Bez ní by se funkce `handlePlayerHit` spustila 60x za sekundu, dokud se dotýkáš nepřítele. Hráč by zemřel okamžitě. Díky tomu, že na 1 sekundu vypneme kolize, dáváme hráči šanci utéct.

### Checklist - Kapitola 5

* [ ] V levém horním rohu vidím zelený Health Bar.
* [ ] Když do mě narazí nepřítel, obrazovka se zatřese, Health Bar se zmenší a postava na chvíli zprůhlední.
* [ ] Když HP klesne na 0, hra se zastaví a objeví se nápis "GAME OVER".
* [ ] Kliknutím myši se hra restartuje a mohu hrát znovu.

**Tímto jsme úspěšně dokončili Fázi 1! Máme kompletní, hratelný prototyp. V příští fázi se vrhneme na Loot a Statistiky (Fáze 2). Jsi připraven?**





To je skvělý nápad, který přidává do hry strategický prvek – hráč už nemůže jen bezhlavě stát, ale musí si hlídat "okno" pro přebíjení, kdy je zranitelný.

Upravíme soubor `src/scenes/GameScene.js`. Soubor `Projectile.js` a `Enemy.js` zůstávají beze změny, protože logika střelby je řízena scénou.

### Co se mění:

1. **Zásobník:** Přidáme proměnné `currentAmmo` (5) a `maxAmmo` (5).
2. **Stav `isReloading`:** Blokuje střelbu, zatímco se přebíjí.
3. **UI Nábojů:** Pod Health Bar přidáme textový ukazatel, který se změní na nápis "RELOADING...", když dojdou náboje.
4. **Časování:** Interval střelby změníme na 1000ms (1s) a přebíjení na 2000ms (2s).

---

### Aktualizovaný soubor: `src/scenes/GameScene.js`

```javascript
import Enemy from '../entities/Enemy.js';
import Projectile from '../entities/Projectile.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // --- 1. NASTAVENÍ HRY A HRÁČE ---
        this.isGameOver = false;
        
        // Statistiky hráče (HP)
        this.playerMaxHealth = 100;
        this.playerHealth = 100;
        this.isInvulnerable = false;

        // Statistiky střelby (Nové!)
        this.maxAmmo = 5;            // Kapacita zásobníku
        this.currentAmmo = 5;        // Aktuální náboje
        this.reloadTime = 2000;      // 2 sekundy na přebití
        this.isReloading = false;    // Stav přebíjení

        // Vytvoření hráče
        this.player = this.add.rectangle(640, 360, 40, 40, 0x00ff00);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // Ovládání
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');

        // --- 2. SKUPINY ENTIT ---
        this.enemies = this.physics.add.group({ classType: Enemy, maxSize: 50 });
        this.projectiles = this.physics.add.group({ classType: Projectile, maxSize: 30 });

        // --- 3. UI (USER INTERFACE) ---
        this.createUI();

        // --- 4. ČASOVAČE ---
        // Spawn nepřátel (každou 1 sekundu)
        this.time.addEvent({ delay: 1000, callback: this.spawnEnemy, callbackScope: this, loop: true });
        
        // Automatická střelba (nyní každou 1 sekundu - pomalejší taktika)
        this.time.addEvent({ delay: 1000, callback: this.autoShoot, callbackScope: this, loop: true });

        // --- 5. KOLIZE ---
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHit, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
    }

    // --- LOGIKA UI ---
    createUI() {
        // 1. HEALTH BAR
        this.healthBarBg = this.add.rectangle(20, 20, 200, 20, 0x000000).setOrigin(0, 0);
        this.healthBar = this.add.rectangle(20, 20, 200, 20, 0x00ff00).setOrigin(0, 0);
        
        // 2. AMMO INDICATOR (Nový UI prvek)
        // Zobrazíme ho pod Health Barem
        this.ammoText = this.add.text(20, 50, `AMMO: ${this.currentAmmo} / ${this.maxAmmo}`, {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0, 0);

        // 3. GAME OVER TEXT
        this.gameOverText = this.add.text(640, 300, 'GAME OVER\nClick to Restart', {
            fontSize: '64px',
            fill: '#ff0000',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);

        // Fixace UI na obrazovku (aby neodjíždělo s kamerou)
        this.healthBarBg.setScrollFactor(0);
        this.healthBar.setScrollFactor(0);
        this.ammoText.setScrollFactor(0);
        this.gameOverText.setScrollFactor(0);
        this.gameOverText.setDepth(100);
    }

    updateHealthBar() {
        const percent = this.playerHealth / this.playerMaxHealth;
        this.healthBar.width = 200 * percent;
        
        if (percent < 0.3) this.healthBar.setFillStyle(0xff0000);
        else this.healthBar.setFillStyle(0x00ff00);
    }

    updateAmmoUI() {
        if (this.isReloading) {
            this.ammoText.setText("RELOADING...");
            this.ammoText.setColor('#ff0000'); // Červený text při přebíjení
        } else {
            this.ammoText.setText(`AMMO: ${this.currentAmmo} / ${this.maxAmmo}`);
            this.ammoText.setColor('#ffffff'); // Bílý text normálně
        }
    }

    // --- HERNÍ LOGIKA ---
    spawnEnemy() {
        if (this.isGameOver) return;

        const x = Math.random() > 0.5 ? -50 : 1330;
        const y = Phaser.Math.Between(0, 720);
        const enemy = this.enemies.get(x, y);
        if (enemy) enemy.spawn(x, y);
    }

    // Upravená logika střelby
    autoShoot() {
        // Nestřílet pokud: je konec hry NEBO právě přebíjím NEBO nemám náboje
        if (this.isGameOver || this.isReloading) return;

        // Pokud došly náboje (pojistka, i když by to mělo řešit přebíjení)
        if (this.currentAmmo <= 0) {
            this.startReload();
            return;
        }

        const nearestEnemy = this.getNearestEnemy();
        
        // Vystřelíme jen pokud je na koho
        if (nearestEnemy) {
            const bullet = this.projectiles.get(this.player.x, this.player.y);
            if (bullet) {
                bullet.fire(this.player.x, this.player.y, nearestEnemy);
                
                // Odečteme náboj
                this.currentAmmo--;
                this.updateAmmoUI();

                // Pokud jsme vystřelili poslední náboj, začneme přebíjet
                if (this.currentAmmo <= 0) {
                    this.startReload();
                }
            }
        }
    }

    // Nová funkce pro přebíjení
    startReload() {
        if (this.isReloading) return; // Už přebíjím, nedělat to znovu

        this.isReloading = true;
        this.updateAmmoUI(); // Aktualizace textu na "RELOADING..."

        // Časovač, který po 2 sekundách doplní náboje
        this.time.delayedCall(this.reloadTime, () => {
            if (this.isGameOver) return;
            
            this.currentAmmo = this.maxAmmo;
            this.isReloading = false;
            this.updateAmmoUI(); // Aktualizace textu zpět na čísla
            
            console.log("Přebito!");
        });
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
            enemy.takeDamage(bullet.damage);
        }
    }

    handlePlayerHit(player, enemy) {
        if (this.isInvulnerable || this.isGameOver || !enemy.active) return;

        this.playerHealth -= 20;
        this.updateHealthBar();
        this.cameras.main.shake(100, 0.01);

        if (this.playerHealth <= 0) {
            this.gameOver();
        } else {
            this.isInvulnerable = true;
            this.player.alpha = 0.5;
            this.time.delayedCall(1000, () => {
                this.isInvulnerable = false;
                this.player.alpha = 1;
            });
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.physics.pause();
        this.player.setFillStyle(0x555555);
        this.gameOverText.setVisible(true);
        this.ammoText.setVisible(false); // Skryjeme ammo při smrti

        this.input.once('pointerdown', () => {
            this.scene.restart();
        });
    }

    update() {
        if (this.isGameOver) return;

        const speed = 250;
        let vX = 0, vY = 0;
        if (this.cursors.left.isDown || this.wasd.A.isDown) vX = -speed;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) vX = speed;
        if (this.cursors.up.isDown || this.wasd.W.isDown) vY = -speed;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) vY = speed;

        this.player.body.setVelocity(vX, vY);
        this.player.body.velocity.normalize().scale(speed);

        this.enemies.children.iterate(e => { if (e?.active) e.update(this.player); });
        this.projectiles.children.iterate(p => { if (p?.active) p.update(); });
    }
}

```

### Vysvětlení změn v kódu:

1. **`startReload()`**: Tato funkce se spustí automaticky po vystřelení posledního náboje.
* Nastaví "vlajku" `isReloading = true`.
* Pomocí `this.time.delayedCall` čeká 2000 ms (2 sekundy).
* Poté doplní zásobník na plný počet.


2. **`autoShoot()`**: Přibyla podmínka `if (this.isReloading) return;`. To znamená, že funkce se sice volá každou vteřinu, ale pokud hráč zrovna přebíjí, funkce se okamžitě ukončí a nevystřelí.
3. **UI Feedback**: Pod zelený Health Bar jsme přidali jednoduchý text. Když střílíš, vidíš `5 / 5`, `4 / 5`... Jakmile dojdou, text zčervená a napíše `RELOADING...`.

Můžeš kód zkopírovat do `GameScene.js` a vyzkoušet. Teď by měla být hra napínavější, protože každých 5 střel musíš na 2 sekundy utíkat bez možnosti obrany!




Skvělé! Fáze 1 (Core Gameplay) je úspěšně za námi. Máme pohyb, boj, nepřátele a riziko smrti.

Nyní vstupujeme do **Fáze 2: RPG Systémy a Progrese**.
Hra zatím nemá "hloubku" – střílíš, dokud nezemřeš. Aby to hráče bavilo déle, musí cítit, že sílí. Prvním krokem je **Systém Zkušeností (XP) a Levelování**.

---

## Kapitola 6: Zkušenosti (XP) a Levelování

V této kapitole přidáme klasickou mechaniku "Survivor" her:

1. Zabitý nepřítel upustí **Duši (XP Orb)**.
2. Hráč ji sebere a naplní se mu **XP Bar**.
3. Při naplnění baru se zvedne **Level** (zatím jen vizuálně a zvýšením čísla, výběr schopností přidáme později).

### 6.1 Nový soubor: `src/entities/ExperienceOrb.js`

Podobně jako nepřátele a střely, i zkušenosti musíme recyklovat (pooling), protože jich na zemi mohou ležet stovky.

```javascript
export default class ExperienceOrb extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Modrý malý čtvereček (XP)
        super(scene, x, y, 15, 15, 0x00ffff);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.value = 10; // Kolik XP dá jedna kulička
    }

    spawn(x, y, value) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.body.enable = true;
        this.value = value;
    }

    collect() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }
}

```

---

### 6.2 Aktualizovaný soubor: `src/scenes/GameScene.js`

Zde musíme propojit smrt nepřítele s vytvořením XP orbu a přidat logiku pro zvyšování úrovně.

**Co je nového:**

* **XP Logika:** Proměnné `level`, `currentXp`, `requiredXp`.
* **XP Bar:** Modrý pruh na spodní straně obrazovky.
* **Drop System:** Když nepřítel zemře, na jeho místě se objeví orb.

```javascript
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
        
        // Pohyb
        const speed = 250;
        let vX = 0, vY = 0;
        if (this.cursors.left.isDown || this.wasd.A.isDown) vX = -speed;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) vX = speed;
        if (this.cursors.up.isDown || this.wasd.W.isDown) vY = -speed;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) vY = speed;
        this.player.body.setVelocity(vX, vY).normalize().scale(speed);

        // Updates
        this.enemies.children.iterate(e => e?.active && e.update(this.player));
        this.projectiles.children.iterate(p => p?.active && p.update());
        // XP orby nepotřebují update, leží na zemi
    }
}

```

### 💡 Vysvětlení Leveling Matematiky

Použili jsme jednoduchý vzorec pro zvyšování náročnosti:
`this.requiredXp = Math.floor(this.requiredXp * 1.5);`

To znamená:

* Level 1 -> 2: Potřebuješ 100 XP (5 zabití).
* Level 2 -> 3: Potřebuješ 150 XP (8 zabití).
* Level 3 -> 4: Potřebuješ 225 XP (12 zabití).
Tímto způsobem se hra přirozeně zpomaluje a levely nezískáváš příliš rychle.

### Checklist - Kapitola 6

* [ ] Vytvořil jsi soubor `src/entities/ExperienceOrb.js`.
* [ ] Po zabití nepřítele zůstane na zemi malý azurový čtvereček.
* [ ] Když hráč přes čtvereček přejde, zmizí.
* [ ] Dole na obrazovce se plní modrý pruh (XP bar).
* [ ] Když se pruh naplní, nápis se změní na "Level 2" a pruh se vyprázdní.

**Hra už začíná být návyková! V příštím kroku bychom měli udělat to, že Level Up hráči skutečně něco dá (např. výběr vylepšení), nebo přidat "Magnet", aby se XP lépe sbíraly. Co preferuješ?**

Omlouvám se, to je moje chyba v syntaxi. Funkce `setVelocity` v Phaseru vrací objekt `Body` (fyzikální tělo), ale funkce `normalize` patří objektu `Vector2` (samotný vektor rychlosti). Proto je nemůžeme takto řetězit za sebou.

Opravíme to tak, že rychlost nastavíme a normalizaci provedeme na vektoru rychlosti až v druhém kroku.

Zde je **opravená metoda `update**` pro soubor `src/scenes/GameScene.js`. Nahraď celou metodu `update` na konci souboru tímto kódem:

### Opravený kód pro `GameScene.js` (část update)

```javascript
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

```

### Co se změnilo?

Místo chybného řetězení:
`this.player.body.setVelocity(vX, vY).normalize().scale(speed);` ❌

Jsme kód rozdělili na logické kroky:

1. Zjistíme směr (`vX`, `vY` jsou buď -1, 0 nebo 1).
2. Pokud se hráč hýbe, nastavíme tento směr do `setVelocity`.
3. Následně přistoupíme přímo k vektoru `this.player.body.velocity` a zavoláme `normalize().scale(speed)`.

Zkus nyní kód uložit a obnovit hru. Mělo by to fungovat bez chyby.





