(function () {
    //'use strict';

    requirejs.config({
        baseUrl: "requirejs/",
        paths: {
            phaser: 'lib/phaser/phaser'
        },
        shim: {
            'phaser': {
                exports: 'Phaser'
            }
        }
    });

    require([
        'phaser',
        'app/phasergame',
    'app/states/bootState',
    'app/states/preloadState',
    'app/states/gameState',
    'app/states/mainMenuState',
    'app/states/finishLevelState',
    'app/states/chooseLevelState'
    ],
    function (
        Phaser,
        PhaserGame,
    BootState,
    PreloadState,
    GameState,
    MainMenuState,
    FinishLevelState,
    ChooseLevelState
    ) {
        PhaserGame.start();
        PhaserGame.game.state.add('Boot', BootState);
        PhaserGame.game.state.add('Preload', PreloadState);
        PhaserGame.game.state.add('MainMenu', MainMenuState);
        PhaserGame.game.state.add('Game', GameState);
        PhaserGame.game.state.add('FinishLevel', FinishLevelState);
        PhaserGame.game.state.add('ChooseLevel', ChooseLevelState);
        PhaserGame.game.state.start('Boot');
    });
}());
