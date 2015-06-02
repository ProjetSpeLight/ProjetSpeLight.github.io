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
               //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
               this.game.scale.pageAlignHorizontally = true;
               this.game.scale.pageAlignVertically = true;
               
        }
           else {
               var width;
               var height;
               if(screen.width > screen.height){
                   width = screen.width - 45.0;
                   height = screen.height - 27.0;
               } else {
                   width = screen.height - 45.0;
                   height = screen.width - 27.0;
               }
               this.game.scale.setUserScale(width/800.0, height/600.0);
                this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE; // Important
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
