/// <reference path="~/node_modules/phaser/build/Phaser.js" />
window.onload = function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
    
    //if(game.device.iOS){
        //game.scale.startFullScreen();
    //}

    //  Add the States your game has.
    game.state.add('Boot', GameStates.Boot);
    game.state.add('Preloader', GameStates.Preloader);
    game.state.add('MainMenu', GameStates.MainMenu);
    game.state.add('Game', GameStates.Game);
    game.state.add('FinishLevel', GameStates.FinishLevel);

    //Variables globales
    var platforms;
    var player;
    var coins;
    var score = 0;
    var pushed;
    var movingPlatforms;
    var levelData;

    //  Now start the Boot state.
    game.state.start('Boot');
 

   

    

};
