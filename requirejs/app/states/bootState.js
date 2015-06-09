define([
    'phaser'
], function (
    Phaser
) { 
    // 'use strict';
    var orientated = false;

    function BootState(game) {    
    }
    
    BootState.prototype = {
        preload: function () {
            // load assets to be used later in the preloader e.g. for loading screen / splashscreen
            this.load.image('preloaderBar', 'assets/preloader-bar.png');
            this.load.image('chargement', 'assets/Chargement.jpg');
        },
        create: function () {
            orientated = false;
            // setup game environment
            this.game.nbLevel = 14;
            // scale, input etc..

            this.input.maxPointers = 3;
            this.stage.disableVisibilityChange = true;

           if (this.game.device.desktop) {
               //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
               this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
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
                //this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
               this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
               //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT; // Important
                this.game.scale.pageAlignHorizontally = true;
                this.game.scale.pageAlignVertically = true;
                this.game.scale.forceOrientation(true, false);
                this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
                this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            }
            this.state.start('Preload');
          
        },

        enterIncorrectOrientation: function () {

            orientated = false;

            document.getElementById('orientation').style.display = 'block';

        },

        leaveIncorrectOrientation: function () {

            orientated = true;

            document.getElementById('orientation').style.display = 'none';

        }
    };
    
    return BootState;
});
