define([
    'phaser', 'app/touch'
], function (
    Phaser, Touch
) { 
    //'use strict';

    function MainMenuState(game) {
        var movingPlatform
        var screenTitle1;
        var screenTitle2;
    };
    
    MainMenuState.prototype = {
        create: function () {            

            this.game.state.states['Game'].currentLevel = 1;
            // create main menu text and images -
            // create a "Start Game" mechanism - variety of ways to do this...

            //Gestion de du fond
            this.createTitle();

            //button_play = this.add.button(400, 180, 'play', this.playGame, this);
            button_play = this.add.button(400, 180, 'play', this.playGame, this, 1, 0, 1);
            button_play.name = 'play';
            button_play.anchor.setTo(0.5, 0.5);

            button_tutorial = this.add.button(400, 300, 'tutorial', this.playTutorial, this, 1, 0, 1);
            button_tutorial.name = 'tutorial';
            button_tutorial.anchor.setTo(0.5, 0.5);

            button_help = this.add.button(400, 420, 'help', this.help, this, 1, 0, 1);
            button_help.name = 'tutorial';
            button_help.anchor.setTo(0.5, 0.5);

            if(!this.game.device.desktop){
                Touch.stop();
                Touch.boutonsSwitch();
            }
        },

        playGame: function () {
            this.state.start('ChooseLevel');
        },

        playTutorial: function () {
            this.game.state.states['Game'].currentLevel = 0;
            this.state.start('Game');
        },

        help: function () {
            this.state.start('FinishLevel');
        },

        createTitle: function(){
            screenTitle1 = this.game.add.sprite(0, 0, 'screentitle');
            screenTitle2 = this.game.add.sprite(screenTitle1.width, 0, 'screentitle');
            this.game.physics.arcade.enable(screenTitle1);
            this.game.physics.arcade.enable(screenTitle2);
            screenTitle1.body.velocity.x = -100;
            screenTitle2.body.velocity.x = screenTitle1.body.velocity.x;
        },

        update: function () {
            if (screenTitle1.x <= -screenTitle1.width) {
                screenTitle1.x = screenTitle1.width + (screenTitle1.x + screenTitle1.width);
            } else if (screenTitle2.x <= -screenTitle1.width) {
                screenTitle2.x = screenTitle1.width + (screenTitle2.x + screenTitle1.width);
            }
        }

    };
    
    
    return MainMenuState;
});
