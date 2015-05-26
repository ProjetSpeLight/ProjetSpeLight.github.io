/**
 * This file implements the functions related to the photon
 */

define(['phaser', 'app/phasergame'], function (Phaser, game) {

    return {
        // Contains the group (container of display objects) of photons
        photons: null,
        // Timer to delay the creation of photons
        photonTime: 0,
        // Button associated to the handler firePhoton()
        fireButton: null,

        /// @function initPhotons
        /// Initialize the group of photons (the factory) in order to create photons and the button to use to throw photons
        /// @param {Phaser.Game} a reference to the game itself
        initPhotons: function (game, player) {
            //  Our photon group
            this.photons = game.add.group();
            this.photons.enableBody = true;
            this.photons.physicsBodyType = Phaser.Physics.ARCADE;
            this.photons.createMultiple(30, 'photon', player.sprite.color.value);

            this.photons.setAll('anchor.x', 0.5);
            this.photons.setAll('anchor.y', 1);
            this.photons.setAll('outOfBoundsKill', true);
            this.photons.setAll('checkWorldBounds', true);

            this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        },

        /// @function firePhoton
        /// Handler that creates a photon
        /// @param {Phaser.Game} a reference to the game itself
        firePhoton: function (game, player) {
            //  To avoid them being allowed to fire too fast we set a time limit
            if (game.time.now > this.photonTime) {
                //  Grab the first photon we can from the pool
                var photon = this.photons.getFirstExists(false);

                if (photon) {
                    //  And fire it
                    if (player.sprite.lookRight) {
                        photon.reset(player.sprite.x + player.sprite.width, player.sprite.y + player.sprite.height / 2 + photon.height / 2);
                        photon.body.velocity.x = 400;
                    } else {
                        photon.reset(player.sprite.x, player.sprite.y + player.sprite.height / 2 + photon.height / 2);
                        photon.body.velocity.x = -400;
                    }
                    // Delay the next fire of photon
                    this.photonTime = game.time.now + 200;
                }
            }
        }


    }

});




