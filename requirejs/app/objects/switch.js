define(['phaser', 'app/phasergame', 'app/player', 'app/objects/action'], function (Phaser, PhaserGame, player, action) {

    /// @function handlerSwitch
    /// Handler called when a photon hits a switch : trigger the associated action
    /// @param {Photon} the photon that hits the switch
    /// @param {Phaser.Sprite} the switch that has been hit by the photon
    function handlerSwitch(photon, switchObject) {
        // We check if the colors match
        if (photon.color.name == switchObject.colorName) {
            // If that's the case, the action is performed
            // We check first if the action was correctly defined
            if (switchObject.switchAction == null) {
                return;
            }
            switchObject.switchAction(switchObject.args);
        }
        // In any case, the photon is destructed
        photon.kill();
    }

    return {
        // The group of sprites
        group: null,

        preloadObjectImage: function () {
            //PhaserGame.game.load.image('switch', 'assets/switch.png');
        },

        /// @function createObjectsGroup
        /// Creation of the differents switchs defined in the JSON file
        /// @param {Array} Array of the different switchs defined in the JSON file. Can be null if no switchs are used in the current level
        createObjectsGroup: function (data, Manager) {
            // Allocation of the group
            this.group = PhaserGame.game.add.physicsGroup();
            // Intialization of the group in the manager
            Manager.EnumModule.SWITCH.refGroup = this.group;

            // If no switchs are defined in the current level, there is nothing to do
            if (data == null) {
                return;
            }

            // For each switch defined
            for (var i = 0 ; i < data.length ; i++) {
                // We get its data
                var switchData = data[i];
                // We create a new switch at the position (x,y) with the token "switchData.skin + switchData.color" to represent the corresponding image loaded
                //var switchObject = this.group.create(switchData.position.x, switchData.position.y, switchData.skin + switchData.color);
                var switchObject = this.group.create(switchData.x, switchData.y, 'switch');
                // Attribute color
                switchObject.colorName = switchData.color;
                // Action associated to the switch
                if (switchData.action != null) {
                    var objAction = action.createAction(switchData.action, Manager);
                    switchObject.switchAction = objAction.actionName;
                    switchObject.args = objAction.args;
                }
                // By default, a switch is immovable
                switchObject.body.immovable = true;
            }

        },

        /// @function updateObject
        /// Updates the group of switchs (to be called by the update() function of the game state)
        updateObject: function () {
            PhaserGame.game.physics.arcade.collide(player.refPhotons.photons, this.group, handlerSwitch);
        }
    }

});




