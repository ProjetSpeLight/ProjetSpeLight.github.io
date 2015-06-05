define(['phaser', 'app/phasergame', 'app/player'], function (Phaser, PhaserGame, player) {


    function finish(player, diamond) {
        PhaserGame.game.state.start('FinishLevel');
    }

    return {


        // Object containing the physic group of coins
        group: null,

        /// @function preloadObjectImage
        /// Preloads the different images / spritesheets used by this module
        preloadObjectsImages: function () {
            PhaserGame.game.load.image('end', 'assets/diamond.png');
        },

        /// @function createObjectsGroup
        /// Create the differents objects defines in the JSON file represented by this module
        /// @param {Array} Array of elements representing 
        createObjectsGroup: function (data, Manager) {

            // Allocation of the group
            this.group = PhaserGame.game.add.physicsGroup();
            // Intialization of the group in the manager
            Manager.EnumModule.END.refGroup = this.group;

            if (data == null) {
                alert("Ce niveau ne contient pas de fin. Bon courage")
                return;
            }
            for (var i = 0 ; i < data.length ; i++) {
                var endData = data[i];
                var end = this.group.create(endData.x, endData.y, 'end');

            }
        },

        updateObjects: function () {
            //when the player touches the end the game is notified that the level is finished
            PhaserGame.game.physics.arcade.overlap(player.sprite, this.group, finish, null, this);
        }


    }




});
