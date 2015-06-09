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
            this.game.nbLevel = 14;
            // scale, input etc..
           if (this.game.device.desktop) {
               //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
               this.game.scale.pageAlignHorizontally = true;
               this.game.scale.pageAlignVertically = true;
               
        }
           else {
               var width;
               var height;
               if (window.orientation == 0 || window.orientation == 180) {
                   width = window.innerHeight - window.innerHeight * 5 / 100;
                   height = window.innerWidth - window.innerWidth * 5 / 100;
               } else {
                   width = window.innerWidth - window.innerWidth * 5 / 100;
                   height = window.innerHeight - window.innerHeight * 5 / 100;
               }
               if ('orientation' in screen) {
                   var lockOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation
                   lockOrientation('landscape');
                }
               this.game.scale.setUserScale(width/800.0, height/600.0);
                this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT; // Important
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
