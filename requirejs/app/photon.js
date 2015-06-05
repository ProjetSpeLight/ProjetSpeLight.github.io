/**
 * This file implements the functions related to the photon
 */

define(['phaser', 'app/phasergame', 'app/color'], function (Phaser, PhaserGame, Color) {

    var count = 0;

    function killPhoton(photon) {
        /*photon.body.velocity.x = 0;
        photon.body.velocity.y = 0;
        if (count < 5) {
            count++;
            return;
        }
        photon.animations.play(photon.color.name);
      
        count = 0;
        
       /*if (!photon.boolKill) {
           photon.boolKill = true;
           return;
       }*/

        /* if (photon.numPlay == 5) {
            photon.animations.stop(photon.color.name);
            photon.kill();
        } else {
            photon.numPlay += 1;
        }*/
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
            for (var i = 0 ; i < this.photons.children.length ; ++i) {
                this.photons.children[i].body.setSize(24, 20, 20, 20);
            }

            for (var i = 0 ; i < this.photons.children.length ; i++) {
                for (var color in Color.ColorEnum) {
                    var val = Color.ColorEnum[color].value - 1;
                    this.photons.children[i].animations.add(Color.ColorEnum[color].name, [1 + 6 * val, 2 + 6 * val, 3 + 6 * val, 4 + 6 * val, 5 + 6 * val], 5, true);
                }
            }

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

                    photon.hasHit = false;

                    //  And fire it
                    if (player.sprite.lookRight) {
                        photon.reset(player.sprite.x, player.sprite.y + player.sprite.height / 2 - photon.height / 2);
                        photon.body.velocity.x = 400;
                    } else {
                        photon.reset(player.sprite.x - 30, player.sprite.y + player.sprite.height / 2 - photon.height / 2);
                        //photon.reset(player.sprite.x, player.sprite.y + player.sprite.height / 2 + 20 / 2);
                        photon.body.velocity.x = -400;
                    }
                    // Delay the next fire of photon
                    this.photonTime = game.time.now + player.sprite.color.delay;

                    // Color of the photon
                    photon.color = player.sprite.color;
                    photon.frame = (player.sprite.color.value - 1) * 6;
                    photon.scale.setTo(1 + player.sprite.color.energy*0.1, 1 + player.sprite.color.energy*0.1);

                    // If the photon goes out the wolrd, it is destroyed
                    photon.events.onOutOfBounds.add(killPhoton, photon);

                    photon.boolKill = false;
                    photon.numPlay = 0;
                }
            }



        },


        updatePhotons: function () {
            for (var i = 0 ; i < this.photons.children.length ; ++i) {
                var p = this.photons.children[i];

                if (p.alive) {
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




