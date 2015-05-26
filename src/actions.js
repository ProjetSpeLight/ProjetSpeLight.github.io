function updateActions(game) {
    var cursors = game.input.keyboard.createCursorKeys();

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

        player.animations.play('left');
    }
    else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 300;

        player.animations.play('right');
    }
    else {
        //  Stand still
        if (player.body.velocity.x == 0) {
            player.animations.stop();
            player.frame = 4;
        }
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && !pushed) {
        player.body.velocity.y = -600;
        pushed = true;
    }

    if (cursors.up.isUp) {
        pushed = false;
    }
}

function collectStar(player, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}
