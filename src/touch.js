function preload_touch(game){
    img = game.load.image('button_jump', 'assets/button_jump.png');
}

function addJoypad(game){
    button_jump = game.add.button(700, 500, 'button_jump', jump, game);

    button_jump.name = 'button_jump';
    button_jump.anchor.setTo(0.5, 0.5);
    button_jump.fixedToCamera=true;
    button_jump.width = 96;
    button_jump.height = 96;
 
}