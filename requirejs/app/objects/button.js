define(['phaser', 'app/phasergame', 'app/player', 'app/objects/action'], function (Phaser, PhaserGame, player, action) {

    /************ CONSTANTS ****************/
    // Delay in order not to trigger the action at each update
    var CONST_DELAY = 5;

    var WIDTH_BUTTON = 37;
    var HEIGHT_BUTTON_PRESSED = 8;
    var HEIGHT_BUTTON_RELEASED = 11;

    /************ END CONSTANTS ****************/


    // Variable used to count the time
    var counter = 0;

    return {
        // The group of sprites
        group: null,

        /// @function preloadObjectImage
        /// Preloads the different images / spritesheets used by this module
        preloadObjectsImages: function () {
            PhaserGame.game.load.spritesheet('button', 'assets/Objects/bouton.png', WIDTH_BUTTON, HEIGHT_BUTTON_RELEASED);
        },

        /// @function createObjectsGroup
        /// Creation of the differents buttons defined in the JSON file
        /// @param {Array} Array of the different buttons defined in the JSON file. Can be null if no buttons are used in the current level
        createObjectsGroup: function (data, Manager) {
            // Allocation of the group
            this.group = PhaserGame.game.add.physicsGroup();
            // Intialization of the group in the manager
            Manager.EnumModule.BUTTON.refGroup = this.group;

            // If no buttons are defined in the current level, there is nothing to do
            if (data == null) {
                return;
            }

            // For each button defined
            for (var i = 0 ; i < data.length ; i++) {
                // We get its data
                var buttonData = data[i];
                // We create a new button at the position (x,y) with the token "buttonData.skin + buttonData.color" to represent the corresponding image loaded
                var buttonObject = this.group.create(buttonData.x, buttonData.y, 'button');
                // By default, a button is immovable
                buttonObject.body.immovable = true;
                // At the beggining, the button is not pressed
                buttonObject.frame = 0;
                // We define the anchor for the hit box
                buttonObject.anchor.y = 0.5;
                buttonObject.body.y += buttonObject.body.height / 2;

                // Action associated to the switch
                if (buttonData.action != null) {
                    var objAction = action.createActionButton(buttonData.action, Manager);
                    buttonObject.buttonAction = objAction.actionName;
                    buttonObject.args = objAction.args;
                }

                // Initialization of an attribute used to the update of the button
                buttonObject.isCollidingPlayer = false;
            }

        },

        /// @function handlerButton
        /// Handler called when the player is on a button : trigger the associated action
        /// @param {Phaser.Sprite} the player sprite
        /// @param {Phaser.Sprite} the button
        handlerButton: function (playerSprite, button) {
            // First, we check if the action was correctly defined
            if (button.buttonAction == null) {
                return;
            }

            // We indicate that the player is colliding the player
            button.isCollidingPlayer = true;

            // We allow the player to go on a button without jumping (like a stair)
            if (playerSprite.body.touching.right) {
                button.frame = 1;
                playerSprite.body.y = button.body.y - playerSprite.body.height + 5;
                button.body.setSize(WIDTH_BUTTON, HEIGHT_BUTTON_PRESSED);
                return;
            }

            if (playerSprite.body.touching.left) {
                button.frame = 1;
                playerSprite.body.y = button.body.y - playerSprite.body.height + 5;
                button.body.setSize(WIDTH_BUTTON, HEIGHT_BUTTON_PRESSED);
                return;
            }

            // If the player is on the button, we trigger the action
            if (playerSprite.body.touching.down && !playerSprite.body.touching.right && !playerSprite.body.touching.left) {
                button.frame = 1;
                playerSprite.body.y = button.body.y - playerSprite.body.height + 5;
                button.body.setSize(WIDTH_BUTTON, HEIGHT_BUTTON_PRESSED);

                counter++;
                if (counter == CONST_DELAY) {
                    counter = 0;
                    button.buttonAction(button.args);
                }
            }

        },

        /// @function handlerButton
        /// Handler called when the player overlap a button : trigger the associated action
        /// @param {Phaser.Sprite} the player sprite
        /// @param {Phaser.Sprite} the button
        handlerOverlap: function (playerSprite, button) {
            button.isCollidingPlayer = true;
            button.frame = 1;
            button.body.setSize(WIDTH_BUTTON, HEIGHT_BUTTON_PRESSED);
            playerSprite.body.y = button.body.y - playerSprite.body.height + 5;
            playerSprite.body.velocity.x /= 2;
            playerSprite.body.touching.down = true;
            counter++;
            if (counter == CONST_DELAY) {
                counter = 0;
                button.buttonAction(button.args);
            }
        },

        /// @function updateObject
        /// Updates the group of buttons (to be called by the update() function of the game state)
        updateObjects: function () {
            // First, we initialize the attribute isCollidingPlayer for each button
            for (var i = 0 ; i < this.group.length ; ++i) {
                this.group.children[i].isCollidingPlayer = false;
            }

            // Then, we treat the collision / overlap between the player and a button
            var test = PhaserGame.game.physics.arcade.collide(player.sprite, this.group, this.handlerButton);
            if (!test) {
                PhaserGame.game.physics.arcade.overlap(player.sprite, this.group, this.handlerOverlap);
            }

            // Finally, we change the button if the player is not on it anymore
            for (var i = 0 ; i < this.group.length ; ++i) {
                if (!this.group.children[i].isCollidingPlayer) {
                    this.group.children[i].frame = 0;
                    this.group.children[i].body.setSize(WIDTH_BUTTON, HEIGHT_BUTTON_RELEASED);
                }
            }
        }
    }

});




