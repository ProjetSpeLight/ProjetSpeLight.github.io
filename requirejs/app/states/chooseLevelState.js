define([
    'phaser',
    'app/cook',
    'app/music'
], function (
    Phaser,
     cook,
     music
) {
    function ChooseLevelState(game) { };

    ChooseLevelState.prototype = {
        create: function () {
            // We generate a text and a button (sprite) per level
            var x = 10;
            var y = 10;
            
            for (var i = 1 ; i <= this.game.nbLevel ; i++) {
                var emptyButton = this.game.add.button(x, y, 'buttonEmpty', this.down, self);
                emptyButton.scale.setTo(0.8, 0.8);

                var posLabelButtonX = x + 25;
                if (i >= 10) {
                    posLabelButtonX = x + 20;
                }
                var posLabelButtonY = y + 9;
                var posLabelScoreX = x + 160;
                var posLabelScoreY = y+7;

                var text = this.game.add.text(posLabelButtonX, posLabelButtonY, "Niveau " + i, { font: "26px Arial", fill: "#ffffff", align: "center" });
                
                // we check if a cookie contains the score for the level i
                var nb = cook.readCookie("Level"+i);
                if (nb != null) { // if there is already a score, we print it
                    var textResult = this.game.add.text(posLabelScoreX, posLabelScoreY, "Score : " + nb, { font: "18px Arial", fill: "#ffffff", align: "center" });
                }
                
                emptyButton.numLevel = i;
                emptyButton.refGame = this;
                y += emptyButton.height + 20;
                if (y > this.game.height - emptyButton.height) {
                    y = 10;
                    if (textResult != null) {
                        x += textResult.width;
                    }
                    x += posLabelScoreX + 40;
                }
            }

            var buttonMenu = this.game.add.button(this.game.width - 10, this.game.height - 10, 'RetMenu', this.returnMenu, this);
            buttonMenu.scale.setTo(0.8, 0.8);
            buttonMenu.anchor.setTo(1, 1);
        },

        down: function (button) {
            button.refGame.game.state.states['Game'].currentLevel = button.numLevel;
            if (music.music != null) {
                music.stopMusic();
            }
            button.refGame.state.start('Game');
        },

        returnMenu: function () {
            this.game.state.start('MainMenu');
        }
        



    };

    return ChooseLevelState;
});
