define(['phaser'], function (Phaser) {

    /************ CONSTANTS ****************/

    var NB_LEVELS = 14;

    /************ END CONSTANTS ****************/

    var orientated = false;

    function BootState(game) { }

    BootState.prototype = {
        preload: function () {
            // load assets to be used later in the preloader e.g. for loading screen / splashscreen
            this.load.image('preloaderBar', 'assets/preloader-bar.png');
            this.load.image('chargement', 'assets/Chargement.jpg');
        },
        create: function () {
            orientated = false;
            this.game.nbLevel = NB_LEVELS;

            this.input.maxPointers = 3;
            this.stage.disableVisibilityChange = true;

           if (this.game.device.desktop) {
               this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
               this.game.scale.pageAlignHorizontally = true;
               this.game.scale.pageAlignVertically = true;               
        }
           else {              
                this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.game.scale.pageAlignHorizontally = true;
                this.game.scale.pageAlignVertically = true;
                this.game.scale.forceOrientation(true, false);
                this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
                this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            }
            this.state.start('Preload');

        },

        enterIncorrectOrientation: function () {

            orientated = false;

            document.getElementById('orientation').style.display = 'block';

        },

        leaveIncorrectOrientation: function () {

            orientated = true;

            document.getElementById('orientation').style.display = 'none';

        }
    };

    return BootState;
});
