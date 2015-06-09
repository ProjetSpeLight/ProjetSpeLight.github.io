define([], function () {

    function DeadState(game) { };

    DeadState.prototype = {
        create: function () {

            //Fond
            title = this.game.add.sprite(0, 0, 'BG_bad');
            var coef = 600 / 720;
            title.scale.x = coef;
            title.scale.y = coef;

            this.add.text(320, 80, 'Game Over', { fontSize: '48px', fill: '#fff' });

            if (this.message != null) {
                this.add.text(320, 120, this.message, { fontSize: '48px', fill: '#fff' });
            }

            this.message = null;

            var button_menu = this.add.button(400, 210, 'RetMenu', this.menuclick, this);
            button_menu.name = 'Returnmenu';
            button_menu.anchor.setTo(0.5, 0.5);
            button_menu.fixedToCamera = true;

            var button_restart = this.add.button(400, 330, 'restart', this.restartclick, this);
            button_restart.name = 'restart';
            button_restart.anchor.setTo(0.5, 0.5);
            button_restart.fixedToCamera = true;

            this.add.text(50, 450, 'Appuyer sur Espace pour recommencer le niveau', { fontSize: '48px', fill: '#fff' });
        },

        menuclick: function () {
            this.state.start('MainMenu');
        },

        restartclick: function () {
            this.state.start('RestartGame');
        },

        update: function () {
            if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.restartclick();
            }
        }
    };

    return DeadState;
});
