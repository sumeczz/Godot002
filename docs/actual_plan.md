
## 📊 Aktuální stav projektu: Fáze 1 (Prototyp)

**Status:** 75 % hotovo

V této fázi jsme se zaměřili na technickou stabilitu a výkon. Díky **Object Poolingu** tvá hra zvládne stovky objektů bez sekání, což je pro žánr "bullet heaven" kritické.

### ✅ Hotové části (Dokončené moduly)

1. **Engine & Infrastruktura (`config.js`, `main.js`)**
* Nastavení Phaser 3 s WebGL renderingem.
* Aktivace Arcade Physics pro detekci kolizí.
* Struktura pro importování modulů (ES6 Modules).


2. **Entita Hráče (`GameScene.js`)**
* Pohyb ve všech 8 směrech (WASD + Šipky).
* **Normalizace pohybu:** Hráč neběhá rychleji šikmo.
* Hranice světa: Hráč nemůže utéct z obrazovky.


3. **Systém Nepřátel (`Enemy.js` + Pooling)**
* **Object Pooling:** Recyklace červených čtverců pro úsporu paměti.
* **AI (Seeker):** Monstra automaticky pronásledují hráče.
* **Spawn Logic:** Nepřátelé se objevují náhodně za okrajem obrazovky.


4. **Bojový systém (`Projectile.js` + Auto-combat)**
* **Targeting:** Vyhledání nejbližšího nepřítele pomocí vzdálenostních vektorů.
* **Automatizace:** Hráč střílí v nastaveném intervalu bez nutnosti klikat.
* **Collision Layer:** Detekce zásahu střela->nepřítel a hráč->nepřítel.



---

## 📝 Detailní To-Do Plán (Co nás čeká)

Nyní, když "čtverečky" fungují, musíme z nich udělat skutečnou hru s pravidly a vizuální odezvou.

### 1. Dokončení Fáze 1: Feedback & Životy (Příští krok)

* [ ] **Health System:** Přidat hráči `HP` (životy) a nepřátelům `damage` (poškození).
* [ ] **Game Over:** Obrazovka, která se objeví, když hráč ztratí všechny životy.
* [ ] **Floating Combat Text:** Čísla, která vyletí z nepřítele, když ho zasáhneš.
* [ ] **Visual Juice:** Záblesk nepřítele do bílé barvy při zásahu (Flash effect).

### 2. Fáze 2: RPG Prvky a Statistiky

* [ ] **Experience System:** Nepřátelé po smrti nechají "duši" (XP krystal).
* [ ] **Level Up:** Při nasbírání XP se zastaví čas a hráč si vybere vylepšení.
* [ ] **Data Structures:** Vytvoření souboru `Stats.js` pro výpočet síly útoku a obrany.

### 3. Fáze 3: Vizuál a Prostředí

* [ ] **Sprites:** Výměna barevných čtverců za skutečné pixel-art postavy.
* [ ] **Animations:** Rozpohybování nohou hráče a monster.
* [ ] **Map System:** Výměna šedého pozadí za dlaždicovou podlahu (Tilemap).

---

## 💡 Základní informace o příštím kroku: "The Game Loop"

Aby se z prototypu stala hra, musíme zavést **princip prohry**. Zatím se v konzoli vypisuje "Hráč zasažen", ale nic se neděje.

V příští kapitole vytvoříme **UI (User Interface)** – tedy ukazatel životů (HP Bar) – a naučíme hru reagovat na smrt hráče. To je důležité pro začátečníky, aby pochopili, jak přenášet data mezi logikou (fyzikou) a tím, co hráč vidí na obrazovce.

**Jsi připraven přejít na Kapitolu 5: Systém životů a uživatelské rozhraní?**