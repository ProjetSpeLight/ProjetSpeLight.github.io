define(['phaser', 'app/phasergame', 'app/player', 'app/objects/filter'], function (Phaser, PhaserGame, player, ennemi) {

    var CONST_DELAY = 5;
    var counter = 0;

    /// @function handlerbutton
    /// Handler called when a photon hits a button : trigger the associated action
    /// @param {Photon} the photon that hits the button
    /// @param {Phaser.Sprite} the button that has been hit by the photon
    function handlerButton(photon, buttonObject) {
        // We check if the colors match
       // if (photon.color.name == buttonObject.colorName) {
            // If that's the case, the action is performed
        //alert('interrupteur on');
        ennemi.group.children[0].body.x += 10;
        //}
        // In any case, the photon is destructed
        //photon.kill();
    }

    return {
        // The group of sprites
        group: null,

       

        /// @function createObjectsGroup
        /// Creation of the differents buttons defined in the JSON file
        /// @param {Array} Array of the different buttons defined in the JSON file. Can be null if no buttons are used in the current level
        createObjectsGroup: function (data) {
            // Allocation of the group
            this.group = PhaserGame.game.add.physicsGroup();

            // If no buttons are defined in the current level, there is nothing to do
            if (data == null) {
                return;
            }

            // For each button defined
            for (var i = 0 ; i < data.length ; i++) {
                // We get its data
                var buttonData = data[i];
                // We create a new button at the position (x,y) with the token "buttonData.skin + buttonData.color" to represent the corresponding image loaded
                //var buttonObject = this.group.create(buttonData.position.x, buttonData.position.y, buttonData.skin + buttonData.color);
                var buttonObject = this.group.create(buttonData.x, buttonData.y, 'button');
                // Attribute color
                //buttonObject.colorName = buttonData.color;
                // By default, a button is immovable
                buttonObject.body.immovable = true;
            }

        },

        /// @function updateObject
        /// Updates the group of buttons (to be called by the update() function of the game state)
        updateObject: function () {
            counter++;
            if (counter == CONST_DELAY) {
                counter = 0;
                PhaserGame.game.physics.arcade.collide(player.sprite, this.group, handlerButton);
            } else {
                PhaserGame.game.physics.arcade.collide(player.sprite, this.group, null);
            }
            
        }
    }

});




