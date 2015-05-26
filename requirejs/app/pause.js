define(['phaser', 'app/phasergame'], function (Phaser, PhaserGame) {



    function preload_pause() {
        PhaserGame.game.load.image('pause', 'assets/pause.png', 180, 210);
        PhaserGame.game.load.image('menu', 'assets/button_menu.png', 180, 210);
        PhaserGame.game.load.image('RetMenu', 'assets/button_RetMenu.png', 180, 210);
        PhaserGame.game.load.image('restart', 'assets/button_restart.png', 180, 210);
        PhaserGame.game.load.image('resume', 'assets/button_resume.png', 180, 210);
    }


    function create_pause() {
        PhaserGame.game.escKey = PhaserGame.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    }

    function update_pause() {
        
        PhaserGame.game.physics.arcade.isPaused = true;
        this.is_paused = true;
        PhaserGame.game.paused = true;

        //var returnmenu = false;
        button_menu = PhaserGame.game.add.button(400, 200, 'RetMenu', returnMenu, this);
        button_menu.name = 'Returnmenu';
        button_menu.anchor.setTo(0.5, 0.5);
        button_menu.fixedToCamera = true;
        //var temp = new SignalBinding(button_menu.onInputUp, returnMenu, true);
        //game.add(temp);
        //button_menu.onInputUp.addOnce(returnMenu, this);

        button_restart = PhaserGame.game.add.button(400, 300, 'restart', restart, this);
        button_restart.name = 'restart';
        button_restart.anchor.setTo(0.5, 0.5);
        button_restart.fixedToCamera = true;

        button_resume = PhaserGame.game.add.button(400, 400, 'resume', resume, this);
        button_resume.name = 'resume';
        button_resume.anchor.setTo(0.5, 0.5);
        button_resume.fixedToCamera = true;


        //game.input.onDown.add(unpause, self);

        button_menu.inputEnabled = true;
        button_menu.events.onInputUp.add(returnMenu, this);

        // And finally the method that handels the pause menu
        function unpause(event) {
            game.paused = false;
        }

        

       /* function menuclick() {
            returnMenu(game);
        }

        function resumeclick() {
            resume(game);
        }


        function restartclick() {
            restart(game);
        }*/

        function returnMenu() {
            PhaserGame.game.paused = false;

            this.is_paused = false;
            PhaserGame.game.physics.arcade.isPaused = false;

            PhaserGame.game.state.start('MainMenu');
        }

        function resume() {
            PhaserGame.game.paused = false;

            button_menu.destroy();
            button_restart.destroy();
            button_resume.destroy();

            this.is_paused = false;
            PhaserGame.game.physics.arcade.isPaused = false;
        }

        function restart() {
            PhaserGame.game.paused = false;

            this.is_paused = false;
            PhaserGame.game.paused = false;

            PhaserGame.game.physics.arcade.isPaused = false;
            PhaserGame.game.state.start('Game');
        }


    }


    


    return {
        is_paused : false,
        update_pause: update_pause,
        preload_pause: preload_pause
    }


});
    
    
    
    
    

