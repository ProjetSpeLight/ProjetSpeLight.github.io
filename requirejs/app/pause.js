define(['phaser', 'app/phasergame'], function (Phaser, PhaserGame) {

    // Declaration of the buttons which compose the pause menu
    var button_menu;
    var button_restart;
    var button_resume;

    /// @function preload_pause
    /// Load the different images related to the pause menu
    function preload_pause() {
        PhaserGame.game.load.image('pause', 'assets/pause.png', 180, 210);
        PhaserGame.game.load.image('menu', 'assets/button_menu.png', 180, 210);
        PhaserGame.game.load.image('RetMenu', 'assets/button_RetMenu.png', 180, 210);
        PhaserGame.game.load.image('restart', 'assets/button_restart.png', 180, 210);
        PhaserGame.game.load.image('resume', 'assets/button_resume.png', 180, 210);
    }

   
    /// @function gamePaused
    /// Handler called when the player put the game into pause
    /// Puts the game into pause and creates the menu pause
    function gamePaused() {
        // Creation of the three buttons

        button_menu = PhaserGame.game.add.button(400, 200, 'RetMenu');
        button_menu.name = 'Returnmenu';
        button_menu.anchor.setTo(0.5, 0.5);
        button_menu.fixedToCamera = true;

        button_restart = PhaserGame.game.add.button(400, 300, 'restart');
        button_restart.name = 'restart';
        button_restart.anchor.setTo(0.5, 0.5);
        button_restart.fixedToCamera = true;

        button_resume = PhaserGame.game.add.button(400, 400, 'resume');
        button_resume.name = 'resume';
        button_resume.anchor.setTo(0.5, 0.5);
        button_resume.fixedToCamera = true;

        // We put the game into pause
        PhaserGame.game.physics.arcade.isPaused = true;
        PhaserGame.game.paused = true;
    }

    /// @function destruction
    /// Remove the paused state and destroy the pause menu
    function destruction() {
        PhaserGame.game.physics.arcade.isPaused = false;
        PhaserGame.game.paused = false;
        button_menu.destroy();
        button_restart.destroy();
        button_resume.destroy();
    }


    /// @function isOnButton
    /// Return a boolean to know if the pointer at the position (x,y) is on the button
    /// @param {Number} the abscissa of the pointer
    /// @param {Number} the abscissa of the ordinate
    /// @param {Phaser.Button} the button to check if the pointer is on
    function isOnButton(x, y, button) {
        if (button == null) {
            return false;
        }
        var inf_x = button.position.x - PhaserGame.game.camera.x - button.width / 2;
        var sup_x = button.position.x - PhaserGame.game.camera.x + button.width / 2;
        var inf_y = button.position.y - PhaserGame.game.camera.y - button.height / 2;
        var sup_y = button.position.y - PhaserGame.game.camera.y + button.height / 2;
        if (x >= inf_x && x <= sup_x && y >= inf_y && y <= sup_y) {
            return true;
        }
        return false;

    }

    /// @function unpause
    /// Handler called when the player clicked on the screen : used to determine if the player had clicked on a button of the pause menu
    /// @param {Phaser.Input} the input at the origin of the signal and thus the call of this handler
    function unpause(event) {
        if (PhaserGame.game.paused) {
            if (isOnButton(event.x, event.y, button_menu)) {//event.y > 180 && event.y < 240) {
                // The player has clicked on the main menu button                
                destruction();
                PhaserGame.game.state.start('MainMenu');
            } else if (isOnButton(event.x, event.y, button_restart)) {//event.y > 270 && event.y < 340) {
                // The player has clicked on the restart button                
                destruction();
                PhaserGame.game.state.start('RestartGame');
            } else if (isOnButton(event.x, event.y, button_resume)) {//event.y > 370 && event.y < 440) {
                // The player has clicked on the resume button            
                destruction();
            }
        }
    }

    return {
        gamePaused: gamePaused,
        preload_pause: preload_pause,
        destruction: destruction,
        unpause: unpause
    }


});






