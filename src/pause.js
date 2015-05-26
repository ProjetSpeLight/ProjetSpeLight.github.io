function preload_pause (game) {
    game.load.image('pause', 'assets/pause.png', 180, 210);
    game.load.image('menu', 'assets/button_menu.png',180,210);
    game.load.image('RetMenu', 'assets/button_RetMenu.png',180,210);
    game.load.image('restart', 'assets/button_restart.png',180,210);
    game.load.image('resume', 'assets/button_resume.png',180,210);
    
}


function create_pause (game) {
    game.escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
}

function update_pause (game) {
    
        var returnmenu = false;
     button_menu = game.add.button(400, 200, 'RetMenu', menuclick, game);
        button_menu.name = 'Returnmenu';
        button_menu.anchor.setTo(0.5, 0.5);
        button_menu.fixedToCamera=true;
        
        button_restart = game.add.button(400, 300, 'restart', restartclick, game);
        button_restart.name = 'restart';
        button_restart.anchor.setTo(0.5, 0.5);
        button_restart.fixedToCamera=true;    
    
        button_resume = game.add.button(400, 400, 'resume', resumeclick, game);
        button_resume.name = 'resume';
        button_resume.anchor.setTo(0.5, 0.5);
        button_resume.fixedToCamera=true;    
    
        game.physics.arcade.isPaused =true;
        game.paused=true;
        
    function menuclick() {
            returnMenu(game);
        }
    
    function resumeclick() {
            resume(game);
        }
    
    
    function restartclick() {
            restart(game);
        }
   
    
}


function returnMenu (game) {
    
    game.paused=false;
    game.physics.arcade.isPaused =false;
    game.state.start('MainMenu');
}

function resume (game) {
    button_menu.destroy();
    button_restart.destroy();
    button_resume.destroy();
    
    game.paused=false;
    game.physics.arcade.isPaused = false;
}

function restart (game) {
    game.paused=false;
    game.physics.arcade.isPaused =false;
    game.state.start('Game');
}
    
    
    
    
    

