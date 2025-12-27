import GameScene from './scenes/GameScene.js';

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
    scene: [GameScene] // Registrace naší scény
};