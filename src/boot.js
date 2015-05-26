﻿// Boot will take care of initializing a few settings,

// declare the object that will hold all game states
var GameStates = {
    //quite common to add game variables/constants in here
};

GameStates.Boot = function (game) {  //declare the boot state

};

GameStates.Boot.prototype = {
    preload: function () {
        // load assets to be used later in the preloader e.g. for loading screen / splashscreen
        this.load.image('preloaderBar', 'assets/preloader-bar.png');
    },
    create: function () {
        // setup game environment
        // scale, input etc..
        
        if(this.game.device.iOS){
            this.game.scale.forceOrientation(true, false);
            this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.game.scale.refresh();
            
           
        }

        // call next state
        this.state.start('Preloader');
        
        
    }
};

