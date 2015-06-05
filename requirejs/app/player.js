define(['phaser', 'app/photon', 'app/phasergame', 'app/color'], function (Phaser, photon, PhaserGame, Color) {


    /// @function initializePlayerAnimations
    /// Initialize the different movements animations
    /// {Phaser.Sprite} the object player itself
    function initializePlayerAnimations(sprite, ColorEnum) {
        for (var color in ColorEnum) {
            var vcolor = ColorEnum[color];
            //var pcolor = ColorEnum[previousColor];
            sprite.animations.add('left' + vcolor.name, [0 + 9 * vcolor.value, 1 + 9 * vcolor.value, 2 + 9 * vcolor.value, 3 + 9 * vcolor.value], 8, true);
            sprite.animations.add('right' + vcolor.name, [5 + 9 * vcolor.value, 6 + 9 * vcolor.value, 7 + 9 * vcolor.value, 8 + 9 * vcolor.value], 8, true);

            for (var ncolor in ColorEnum) {
                // animation when the character loses a color

                var pcolor = ColorEnum[ncolor];
                sprite.animations.add('deathLeft' + vcolor.name + pcolor.name, [0 + 9 * vcolor.value, 1 + 9 * pcolor.value, 2 + 9 * vcolor.value, 3 + 9 * pcolor.value], 8, true);
                sprite.animations.add('deathRight' + vcolor.name + pcolor.name, [5 + 9 * vcolor.value, 6 + 9 * pcolor.value, 7 + 9 * vcolor.value, 8 + 9 * pcolor.value], 8, true);
                sprite.animations.add('deathStandingStill' + vcolor.name + pcolor.name, [4 + 9 * vcolor.value, 4 + 9 * pcolor.value], 8, true);
            }
        }

        // Initialization of an attribute to indicate where the player look at
        sprite.lookRight = true;
        sprite.invincible = false;
    }

    return {

        // The object "player" (Phaser.Sprite) is defined and initialized in the main program (game.js).
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
        numberColor: 0,
        previousColor: Color.ColorEnum.BLACK,

        kill: function () {

            if (!this.sprite.invincible){
 
                //check if the player has a color or not
                if (this.sprite.color.value != 0) {
                    //he has a color so we remove the last color
                    this.timeInvincible=1;
                    this.removePlayerColor();
                } else {
                    PhaserGame.score = 0;
                    //he hasn't so we restart the game
                    PhaserGame.game.state.start('RestartGame');
                }
            }
        },

        initializePlayer: function (game, x, y) {
            // The player and its settings            
            this.sprite = PhaserGame.game.add.sprite(x, y, 'dude');
            this.sprite.scale = new Phaser.Point(0.6, 0.6);
            

            //  We need to enable physics on the player
            PhaserGame.game.physics.arcade.enable(this.sprite);

            this.sprite.body.bounce.y = 0.0;
            this.sprite.body.gravity.y = 1000;
            PhaserGame.game.camera.follow(this.sprite);
            this.sprite.body.collideWorldBounds = true;
            this.sprite.anchor = new Phaser.Point(0.5, 0.5);
            this.sprite.body.setSize(56, 100);



            // Initialization of the player animations
            initializePlayerAnimations(this.sprite, Color.ColorEnum);

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
                if (this.sprite.body.velocity.x == 0) {
                    //If invincible, we create a animation to display the color lost 
                    if (this.sprite.invincible) {
                        this.sprite.animations.play('deathStandingStill' + this.sprite.color.name + this.previousColor.name);
                    } else {
                        this.sprite.animations.stop();
                        this.sprite.frame = this.sprite.color.value * 9 + 4;
                    }
                }
            }

            //  Allow the player to jump if they are touching the ground.
            if (cursors.up.isDown || this.activeJump) {
                this.jump();
            }

            if (cursors.up.isUp) {
                this.pushed = false;
            }


            //  Firing?
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
            
            this.updatePositionPlayer(cursors);

            // Finally, we check if the player has to change of color
            /*if (sprite.body.touching.down) {
                if (cursors.down.isDown || this.changeColor)
                alert('jm');
            }*/
            
             
            
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
            if (this.sprite.invincible) {
                // alert('death meft');
                this.sprite.animations.play('deathLeft' + this.sprite.color.name + this.previousColor.name);
            } else {
                this.sprite.animations.play('left' + this.sprite.color.name);
            }
            this.sprite.lookRight = false;
        },

        handlerRight: function () {
            this.sprite.body.velocity.x = 300;
            if (this.sprite.invincible) {
                this.sprite.animations.play('deathRight' + this.sprite.color.name + this.previousColor.name);
            } else {
                this.sprite.animations.play('right' + this.sprite.color.name);
            }
            this.sprite.lookRight = true;
        },

        handlerAccelerometer: function () {
            /*this.sprite.body.velocity.x = this.velocity;
            if (this.velocity < 0) {
                this.sprite.animations.play('left' + this.sprite.color.name);
                this.sprite.lookRight = false;
            } else if (this.velocity > 0){
                this.sprite.animations.play('right' + this.sprite.color.name);
                this.sprite.lookRight = true;
            } else {
                this.sprite.animations.stop();
                this.sprite.frame = this.sprite.color.value * 9 + 4;
            }*/
            this.sprite.body.velocity.x = this.velocity;
            if (this.velocity < 0) {
                this.sprite.animations.play('left' + this.sprite.color.name);
                this.sprite.lookRight = false;
            } else if (this.velocity > 0) {
                this.sprite.animations.play('right' + this.sprite.color.name);
                this.sprite.lookRight = true;
            } else {
                this.sprite.animations.stop();
                this.sprite.frame = this.sprite.color.value * 9 + 4;
            }
        },



        /// @function animationDeath
        /// Movement the character does when he is wounded
        animationDeath: function () {
            /*
            // if the character is moving
            // to the left
            if (!this.lookRight) {
                this.sprite.body.velocity.x = 300;
                this.sprite.body.velocity.y = -400;
                this.sprite.animations.play('right' + this.sprite.color.name);
                // to the right
            } else {
                this.sprite.body.velocity.x = -300;
                this.sprite.body.velocity.y = -400;
                this.sprite.animations.play('left' + this.sprite.color.name);
            } */

            if (this.lookRight) {
                this.sprite.animations.play('deathRight' + this.sprite.color.name + this.firstAddColor.name);
            } else if (!this.lookRight) {
                this.sprite.animations.play('deathLeft' + this.sprite.color.name + this.firstAddColor.name);
            }
            wounded = true;
        },


        filterColor: function (color) {
            this.sprite.color = Color.subFilterColor(this.sprite.color, Color.getColor(color));
            this.firstAddColor = Color.subFilterColor(this.firstAddColor, Color.getColor(color));
            if (this.firstAddColor == this.sprite.color) {
                this.firstAddColor = Color.ColorEnum.BLACK;
            }
            this.secondAddColor = Color.ColorEnum.BLACK;


        }

    }

});

