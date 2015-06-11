define([], function () {

    function CreditState(game) { };

    CreditState.prototype = {
        create: function () {
            // Background with the credits
            var title = this.game.add.sprite(0, 0, 'Credits');

            // Button to come back to the Main Menu
            var button_retour = this.add.button(700, 60, 'retour', this.returnMenu, this, 1, 0, 1);
            button_retour.name = 'play';
            button_retour.anchor.setTo(0.5, 0.5);
            button_retour.scale.x = 0.7;
            button_retour.scale.y = 0.7;
        },


        returnMenu: function () {
            this.game.state.start('MainMenu');
        }

    };

    return CreditState;
});
