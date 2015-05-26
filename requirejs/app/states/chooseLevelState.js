define([
    'phaser'
], function (
    Phaser
) { 
    //'use strict';

    function ChooseLevelState(game) {
        
    };
    
    ChooseLevelState.prototype = {
        create: function () {
            // create main menu text and images -
            // create a "Start Game" mechanism - variety of ways to do this...
            button_play = this.add.button(400, 200, 'play1', this.playLevel, this);
            button_play.name = 'play1';
            button_play.anchor.setTo(0.5, 0.5);
            
             button_play = this.add.button(400, 300, 'play2', this.playLevel2, this);
            button_play.name = 'play2';
            button_play.anchor.setTo(0.5, 0.5);
            
        },

        playLevel: function () {
            this.game.state.states['Game'].currentLevel = 1;
            this.state.start('Game',true,false);
        },
        
         playLevel2: function () {
            this.game.state.states['Game'].currentLevel = 2;
            this.state.start('Game',true,false);
        }

    };
       
    return ChooseLevelState;
});
