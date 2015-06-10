define(['app/phasergame', 'app/player', 'app/objects/ennemi'], function (PhaserGame, player, enemies) {

    /// @function handlerPhoton
    /// Handler called when a photon hits a wall - Destroy the wall if the photon is enough powerful
    /// @param {Photon} the photon which hits the wall
    /// @param {Phaser.Sprite} the wall which has been hit
    function handlerPhoton(photon, wall) {
        if (photon.color.energy >= wall.minEnergy) {
            wall.destroy();
        }
        player.refPhotons.killPhoton(photon);
    }

    return {
        // The group of sprites
        group: null,

        /// @function preloadObjectImage
        /// Preloads the different images / spritesheets used by this module
        preloadObjectsImages: function () {
            PhaserGame.game.load.image('wall', 'assets/Objects/wall.png');
        },

        /// @function createObjectsGroup
        /// Creation of the differents walls defined in the JSON file
        /// @param {Array} Array of the different walls defined in the JSON file. Can be null if no walls are used in the current level
        /// @param {objectsManager} Module manager handling the walls
        createObjectsGroup: function (data, Manager) {
            // Allocation of the group
            this.group = PhaserGame.game.add.physicsGroup();
            // Intialization of the group in the manager
            Manager.EnumModule.WALL.refGroup = this.group;
            // If no walls are defined in the current level, there is nothing to do
            if (data == null) {
                return;
            }
            // For each wall defined
            for (var i = 0 ; i < data.length ; i++) {

                /*** We get its data ***/
                var wallData = data[i];

                var x = wallData.x;
                var y = wallData.y;
                var minEnergy = wallData.minEnergy;

                /*** Creation of the wall ***/

                // We create a new wall at the position (x,y) with the parsed data
                var wallObject = this.group.create(x, y, 'wall');
                wallObject.minEnergy = minEnergy;

                var size = wallData.size;
                if (size != null) {
                    if (size.x == null)
                        size.x = 1;
                    if (size.y == null)
                        size.y = 1;
                    wallObject.scale.setTo(size.x, size.y);
                }

                // General settings for a wall
                wallObject.body.immovable = true;
                PhaserGame.game.physics.arcade.enable(wallObject); // Physics parameter
                wallObject.body.allowGravity = false; // Physics parameter

                // Id if defined
                if (wallData.id != null) {
                    wallObject.id = wallData.id;
                }
            }
        },



        /// @function updateObject
        /// Updates the group of walls (to be called by the update() function of the game state)
        updateObjects: function () {
            PhaserGame.game.physics.arcade.overlap(player.refPhotons.photons, this.group, handlerPhoton);
            PhaserGame.game.physics.arcade.collide(player.sprite, this.group);
            PhaserGame.game.physics.arcade.collide(enemies.group, this.group);
        }
    }
});




