/**
 * This module implements the fonctionnalities of the player
 */


define(['phaser', 'app/photon', 'app/phasergame'], function (Phaser, photon, PhaserGame) {


    /// @function initializePlayerAnimations
    /// Initialize the different movements animations
    /// {Phaser.Sprite} the object player itself
    function initializePlayerAnimations(sprite, ColorEnum) {
        for (var color in ColorEnum) {
            var vcolor = ColorEnum[color];
            sprite.animations.add('left' + vcolor.name, [0 + 9 * vcolor.value, 1 + 9 * vcolor.value, 2 + 9 * vcolor.value, 3 + 9 * vcolor.value], 10, true);
            sprite.animations.add('right' + vcolor.name, [5 + 9 * vcolor.value, 6 + 9 * vcolor.value, 7 + 9 * vcolor.value, 8 + 9 * vcolor.value], 10, true);
        }

        // Initialization of an attribute to indicate where the player look at
        sprite.lookRight = true;
    }


    function subAdditiveColorMagenta(color1, color2) {
        return color1.name == 'Red' && color2.name == 'Blue';
    }

    function subAdditiveColorCyan(color1, color2) {
        return color1.name == 'Red' && color2.name == 'Green';
    }

    function subAdditiveColorYellow(color1, color2) {
        return color1.name == 'Blue' && color2.name == 'Green';
    }


    function additiveColor(oldColor, newColor, ColorEnum) {
        if (subAdditiveColorMagenta(oldColor, newColor) || subAdditiveColorMagenta(newColor, oldColor)) {
            return ColorEnum.MAGENTA;
        }

        if (subAdditiveColorCyan(oldColor, newColor) || subAdditiveColorCyan(newColor, oldColor)) {
            return ColorEnum.YELLOW;
        }

        if (subAdditiveColorYellow(oldColor, newColor) || subAdditiveColorYellow(newColor, oldColor)) {
            return ColorEnum.CYAN;
        }

        if ((oldColor.name == 'Magenta' && newColor.name == 'Green') || (oldColor.name == 'Yellow' && newColor.name == 'Blue') || (oldColor.name == 'Cyan' && newColor.name == 'Red')) {
            return ColorEnum.WHITE;
        }

        if (oldColor.name == 'Magenta' || oldColor.name == 'Cyan' || oldColor.name == 'Yellow' || oldColor.name == 'White') {
            return oldColor;
        }

        return newColor;
    }

    return {

        // The object "player" (Phaser.Sprite) is defined and initialized in the main program (game.js).
        sprite: null,
        pushed: false,
        refPhotons: photon,
        moveRight: false,
        moveLeft: false,
        fireActive: false,
        changeColor: false,
        activeJump: false,

        // Declaration of the enumeration representing the color of the player
        ColorEnum: {
            BLACK: { value: 0, name: 'Black', code: 'B' },
            RED: { value: 1, name: 'Red', code: 'R' },
            BLUE: { value: 3, name: 'Blue', code: 'Bl' },
            GREEN: { value: 2, name: 'Green', code: 'G' },
            YELLOW: { value: 4, name: 'Yellow', code: 'Y' },
            CYAN: { value: 5, name: 'Cyan', code: 'C' },
            MAGENTA: { value: 6, name: 'Magenta', code: 'M' },
            WHITE: { value: 7, name: 'White', code: 'W' }
        },

        initializePlayer: function (game, x, y) {
            // The player and its settings            
            this.sprite = PhaserGame.game.add.sprite(x, y, 'dude');

            //  We need to enable physics on the player
            PhaserGame.game.physics.arcade.enable(this.sprite);

            this.sprite.body.bounce.y = 0.0;
            this.sprite.body.gravity.y = 1000;
            PhaserGame.game.camera.follow(this.sprite);
            this.sprite.body.collideWorldBounds = true;


            // Initialization of the player animations
            initializePlayerAnimations(this.sprite, this.ColorEnum);

            // Initialization of an attribute to indicate where the player look at
            this.sprite.lookRight = true;
            this.sprite.color = this.ColorEnum.BLACK;

            // Initialization of the photons
            photon.initPhotons(PhaserGame.game, this);
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
            else {
                //  Stand still
                if (this.sprite.body.velocity.x == 0) {
                    this.sprite.animations.stop();
                    this.sprite.frame = this.sprite.color.value * 9 + 4;
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




        /// @function getColor
        /// Return the object of the enumeration corresponding to the string in argument, null if the string does not represent a color name
        /// @param {String} the color name
        getColor: function (colorName) {
            for (var id in this.ColorEnum) {
                if (this.ColorEnum[id].name == colorName) {
                    return this.ColorEnum[id];
                }
            }
            return null;
        },

        /// @function changePlayerColor
        /// Change the current color of the player (and thus of the photons he throws) to the new one given in argument
        changePlayerColor: function (newColor) {
            var color = this.getColor(newColor);
            if (color == null) {
                return;
            }
            color = additiveColor(this.sprite.color, color, this.ColorEnum);
            if (this.sprite.color != color) {
                this.sprite.color = color;
                this.sprite.frame = this.sprite.color.value * 9 + 4;
                if (this.sprite.color.value >= 1) {
                    photon.photons.setAll('frame', this.sprite.color.value - 1);
                }
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
            this.sprite.animations.play('left' + this.sprite.color.name);
            this.sprite.lookRight = false;
        },

        handlerRight: function () {
            this.sprite.body.velocity.x = 300;
            this.sprite.animations.play('right' + this.sprite.color.name);
            this.sprite.lookRight = true;
        }

    }

});

