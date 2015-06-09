define(['app/music'], function (musique) {

    function RestartGameState(game) { };

    RestartGameState.prototype = {
        create: function () {
            musique.stopMusic();
            this.state.start('Game');
        }
    };

    return RestartGameState;
});
