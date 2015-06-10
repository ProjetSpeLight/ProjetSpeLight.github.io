define(['phaser', 'app/phasergame', 'app/player', 'app/objects/action'], function (Phaser, PhaserGame, player, action) {

    /// @function triggerAction
    /// Handler called when a photon hits a switch : trigger the associated action
    /// @param {Phaser.Sprite} the switch that has been hit by the photon
    function triggerAction(switchObject) {

        if (switchObject.switchActionName == "actionChangeObjectColor") {
            switchObject.switchOnAction(switchObject.onArgs);
        } else {
            if (switchObject.state == "On") {
                switchObject.switchOnAction(switchObject.onArgs);
                switchObject.state = "Off";
            } else {
                switchObject.switchOffAction(switchObject.offArgs);
                switchObject.state = "On";
            }
            var str = switchObject.objectType + switchObject.color + switchObject.state;
            switchObject.loadTexture(str);
        }
    }

    /// @function handlerSwitch
    /// Handler called when a photon hits a switch : prepare the animation (camera moving) if needed to show the target when the action will be triggered
    /// @param {Photon} the photon that hits the switch
    /// @param {Phaser.Sprite} the switch that has been hit by the photon
    function handlerSwitch(photon, switchObject) {

        // In any case, the photon is destructed
        photon.kill();
        // We check if the colors match
        if (photon.color.name != switchObject.color
            || switchObject.switchOnAction == null) {
            photon.kill();
            return;
        }

        // The following code is only executed if the switch have been activated (i.e. its state has changed)

        // First, we check if the animation for this switch has already by played
        if (switchObject.hasPlayedAnimation) {
            // If that is the case, we do not do it again
            triggerAction(switchObject);
            return;
        }

        // Then, we check if the animation is needed
        // To do that, we check if the camera (equivalent to a rectangle) contains the sprite (also equivalent to a rectangle with arcade physics)
        var cameraView = PhaserGame.game.camera.view;
        var body = switchObject.onArgs.target.body;
        var rectObj = new Phaser.Rectangle(body.x - 10, body.y - 10, body.width + 20, body.height + 20);
        var contains = Phaser.Rectangle.containsRect(rectObj, cameraView);

        // If the target is already visible on the screen, there is no need for an animation
        // and no need to move the camera, so we juste trigger the action
        if (contains) {
            triggerAction(switchObject);
        } else {
            // If the target is not on the screen, we need to display an animation by moving the camera
            switchObject.hasPlayedAnimation = true;

            // Like we need to move manually the camera, we stop it focusing the player
            PhaserGame.game.camera.unfollow();
            // We save the switch to be able to call the triggerAction function when the camera will be at the right place
            PhaserGame.handlerSwitchObj = switchObject;
            // We save the rectangle where the target is to gain some work time
            PhaserGame.rectObj = rectObj;
            // We indicate that we enter in the state where we will move the camera and thus stop the game
            PhaserGame.freezeGame = true;
        }
    }

    return {
        // The group of sprites
        group: null,

        preloadObjectsImages: function () {
            PhaserGame.game.load.image('switchRedOn', 'assets/Objects/Switch/Switch_Red.png');
            PhaserGame.game.load.image('switchBlueOn', 'assets/Objects/Switch/Switch_Blue.png');
            PhaserGame.game.load.image('switchGreenOn', 'assets/Objects/Switch/Switch_Green.png');
            PhaserGame.game.load.image('switchMagentaOn', 'assets/Objects/Switch/Switch_Magenta.png');
            PhaserGame.game.load.image('switchYellowOn', 'assets/Objects/Switch/Switch_Yellow.png');
            PhaserGame.game.load.image('switchCyanOn', 'assets/Objects/Switch/Switch_Cyan.png');
            PhaserGame.game.load.image('switchWhiteOn', 'assets/Objects/Switch/Switch_White.png');
            PhaserGame.game.load.image('switchRedOff', 'assets/Objects/Switch/Switch_RedOff.png');
            PhaserGame.game.load.image('switchBlueOff', 'assets/Objects/Switch/Switch_BlueOff.png');
            PhaserGame.game.load.image('switchGreenOff', 'assets/Objects/Switch/Switch_GreenOff.png');
            PhaserGame.game.load.image('switchMagentaOff', 'assets/Objects/Switch/Switch_MagentaOff.png');
            PhaserGame.game.load.image('switchYellowOff', 'assets/Objects/Switch/Switch_YellowOff.png');
            PhaserGame.game.load.image('switchCyanOff', 'assets/Objects/Switch/Switch_CyanOff.png');
            PhaserGame.game.load.image('switchWhiteOff', 'assets/Objects/Switch/Switch_WhiteOff.png');
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
                switchObject.color = switchData.color;
                switchObject.switchActionName = switchData.action.actionName;
                switchObject.objectType = 'switch';
                switchObject.id = switchData.id;
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
                    var str = "switch" + switchObject.color + switchObject.state;
                    switchObject.loadTexture(str);
                }

                // Boolean to display the camera animation only once
                switchObject.hasPlayedAnimation = false;
            }

        },

        /// @function updateObject
        /// Updates the group of switchs (to be called by the update() function of the game state)
        updateObjects: function () {
            PhaserGame.game.physics.arcade.collide(player.refPhotons.photons, this.group, handlerSwitch);
        },

        triggerAction: triggerAction
    }

});




