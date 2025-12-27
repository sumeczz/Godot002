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