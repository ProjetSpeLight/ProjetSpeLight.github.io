/**
  * This module defines the sprite representing the ennemis
  *
  */

define(['phaser', 'app/phasergame', 'app/player', 'app/photon'], function (Phaser, PhaserGame, player, photon) {



    function killEnnemi(photon, enemy) {
        photon.kill();
        enemy.nbLives--;
        if (enemy.nbLives == 0) {
            enemy.destroy();
            PhaserGame.score += 10;
        }
        
    }

    function killPlayer(playerSprite, ennemi) {
        player.kill();
    }

    return {

        // Object containing the physic group of ennemis
        group: null,

        /// @function preloadObjectImage
        /// Preloads the different images / spritesheets used by this module
        preloadObjectsImages: function () {
            PhaserGame.game.load.spritesheet('normalEnemy', 'assets/baddie.png', 32, 32);
            PhaserGame.game.load.spritesheet('flyingEnemy', 'assets/Fantome.png', 75, 60);

        },

        /// @function createObjectsGroup
        /// Create the differents objects defines in the JSON file represented by this module
        /// @param {Array} Array of elements representing 
        createObjectsGroup: function (data, Manager) {

            // Allocation of the group
            this.group = PhaserGame.game.add.physicsGroup();

            // Intialization of the group in the manager
            Manager.EnumModule.ENEMY.refGroup = this.group;

            if (data == null)
                return;
            for (var i = 0 ; i < data.length ; i++) {
                var ennemiData = data[i];

                // We get the type of enemy
                var enemyType = 'normal';
                if (ennemiData.type != null) {
                    enemyType = ennemiData.type;
                }


                var skin = enemyType + 'Enemy';

                var ennemi = this.group.create(ennemiData.x, ennemiData.y, skin);
                ennemi.frame = 1;
                ennemi.id = ennemiData.id
                var speed = ennemiData.speed;
                if (speed != null) {
                    if (speed.x == null)
                        speed.x = 0;
                    if (speed.y == null)
                        speed.y = 0;
                } else {
                    speed.x = 0;
                    speed.y = 0;
                }
                ennemi.body.velocity.x = speed.x;
                ennemi.body.velocity.y = speed.y;

                ennemi.saveSpeedX = speed.x;
                ennemi.saveSpeedY = speed.y;

                var bounds = ennemiData.bounds;
                if (bounds != null) {
                    if (bounds.left != null)
                        ennemi.body.sprite.leftBounds = ennemiData.bounds.left;
                    if (bounds.right != null)
                        ennemi.body.sprite.rightBounds = ennemiData.bounds.right;
                    if (bounds.top != null)
                        ennemi.body.sprite.topBounds = ennemiData.bounds.top;
                    if (bounds.bottom != null)
                        ennemi.body.sprite.bottomBounds = ennemiData.bounds.bottom;
                }

                ennemi.body.collideWorldBounds = true;
                ennemi.body.bounce.y = 1;
                ennemi.body.bounce.x = 1;

                if (enemyType == 'normal') {
                    ennemi.nbLives = 5;
                } else {
                    ennemi.nbLives = 1;
                    ennemi.animations.add('animFlying', [0, 1, 2, 1], 6, true);
                    ennemi.play('animFlying');
                }
            }
        },

        updateObjects: function () {            
            PhaserGame.game.physics.arcade.overlap(player.sprite, this.group, killPlayer, null, this);
            PhaserGame.game.physics.arcade.collide(photon.photons, this.group, killEnnemi, null, this);



            //Déplacement des ennemis
            this.group.forEach(function (element) {

                if (element.body.velocity.x != element.saveSpeedX && element.body.velocity.x != -element.saveSpeedX) {
                    element.body.velocity.x = element.saveSpeedX;
                }

                if (element.body.velocity.y != element.saveSpeedY && element.body.velocity.y != -element.saveSpeedY) {
                    element.body.velocity.y = element.saveSpeedY;
                }

                if (element.body.x >= element.body.sprite.rightBounds || element.body.x <= element.body.sprite.leftBounds)
                    element.body.velocity.x *= -1;

                if (element.body.y <= element.body.sprite.topBounds || element.body.y >= element.body.sprite.bottomBounds)
                    element.body.velocity.y *= -1;

            })

        }


    }

});
