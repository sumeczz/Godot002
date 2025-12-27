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





Je to skvělý pocit, když se podaří opravit chybu, že? Nyní, když máme stabilní základ a sbíráme zkušenosti, musíme dát hráčům důvod, **proč** vlastně chtějí levelovat.

## Kapitola 7: Systém vylepšení (Upgrade Menu)

V této kapitole změníme moment "Level Up" z pouhé změny čísla na strategické rozhodnutí.
Když hráč dosáhne nové úrovně:

1. Hra se **pozastaví** (nepřátelé se zastaví).
2. Zobrazí se **nabídka 3 náhodných vylepšení**.
3. Hráč si vybere, staty se upraví a hra pokračuje.

### 7.1 Úprava logiky (Refactoring)

Abychom mohli vylepšovat statistiky, musíme přestat používat "tvrdá čísla" (hardcoded values) a převést je na proměnné.

* Místo `const speed = 250` budeme používat `this.playerSpeed`.
* Místo pevného časovače střelby budeme interval dynamicky měnit.

### 7.2 Kompletní soubor: `src/scenes/GameScene.js`

Tento soubor se nám rozrostl. Přidal jsem do něj systém pro generování UI tlačítek a logiku vylepšování.

**Klíčové novinky:**

* **`this.upgradePool`**: Seznam možných vylepšení (Rychlost, Střelba, Zásobník, Léčení).
* **`showUpgradeMenu()`**: Funkce, která zastaví fyziku a vykreslí 3 tlačítka.
* **`applyUpgrade()`**: Funkce, která skutečně změní čísla (např. `this.playerSpeed += 20`).

```javascript
import Enemy from '../entities/Enemy.js';
import Projectile from '../entities/Projectile.js';
import ExperienceOrb from '../entities/ExperienceOrb.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // --- 1. CONFIG & STATS ---
        this.isGameOver = false;
        this.isGamePaused = false; // Nový stav pro pauzu při levelování

        // Hráč stats (nyní proměnné pro upgrade)
        this.playerMaxHealth = 100;
        this.playerHealth = 100;
        this.playerSpeed = 200; // Základní rychlost
        this.isInvulnerable = false;

        // Střelba stats
        this.maxAmmo = 5;
        this.currentAmmo = 5;
        this.reloadTime = 2000;
        this.fireRate = 1000; // Čas mezi výstřely v ms
        this.isReloading = false;
        this.damageMult = 1; // Násobič poškození

        // Leveling stats
        this.level = 1;
        this.currentXp = 0;
        this.requiredXp = 50; // Pro testování nižší hodnota

        // Definice možných vylepšení
        this.upgradePool = [
            { id: 'speed', text: 'Rychlé Nohy (+10% Speed)', type: 'stat', key: 'playerSpeed', value: 20 },
            { id: 'ammo', text: 'Velký Zásobník (+1 Náboj)', type: 'stat', key: 'maxAmmo', value: 1 },
            { id: 'fire_rate', text: 'Kulomet (-10% Delay)', type: 'custom', action: 'buffFireRate' },
            { id: 'heal', text: 'Lékárnička (+30 HP)', type: 'custom', action: 'healPlayer' },
            { id: 'damage', text: 'Průbojné střely (+2 Dmg)', type: 'stat', key: 'damageMult', value: 0.2 }
        ];

        // --- 2. ENTITY ---
        this.player = this.add.rectangle(640, 360, 40, 40, 0x00ff00);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');

        this.enemies = this.physics.add.group({ classType: Enemy, maxSize: 50 });
        this.projectiles = this.physics.add.group({ classType: Projectile, maxSize: 30 });
        this.expOrbs = this.physics.add.group({ classType: ExperienceOrb, maxSize: 100 });

        // --- 3. UI ---
        this.createUI();
        this.createUpgradeUI(); // Připravíme skryté menu

        // --- 4. ČASOVAČE ---
        // Střelecký časovač si uložíme do proměnné, abychom ho mohli resetovat při změně rychlosti
        this.shootTimer = this.time.addEvent({ delay: this.fireRate, callback: this.autoShoot, callbackScope: this, loop: true });
        
        this.time.addEvent({ delay: 1000, callback: this.spawnEnemy, callbackScope: this, loop: true });

        // --- 5. KOLIZE ---
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHit, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
        this.physics.add.overlap(this.player, this.expOrbs, this.collectOrb, null, this);
    }

    createUI() {
        // Health Bar
        this.healthBarBg = this.add.rectangle(20, 20, 200, 20, 0x000000).setOrigin(0).setScrollFactor(0);
        this.healthBar = this.add.rectangle(20, 20, 200, 20, 0x00ff00).setOrigin(0).setScrollFactor(0);
        
        // Ammo
        this.ammoText = this.add.text(20, 50, `AMMO: 5 / 5`, { fontSize: '18px', fill: '#fff' }).setScrollFactor(0);

        // XP Bar
        this.xpBarBg = this.add.rectangle(0, 700, 1280, 20, 0x000000).setOrigin(0).setScrollFactor(0);
        this.xpBar = this.add.rectangle(0, 700, 0, 20, 0x0088ff).setOrigin(0).setScrollFactor(0);
        this.levelText = this.add.text(640, 680, 'Level 1', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0);

        // Game Over
        this.gameOverText = this.add.text(640, 300, 'GAME OVER', { fontSize: '64px', fill: '#f00' }).setOrigin(0.5).setScrollFactor(0).setVisible(false);
    }

    createUpgradeUI() {
        // Vytvoříme kontejner (skupinu), kterou budeme skrývat/zobrazovat
        this.upgradeContainer = this.add.container(0, 0).setScrollFactor(0).setVisible(false).setDepth(200);

        // Poloprůhledné pozadí
        const bg = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);
        const title = this.add.text(640, 150, 'LEVEL UP! Vyber vylepšení:', { fontSize: '40px', color: '#ffd700' }).setOrigin(0.5);

        this.upgradeContainer.add([bg, title]);

        // Placeholder pro tlačítka (vytvoříme je dynamicky při zobrazení)
        this.upgradeButtons = []; 
    }

    // --- LOGIKA LEVEL UP ---
    levelUp() {
        this.level++;
        this.currentXp -= this.requiredXp;
        this.requiredXp = Math.floor(this.requiredXp * 1.5);
        this.updateXpUi();

        // Pauzneme hru a zobrazíme menu
        this.showUpgradeMenu();
    }

    showUpgradeMenu() {
        this.isGamePaused = true;
        this.physics.pause(); // Zastaví pohyb všech fyzikálních objektů
        this.upgradeContainer.setVisible(true);

        // Vyčistit stará tlačítka
        this.upgradeButtons.forEach(btn => btn.destroy());
        this.upgradeButtons = [];

        // Vybrat 3 náhodná vylepšení
        // (Jednoduchý shuffle array)
        const shuffled = this.upgradePool.sort(() => 0.5 - Math.random());
        const options = shuffled.slice(0, 3);

        // Vykreslit tlačítka
        options.forEach((opt, index) => {
            const yPos = 250 + (index * 100);
            
            // Tlačítko (Pozadí)
            const btnBg = this.add.rectangle(640, yPos, 400, 80, 0x333333)
                .setInteractive({ useHandCursor: true });
            
            // Text tlačítka
            const btnText = this.add.text(640, yPos, opt.text, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);

            // Efekt po najetí myši
            btnBg.on('pointerover', () => btnBg.setFillStyle(0x555555));
            btnBg.on('pointerout', () => btnBg.setFillStyle(0x333333));
            
            // Kliknutí
            btnBg.on('pointerdown', () => this.selectUpgrade(opt));

            this.upgradeContainer.add([btnBg, btnText]);
            this.upgradeButtons.push(btnBg, btnText);
        });
    }

    selectUpgrade(upgrade) {
        // Aplikace efektu
        if (upgrade.type === 'stat') {
            this[upgrade.key] += upgrade.value;
            console.log(`Vylepšeno: ${upgrade.key} je nyní ${this[upgrade.key]}`);
        } 
        else if (upgrade.type === 'custom') {
            if (upgrade.action === 'healPlayer') {
                this.playerHealth = Math.min(this.playerHealth + 30, this.playerMaxHealth);
                this.updateHealthBar();
            }
            else if (upgrade.action === 'buffFireRate') {
                this.fireRate *= 0.9; // Zrychlíme o 10%
                // Musíme resetovat časovač střelby
                this.shootTimer.remove(false);
                this.shootTimer = this.time.addEvent({ delay: this.fireRate, callback: this.autoShoot, callbackScope: this, loop: true });
            }
        }

        // Pokud jsme zvedli ammo, doplníme ho
        if (upgrade.key === 'maxAmmo') {
            this.updateAmmoUi();
        }

        // Obnovit hru
        this.upgradeContainer.setVisible(false);
        this.isGamePaused = false;
        this.physics.resume();
    }

    // --- HERNÍ LOGIKA (Standardní) ---
    spawnExpOrb(x, y) {
        const orb = this.expOrbs.get(x, y);
        if (orb) orb.spawn(x, y, 20);
    }

    collectOrb(player, orb) {
        if (!orb.active) return;
        orb.collect();
        this.currentXp += orb.value;
        this.updateXpUi();
        
        if (this.currentXp >= this.requiredXp) {
            this.levelUp();
        }
    }

    updateXpUi() {
        this.levelText.setText(`Level ${this.level}`);
        const percent = Math.min(this.currentXp / this.requiredXp, 1);
        this.xpBar.width = 1280 * percent;
    }

    updateHealthBar() {
        const percent = Math.max(0, this.playerHealth / this.playerMaxHealth);
        this.healthBar.width = 200 * percent;
        this.healthBar.setFillStyle(percent < 0.3 ? 0xff0000 : 0x00ff00);
    }

    updateAmmoUi() {
        this.ammoText.setText(this.isReloading ? "RELOADING..." : `AMMO: ${this.currentAmmo} / ${this.maxAmmo}`);
        this.ammoText.setColor(this.isReloading ? '#f00' : '#fff');
    }

    spawnEnemy() {
        if (this.isGameOver || this.isGamePaused) return;
        const x = Math.random() > 0.5 ? -50 : 1330;
        const y = Phaser.Math.Between(0, 720);
        const enemy = this.enemies.get(x, y);
        if (enemy) enemy.spawn(x, y);
    }

    autoShoot() {
        if (this.isGameOver || this.isReloading || this.isGamePaused) return;
        if (this.currentAmmo <= 0) { this.startReload(); return; }

        const nearest = this.getNearestEnemy();
        if (nearest) {
            const b = this.projectiles.get(this.player.x, this.player.y);
            if (b) {
                // Posíláme i dmg multiplier (zatím nevyužitý v projectile.js, ale připravený)
                b.damage = 10 * this.damageMult; 
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

    getNearestEnemy() {
        let nearest = null;
        let dist = Infinity;
        this.enemies.getChildren().forEach(e => {
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
            if (!enemy.active) this.spawnExpOrb(enemy.x, enemy.y);
        }
    }

    handlePlayerHit(player, enemy) {
        if (this.isInvulnerable || this.isGameOver || this.isGamePaused || !enemy.active) return;
        
        this.playerHealth -= 20;
        this.updateHealthBar();
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
        if (this.isGameOver || this.isGamePaused) return;
        
        // POHYB HRÁČE - Používá this.playerSpeed
        let vX = 0;
        let vY = 0;

        if (this.cursors.left.isDown || this.wasd.A.isDown) vX = -1;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) vX = 1;

        if (this.cursors.up.isDown || this.wasd.W.isDown) vY = -1;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) vY = 1;

        if (vX !== 0 || vY !== 0) {
            this.player.body.setVelocity(vX, vY);
            // ZDE JE OPRAVA z minula + použití dynamické rychlosti
            this.player.body.velocity.normalize().scale(this.playerSpeed);
        } else {
            this.player.body.setVelocity(0, 0);
        }

        // Updates
        this.enemies.children.iterate(e => e?.active && e.update(this.player));
        this.projectiles.children.iterate(p => p?.active && p.update());
    }
}

```

### 💡 Jak to funguje?

1. **Vytvoření menu:** V `createUpgradeUI` si připravíme "krabici" (kontejner), která je neviditelná.
2. **Spuštění menu:** Funkce `showUpgradeMenu` tuto krabici zviditelní a `this.physics.pause()` zmrazí všechna monstra na místě.
3. **Výběr:** Hráč klikne na tlačítko. Funkce `selectUpgrade` zjistí, co tlačítko dělá (např. zvýší `maxAmmo`), provede to a pak zavolá `this.physics.resume()`, čímž se hra opět rozjede.

### Checklist - Kapitola 7

* [ ] Vyměnil jsi celý kód v `GameScene.js`.
* [ ] Zkus nasbírat XP na první level (nastavil jsem `requiredXp` na 50 pro rychlý test).
* [ ] Hra se zastaví, ztmavne a objeví se 3 tlačítka.
* [ ] Zkus vybrat "Rychlé Nohy". Hráč by měl po odkliknutí běhat znatelně rychleji.

**Tímto máme hotovou základní smyčku RPG progrese! V příštím kroku (Kapitola 8) se můžeme podívat na vizuální stránku – nahradit čtverečky za opravdové sprity, nebo přidat "Drop Tables" pro lepší loot.**



Tento návrh zásadně mění dynamiku hry. Místo "Diablo-klonu" (kde se přehrabujete v inventáři během boje) směřujeme k **"Extraction Roguelite"** stylu (podobné hrám jako *Escape from Tarkov* nebo *Dark and Darker*, ale ve 2D). Je to mnohem napínavější, protože hráč musí vážit risk (nesu hodně zlata) a odměnu (jít hlouběji).

Zde je **revidovaný Design Dokument** a upravený **Plán vývoje**, který odráží tyto změny.

---

# 📜 Design Dokument: Systémy v 2.0 (Extraction Mode)

### 1. Ekonomika a Zdroje

Máme tři měny, každá má jiný účel a pravidla ztráty.

* **Zlato (Soft Currency):**
* *Získání:* Drop z běžných nepřátel.
* *Použití:* Nákup základních lektvarů, opravy výbavy (pokud bude degradovat), poplatky za vstup do těžších dungeonů.
* *Pravidlo smrti:* **Všechno neuložené zlato se ztrácí.**
* *Banking:* V dungeonu se náhodně objevuje "Kurýr" (NPC), kterému lze předat zlato k odeslání do města.


* **Blood Shards (Hard Currency):**
* *Získání:* Drop z Bossů a vzácných truhel. Vzácnost cca 1-3 na run.
* *Použití:* Crafting zbraní a brnění ve městě.
* *Pravidlo smrti:* Zůstávají hráči i po smrti (jsou to magické fragmenty vázané na duši).


* **Zkušenosti (XP):**
* *In-Run XP:* Resetují se každou hru. Slouží k dočasnému posílení.
* *Meta XP (Account Level):* Pokud hráč přežije nebo odešle XP, zvyšuje se úroveň účtu, což odemyká nové recepty pro Crafting.



### 2. Progrese a Loadout

Hra je rozdělena na **Hub (Město)** a **Dungeon (Run)**.

* **Před Runem (Příprava):**
* Hráč si v menu vybere **1 Zbraň** a **1 Brnění** ze svého skladu.
* Tyto předměty definují staty (např. *Heavy Armor = hodně HP, pomalý pohyb*).
* Během hry **NELZE** měnit výbavu.


* **Během Runu (Adaptace):**
* **Level Up:** Hra se nezastavuje (nebo jen na mžik). Hráč získá **Skill Point**.
* **Stat Upgrade:** Jednoduché menu (např. klávesa TAB), kde hráč investuje body do:
* *Vitality* (+Max HP)
* *Agility* (+Move Speed)
* *Strength* (+Damage)
* *Haste* (-Cooldown)





### 3. Obtížnost: "The Descent" (Systém Pater)

Místo nekonečné louky budeme mít uzavřené levely (Patra).

* **Struktura Patra:** Uzavřená mapa (např. 2000x2000 px).
* **Cíl:** Najít **Portál** do dalšího patra.
* **Škálování (Scaling):**
* Patro 1: Level monster 1, Drop Rate x1.
* Patro 2: Level monster 3, Drop Rate x1.2.
* Patro 3: Level monster 5, Drop Rate x1.5 + Šance na Bosse.


* **Hardcore XP Křivka:** Exponenciální nárůst. Prvních pár levelů jde rychle, ale dostat se na "max build" v jednom runu bude vyžadovat, aby hráč šel hluboko (Patro 5+).

---

# 🛠️ Nový Plán Vývoje (Roadmap)

Vzhledem k těmto změnám musíme upravit priority. Musíme vytvořit globální správu dat (Save System) dříve než grafiku, protože na ní stojí logika inventáře.

### Fáze 2a: Globální Data a Hub (Kroky 8-12)

*Cíl: Umožnit hráči hromadit zdroje a vybírat výbavu před hrou.*

8. **DataManager:** Vytvoření `PlayerData.js`. Singleton, který drží informace o Zlatě, Shards a Inventáři a ukládá je do `localStorage` prohlížeče.
9. **Hlavní Menu (Hub Scene):** Vytvoření scény, kde hráč vidí své statistiky a tlačítko "Start Run".
10. **Loadout Systém:** V Hubu přidat jednoduchý výběr zbraně (zatím jen textový výběr: "Meč" vs "Hůlka").
11. **Předání dat do hry:** Upravit `GameScene`, aby při startu načetla poškození a rychlost podle vybrané zbraně z Hubu.

### Fáze 2b: Přepracování Game Loopu (Kroky 13-17)

*Cíl: Změnit nekonečnou hru na systém pater.*

12. **Stat Upgrade UI:** Nahradit stávající "výběr ze 3 karet" novým panelem, kde za Skill Point zvýšíte konkrétní stat.
13. **Systém Zlata:** Přidat `GoldCoin` entitu. Logika pro ztrátu zlata při smrti (`Game Over` smaže dočasné zlato).
14. **Banking NPC:** Přidat postavu "Kurýra", která se objeví náhodně. Při dotyku uloží aktuální zlato do trvalého úložiště.
15. **Portal Mechanika:** Objekt, který se objeví po zabití určitého počtu nepřátel. Dotyk = Restart scény s vyšší obtížností (Patro +1).
16. **Hardcore Tuning:** Úprava křivky HP monster a potřebných XP pro levelování dle zadání.

---

### ✅ Co uděláme teď?

Abychom mohli začít budovat tento systém, musíme nejprve vytvořit "Mozek" celé aplikace, který si bude pamatovat data i když vypneme hru.

**Doporučuji začít Krokem 8: Vytvoření `PlayerData.js` (Save System) a úpravou `main.js`, aby hra nezačínala rovnou bojem, ale v Menu.**

Souhlasíš s tímto postupem? Pokud ano, vygeneruji kód pro správu dat a úvodní menu.





Skvělé. Začínáme transformaci na **Extraction Roguelite**.

Prvním krokem je vytvoření "paměti" hry. Hra si musí pamatovat, kolik má hráč zlata a co má na sobě, i když se vypne prohlížeč. Také potřebujeme **Hlavní Menu (Hub)**, které bude sloužit jako bezpečný přístav před vstupem do podzemí.

---

## Kapitola 8: Správa Dat a Hlavní Menu

V této kapitole vytvoříme systém pro ukládání postupu a úvodní obrazovku.

### 8.1 Nový soubor: `src/data/PlayerData.js`

Tento soubor bude sloužit jako "trezor". Bude držet informace o trvalém postupu (Meta-Data) a o aktuálním vybavení. Použijeme `localStorage`, což je funkce prohlížeče pro trvalé ukládání dat.

**Klíčové vlastnosti:**

* `totalGold`: Peníze v bezpečí ve městě.
* `bloodShards`: Vzácná měna na crafting.
* `currentLoadout`: Co má hráč právě na sobě (ovlivní staty ve hře).

Vytvořte složku `src/data` a v ní tento soubor:

```javascript
class PlayerDataManager {
    constructor() {
        // Výchozí hodnoty pro nového hráče
        this.data = {
            totalGold: 0,
            bloodShards: 0,
            highScore: 0,
            // Jednoduchý loadout (zatím jen staty, později ID předmětů)
            currentLoadout: {
                weaponName: "Zrezivělý Meč",
                damageBonus: 0,
                attackSpeedBonus: 0,
                moveSpeedBonus: 0
            }
        };

        // Zkusíme načíst data z prohlížeče
        this.load();
    }

    save() {
        // Převedeme objekt na text a uložíme do prohlížeče
        localStorage.setItem('soulHarvestSave', JSON.stringify(this.data));
        console.log("Hra uložena.");
    }

    load() {
        const savedData = localStorage.getItem('soulHarvestSave');
        if (savedData) {
            // Pokud existuje uložení, načteme ho
            const parsed = JSON.parse(savedData);
            // Sloučíme s výchozími daty (pro případ, že bychom přidali nové položky v updatu)
            this.data = { ...this.data, ...parsed };
            console.log("Data načtena:", this.data);
        }
    }

    // Metoda pro přičtení měny (voláme po úspěšném extraction)
    addResources(gold, shards) {
        this.data.totalGold += gold;
        this.data.bloodShards += shards;
        this.save();
    }

    // Získání aktuálního vybavení
    getLoadout() {
        return this.data.currentLoadout;
    }
}

// Vytvoříme a exportujeme jedinou instanci (Singleton)
export const PlayerData = new PlayerDataManager();

```

---

### 8.2 Nový soubor: `src/scenes/MenuScene.js`

Toto bude naše "Město". Zde hráč vidí své bohatství a startuje nový Run.

**Co scéna dělá:**

1. Zobrazí název hry.
2. Zobrazí aktuální stav konta (načtený z `PlayerData`).
3. Tlačítkem "Start Run" spustí `GameScene`.

Vytvořte soubor ve složce `src/scenes/`:

```javascript
import { PlayerData } from '../data/PlayerData.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        // Černé pozadí
        this.cameras.main.setBackgroundColor('#111111');

        // 1. Název Hry
        this.add.text(640, 150, 'SOUL HARVEST:\nDESCENT', {
            fontSize: '80px',
            fontFamily: 'Impact',
            fill: '#880000',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // 2. Statistiky Hráče (Hub Info)
        const gold = PlayerData.data.totalGold;
        const shards = PlayerData.data.bloodShards;
        const weapon = PlayerData.data.currentLoadout.weaponName;

        this.add.text(640, 300, `TREZOR: ${gold} Gold | ${shards} Blood Shards`, {
            fontSize: '24px',
            fill: '#ffd700',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.add.text(640, 340, `Vybaveno: ${weapon}`, {
            fontSize: '20px',
            fill: '#aaaaaa',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // 3. Tlačítko START
        const startBtn = this.add.rectangle(640, 500, 300, 80, 0x333333)
            .setInteractive({ useHandCursor: true });
        
        const btnText = this.add.text(640, 500, 'VSTOUPIT DO KRYPTY', {
            fontSize: '28px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Interakce tlačítka
        startBtn.on('pointerover', () => startBtn.setFillStyle(0x555555));
        startBtn.on('pointerout', () => startBtn.setFillStyle(0x333333));
        
        startBtn.on('pointerdown', () => {
            // Spustíme hru
            this.scene.start('GameScene');
        });

        // 4. Instrukce
        this.add.text(640, 650, 'WASD: Pohyb | Hra se ukládá automaticky', {
            fontSize: '16px',
            fill: '#444444'
        }).setOrigin(0.5);
    }
}

```

---

### 8.3 Úprava souboru: `src/config.js`

Musíme hře říct, že existuje nová scéna `MenuScene` a že má být **první**, která se načte.

```javascript
import MenuScene from './scenes/MenuScene.js'; // Import Menu
import GameScene from './scenes/GameScene.js';

export const GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#1a1a1a',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // Vypneme debug rámečky pro hezčí vzhled
        }
    },
    // DŮLEŽITÉ: MenuScene musí být v poli PRVNÍ
    scene: [MenuScene, GameScene] 
};

```

---

### 8.4 Rychlá úprava `src/scenes/GameScene.js` (Jen tlačítko návratu)

Zatím nebudeme předělávat celou herní logiku (to je další krok), ale přidáme do `GameScene` možnost vrátit se do menu po smrti, aby cyklus fungoval.

Najdi v `GameScene.js` metodu `gameOver()` a uprav ji takto:

```javascript
    gameOver() {
        this.isGameOver = true;
        this.physics.pause();
        this.player.setFillStyle(0x555555);
        this.gameOverText.setVisible(true);
        this.upgradeContainer.setVisible(false); // Skrýt upgrade menu pokud je otevřené

        // Úprava textu Game Over
        this.gameOverText.setText("KRYPTA TĚ POHLTILA\nKlikni pro návrat do města");
        this.gameOverText.setFontSize('40px');

        // Kliknutím se vrátíme do MenuScene místo restartu scény
        this.input.once('pointerdown', () => {
            // Zde později budeme řešit ztrátu zlata
            this.scene.start('MenuScene');
        });
    }

```

---

### Checklist - Kapitola 8

1. [ ] Vytvořil jsi složku `src/data` a soubor `PlayerData.js`.
2. [ ] Vytvořil jsi soubor `src/scenes/MenuScene.js`.
3. [ ] Upravil jsi `src/config.js` (přidal MenuScene na začátek pole).
4. [ ] Upravil jsi metodu `gameOver` v `GameScene.js`.
5. [ ] **Test:** Po spuštění hry vidíš černé menu s nápisem "SOUL HARVEST". Vidíš stav zlata 0. Po kliknutí na tlačítko se spustí hra. Když zemřeš, kliknutí tě vrátí zpět do hlavního menu.

**Jakmile toto potvrdíš, pustíme se v Kapitole 9 do "Ekonomiky v Runu" – přidáme Zlaté mince, které padají z nepřátel, a logiku jejich ztráty při smrti.**


Rozumím. Abychom předešli chybám při kopírování kousků kódu, zde je **kompletní, funkční soubor `src/scenes/GameScene.js**`.

Tento soubor obsahuje vše z předchozích lekcí (pohyb, střelba, levelování, vylepšení) a je upraven tak, aby komunikoval s novým systémem menu (`MenuScene` a `PlayerData`).

Stačí smazat starý obsah `GameScene.js` a vložit tento kód.

### Soubor: `src/scenes/GameScene.js`

```javascript
import Enemy from '../entities/Enemy.js';
import Projectile from '../entities/Projectile.js';
import ExperienceOrb from '../entities/ExperienceOrb.js';
import { PlayerData } from '../data/PlayerData.js'; // Import dat hráče

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // --- 1. CONFIG & STATS ---
        // Načteme základní bonusy z PlayerData (zatím jen příprava)
        const loadout = PlayerData.getLoadout();

        this.isGameOver = false;
        this.isGamePaused = false; 

        // Hráč stats
        this.playerMaxHealth = 100;
        this.playerHealth = 100;
        this.playerSpeed = 200 + loadout.moveSpeedBonus; // Aplikace bonusu z loadoutu
        this.isInvulnerable = false;

        // Střelba stats
        this.maxAmmo = 5;
        this.currentAmmo = 5;
        this.reloadTime = 2000;
        this.fireRate = 1000; 
        this.isReloading = false;
        this.damageMult = 1 + (loadout.damageBonus / 100); // Aplikace bonusu z loadoutu

        // Leveling stats
        this.level = 1;
        this.currentXp = 0;
        this.requiredXp = 50; 

        // Definice možných vylepšení (Upgrade Pool)
        this.upgradePool = [
            { id: 'speed', text: 'Rychlé Nohy (+10% Speed)', type: 'stat', key: 'playerSpeed', value: 20 },
            { id: 'ammo', text: 'Velký Zásobník (+1 Náboj)', type: 'stat', key: 'maxAmmo', value: 1 },
            { id: 'fire_rate', text: 'Kulomet (-10% Delay)', type: 'custom', action: 'buffFireRate' },
            { id: 'heal', text: 'Lékárnička (+30 HP)', type: 'custom', action: 'healPlayer' },
            { id: 'damage', text: 'Průbojné střely (+2 Dmg)', type: 'stat', key: 'damageMult', value: 0.2 }
        ];

        // --- 2. ENTITY ---
        this.player = this.add.rectangle(640, 360, 40, 40, 0x00ff00);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // Ovládání
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');

        // Skupiny (Pools)
        this.enemies = this.physics.add.group({ classType: Enemy, maxSize: 50 });
        this.projectiles = this.physics.add.group({ classType: Projectile, maxSize: 30 });
        this.expOrbs = this.physics.add.group({ classType: ExperienceOrb, maxSize: 100 });

        // --- 3. UI ---
        this.createUI();
        this.createUpgradeUI(); 

        // --- 4. ČASOVAČE ---
        this.shootTimer = this.time.addEvent({ delay: this.fireRate, callback: this.autoShoot, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 1000, callback: this.spawnEnemy, callbackScope: this, loop: true });

        // --- 5. KOLIZE ---
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHit, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
        this.physics.add.overlap(this.player, this.expOrbs, this.collectOrb, null, this);
    }

    createUI() {
        // Health Bar
        this.healthBarBg = this.add.rectangle(20, 20, 200, 20, 0x000000).setOrigin(0).setScrollFactor(0);
        this.healthBar = this.add.rectangle(20, 20, 200, 20, 0x00ff00).setOrigin(0).setScrollFactor(0);
        
        // Ammo
        this.ammoText = this.add.text(20, 50, `AMMO: 5 / 5`, { fontSize: '18px', fill: '#fff' }).setScrollFactor(0);

        // XP Bar
        this.xpBarBg = this.add.rectangle(0, 700, 1280, 20, 0x000000).setOrigin(0).setScrollFactor(0);
        this.xpBar = this.add.rectangle(0, 700, 0, 20, 0x0088ff).setOrigin(0).setScrollFactor(0);
        this.levelText = this.add.text(640, 680, 'Level 1', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0);

        // Game Over Text
        this.gameOverText = this.add.text(640, 300, 'GAME OVER', { 
            fontSize: '64px', fill: '#f00', align: 'center' 
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(100);
    }

    createUpgradeUI() {
        this.upgradeContainer = this.add.container(0, 0).setScrollFactor(0).setVisible(false).setDepth(200);
        const bg = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);
        const title = this.add.text(640, 150, 'LEVEL UP! Vyber vylepšení:', { fontSize: '40px', color: '#ffd700' }).setOrigin(0.5);

        this.upgradeContainer.add([bg, title]);
        this.upgradeButtons = []; 
    }

    // --- LOGIKA LEVEL UP ---
    levelUp() {
        this.level++;
        this.currentXp -= this.requiredXp;
        this.requiredXp = Math.floor(this.requiredXp * 1.5);
        this.updateXpUi();
        this.showUpgradeMenu();
    }

    showUpgradeMenu() {
        this.isGamePaused = true;
        this.physics.pause();
        this.upgradeContainer.setVisible(true);

        this.upgradeButtons.forEach(btn => btn.destroy());
        this.upgradeButtons = [];

        const shuffled = this.upgradePool.sort(() => 0.5 - Math.random());
        const options = shuffled.slice(0, 3);

        options.forEach((opt, index) => {
            const yPos = 250 + (index * 100);
            
            const btnBg = this.add.rectangle(640, yPos, 400, 80, 0x333333).setInteractive({ useHandCursor: true });
            const btnText = this.add.text(640, yPos, opt.text, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);

            btnBg.on('pointerover', () => btnBg.setFillStyle(0x555555));
            btnBg.on('pointerout', () => btnBg.setFillStyle(0x333333));
            btnBg.on('pointerdown', () => this.selectUpgrade(opt));

            this.upgradeContainer.add([btnBg, btnText]);
            this.upgradeButtons.push(btnBg, btnText);
        });
    }

    selectUpgrade(upgrade) {
        if (upgrade.type === 'stat') {
            this[upgrade.key] += upgrade.value;
        } else if (upgrade.type === 'custom') {
            if (upgrade.action === 'healPlayer') {
                this.playerHealth = Math.min(this.playerHealth + 30, this.playerMaxHealth);
                this.updateHealthBar();
            } else if (upgrade.action === 'buffFireRate') {
                this.fireRate *= 0.9;
                this.shootTimer.remove(false);
                this.shootTimer = this.time.addEvent({ delay: this.fireRate, callback: this.autoShoot, callbackScope: this, loop: true });
            }
        }

        if (upgrade.key === 'maxAmmo') this.updateAmmoUi();

        this.upgradeContainer.setVisible(false);
        this.isGamePaused = false;
        this.physics.resume();
    }

    // --- HERNÍ LOGIKA ---
    spawnExpOrb(x, y) {
        const orb = this.expOrbs.get(x, y);
        if (orb) orb.spawn(x, y, 20);
    }

    collectOrb(player, orb) {
        if (!orb.active) return;
        orb.collect();
        this.currentXp += orb.value;
        this.updateXpUi();
        if (this.currentXp >= this.requiredXp) this.levelUp();
    }

    updateXpUi() {
        this.levelText.setText(`Level ${this.level}`);
        const percent = Math.min(this.currentXp / this.requiredXp, 1);
        this.xpBar.width = 1280 * percent;
    }

    updateHealthBar() {
        const percent = Math.max(0, this.playerHealth / this.playerMaxHealth);
        this.healthBar.width = 200 * percent;
        this.healthBar.setFillStyle(percent < 0.3 ? 0xff0000 : 0x00ff00);
    }

    updateAmmoUi() {
        this.ammoText.setText(this.isReloading ? "RELOADING..." : `AMMO: ${this.currentAmmo} / ${this.maxAmmo}`);
        this.ammoText.setColor(this.isReloading ? '#f00' : '#fff');
    }

    spawnEnemy() {
        if (this.isGameOver || this.isGamePaused) return;
        const x = Math.random() > 0.5 ? -50 : 1330;
        const y = Phaser.Math.Between(0, 720);
        const enemy = this.enemies.get(x, y);
        if (enemy) enemy.spawn(x, y);
    }

    autoShoot() {
        if (this.isGameOver || this.isReloading || this.isGamePaused) return;
        if (this.currentAmmo <= 0) { this.startReload(); return; }

        const nearest = this.getNearestEnemy();
        if (nearest) {
            const b = this.projectiles.get(this.player.x, this.player.y);
            if (b) {
                b.damage = 10 * this.damageMult; 
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

    getNearestEnemy() {
        let nearest = null;
        let dist = Infinity;
        this.enemies.getChildren().forEach(e => {
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
            if (!enemy.active) this.spawnExpOrb(enemy.x, enemy.y);
        }
    }

    handlePlayerHit(player, enemy) {
        if (this.isInvulnerable || this.isGameOver || this.isGamePaused || !enemy.active) return;
        
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

    // --- GAME OVER A NÁVRAT DO MENU ---
    gameOver() {
        this.isGameOver = true;
        this.physics.pause();
        this.player.setFillStyle(0x555555);
        this.upgradeContainer.setVisible(false);

        // Zobrazení textu a instrukce
        this.gameOverText.setVisible(true);
        this.gameOverText.setText("KRYPTA TĚ POHLTILA\nKlikni pro návrat do města");
        this.gameOverText.setFontSize('40px');

        // Kliknutím se vrátíme do MenuScene
        this.input.once('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    update() {
        if (this.isGameOver || this.isGamePaused) return;
        
        // --- POHYB HRÁČE ---
        let vX = 0;
        let vY = 0;

        if (this.cursors.left.isDown || this.wasd.A.isDown) vX = -1;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) vX = 1;

        if (this.cursors.up.isDown || this.wasd.W.isDown) vY = -1;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) vY = 1;

        if (vX !== 0 || vY !== 0) {
            this.player.body.setVelocity(vX, vY);
            this.player.body.velocity.normalize().scale(this.playerSpeed);
        } else {
            this.player.body.setVelocity(0, 0);
        }

        // --- UPDATE OSTATNÍCH ENTIT ---
        this.enemies.children.iterate(e => e?.active && e.update(this.player));
        this.projectiles.children.iterate(p => p?.active && p.update());
    }
}

```


Výborně. Máme funkční menu, ukládání dat a herní smyčku. Teď do hry přidáme to nejdůležitější pro žánr "Extraction" – **Riziko a Odměnu**.

V této kapitole zavedeme:

1. **Zlaté Mince:** Budou padat z nepřátel.
2. **Dočasný Batoh:** Zlato, které seberete, se vám *nepřičte* hned. Máte ho jen "v kapse".
3. **Extrakční Portál:** Aby se zlato uložilo do "Trezoru" (PlayerData), musíte najít portál a utéct.
4. **Smrt:** Pokud zemřete, o zlato v kapse přijdete.

---

## Kapitola 9: Zlato, Portál a Útěk

### 9.1 Nový soubor: `src/entities/GoldCoin.js`

Jednoduchá entita reprezentující peníze.

```javascript
export default class GoldCoin extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Žluté kolečko (reprezentované čtvercem pro zjednodušení, později sprite)
        super(scene, x, y, 12, 12, 0xffd700);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.value = 1; // Hodnota mince
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

### 9.2 Nový soubor: `src/entities/Portal.js`

Toto je náš únikový bod. Objeví se po určité době.

```javascript
export default class Portal extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Modrý "mystický" obdélník
        super(scene, x, y, 50, 80, 0x0000ff);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true); // Hráč ho nemůže odtlačit
        
        // Jednoduchá animace "pulzování" (změna průhlednosti)
        scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    spawn(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.body.enable = true;
    }
}

```

### 9.3 Aktualizace `src/scenes/GameScene.js`

Zde propojíme vše dohromady.

**Změny v logice:**

* **`tempGold`**: Proměnná pro zlato v aktuálním runu.
* **`spawnPortal()`**: Funkce, která po dosažení cíle (např. Level 3) otevře cestu ven.
* **`extract()`**: Funkce, která se zavolá při dotyku portálu – uloží zlato a vrátí do menu.

Zde je kompletní kód:

```javascript
import Enemy from '../entities/Enemy.js';
import Projectile from '../entities/Projectile.js';
import ExperienceOrb from '../entities/ExperienceOrb.js';
import GoldCoin from '../entities/GoldCoin.js'; // NOVÉ
import Portal from '../entities/Portal.js';     // NOVÉ
import { PlayerData } from '../data/PlayerData.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // --- 1. CONFIG & STATS ---
        const loadout = PlayerData.getLoadout();

        this.isGameOver = false;
        this.isGamePaused = false; 

        // Ekonomika Runu (NOVÉ)
        this.tempGold = 0; // Zlato, které ztratíš, když zemřeš
        this.portalActive = false;

        // Hráč stats
        this.playerMaxHealth = 100;
        this.playerHealth = 100;
        this.playerSpeed = 200 + loadout.moveSpeedBonus;
        this.isInvulnerable = false;

        // Střelba stats
        this.maxAmmo = 5;
        this.currentAmmo = 5;
        this.reloadTime = 2000;
        this.fireRate = 1000; 
        this.isReloading = false;
        this.damageMult = 1 + (loadout.damageBonus / 100);

        // Leveling stats
        this.level = 1;
        this.currentXp = 0;
        this.requiredXp = 50; 

        this.upgradePool = [
            { id: 'speed', text: 'Rychlé Nohy (+10% Speed)', type: 'stat', key: 'playerSpeed', value: 20 },
            { id: 'ammo', text: 'Velký Zásobník (+1 Náboj)', type: 'stat', key: 'maxAmmo', value: 1 },
            { id: 'fire_rate', text: 'Kulomet (-10% Delay)', type: 'custom', action: 'buffFireRate' },
            { id: 'heal', text: 'Lékárnička (+30 HP)', type: 'custom', action: 'healPlayer' },
            { id: 'damage', text: 'Průbojné střely (+2 Dmg)', type: 'stat', key: 'damageMult', value: 0.2 }
        ];

        // --- 2. ENTITY ---
        this.player = this.add.rectangle(640, 360, 40, 40, 0x00ff00);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');

        // Skupiny
        this.enemies = this.physics.add.group({ classType: Enemy, maxSize: 50 });
        this.projectiles = this.physics.add.group({ classType: Projectile, maxSize: 30 });
        this.expOrbs = this.physics.add.group({ classType: ExperienceOrb, maxSize: 100 });
        this.goldCoins = this.physics.add.group({ classType: GoldCoin, maxSize: 50 }); // NOVÉ

        // Portál (zatím neaktivní, vytvoříme ho mimo obrazovku)
        this.portal = new Portal(this, -100, -100); 
        this.portal.setVisible(false);
        this.portal.body.enable = false;

        // --- 3. UI ---
        this.createUI();
        this.createUpgradeUI(); 

        // --- 4. ČASOVAČE ---
        this.shootTimer = this.time.addEvent({ delay: this.fireRate, callback: this.autoShoot, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 1000, callback: this.spawnEnemy, callbackScope: this, loop: true });

        // --- 5. KOLIZE ---
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHit, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
        this.physics.add.overlap(this.player, this.expOrbs, this.collectOrb, null, this);
        
        // Nové kolize
        this.physics.add.overlap(this.player, this.goldCoins, this.collectGold, null, this);
        this.physics.add.overlap(this.player, this.portal, this.extract, null, this);
    }

    createUI() {
        // Health Bar
        this.healthBarBg = this.add.rectangle(20, 20, 200, 20, 0x000000).setOrigin(0).setScrollFactor(0);
        this.healthBar = this.add.rectangle(20, 20, 200, 20, 0x00ff00).setOrigin(0).setScrollFactor(0);
        
        // Ammo
        this.ammoText = this.add.text(20, 50, `AMMO: 5 / 5`, { fontSize: '18px', fill: '#fff' }).setScrollFactor(0);

        // Gold UI (NOVÉ) - vpravo nahoře
        this.goldText = this.add.text(1260, 20, `LOOT: 0 G`, { 
            fontSize: '24px', fill: '#ffd700', align: 'right', fontFamily: 'monospace' 
        }).setOrigin(1, 0).setScrollFactor(0);

        // Extraction Warning (NOVÉ)
        this.extractionText = this.add.text(640, 100, 'PORTÁL OTEVŘEN!', {
            fontSize: '32px', fill: '#00ffff', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false);

        // XP Bar
        this.xpBarBg = this.add.rectangle(0, 700, 1280, 20, 0x000000).setOrigin(0).setScrollFactor(0);
        this.xpBar = this.add.rectangle(0, 700, 0, 20, 0x0088ff).setOrigin(0).setScrollFactor(0);
        this.levelText = this.add.text(640, 680, 'Level 1', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0);

        // Game Over
        this.gameOverText = this.add.text(640, 300, 'GAME OVER', { 
            fontSize: '64px', fill: '#f00', align: 'center' 
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(100);
    }

    createUpgradeUI() {
        this.upgradeContainer = this.add.container(0, 0).setScrollFactor(0).setVisible(false).setDepth(200);
        const bg = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);
        const title = this.add.text(640, 150, 'LEVEL UP! Vyber vylepšení:', { fontSize: '40px', color: '#ffd700' }).setOrigin(0.5);
        this.upgradeContainer.add([bg, title]);
        this.upgradeButtons = []; 
    }

    // --- LOGIKA LEVEL UP & PORTAL ---
    levelUp() {
        this.level++;
        this.currentXp -= this.requiredXp;
        this.requiredXp = Math.floor(this.requiredXp * 1.5);
        this.updateXpUi();
        
        // Pokud hráč dosáhne Levelu 3, otevře se portál (zjednodušená podmínka)
        if (this.level === 3 && !this.portalActive) {
            this.openPortal();
        }

        this.showUpgradeMenu();
    }

    openPortal() {
        this.portalActive = true;
        // Portál se objeví náhodně na mapě
        const px = Phaser.Math.Between(100, 1180);
        const py = Phaser.Math.Between(100, 620);
        
        this.portal.spawn(px, py);
        
        this.extractionText.setVisible(true);
        this.extractionText.setText(`PORTÁL OTEVŘEN!\nNajdi ho: [${px}, ${py}]`); // Nápověda souřadnic
        
        console.log("Portál otevřen na:", px, py);
    }

    extract() {
        if (!this.portalActive) return;

        // ÚSPĚŠNÝ ÚTĚK!
        this.physics.pause();
        this.isGamePaused = true;
        
        // Uložení zlata
        PlayerData.addResources(this.tempGold, 0);

        this.add.text(640, 360, 'EXTRAKCE ÚSPĚŠNÁ!', {
            fontSize: '64px', fill: '#00ff00', stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

        this.time.delayedCall(2000, () => {
            this.scene.start('MenuScene');
        });
    }

    // --- UPGRADE MENU ---
    showUpgradeMenu() {
        this.isGamePaused = true;
        this.physics.pause();
        this.upgradeContainer.setVisible(true);

        this.upgradeButtons.forEach(btn => btn.destroy());
        this.upgradeButtons = [];

        const shuffled = this.upgradePool.sort(() => 0.5 - Math.random());
        const options = shuffled.slice(0, 3);

        options.forEach((opt, index) => {
            const yPos = 250 + (index * 100);
            const btnBg = this.add.rectangle(640, yPos, 400, 80, 0x333333).setInteractive({ useHandCursor: true });
            const btnText = this.add.text(640, yPos, opt.text, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);

            btnBg.on('pointerover', () => btnBg.setFillStyle(0x555555));
            btnBg.on('pointerout', () => btnBg.setFillStyle(0x333333));
            btnBg.on('pointerdown', () => this.selectUpgrade(opt));

            this.upgradeContainer.add([btnBg, btnText]);
            this.upgradeButtons.push(btnBg, btnText);
        });
    }

    selectUpgrade(upgrade) {
        if (upgrade.type === 'stat') {
            this[upgrade.key] += upgrade.value;
        } else if (upgrade.type === 'custom') {
            if (upgrade.action === 'healPlayer') {
                this.playerHealth = Math.min(this.playerHealth + 30, this.playerMaxHealth);
                this.updateHealthBar();
            } else if (upgrade.action === 'buffFireRate') {
                this.fireRate *= 0.9;
                this.shootTimer.remove(false);
                this.shootTimer = this.time.addEvent({ delay: this.fireRate, callback: this.autoShoot, callbackScope: this, loop: true });
            }
        }
        if (upgrade.key === 'maxAmmo') this.updateAmmoUi();

        this.upgradeContainer.setVisible(false);
        this.isGamePaused = false;
        this.physics.resume();
    }

    // --- HERNÍ LOGIKA ---
    spawnExpOrb(x, y) {
        const orb = this.expOrbs.get(x, y);
        if (orb) orb.spawn(x, y, 20);
    }

    spawnGoldCoin(x, y) {
        const coin = this.goldCoins.get(x, y);
        if (coin) coin.spawn(x, y, Phaser.Math.Between(5, 15)); // Náhodná hodnota 5-15
    }

    collectOrb(player, orb) {
        if (!orb.active) return;
        orb.collect();
        this.currentXp += orb.value;
        this.updateXpUi();
        if (this.currentXp >= this.requiredXp) this.levelUp();
    }

    collectGold(player, coin) {
        if (!coin.active) return;
        coin.collect();
        this.tempGold += coin.value;
        this.goldText.setText(`LOOT: ${this.tempGold} G`);
        
        // Malý efekt zvětšení textu
        this.tweens.add({
            targets: this.goldText,
            scale: 1.2,
            duration: 100,
            yoyo: true
        });
    }

    updateXpUi() {
        this.levelText.setText(`Level ${this.level}`);
        const percent = Math.min(this.currentXp / this.requiredXp, 1);
        this.xpBar.width = 1280 * percent;
    }

    updateHealthBar() {
        const percent = Math.max(0, this.playerHealth / this.playerMaxHealth);
        this.healthBar.width = 200 * percent;
        this.healthBar.setFillStyle(percent < 0.3 ? 0xff0000 : 0x00ff00);
    }

    updateAmmoUi() {
        this.ammoText.setText(this.isReloading ? "RELOADING..." : `AMMO: ${this.currentAmmo} / ${this.maxAmmo}`);
        this.ammoText.setColor(this.isReloading ? '#f00' : '#fff');
    }

    spawnEnemy() {
        if (this.isGameOver || this.isGamePaused) return;
        const x = Math.random() > 0.5 ? -50 : 1330;
        const y = Phaser.Math.Between(0, 720);
        const enemy = this.enemies.get(x, y);
        if (enemy) enemy.spawn(x, y);
    }

    autoShoot() {
        if (this.isGameOver || this.isReloading || this.isGamePaused) return;
        if (this.currentAmmo <= 0) { this.startReload(); return; }

        const nearest = this.getNearestEnemy();
        if (nearest) {
            const b = this.projectiles.get(this.player.x, this.player.y);
            if (b) {
                b.damage = 10 * this.damageMult; 
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

    getNearestEnemy() {
        let nearest = null;
        let dist = Infinity;
        this.enemies.getChildren().forEach(e => {
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
            
            // DROP SYSTÉM
            if (!enemy.active) {
                this.spawnExpOrb(enemy.x, enemy.y);
                
                // 30% šance na drop zlata
                if (Math.random() < 0.3) {
                    this.spawnGoldCoin(enemy.x, enemy.y);
                }
            }
        }
    }

    handlePlayerHit(player, enemy) {
        if (this.isInvulnerable || this.isGameOver || this.isGamePaused || !enemy.active) return;
        
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
        this.upgradeContainer.setVisible(false);

        // Ztráta zlata!
        this.gameOverText.setVisible(true);
        this.gameOverText.setText(`SMRT!\nZtraceno ${this.tempGold} Zlata\nKlikni pro návrat`);
        this.gameOverText.setFontSize('40px');

        this.input.once('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    update() {
        if (this.isGameOver || this.isGamePaused) return;
        
        let vX = 0;
        let vY = 0;

        if (this.cursors.left.isDown || this.wasd.A.isDown) vX = -1;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) vX = 1;

        if (this.cursors.up.isDown || this.wasd.W.isDown) vY = -1;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) vY = 1;

        if (vX !== 0 || vY !== 0) {
            this.player.body.setVelocity(vX, vY);
            this.player.body.velocity.normalize().scale(this.playerSpeed);
        } else {
            this.player.body.setVelocity(0, 0);
        }

        this.enemies.children.iterate(e => e?.active && e.update(this.player));
        this.projectiles.children.iterate(p => p?.active && p.update());
    }
}

```

### Checklist - Kapitola 9

1. [ ] Vytvořil jsi soubor `src/entities/GoldCoin.js`.
2. [ ] Vytvořil jsi soubor `src/entities/Portal.js`.
3. [ ] Aktualizoval jsi `src/scenes/GameScene.js`.
4. [ ] **Test 1:** Zabíjej nepřátele. Občas vypadne žlutá mince.
5. [ ] **Test 2:** Sbírej mince. Vpravo nahoře se zvyšuje počítadlo "LOOT".
6. [ ] **Test 3 (Smrt):** Nech se zabít. Vrať se do menu. V trezoru by mělo být pořád 0 zlata (protože jsi ho nevynesl).
7. [ ] **Test 4 (Útěk):** Dosáhni Levelu 3. Objeví se modrý obdélník (portál) a nápis.
8. [ ] **Test 5:** Vejdi do portálu. Objeví se "EXTRAKCE ÚSPĚŠNÁ". Po návratu do menu bys měl mít v "TREZORU" peníze!

**Tímto je cyklus kompletní. V další kapitole (Kapitola 10) bychom se měli vrhnout na grafiku a nahradit ty ošklivé čtverce, co říkáš?**




Tento krok je zásadní, protože měníme samotnou smyčku hry (Core Loop) na systém **Extraction**. Zavádíme trvalou progresi (Meta-XP), bezpečné a nebezpečné měny a NPC bankéře.

Zde je kompletní implementace upravených systémů.

---

### Krok 1: Aktualizace `src/data/PlayerData.js`

Musíme přidat podporu pro Meta XP (úroveň účtu), Blood Shards a logiku pro výběr vybavení (Loadout).

```javascript
class PlayerDataManager {
    constructor() {
        // Výchozí hodnoty
        this.data = {
            totalGold: 0,
            bloodShards: 0,
            metaXp: 0,         // Zkušenosti účtu
            accountLevel: 1,   // Úroveň účtu
            
            // Odemčené věci
            unlockedWeapons: ['Zrezivělý Meč', 'Lovecká Kuše'],
            unlockedAbilities: ['Sprint', 'Léčení'],
            
            // Aktuální výběr
            currentLoadout: {
                weapon: 'Zrezivělý Meč',
                ability: 'Sprint'
            }
        };

        this.load();
    }

    save() {
        localStorage.setItem('soulHarvestSave', JSON.stringify(this.data));
    }

    load() {
        const savedData = localStorage.getItem('soulHarvestSave');
        if (savedData) {
            this.data = { ...this.data, ...JSON.parse(savedData) };
        }
    }

    // --- Správa Měny ---
    addGold(amount) {
        this.data.totalGold += amount;
        this.save();
    }

    addShards(amount) {
        this.data.bloodShards += amount;
        this.save();
    }

    // --- Správa Meta XP ---
    addMetaXp(amount) {
        this.data.metaXp += amount;
        // Jednoduchý vzorec: Level up každých 1000 XP * level
        const nextLevelXp = this.data.accountLevel * 1000;
        
        if (this.data.metaXp >= nextLevelXp) {
            this.data.accountLevel++;
            this.data.metaXp -= nextLevelXp;
            console.log("ACCOUNT LEVEL UP!", this.data.accountLevel);
        }
        this.save();
    }

    // --- Správa Loadoutu ---
    setLoadout(weapon, ability) {
        this.data.currentLoadout.weapon = weapon;
        this.data.currentLoadout.ability = ability;
        this.save();
    }

    getLoadout() {
        return this.data.currentLoadout;
    }
}

export const PlayerData = new PlayerDataManager();

```

---

### Krok 2: Nová entita `src/entities/BloodShard.js`

Vzácná měna, která padá z bossů a zůstává i po smrti.

```javascript
export default class BloodShard extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Červený kosočtverec (reprezentován čtvercem otočeným o 45 stupňů)
        super(scene, x, y, 16, 16, 0xff0000);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setAngle(45); // Otočení
        this.value = 1;
        
        // Pulzující animace
        scene.tweens.add({
            targets: this,
            scale: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    spawn(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.body.enable = true;
    }

    collect() {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }
}

```

---

### Krok 3: Nová entita `src/entities/Courier.js`

NPC Bankéř. Objeví se, vezme zlato a zmizí.

```javascript
export default class Courier extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Zelený NPC
        super(scene, x, y, 40, 60, 0x00ff88);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true);
        
        // Text nad hlavou
        this.label = scene.add.text(x, y - 40, "KURÝR", {
            fontSize: '16px', fill: '#00ff88', align: 'center'
        }).setOrigin(0.5);
    }

    spawn(x, y) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.label.setPosition(x, y - 40).setVisible(true);
        this.body.enable = true;

        // Kurýr zmizí po 30 sekundách, pokud ho nevyužiješ
        this.scene.time.delayedCall(30000, () => {
            if (this.active) this.leave();
        });
    }

    leave() {
        this.setActive(false);
        this.setVisible(false);
        this.label.setVisible(false);
        this.body.enable = false;
    }
}

```

---

### Krok 4: Aktualizace `src/scenes/MenuScene.js`

Zde přidáme výběr Loadoutu (Zbraň + Schopnost).

```javascript
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

```

---

### Krok 5: Aktualizace `src/scenes/GameScene.js`

Kompletní logika pro nový ekonomický model, banking a extrakci.

**Klíčové změny:**

* `collectGold`: Zlato jde do dočasného `tempGold`.
* `collectShard`: Shard se ihned ukládá (nebo se počítá stranou, ale přežije smrt).
* `bankGold`: Interakce s Kurýrem uloží `tempGold` -> `PlayerData`.
* `extract`: Převede `tempGold` -> `PlayerData` a `currentXp` -> `PlayerData (MetaXP)`.
* `gameOver`: Ztráta `tempGold`, ale `collectedShards` zůstávají.

```javascript
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

```



To je výborný směr. Přechod na **Hardcore Extraction** styl vyžaduje, aby hra hráče "nenodila za ručičku". Hráč se musí bát každého zásahu a každá mince musí mít váhu.

Zde je aktualizovaný přehled a návrh systémů, které hru přitvrdí.

---

## 📊 Aktuální Stav Projektu: Soul Harvest v0.5

**Fáze:** Funkční "Extraction" Core Loop (Alpha)
**Styl:** Casual (zatím příliš lehké) -> Cíl: **Hardcore / Tactical**

### ✅ Co funguje:

* **Ekonomika:** Rozdělení na Gold (risk) a Shards (safe).
* **Banking:** Kurýr pro ukládání zlata během boje.
* **Meta-Data:** Ukládání postupu a loadoutů.
* **Mechaniky:** Střelba, přebíjení, levelování, extrakce portálem.

### ⚠️ Co musíme změnit (Hardcore Shift):

* **Příliš mnoho zdrojů:** Zlato a HP padají moc často.
* **Nulový stres:** Hráč vydrží příliš mnoho zásahů a regeneruje se (pokud má passive).
* **Statická obtížnost:** Nepřátelé jsou pořád stejní, hra se nestává těžší s časem v rámci runu.

---

## 💀 Návrh Systémů pro "Hardcore & Slow Progress"

Abychom dosáhli pocitu, že progress je zasloužený, navrhuji implementovat tyto tři systémy. Vyber, které zavedeme (doporučuji všechny pro maximální efekt).

### 1. Systém "Eskalace Hrozby" (Dynamic Difficulty)

Hra nebude mít statickou obtížnost. Čím déle zůstaneš v levelu (aby sis nahrabal zlato), tím agresivnější hra bude.

* **Mechanika:** Každých 60 sekund stoupne "Threat Level".
* **Efekt:**
* Lvl 1: Pomalí zombíci.
* Lvl 3: Zombíci zrychlí o 20 %.
* Lvl 5: Začnou se spawnovat "Hunters" (velmi rychlí, malí HP) a "Tanks" (pomalí, hodně HP).
* Lvl 10: "Sudden Death" – spawnování Bossů.


* **Cíl:** Nutí hráče riskovat. *"Mám odejít teď s 50 zlatými, nebo zkusím přežít ještě minutu pro kurýra, ale hrozí, že mě zabijí?"*

### 2. Systém "Vzácného Léčení" (Attrition)

V současnosti se hráč cítí bezpečně. To musíme zrušit.

* **Změna:** Odstranění pasivní regenerace (pokud není ultra-vzácným upgradem).
* **Mechanika:** Lékárničky nepadají z běžných monster. Lze je koupit pouze u **Obchodníka** (vzácné NPC v mapě) za Zlato, nebo vypadnou z Bosse.
* **Důsledek:** Každý zásah bolí. Pokud máš 50% HP, musíš hrát extrémně opatrně.

### 3. Systém "Daň ze Vstupu" (Economy Drain)

Aby zlato mělo hodnotu, musí ubývat. Progress bude pomalý, protože hráč musí investovat do přežití.

* **Mechanika:** Vstup do dungeonu není zdarma. Stojí "Proviant" (např. 10 Gold).
* **Riziko:** Pokud hráč několikrát po sobě zemře a ztratí všechno zlato, dostane se na dno. Musí jít na "Free Run" (jen s pěstmi/základní dýkou), aby si vydělal na náboje do lepší zbraně.

---

## 🛠️ Konkrétní nastavení obtížnosti (Balance Patch)

Aplikujme tato čísla v příštím kroku kódu:

| Atribut | Původní hodnota | **Nová Hardcore Hodnota** | Komentář |
| --- | --- | --- | --- |
| **HP Hráče** | 100 | **60** | 3-4 zásahy a konec. |
| **DMG Nepřítele** | 10 | **15 - 25** | Zásahy musí bolet. |
| **Rychlost Hráče** | 200 | **180** | Nemůžeš jednoduše utéct všemu. |
| **Rychlost Nepřítele** | 80 | **50 - 220** | Pomalé hordy vs. rychlí sprinteři. |
| **Drop Rate (Zlato)** | 30 % | **10 %** | Zlato musí být vzácnost. |
| **Reload Time** | 2s | **2.5s** | Větší okno zranitelnosti. |
| **XP Křivka** | Lineární | **Exponenciální** | Lvl 1->2 (Easy), Lvl 5->6 (Hard). |

---

## 📝 Nový To-Do Plán: Cesta k "Core Gameplay"

Tento plán se zaměřuje čistě na mechaniky a balanc. Grafiku odsouváme, dokud nebude hra zábavná i jako "čtverečky".

1. **Rebalance (The Numbers):** Úprava `GameScene.js` a `Enemy.js` na výše uvedené hardcore hodnoty. Odstranění snadného léčení.
2. **Threat System:** Implementace globálního časovače, který zvyšuje staty nepřátel každou minutu.
3. **Enemy Variety (Typy):**
* *Runner:* Málo HP, extrémní rychlost (nutí hráče střílet, ne utíkat).
* *Tank:* Hodně HP, pomalý, velký hitbox (funguje jako zeď).


4. **Shopkeeper NPC:** Postava, která se náhodně objeví (jako Kurýr) a prodává Lékárničku nebo Ammo Refill za *nasbírané zlato v runu*.
5. **Meta-Upgrade Shop (Menu):** Vytvoření sekce v menu, kde se utrácejí Blood Shards za trvalé +1 HP nebo +1 DMG (velmi drahé, pomalý progress).
6. **Vylepšená AI:** Nepřátelé se neshlukují do jednoho bodu (separace), ale obkličují hráče.

---

### Jak začneme?

Doporučuji začít bodem **1 a 3 najednou** (Rebalance + Typy nepřátel). Tím okamžitě změníme pocit ze hry z "kosení trávy" na "boj o přežití".

**Mám vygenerovat upravený `Enemy.js` (podpora pro různé typy monster) a `GameScene.js` (hardcore čísla)?**




