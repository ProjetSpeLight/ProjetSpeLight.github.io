define(['phaser', 'app/pause', 'app/phasergame', 'app/objects/objectsManager'], function (Phaser, pause, PhaserGame, Manager) {
    // 'use strict';

    function PreloadState(game) { }

    PreloadState.prototype = {
        preload: function () {
            // common to add a loading bar sprite here...
            this.preloadBar = PhaserGame.game.add.sprite(PhaserGame.game.width / 2 - 100, PhaserGame.game.height / 2, 'preloaderBar');
            PhaserGame.game.load.setPreloadSprite(this.preloadBar);

            // load all game assets
            // images, spritesheets, atlases, audio etc..
            PhaserGame.game.load.image('sky', 'assets/sky.png');
            PhaserGame.game.load.image('diamond', 'assets/diamond.png');            
            PhaserGame.game.load.image('dead', 'assets/dead.png');         
            PhaserGame.game.load.image('buttonEmpty', 'assets/emptyButton.png');

            // Loading images for the different objects
            Manager.preloadObjects();

            // For the pause state
            pause.preload_pause();

            //Chargement ecran titre
            this.load.image('screentitle', 'assets/ScreenTitle.png');

            this.load.image('button_jump', 'assets/button_jump.png', 64, 64);

            if (!this.game.device.desktop) {
                this.load.image('buttonChangeColor', 'assets/boutons/changeColor.png');
                this.load.image('buttonDroite', 'assets/boutons/droite_rect.png');
                this.load.image('buttonGauche', 'assets/boutons/gauche_rect.png');
                this.load.image('buttonSaut', 'assets/boutons/saut.png');
                this.load.image('buttonTir', 'assets/boutons/tir.png')
            }

            this.load.spritesheet('play', 'assets/boutons/New_Game.png', 190, 68);
            this.load.image('play1', 'assets/button_play_level1.png');
            this.load.image('play2', 'assets/button_play_level2.png');
            this.load.spritesheet('help', 'assets/boutons/Aide.png', 190, 68);
            this.load.spritesheet('tutorial', 'assets/boutons/Tuto.png', 190, 68);
            this.load.image('buttonNextLevel', 'assets/button_nextlevel.png');
            this.load.spritesheet('bouton', 'assets/boutons/Boutons.png', 190, 68);
            this.load.spritesheet('accelerometre', 'assets/boutons/Accelerometre.png', 190, 68);


            //this.load.spritesheet('dude', 'assets/colordude.png', 32, 48);
            this.load.spritesheet('dude', 'assets/colordude_melo.png', 100, 100);
            //this.load.spritesheet('photon', 'assets/photons.png', 20, 20);
            this.load.spritesheet('photon', 'assets/photons_explosion.png', 60, 60);

            

            // Tutoriel
            //this.load.json('level0', 'http://localhost:4200/assets/levels/Tutoriel.json');

            // Niveaux du jeu
            /*this.load.json('level1', 'http://localhost:4200/assets/levels/Level1.json');
            this.load.json('level2', 'http://localhost:4200/assets/levels/Level2.json');
            this.load.json('level3', 'http://localhost:4200/assets/levels/Level3.json');
            this.load.json('level4', 'http://localhost:4200/assets/levels/Level4.json');
            this.load.json('level5', 'http://localhost:4200/assets/levels/Level5.json');*/
            
            /*this.load.json('level1', 'http://projetspelight.github.io/assets/levels/Level1.json');
            this.load.json('level2', 'http://projetspelight.github.io/assets/levels/Level2.json');
            this.load.json('level3', 'http://projetspelight.github.io/assets/levels/Level3.json');
            this.load.json('level4', 'http://projetspelight.github.io/assets/levels/Level4.json');
            this.load.json('level5', 'http://projetspelight.github.io/assets/levels/Level5.json');*/



        },

        create: function () {
            //call next state
            this.state.start('MainMenu');
        }
    };

    return PreloadState;
});
