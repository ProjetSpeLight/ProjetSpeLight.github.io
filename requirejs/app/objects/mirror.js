define(['phaser', 'app/phasergame', 'app/player', 'app/objects/platforms', 'app/objects/runner'], function (Phaser, PhaserGame, player, platforms, runner) {

    /// @function reflexionPhoton
    /// Handler called when a photon hits a mirror - Change the direction of the photon according to its reflexion on the mirror
    /// @param {Photon} the photon which hits the mirror
    /// @param {Phaser.Sprite} the mirror which has been hit
    function reflexionPhoton(photon, mirror) {
        if (photon.hasHit) {
            if (photon.idMirrorReflexion == mirror.idPerso) {
                return;
            }
        }
        var x = photon.body.velocity.x;
        var y = photon.body.velocity.y;
        var beta = ((mirror.angle + 180) % 180) * Math.PI / 180;
        var alpha;
        if(x>y&&-x<y)
            alpha = Math.atan(y / x);
        else
            alpha = Math.PI/2  - Math.atan(x/y);
        var gamma = beta - alpha;
        var theta = Math.PI + beta + gamma - alpha;
        var newX = x * Math.cos(theta) - y * Math.sin(theta);
        var newY = y * Math.cos(theta) + x * Math.sin(theta);
        photon.body.velocity.x = newX;
        photon.body.velocity.y = newY;
        photon.hasHit = true;
        photon.idMirrorReflexion = mirror.idPerso;
    }


    function handlerMoveMirror(playerSprite, mirror) {
        if (!mirror.immovable && playerSprite.body.velocity.y == 0) {
            if (mirror.body.touching.left) {
                mirror.body.velocity.x += 10;
            } else if (mirror.body.touching.right) {
                mirror.body.velocity.x -= 10;
            }
        }
    }

    return {
        // The group of sprites
        group: null,

        /// @function preloadObjectImage
        /// Preloads the different images / spritesheets used by this module
        preloadObjectsImages: function () {
            PhaserGame.game.load.image('mirrorFixed', 'assets/mirror.png');
            PhaserGame.game.load.image('mirrorMovable', 'assets/mirror.png');
            PhaserGame.game.load.image('mirrorRunnerLeft', 'assets/mirror/runnerLeft.png');
            PhaserGame.game.load.image('mirrorRunnerMiddle', 'assets/mirror/runnerMiddle.png');
            PhaserGame.game.load.image('mirrorRunnerRight', 'assets/mirror/runnerRight.png');

        },

        /// @function createObjectsGroup
        /// Creation of the differents mirrors defined in the JSON file
        /// @param {Array} Array of the different mirrors defined in the JSON file. Can be null if no mirrors are used in the current level
        /// @param {objectsManager} Module manager handling the mirrors
        createObjectsGroup: function (data, Manager) {
            // Allocation of the group
            this.group = PhaserGame.game.add.physicsGroup();
            // Intialization of the group in the manager
            Manager.EnumModule.MIRROR.refGroup = this.group;
            // If no mirrors are defined in the current level, there is nothing to do
            if (data == null) {
                return;
            }
            // For each mirror defined
            for (var i = 0 ; i < data.length ; i++) {

                /*** We get its data ***/
                var mirrorData = data[i];

                // Mandatory data
                var x = mirrorData.x;
                var y = mirrorData.y;

                // Default value
                var angle = 45;
                var immovable = true;
                var leftBound = x;
                var rightBound = x;

                // Optional ones
                if (mirrorData.angle != null) {
                    angle = mirrorData.angle;
                }

                if (mirrorData.immovable != null) {
                    immovable = mirrorData.immovable;
                }

                if (!immovable && mirrorData.bounds != null) {
                    if (mirrorData.bounds.left != null) {
                        leftBound = mirrorData.bounds.left;
                    }
                    if (mirrorData.bounds.right != null) {
                        rightBound = mirrorData.bounds.right;
                    }
                }

                /*** Creation of the mirror ***/

                // We find out the appropriate skin to use
                var skin = 'mirror';
                if (immovable) {
                    skin += 'Fixed';
                } else {
                    skin += 'Movable';
                }

                // We create a new mirror at the position (x,y) with the parsed data
                var mirrorObject = this.group.create(x, y, skin);

                // We set the parsed data
                mirrorObject.angle = angle;
                mirrorObject.body.immovable = immovable;
                mirrorObject.leftBound = leftBound;
                mirrorObject.rightBound = rightBound;

                // General settings for a mirror
                mirrorObject.anchor.setTo(0.5, 0.5);
                PhaserGame.game.physics.arcade.enable(mirrorObject); // Physics parameter
                mirrorObject.body.allowGravity = false; // Physics parameter
                mirrorObject.idPerso = i;  // Id to prevent multi reflexion of a photon

                // Id if defined
                if (mirrorData.id != null) {
                    mirrorObject.id = mirrorData.id;
                }

                
                mirrorObject.runner = runner.createObject(mirrorObject);
                

                if (!immovable) {
                    mirrorObject.body.checkCollision.up = false;
                }

            }
        },



        /// @function updateObject
        /// Updates the group of mirrors (to be called by the update() function of the game state)
        updateObjects: function () {

            /// This function checks in the case of a movable mirror if it is in its runner
            function processCallback(playerSprite, element) {
                /*var angle = -element.angle * Math.PI / 180;
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                var xmax = cos * element.body.width + sin * element.body.height + element.body.x - element.body.width / 2;*/
                var xmax = element.body.x + element.body.width;

                if (element.rightBound == element.leftBound) {
                    return true;
                }

                if (/*element.body.x + element.body.width*/ xmax >= element.rightBound && playerSprite.body.velocity.x >= 0) {
                    return false;
                }

                if (element.body.x - element.body.width <= element.leftBound && playerSprite.body.velocity.x <= 0) {
                    return false;
                }

                return true;
            }

            PhaserGame.game.physics.arcade.overlap(player.refPhotons.photons, this.group, reflexionPhoton);
            PhaserGame.game.physics.arcade.collide(player.sprite, this.group, null, processCallback);
            PhaserGame.game.physics.arcade.collide(this.group, platforms.group, null);
            for (var i = 0; i < this.group.children.length; i++) {

                var miror = this.group.children[i];
                if (miror.body.velocity.x != 0) {
                    miror.body.velocity.x /= 1.1;
                }
                if (miror.body.velocity.y != 0) {
                    miror.body.velocity.y /= 1.1;
                }
            }           
        }
    }
});




