define([
    'phaser'
], function (
    Phaser
) { 
    //'use strict';

    function MainMenuState(game) {
        var movingPlatform
    };
    
    MainMenuState.prototype = {
        create: function () {
            // create main menu text and images -
            // create a "Start Game" mechanism - variety of ways to do this...

            button_play = this.add.button(400, 200, 'play', this.playGame, this);
            button_play.name = 'play';
            button_play.anchor.setTo(0.5, 0.5);

            button_tutorial = this.add.button(400, 300, 'tutorial', this.playTutorial, this);
            button_tutorial.name = 'tutorial';
            button_tutorial.anchor.setTo(0.5, 0.5);

            button_help = this.add.button(400, 400, 'help', this.help, this);
            button_help.name = 'tutorial';
            button_help.anchor.setTo(0.5, 0.5);
        },

        playGame: function () {
            this.state.start('ChooseLevel');
        },

        playTutorial: function () {
            this.state.start('Game');
        },

        help: function () {
            this.state.start('Game');
        }

    };
    
    
    return MainMenuState;
});
