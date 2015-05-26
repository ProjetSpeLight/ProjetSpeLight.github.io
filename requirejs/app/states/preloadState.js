define(['phaser', 'app/pause', 'app/phasergame'], function (Phaser, pause, PhaserGame) { 
   // 'use strict';

    function PreloadState(game) {}
    
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

            // For the pause state
            pause.preload_pause();



            this.load.image('button_jump', 'assets/button_jump.png', 64, 64);

            if (this.game.device.iOS) {
                //pause.preload_touch(this);
            }

            this.load.image('play', 'assets/button_play.png');
            this.load.image('play1', 'assets/button_play_level1.png');
            this.load.image('play2', 'assets/button_play_level2.png');
            this.load.image('help', 'assets/button_help.png');
            this.load.image('tutorial', 'assets/button_tutorial.png');


            this.load.spritesheet('dude', 'assets/colordude.png', 32, 48);
            this.load.spritesheet('photon', 'assets/photons.png', 20, 22);

            this.load.image('photonvert', 'assets/photon_vert.png');
            this.load.image('photonrouge', 'assets/photon_rouge.png');
            this.load.image('photonjaune', 'assets/photon_jaune.png');
            this.load.image('photonblanc', 'assets/photon_blanc.png');

            this.load.json('level', 'http://localhost:4200/assets/levels/level.json');
            this.load.json('level2', 'http://localhost:4200/assets/levels/level2.json');


        },

        create: function () {
            //call next state
            this.state.start('MainMenu');
        }
    };
    
    return PreloadState;
});
