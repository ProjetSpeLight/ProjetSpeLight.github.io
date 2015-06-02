define([
    'phaser'
], function (
    Phaser
) {
    function ChooseLevelState(game) { };

    ChooseLevelState.prototype = {
        create: function () {
            // We generate a text and a button (sprite) per level
            var x = 10;
            var y = 10;
            for (var i = 1 ; i < 6 ; i++) {
                var emptyButton = this.game.add.button(x, y, 'buttonEmpty', this.down, self);
                var text = this.game.add.text(x + 50, y + 15, "Level " + i, { font: "28px Arial", fill: "#ffffff", align: "center" });
                emptyButton.numLevel = i;
                emptyButton.refGame = this;
                y += emptyButton.height + 20;
                if (y > this.game.world.height - emptyButton.height) {
                    y = 10;
                    x += emptyButton.width + 20;
                }
            }
        },

        down: function (button) {
            button.refGame.game.state.states['Game'].currentLevel = button.numLevel;
            button.refGame.state.start('Game');
        },



    };

    return ChooseLevelState;
});
