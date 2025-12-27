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