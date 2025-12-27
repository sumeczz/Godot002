Skvělá práce! Máme za sebou kritický milník. Implementací **Upgrade Systému** se z technického dema stala skutečná hra, která má smyčku (Core Loop) a motivuje hráče hrát dál.

Tímto jsme se přehoupli do **poloviny Fáze 2**. Nyní, když logika funguje, je čas zbavit se "programátorské grafiky" (barevných čtverců) a začít budovat atmosféru, a následně přidat slibovaný "Diablo-like" loot.

Zde je aktualizovaný stav projektu a podrobný plán pro dalších 20 kroků.

---

## 📊 Aktuální Stav Projektu: Soul Harvest (Verze 0.3)

**Celkový postup:** ~35 % finální hry
**Fáze:** Přechod z Prototypu do Alpha verze

### ✅ Co je hotové (Done):

1. **Pohyb:** Plynulý WASD pohyb s normalizací vektorů.
2. **Boj:** Automatická střelba na nejbližší cíl, projektily, kolize.
3. **Nepřátelé:** Pooling systém, AI pronásledování, HP systém.
4. **Zdroje:** Munice, přebíjení (Reload mechanika), UI ukazatele.
5. **Progrese:** XP Orby, Levelování, Zastavení hry, Výběr z náhodných vylepšení.

### 🚧 Co chybí (Missing):

* Grafika (Sprites & Animace).
* Zvuky a Hudba.
* Loot (Předměty, Inventář).
* Mapy (Dungeon Generation).

---

## 📝 To-Do List: Dalších 20 Kroků

Tento plán je rozdělen do dvou logických bloků. Nejprve hru "oblečeme" (Vizuál), poté jí dáme "hloubku" (Loot).

### Blok A: Vizuál, Audio a "Juice" (Kroky 1–10)

*Cíl: Hra přestane vypadat jako geometrické cvičení a začne vypadat jako RPG.*

1. **Asset Loader:** Vytvoření `PreloadScene.js` pro centrální načítání obrázků a zvuků (aby se nepletly v `GameScene`).
2. **Sprite Hráče:** Nahrazení zeleného čtverce za statický obrázek hrdiny.
3. **Animace Hráče:** Přidání animací `walk_down`, `walk_up`, `idle` (rozpohybování nohou).
4. **Sprite Nepřátel:** Nahrazení červených čtverců za sprity (např. kostlivci nebo netopýři).
5. **Flip Mechanics:** Logika pro otáčení spritů doleva/doprava podle směru pohybu.
6. **Pozadí (Svět):** Nahrazení černé barvy za nekonečnou texturu podlahy (TilingSprite).
7. **Zvukový Manažer:** Implementace zvuků pro střelbu (`shoot.wav`) a zásah (`hit.wav`).
8. **Floating Combat Text:** Čísla poškození, která vyletí z nepřítele a zmizí (velmi důležité pro pocit síly).
9. **Vylepšený Feedback:** Částicové efekty (Particles) při smrti nepřítele (krev nebo kosti).
10. **Hlavní Menu:** Jednoduchá scéna `MenuScene` s tlačítkem "Start Game".

### Blok B: Loot Systém a Inventář (Kroky 11–20)

*Cíl: Implementace "Diablo" prvků – sbírání předmětů a stavění buildu.*

11. **Item Class:** Vytvoření datové struktury pro předměty (Název, Rarita, Staty).
12. **Loot Drop:** Šance, že nepřítel po smrti upustí místo XP truhlu nebo předmět.
13. **Pickup Interaction:** Logika pro sebrání předmětu (klávesa E nebo automaticky).
14. **Inventory UI (Backend):** Pole (Array), které drží hráčovy předměty.
15. **Inventory UI (Frontend):** Vykreslení mřížky inventáře (Grid) na obrazovku (klávesa I).
16. **Tooltipy:** Zobrazení statistik předmětu po najetí myší.
17. **Equip System:** Logika "nasazení" předmětu (přepočítání statů hráče podle vybavení).
18. **Rarity System:** Generátor barev a statů (Běžné, Vzácné, Legendární).
19. **Weapon Variety:** Implementace různých typů útoků (nejen jedna střela, ale např. brokovnice nebo orbitální štít).
20. **Save/Load:** Ukládání postupu (Local Storage), aby hráč nepřišel o levely/předměty po zavření prohlížeče.

---

### 💡 Doporučení pro další krok

Abychom mohli začít s **Blokem A**, budeme potřebovat grafiku. Pro výukové účely doporučuji použít nějaký **Free Asset Pack** (např. z *itch.io*), který obsahuje:

* Postavu (Top-down view).
* Pár monster.
* Dlaždice podlahy (Tileset).

**Mám připravit Kapitolu 8: "Asset Loader a První Sprity", kde se naučíme načítat obrázky a nahradíme ty barevné čtverce?**



