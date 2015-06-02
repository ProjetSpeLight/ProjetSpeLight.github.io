/**
  * This module defines the sprite representing the ennemis
  *
  */

define(['phaser', 'app/phasergame', 'app/player', 'app/objects/coin', 'app/photon', 'app/touch', 'app/objects/platforms'], function (Phaser, PhaserGame, player, coinObject, photon, Touch, platforms) {

    // on a une collision dans pique à corriger une fois finie

    function killPlayer(play, ennemi) {

        //player.animationDeath();

        if (!play.invincible){
            coinObject.score = 0;    
            //check if the player has a color or not
            if (play.color.value != 0){
                 //he has a color so we remove the last color
                player.timeInvincible=1;
                player.removePlayerColor();
            } else {
                //he hasn't so we restart the game
                PhaserGame.game.state.start('RestartGame');
            }
        }

    }

    function killEnnemi(photon, ennemi) {
        ennemi.kill();
        photon.kill();
    }

    return {

        /***** Attributes *****/

        // Object containing the physic group of ennemis
        group: null,


        /***** Methodes *****/

        /// @function createObjectsGroup
        /// Create the differents objects defines in the JSON file represented by this module
        /// @param {Array} Array of elements representing 
        createObjectGroup: function (data) {

            this.group = PhaserGame.game.add.physicsGroup();

            if (data == null)
                return;          
            for (var i = 0 ; i < data.length ; i++) {
                var ennemiData = data[i];
                var ennemi = this.group.create(ennemiData.x, ennemiData.y, ennemiData.skin);
                ennemi.frame = 1;
                if (ennemiData.speed.x != 0) {
                    ennemi.body.sprite.leftBounds = ennemiData.bounds.left;
                    ennemi.body.sprite.rightBounds = ennemiData.bounds.right;
                    ennemi.body.velocity.x = ennemiData.speed.x;
                }
                ennemi.body.bounce.y = 0;
                ennemi.body.gravity.y = 1000;


            }
        },

        updateObject: function () {

            PhaserGame.game.physics.arcade.collide(this.group, platforms.group);
            PhaserGame.game.physics.arcade.overlap(player.sprite, this.group, killPlayer, null, this);
            PhaserGame.game.physics.arcade.collide(photon.photons, this.group, killEnnemi, null, this);

            //Déplacement des ennemis
            this.group.forEach(function (element) {
                if (element.body.x >= element.body.sprite.rightBounds) {
                    element.body.velocity.x *= -1;
                } else if (element.body.x <= element.body.sprite.leftBounds) {
                    element.body.velocity.x *= -1;
                }
                if (element.body.y <= element.body.sprite.topBounds) {
                    element.body.velocity.y *= -1;
                } else if (element.body.y >= element.body.sprite.bottomBounds) {
                    element.body.velocity.y *= -1;
                }
            })

        }


    }

});
