define(['phaser'], function (Phaser) {
    // 'use strict';

    function FinishLevelState(game) { }

    FinishLevelState.prototype = {

        create: function () {
            var button_menu = this.add.button(400, 200, 'RetMenu', this.menuclick, this);
            button_menu.name = 'Returnmenu';
            button_menu.anchor.setTo(0.5, 0.5);
            button_menu.fixedToCamera = true;

            var button_restart = this.add.button(400, 300, 'restart', this.restartclick, this);
            button_restart.name = 'restart';
            button_restart.anchor.setTo(0.5, 0.5);
            button_restart.fixedToCamera = true;

            var button_next = this.add.button(400, 400, 'buttonNextLevel', this.next, this);
            button_next.name = 'next';
            button_next.anchor.setTo(0.5, 0.5);
            button_next.fixedToCamera = true;

        },

        menuclick: function () {
            this.state.start('MainMenu');
        },

        restartclick: function () {
            this.state.start('Game');
        },

        next: function () {
            this.game.state.states['Game'].currentLevel += 1;
            this.state.start('Game', true, false);
        }

    };

    return FinishLevelState;
});
