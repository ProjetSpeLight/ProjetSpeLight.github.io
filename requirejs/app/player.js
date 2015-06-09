define(['phaser', 'app/photon', 'app/phasergame', 'app/color'], function (Phaser, photon, PhaserGame, Color) {

    /***********  CONSTANTS ***************/
    var NUM_FRAME_NORMAL = 3; // Default frame of the spritesheet

    /***********  END CONSTANTS ***************/


    // Variables used to freeze the game
    var freeze = false;
    var freezeSaveVelocityX, freezeSaveVelocityY;


    /// @function initializePlayerAnimations
    /// Initialize the different movements animations
    /// {Phaser.Sprite} the object player itself
    /// {Array} The enumeration of the colors with their different properties
    function initializePlayerAnimations(sprite) {
        // Annimation when the sprite moves to the left
        sprite.animations.add('left', [0, 1, 0, 2], 4, true);
        // Animation when the sprite moves to the right
        sprite.animations.add('right', [4, 5, 4, 6], 4, true);
        // Animation when for the game over
        sprite.animations.add('finalDeath', [8, 7, 8, 9], 4, true);
    }

    return {

        // The object "player" (Phaser.Sprite) is defined and initialized in the main program (createLevel.js).
        sprite: null,
        pushed: false,
        refPhotons: photon,
        moveRight: false,
        moveLeft: false,
        accelerometerOn: false,
        velocity: 0,
        fireActive: false,
        changeColor: false,
        activeJump: false,
        timeInvincible: 0,
        firstAddColor: Color.ColorEnum.BLACK,
        secondAddColor: Color.ColorEnum.BLACK,
        previousColor: Color.ColorEnum.BLACK,


        preloadPlayer: function () {
            PhaserGame.game.load.spritesheet('playerBlack', 'assets/player/black.png', 60, 60);
            PhaserGame.game.load.spritesheet('playerRed', 'assets/player/red.png', 60, 60);
            PhaserGame.game.load.spritesheet('playerBlue', 'assets/player/blue.png', 60, 60);
            PhaserGame.game.load.spritesheet('playerGreen', 'assets/player/green.png', 60, 60);
            PhaserGame.game.load.spritesheet('playerMagenta', 'assets/player/magenta.png', 60, 60);
            PhaserGame.game.load.spritesheet('playerYellow', 'assets/player/yellow.png', 60, 60);
            PhaserGame.game.load.spritesheet('playerCyan', 'assets/player/cyan.png', 60, 60);
            PhaserGame.game.load.spritesheet('playerWhite', 'assets/player/white.png', 60, 60);
        },


        kill: function () {

            if (!this.sprite.invincible) {
                //check if the player has a color or not
                if (this.sprite.color.value != 0) {
                    //he has a color so we remove the last color
                    this.timeInvincible = 1;
                    this.removePlayerColor();
                    var tween = [];
                    tween[0] = PhaserGame.game.add.tween(this.sprite).to({ alpha: 0 }, 330, Phaser.Easing.Linear.None);
                    tween[1] = PhaserGame.game.add.tween(this.sprite).to({ alpha: 1 }, 330, Phaser.Easing.Linear.None);
                    tween[2] = PhaserGame.game.add.tween(this.sprite).to({ alpha: 0 }, 330, Phaser.Easing.Linear.None);
                    tween[3] = PhaserGame.game.add.tween(this.sprite).to({ alpha: 1 }, 330, Phaser.Easing.Linear.None);
                    tween[4] = PhaserGame.game.add.tween(this.sprite).to({ alpha: 0 }, 330, Phaser.Easing.Linear.None);
                    tween[5] = PhaserGame.game.add.tween(this.sprite).to({ alpha: 1 }, 330, Phaser.Easing.Linear.None);
                    tween[0].chain(tween[1], tween[2], tween[3], tween[4], tween[5]);
                    tween[5].onComplete.add(this.updateImagePlayer, this);
                    tween[0].start();

                } else {
                    PhaserGame.score = 0;
                    PhaserGame.dead = true;
                    PhaserGame.game.camera.unfollow();
                    this.sprite.animations.stop();
                    this.sprite.body.velocity.x = 0;
                    this.sprite.body.velocity.y = 0;
                    this.sprite.body.gravity.y = 0;
                    this.sprite.body.collideWorldBounds = false;
                    this.jumpMinY = this.sprite.body.y - 2 * this.sprite.body.height;
                    this.maxY = PhaserGame.game.camera.y + PhaserGame.game.camera.height;
                    this.sprite.animations.play('finalDeath', 10);
                    this.sprite.timePreAnimationDeath = 10;
                }
            }
        },

        initializePlayer: function (game, x, y) {
            // Initialization of the scope variables
            freeze = false;

            // The player and its settings            
            this.sprite = PhaserGame.game.add.sprite(x, y, 'playerBlack');

            //  We need to enable physics on the player
            PhaserGame.game.physics.arcade.enable(this.sprite);

            this.sprite.body.bounce.y = 0.0;
            this.sprite.body.gravity.y = 1000;
            PhaserGame.game.camera.follow(this.sprite);
            this.sprite.body.collideWorldBounds = true;
            this.sprite.anchor = new Phaser.Point(0.5, 0.5);
            this.sprite.body.setSize(40, 60);

            // Initialization of the different attributes
            this.timeInvincible = 0;
            this.pushed = false;
            this.moveRight = false;
            this.moveLeft = false;
            this.accelerometerOn = false;
            this.velocity = 0;
            this.fireActive = false;
            this.changeColor = false;
            this.activeJump = false;
            this.firstAddColor = Color.ColorEnum.BLACK;
            this.secondAddColor = Color.ColorEnum.BLACK;
            this.previousColor = Color.ColorEnum.BLACK;
            // Initialization of an attribute to indicate where the player look at

            this.sprite.lookRight = true;
            this.sprite.invincible = false;

            // Initialization of the player animations
            initializePlayerAnimations(this.sprite);

            // Initialization of an attribute to indicate where the player look at
            this.sprite.lookRight = true;
            this.sprite.color = Color.ColorEnum.BLACK;

            // Initialization of the photons
            photon.initPhotons(PhaserGame.game, this);

            this.firstAddColor = Color.ColorEnum.BLACK;
            this.secondAddColor = Color.ColorEnum.BLACK;


        },

        /// @function updatePositionPlayer
        /// Move the player when the game is updated
        /// @param {Phaser.Sprite} the object player itself
        /// @param {Object} object containing a Phaser.Key object for each directional arrows keys
        updatePositionPlayer: function (cursors) {
            //  Reset the players velocity (movement)
            if (this.sprite.body.velocity.x > 10 && !this.sprite.body.touching.down) {
                this.sprite.body.velocity.x -= 5;
            } else if (this.sprite.body.velocity.x < -10 && !this.sprite.body.touching.down) {
                this.sprite.body.velocity.x += 5;
            } else {
                this.sprite.body.velocity.x = 0;
            }

            if (cursors.left.isDown || this.moveLeft) {
                //  Move to the left
                this.handlerLeft();
            }
            else if (cursors.right.isDown || this.moveRight) {
                //  Move to the right                
                this.handlerRight();
            }
            else if (this.accelerometerOn) {
                //  Move to the left
                this.handlerAccelerometer();
            }
            else {
                //  Stand still
                if (this.sprite.body.velocity.x == 0 && !this.sprite.invincible) {
                    this.sprite.animations.stop();
                    this.sprite.frame = NUM_FRAME_NORMAL;
                }
            }

            //  Allow the player to jump if they are touching the ground.
            if (cursors.up.isDown || this.activeJump) {
                this.jump();
            }

            if (cursors.up.isUp) {
                this.pushed = false;
            }


            //  Firing a photon
            if (photon.fireButton.isDown || this.fireActive) {
                if (this.sprite.color.name != 'Black') {
                    photon.firePhoton(PhaserGame.game, this);
                }
            }



        },


        updatePlayer: function () {

            // We begin by checking on the invincibility of the player
            // The invincibility lasts 2 sec
            if (this.timeInvincible != 0) {
                if (this.timeInvincible >= 120) {
                    this.sprite.invincible = false;
                    this.timeInvincible = 0;
                } else {
                    this.sprite.invincible = true;
                    this.timeInvincible++;
                }

            } else {
                this.sprite.invincible = false;
            }

            // Then, we update its position
            var cursors = PhaserGame.game.input.keyboard.createCursorKeys();

            if (!PhaserGame.dead) {
                this.updatePositionPlayer(cursors);
            }

            photon.updatePhotons();

        },

        /// @function removePlayerColor
        /// remove the last color he obtained 
        removePlayerColor: function () {
            this.previousColor = this.sprite.color;
            this.sprite.color = this.firstAddColor;
            this.firstAddColor = this.secondAddColor;
            this.secondAddColor = Color.ColorEnum.BLACK;
        },

        updateImagePlayer: function () {
            this.sprite.loadTexture('player' + this.sprite.color.name);
            //this.sprite.frame = NUM_FRAME_NORMAL;
        },




        /// @function changePlayerColor
        /// Change the current color of the player (and thus of the photons he throws) to the new one given in argument
        changePlayerColor: function (newColor) {
            var color = Color.getColor(newColor);
            if (color == null) {
                return;
            }
            color = Color.additiveColor(this.sprite.color, color);
            if (this.sprite.color != color) {
                this.secondAddColor = this.firstAddColor;
                this.firstAddColor = this.sprite.color;
                this.sprite.color = color;
                this.sprite.loadTexture('player' + this.sprite.color.name);
                this.sprite.frame = this.sprite.color.value * 9 + 4;
            }
        },

        jump: function () {
            if (this.sprite.body.touching.down && !this.pushed) {
                this.sprite.body.velocity.y = -600;
                this.pushed = true;
            }
        },

        handlerLeft: function () {
            this.sprite.body.velocity.x = -300;
            this.sprite.animations.play('left');
            this.sprite.lookRight = false;
        },

        handlerRight: function () {
            this.sprite.body.velocity.x = 300;
            this.sprite.animations.play('right');
            this.sprite.lookRight = true;
        },

        handlerAccelerometer: function () {
            this.sprite.body.velocity.x = this.velocity;
            if (this.velocity < 0) {
                this.sprite.animations.play('left');
                this.sprite.lookRight = false;
            } else if (this.velocity > 0) {
                this.sprite.animations.play('right');
                this.sprite.lookRight = true;
            } else {
                this.sprite.animations.stop();
                this.sprite.frame = NUM_FRAME_NORMAL;
            }
        },

        filterColor: function (color) {
            this.sprite.color = Color.subFilterColor(this.sprite.color, Color.getColor(color));
            this.firstAddColor = Color.subFilterColor(this.firstAddColor, Color.getColor(color));
            if (this.firstAddColor == this.sprite.color) {
                this.firstAddColor = Color.ColorEnum.BLACK;
            }
            this.secondAddColor = Color.ColorEnum.BLACK;
            this.sprite.loadTexture('player' + this.sprite.color.name);
        },

        freezeGame: function () {
            if (freeze) {
                return;
            }
            freeze = true;
            freezeSaveVelocityX = this.sprite.body.velocity.x;
            freezeSaveVelocityY = this.sprite.body.velocity.y;
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
        },

        relaunchGame: function () {
            if (!freeze) {
                return;
            }
            freeze = false;

            this.sprite.body.velocity.x = freezeSaveVelocityX;
            this.sprite.body.velocity.y = freezeSaveVelocityY;

        }

    }

});

