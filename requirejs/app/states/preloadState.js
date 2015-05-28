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

            if (!this.game.device.desktop) {
                this.load.spritesheet('buttonvertical', 'assets/buttons/button-vertical.png', 64, 64);
                this.load.spritesheet('buttonhorizontal', 'assets/buttons/button-horizontal.png', 96, 64);
                this.load.spritesheet('buttonfire', 'assets/buttons/button-round-a.png', 96, 96);
                this.load.spritesheet('buttonjump', 'assets/buttons/button-round-b.png', 96, 96);
            }

            this.load.image('play', 'assets/button_play.png');
            this.load.image('play1', 'assets/button_play_level1.png');
            this.load.image('play2', 'assets/button_play_level2.png');
            this.load.image('help', 'assets/button_help.png');
            this.load.image('tutorial', 'assets/button_tutorial.png');
            this.load.image('buttonNextLevel', 'assets/button_nextlevel.png');


            this.load.spritesheet('dude', 'assets/colordude.png', 32, 48);
            this.load.spritesheet('photon', 'assets/photons.png', 20, 20);
            this.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);

            


            //this.load.json('level1', 'http://localhost:4200/assets/levels/level.json');
            //this.load.json('level2', 'http://localhost:4200/assets/levels/level2.json');
            //this.load.json('level2', 'http://localhost:4200/assets/levels/levelTest.json');
            this.load.json('level1', 'http://projetspelight.github.io/assets/levels/level.json');
            this.load.json('level2', 'http://projetspelight.github.io/assets/levels/levelTest.json');


        },

        create: function () {
            //call next state
            this.state.start('MainMenu');
        }
    };
    
    return PreloadState;
});
