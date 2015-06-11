define(['phaser', 'app/pause', 'app/phasergame', 'app/objects/objectsManager', 'app/music', 'app/player'], function (Phaser, pause, PhaserGame, Manager, music, player) {

    function PreloadState(game) { }

    PreloadState.prototype = {
        preload: function () {
            // common to add a loading bar sprite here...
            PhaserGame.game.add.sprite(0, 0, 'chargement');
            this.preloadBar = PhaserGame.game.add.sprite(PhaserGame.game.width / 2 - 100, PhaserGame.game.height / 2, 'preloaderBar');
            PhaserGame.game.load.setPreloadSprite(this.preloadBar);

            // load all game assets
            // images, spritesheets, atlases, audio etc..
            PhaserGame.game.load.image('sky', 'assets/sky.png');
            PhaserGame.game.load.image('diamond', 'assets/diamond.png');
            PhaserGame.game.load.image('buttonEmpty', 'assets/emptyButton.png');

            player.preloadPlayer();

            // Loading images for the different objects
            Manager.preloadObjects();

            // For the pause state
            pause.preload_pause();

            // For the musics
            music.preload();
            this.load.audio('Titre', ['assets/audio/MainMenu.mp3', 'assets/audio/MainMenu.ogg']);

            if (!this.game.device.desktop) {
                this.load.image('buttonChangeColor', 'assets/boutons/changeColor.png');
                this.load.image('buttonDroite', 'assets/boutons/droite_rect.png');
                this.load.image('buttonGauche', 'assets/boutons/gauche_rect.png');
                this.load.image('buttonSaut', 'assets/boutons/saut.png');
                this.load.image('buttonTir', 'assets/boutons/tir.png')
            }

            this.load.spritesheet('play', 'assets/boutons/New_Game.png', 190, 68);
            this.load.spritesheet('retour', 'assets/boutons/Retour.png', 190, 68);
            this.load.spritesheet('help', 'assets/boutons/Credits.png', 190, 68);
            this.load.spritesheet('tutorial', 'assets/boutons/Tuto.png', 190, 68);
            this.load.image('buttonNextLevel', 'assets/button_nextlevel.png');
            this.load.spritesheet('bouton', 'assets/boutons/Boutons.png', 190, 68);
            this.load.spritesheet('accelerometre', 'assets/boutons/Accelerometre.png', 190, 68);

            //Prelude
            //Son
            this.load.audio('son_eclair', ['assets/audio/eclair.mp3', 'assets/audio/eclair.ogg']);
            this.load.audio('son_pluie', ['assets/audio/pluie.mp3', 'assets/audio/pluie.ogg']);
            this.load.audio('conte', ['assets/audio/Conte.mp3', 'assets/audio/Conte.ogg']);
            this.load.audio('heros', ['assets/audio/Heros.mp3', 'assets/audio/Heros.ogg']);
            this.load.audio('desastre', ['assets/audio/Desastre.mp3', 'assets/audio/Desastre.ogg']);
            //Images
            this.load.image('BG_good', 'assets/intro/BG_good.jpg');
            this.load.image('BG_bad', 'assets/intro/BG_bad.jpg');
            this.load.image('lumiere', 'assets/intro/lumiere.png');
            this.load.image('Credits', 'assets/credits.png');
            this.load.image('rain', 'assets/intro/rain.png');
            this.load.spritesheet('boules', 'assets/Objects/plateformeCouleur.png', 100, 100);
            this.load.image('ecrantitre', 'assets/intro/EcranTitre.png');
        },

        create: function () {
            //call next state
            this.state.start('Prelude');
        }
    };

    return PreloadState;
});
