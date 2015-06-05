define(['phaser', 'app/phasergame', 'app/player', 'app/objects/action'], function (Phaser, PhaserGame, player, action) {

    /// @function handlerSwitch
    /// Handler called when a photon hits a switch : trigger the associated action
    /// @param {Photon} the photon that hits the switch
    /// @param {Phaser.Sprite} the switch that has been hit by the photon
    function handlerSwitch(photon, switchObject) {
        // We check if the colors match
        if (photon.color.name != switchObject.colorName
            || switchObject.switchOnAction == null) {
            photon.kill();
            return;
        }
        if (switchObject.actionName == "actionChangeObjectColor") {
            switchObject.switchOnAction(switchObject.onArgs);
        } else {
            if (switchObject.state == "On") {
                switchObject.switchOnAction(switchObject.onArgs);
                switchObject.state = "Off";
            } else {
                switchObject.switchOffAction(switchObject.offArgs);
                switchObject.state = "On";
            }
            var str = "switch" + switchObject.colorName + switchObject.state;
            switchObject.loadTexture(str);
        }
        // In any case, the photon is destructed
        photon.kill();


    }

    return {
        // The group of sprites
        group: null,

        preloadObjectsImages: function () {
            PhaserGame.game.load.image('switchRedOn', 'assets/Switch/Switch_Red.png');
            PhaserGame.game.load.image('switchBlueOn', 'assets/Switch/Switch_Blue.png');
            PhaserGame.game.load.image('switchGreenOn', 'assets/Switch/Switch_Green.png');
            PhaserGame.game.load.image('switchMagentaOn', 'assets/Switch/Switch_Magenta.png');
            PhaserGame.game.load.image('switchYellowOn', 'assets/Switch/Switch_Yellow.png');
            PhaserGame.game.load.image('switchCyanOn', 'assets/Switch/Switch_Cyan.png');
            PhaserGame.game.load.image('switchWhiteOn', 'assets/Switch/Switch_White.png');
            PhaserGame.game.load.image('switchRedOff', 'assets/Switch/Switch_RedOff.png');
            PhaserGame.game.load.image('switchBlueOff', 'assets/Switch/Switch_BlueOff.png');
            PhaserGame.game.load.image('switchGreenOff', 'assets/Switch/Switch_GreenOff.png');
            PhaserGame.game.load.image('switchMagentaOff', 'assets/Switch/Switch_MagentaOff.png');
            PhaserGame.game.load.image('switchYellowOff', 'assets/Switch/Switch_YellowOff.png');
            PhaserGame.game.load.image('switchCyanOff', 'assets/Switch/Switch_CyanOff.png');
            PhaserGame.game.load.image('switchWhiteOff', 'assets/Switch/Switch_WhiteOff.png');
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
                var state;
                if (switchData.action.actionName == 'actionMoveObject')
                    state = 'Off';
                else
                    state = 'On';
                // We create a new switch at the position (x,y) with the token "switchData.skin + switchData.color + state" to represent the corresponding image loaded
                var switchObject = this.group.create(switchData.x, switchData.y, 'switch' + switchData.color + state);
                switchObject.state = state;
                // Attribute color 
                switchObject.colorName = switchData.color;
                // Action associated to the switch
                if (switchData.action != null) {
                    var objAction = action.createAction(switchData.action, Manager);
                    switchObject.switchOnAction = objAction.onActionName;
                    switchObject.switchOffAction = objAction.offActionName;
                    switchObject.onArgs = objAction.onArgs;
                    switchObject.offArgs = objAction.offArgs;
                }

                // By default, a switch is immovable
                switchObject.body.immovable = true;
                if (switchData.action.actionName == "actionCreateObject") {
                    switchObject.switchOnAction(switchObject.onArgs);
                    switchObject.state = "Off";
                    var str = "switch" + switchObject.colorName + switchObject.state;
                    switchObject.loadTexture(str);
                }


            }

        },

        /// @function updateObject
        /// Updates the group of switchs (to be called by the update() function of the game state)
        updateObjects: function () {
            PhaserGame.game.physics.arcade.collide(player.refPhotons.photons, this.group, handlerSwitch);
        }
    }

});




