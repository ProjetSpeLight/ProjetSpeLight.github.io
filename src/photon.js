/**
 * This file implements the functions related to the photon
 */

// Contains the group (container of display objects) of photons
var photons;
// Timer to delay the creation of photons
var photonTime = 0;
// Button associated to the handler firePhoton()
var fireButton;

/// @function initPhotons
/// Initialize the group of photons (the factory) in order to create photons and the button to use to throw photons
/// @param {Phaser.Game} a reference to the game itself
function initPhotons(game) {
    //  Our photon group
    photons = game.add.group();
    photons.enableBody = true;
    photons.physicsBodyType = Phaser.Physics.ARCADE;
    photons.createMultiple(30, 'photon', player.color.value);

    photons.setAll('anchor.x', 0.5);
    photons.setAll('anchor.y', 1);
    photons.setAll('outOfBoundsKill', true);
    photons.setAll('checkWorldBounds', true);

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
}

/// @function firePhoton
/// Handler that creates a photon
/// @param {Phaser.Game} a reference to the game itself
function firePhoton(game) {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > photonTime) {
        //  Grab the first photon we can from the pool
        photon = photons.getFirstExists(false);

        if (photon) {
            //  And fire it
            if (player.lookRight) {
                photon.reset(player.x + player.width, player.y + player.height / 2 + photon.height / 2);
                photon.body.velocity.x = 400;
            } else {
                photon.reset(player.x, player.y + player.height / 2 + photon.height / 2);
                photon.body.velocity.x = -400;
            }
            // Delay the next fire of photon
            photonTime = game.time.now + 200;
        }
    }
}






