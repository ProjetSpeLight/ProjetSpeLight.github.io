define(['phaser', 'app/phasergame', 'app/player', 'app/objects/platforms'], function (Phaser, PhaserGame, player, platforms) {



    return {
        // The group of sprites
        group: null,

        /// @function preloadObjectImage
        /// Preloads the different images / spritesheets used by this module
        preloadObjectsImages: function () {
            PhaserGame.game.load.image('mirrorFixed', 'assets/mirror.png');
            PhaserGame.game.load.image('mirrorMovable', 'assets/mirror.png');
            PhaserGame.game.load.image('mirrorRunnerLeft', 'assets/mirror/runnerLeft.png');
            PhaserGame.game.load.image('mirrorRunnerMiddle', 'assets/mirror/runnerMiddle.png');
            PhaserGame.game.load.image('mirrorRunnerRight', 'assets/mirror/runnerRight.png');

        },

        /// @function createObjectsGroup
        /// Creation of the differents mirrors defined in the JSON file
        /// @param {Array} Array of the different mirrors defined in the JSON file. Can be null if no mirrors are used in the current level
        /// @param {objectsManager} Module manager handling the mirrors
        createObject: function (mirrorObject) {

            // Creation of the runner if needed
            if (mirrorObject.leftBound != mirrorObject.rightBound) {
                var runner = {
                    "middle": this.group.create(mirrorObject.leftBound, mirrorObject.body.y , 'mirrorRunnerMiddle'),
                    "left": this.group.create(mirrorObject.leftBound, mirrorObject.body.y  - 2, 'mirrorRunnerLeft'),
                    "right": this.group.create(mirrorObject.rightBound, mirrorObject.body.y  - 2, 'mirrorRunnerRight')
                }
                var size = (mirrorObject.rightBound - mirrorObject.leftBound);
                runner.middle.scale.setTo(size, 1);

                mirrorObject.events.onKilled.add(runner.middle.kill, runner.middle, null);
                mirrorObject.events.onKilled.add(runner.left.kill, runner.left, null);
                mirrorObject.events.onKilled.add(runner.right.kill, runner.right, null);

                mirrorObject.events.onRevived.add(runner.middle.revive, runner.middle, null);
                mirrorObject.events.onRevived.add(runner.left.revive, runner.left, null);
                mirrorObject.events.onRevived.add(runner.right.revive, runner.right, null);

            }
            


            return runner;

        },




    }
});




