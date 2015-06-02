define(['phaser','app/objects/time', 'app/touch'], function (Phaser,time, Touch) {
    // 'use strict';

    function FinishLevelState(game) { }

    FinishLevelState.prototype = {

        create: function () {
            
            if(!this.game.device.desktop){
                Touch.stop();
            }
            
            var wellDone = this.add.text(320, 30, ' Well Done !' , { fontSize: '32px', fill: '#fff' });
            
            if (time.time >=0) {
                var timeDone = this.add.text(290, 80, ' Time: ' , { fontSize: '32px', fill: '#fff' });
                timeDone.text='Time Done: '+(time.timebegin-time.time)+' sec !';
                
            }
            
            var button_menu = this.add.button(400, 180, 'RetMenu', this.menuclick, this);
            button_menu.name = 'Returnmenu';
            button_menu.anchor.setTo(0.5, 0.5);
            button_menu.fixedToCamera = true;

            var button_restart = this.add.button(400, 300, 'restart', this.restartclick, this);
            button_restart.name = 'restart';
            button_restart.anchor.setTo(0.5, 0.5);
            button_restart.fixedToCamera = true;

            var button_next = this.add.button(400, 420, 'buttonNextLevel', this.next, this);
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
