define([
    'phaser'
], function (
    Phaser
) { 
    // 'use strict';

    function BootState(game) {}
    
    BootState.prototype = {
        preload: function () {
            // load assets to be used later in the preloader e.g. for loading screen / splashscreen
            this.load.image('preloaderBar', 'assets/preloader-bar.png');
        },
        create: function () {
            // setup game environment
            // scale, input etc..
           if (this.game.device.desktop) {
               this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
               this.game.scale.pageAlignHorizontally = true;
               this.game.scale.pageAlignVertically = true;
               
        }
            else {
                this.game.scale.setUserScale((screen.width-30.0)/800.0, (screen.height-17)/600.0);
                this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT; // Important
                this.game.scale.pageAlignHorizontally = true;
                this.game.scale.pageAlignVertically = true;
                this.game.scale.forceOrientation(true, false);
                this.game.scale.setResizeCallback(this.gameResized, this);
            }
            this.state.start('Preload');

        }
    };
    
    return BootState;
});
