/**
 * This file implements the functions related to the photon
 */

define(['phaser', 'app/phasergame', 'app/color', 'app/music'], function (Phaser, PhaserGame, Color, music) {

    /******** Scope variables ***********/

    // Counter to help to delay the throw of photons
    var count = 0;
    // The music played at each throw
    var musicPhotonFire;


    /******** Scope functions **********/

    /// @function killPhoton
    /// Kills the photon in parameter
    function killPhoton(photon) {
        photon.kill();
    }

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

            this.photons.setAll('anchor.x', 0);
            this.photons.setAll('anchor.y', 0);
            this.photons.setAll('outOfBoundsKill', true);
            this.photons.setAll('checkWorldBounds', true);
            this.photons.setAll('setSize', true);
            musicPhotonFire = PhaserGame.game.add.audio('photonFire', 1, false);

            this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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

                    // First, we define some attributes which will be used after
                    photon.hasHit = false; // Boolean to improve the reflexion on a mirror

                    // We play the music
                    musicPhotonFire.play();

                    // We define its position and speed according the way the player looks at
                    if (player.sprite.lookRight) {
                        photon.reset(player.sprite.x, player.sprite.y - photon.height / 2);
                        photon.body.velocity.x = 600;
                    } else {
                        photon.reset(player.sprite.x - 30, player.sprite.y - photon.height / 2);
                        photon.body.velocity.x = -600;
                    }

                    // Delay the next fire of photon
                    this.photonTime = game.time.now + player.sprite.color.delay;

                    // Color of the photon
                    photon.color = player.sprite.color;
                    photon.frame = player.sprite.color.value - 1;

                    // We change the size of the photon depending on its energy
                    // 
                    photon.scale.setTo(1 + (7 - player.sprite.color.energy) * 0.1, 1 + (7 - player.sprite.color.energy) * 0.1);

                    // If the photon goes out the wolrd, it is destroyed
                    photon.events.onOutOfBounds.add(killPhoton, photon);


                }
            }



        },

        /// @function updatePhotons
        /// Checks the position of each photon and kill them if they are out of the screen (and not only the wolrd)
        updatePhotons: function () {
            for (var i = 0 ; i < this.photons.children.length ; ++i) {
                var p = this.photons.children[i];
                // We check if the photon is alive (i.e. if it has been thrown)
                if (p.alive) {
                    // If it is, we check its position
                    if (p.body.x < PhaserGame.game.camera.x ||
                        p.body.x > PhaserGame.game.camera.x + PhaserGame.game.camera.width ||
                        p.body.y < PhaserGame.game.camera.y ||
                        p.body.y > PhaserGame.game.camera.y + PhaserGame.game.camera.height) {
                        p.kill();
                    }
                }

            }

        },

        killPhoton: killPhoton


    }

});




