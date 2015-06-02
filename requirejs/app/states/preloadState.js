define(['phaser', 'app/pause', 'app/phasergame'], function (Phaser, pause, PhaserGame) {
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
            PhaserGame.game.load.image('ground', 'assets/platform.png');
            PhaserGame.game.load.image('diamond', 'assets/diamond.png');


            PhaserGame.game.load.image('groundYellow', 'assets/platform_Jaune.png');
            PhaserGame.game.load.image('groundRed', 'assets/platform_Rouge.png');
            PhaserGame.game.load.image('groundBlue', 'assets/platform_Bleu.png');
            PhaserGame.game.load.image('groundGreen', 'assets/platform_Vert.png');

            PhaserGame.game.load.image('coin', 'assets/star.png');

            PhaserGame.game.load.image('logo', 'assets/phaser2.png');
            PhaserGame.game.load.image('dead', 'assets/dead.png');
            PhaserGame.game.load.image('switchRed', 'assets/Switch/Switch_Red.png');
            PhaserGame.game.load.image('switchBlue', 'assets/Switch/Switch_Blue.png');
            PhaserGame.game.load.image('switchGreen', 'assets/Switch/Switch_Green.png');
            PhaserGame.game.load.image('switchMagenta', 'assets/Switch/Switch_Magenta.png');
            PhaserGame.game.load.image('switchYellow', 'assets/Switch/Switch_Yellow.png');
            PhaserGame.game.load.image('switchCyan', 'assets/Switch/Switch_Cyan.png');
            PhaserGame.game.load.image('switchWhite', 'assets/Switch/Switch_White.png');
            
            
            PhaserGame.game.load.image('mirror', 'assets/mirror.png');


            PhaserGame.game.load.image('buttonEmpty', 'assets/emptyButton.png');



            // For the pause state
            pause.preload_pause();

            //Chargement ecran titre
            this.load.image('screentitle', 'assets/ScreenTitle.png');

            this.load.image('button_jump', 'assets/button_jump.png', 64, 64);
            this.load.image('pique', 'assets/pique.png');

            if (!this.game.device.desktop) {
                this.load.image('buttonChangeColor', 'assets/boutons/changeColor.png');
                this.load.image('buttonDroite', 'assets/boutons/droite.png');
                this.load.image('buttonGauche', 'assets/boutons/gauche.png');
                this.load.image('buttonSaut', 'assets/boutons/saut.png');
                this.load.image('buttonTir', 'assets/boutons/tir.png')
            }

            //this.load.image('play', 'assets/button_play.png');
            this.load.spritesheet('play', 'assets/boutons/New_Game.png', 190, 68);
            this.load.image('play1', 'assets/button_play_level1.png');
            this.load.image('play2', 'assets/button_play_level2.png');
            this.load.spritesheet('help', 'assets/boutons/Aide.png', 190, 68);
            this.load.spritesheet('tutorial', 'assets/boutons/Tuto.png', 190, 68);
            this.load.image('buttonNextLevel', 'assets/button_nextlevel.png');
            this.load.spritesheet('bouton', 'assets/boutons/Boutons.png', 190, 68);
            this.load.spritesheet('accelerometre', 'assets/boutons/Accelerometre.png', 190, 68);


            this.load.spritesheet('dude', 'assets/colordude.png', 32, 48);
            this.load.spritesheet('photon', 'assets/photons.png', 20, 20);
            this.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);



            this.load.image('button', 'assets/photon_vert.png');

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
