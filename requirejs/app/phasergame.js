define(['phaser'], function (Phaser) {
    //'use strict';

    return {
        game: null,
        start: function () {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, '');

            //if(game.device.iOS){
            //game.scale.startFullScreen();
            //}
        }
    }


});
