/**
 * This module implements the fonctionnalities of the player
 */

// The object "player" (Phaser.Sprite) is defined and initialized in the main program (game.js).

// Declaration of the enumeration representing the color of the player
var ColorEnum = {
    BLACK: { value: 3, name: 'Black', code: 'B' },
    RED: { value: 2, name: 'Red', code: 'R' },
    BLUE: { value: 1, name: 'Blue', code: 'Bl' },
    GREEN: { value: 0, name: 'Green', code: 'G' },
    YELLOW: { value: 4, name: 'Yellow', code: 'Y' },
    CYAN: { value: 5, name: 'Cyan', code: 'C' },
    MAGENTA: { value: 6, name: 'Magenta', code: 'M' },
    WHITE: { value: 7, name: 'White', code: 'W' }
}


/// @function initializePlayerAnimations
/// Initialize the different movements animations
/// {Phaser.Sprite} the object player itself
function initializePlayerAnimations(player) {
    for (var color in ColorEnum) {
        var vcolor = ColorEnum[color];
        player.animations.add('left' + vcolor.name, [0 + 9 * vcolor.value, 1 + 9 * vcolor.value, 2 + 9 * vcolor.value, 3 + 9 * vcolor.value], 10, true);
        player.animations.add('right' + vcolor.name, [5 + 9 * vcolor.value, 6 + 9 * vcolor.value, 7 + 9 * vcolor.value, 8 + 9 * vcolor.value], 10, true);
    }

    // Initialization of an attribute to indicate where the player look at
    player.lookRight = true;
}

/// @function updatePositionPlayer
/// Move the player when the game is updated
/// @param {Phaser.Sprite} the object player itself
/// @param {Object} object containing a Phaser.Key object for each directional arrows keys
function updatePositionPlayer(player, cursors) {

    //  Reset the players velocity (movement)
    if (player.body.velocity.x > 10 && !player.body.touching.down) {
        player.body.velocity.x -= 5;
    } else if (player.body.velocity.x < -10 && !player.body.touching.down) {
        player.body.velocity.x += 5;
    } else {
        player.body.velocity.x = 0;
    }

    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -300;
        player.animations.play('left' + player.color.name);
        player.lookRight = false;
    }
    else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 300;
        player.animations.play('right' + player.color.name);
        player.lookRight = true;
    }
    else {
        //  Stand still
        if (player.body.velocity.x == 0) {
            player.animations.stop();
            player.frame = player.color.value * 9 + 4;
        }
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown) {
        jump();
    }

    if (cursors.up.isUp) {
        pushed = false;
    }

}


/// @function updateColorPlayer
/// Change the color of the player according to the value in argument
/// @param {Phaser.Sprite} the object player itself
/// @param {Phaser.Keyboard} an object representing the keyboard
function updateColorPlayer(player, keyboard, game) {
    var key = keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    if (key.onDown) {
        key.onDown.removeAll();
        var sig = key.onUp.add(testChangeColor);
        // sig.execute([player, key]);

    }

    //  Firing?
    if (fireButton.isDown) {
        firePhoton(game);
    }
}


function testChangeColor() {
    var pcolor = player.color.value;
    if (pcolor == 0) {
        player.color = ColorEnum.BLUE;
        player.frame = player.color.value * 9 + 4;
    } else if (pcolor == 1) {
        player.color = ColorEnum.RED;
        player.frame = player.color.value * 9 + 4;
    }

    else {
        player.color = ColorEnum.GREEN;
        player.frame = player.color.value * 9 + 4;
    }
}

/// @function getColor
/// Return the object of the enumeration corresponding to the string in argument, null if the string does not represent a color name
/// @param {String} the color name
function getColor(colorName) {

    for (var id in ColorEnum) {
        if (ColorEnum[id].name == colorName) {
            return ColorEnum[id];
        }
    }
    return null;
}

/// @function changePlayerColor
/// Change the current color of the player (and thus of the photons he throws) to the new one given in argument
function changePlayerColor(newColor, player) {
    var color = getColor(newColor);
    if (player.color != color) {
        player.color = color;
        player.frame = player.color.value * 9 + 4;
        photons.setAll('frame', player.color.value);
    }
}

function jump() {
    if (player.body.touching.down && !pushed) {
        player.body.velocity.y = -600;
        pushed = true;
    }
}



