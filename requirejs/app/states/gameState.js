define(['phaser', 'app/createLevel', 'app/player', 'app/pause', 'app/phasergame', 'app/touch'], function (Phaser, createLevel, player, pause, PhaserGame, Touch) {

    function GameState(game) {
        score = 0;
        paused = false;
    }

    var stopped = false;

    GameState.prototype = {
        create: function () {
            stopped = false;
            PhaserGame.game.physics.startSystem(Phaser.Physics.ARCADE);
            if (!createLevel('level' + this.currentLevel)) {
                alert('niveau indisponible');
                stopped = true;
                return;
            }


            if (!this.game.device.desktop) {
                Touch.initJoypad();
            }

            scoreText = PhaserGame.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
            scoreText.fixedToCamera = true;
            var button_pause = PhaserGame.game.add.button(700, 20, 'pause', actionClick, this);


            button_pause.name = 'pause';
            button_pause.anchor.setTo(0.5, 0.5);
            button_pause.fixedToCamera = true;

            function actionClick() {
                pause.update_pause();
                //this.update_pause();
                /*button_menu = game.add.button(400, 200, 'RetMenu', returnMenu);
                button_menu.name = 'Returnmenu';
                button_menu.anchor.setTo(0.5, 0.5);
                button_menu.fixedToCamera = true;

                button_restart = game.add.button(400, 300, 'restart', restart);
                button_restart.name = 'restart';
                button_restart.anchor.setTo(0.5, 0.5);
                button_restart.fixedToCamera = true;

                button_resume = game.add.button(400, 400, 'resume', resume);
                button_resume.name = 'resume';
                button_resume.anchor.setTo(0.5, 0.5);
                button_resume.fixedToCamera = true;

                game.physics.arcade.isPaused = true;
                paused = true;         



                function returnMenu() {
                    alert('hangler main');
                    game.paused = false;
                    game.physics.arcade.isPaused = false;
                    game.state.start('MainMenu');
                }

                function resume() {
                    button_menu.destroy();
                    button_restart.destroy();
                    button_resume.destroy();

                    paused = false;
                    game.physics.arcade.isPaused = false;
                }

                function restart() {
                    paused = false;
                    game.physics.arcade.isPaused = false;
                    game.state.start('Game');
                }*/
            }




        },

        /* returnMenu: function () {
             alert('hangler main');
             game.paused = false;
             game.physics.arcade.isPaused = false;
             game.state.start('MainMenu');
         },
 
 
         update_pause: function () {
 
             var returnmenu = false;
             button_menu = game.add.button(400, 200, 'RetMenu', this.returnMenu);
             button_menu.name = 'Returnmenu';
             button_menu.anchor.setTo(0.5, 0.5);
             button_menu.fixedToCamera = true;
 
             button_restart = game.add.button(400, 300, 'restart', restartclick, this);
             button_restart.name = 'restart';
             button_restart.anchor.setTo(0.5, 0.5);
             button_restart.fixedToCamera = true;
 
             button_resume = game.add.button(400, 400, 'resume', resumeclick, this);
             button_resume.name = 'resume';
             button_resume.anchor.setTo(0.5, 0.5);
             button_resume.fixedToCamera = true;
 
             game.physics.arcade.isPaused = true;
             game.paused = true;
 
             function resumeclick() {
                 resume(game);
             }
 
 
             function restartclick() {
                 restart(game);
             }
 
 
 
             function resume(game) {
                 button_menu.destroy();
                 button_restart.destroy();
                 button_resume.destroy();
 
                 game.paused = false;
                 game.physics.arcade.isPaused = false;
             }
 
             function restart(game) {
                 game.paused = false;
                 game.physics.arcade.isPaused = false;
                 game.state.start('Game');
             }
 
 
         },*/

        update: function () {

            if (stopped) {
                PhaserGame.game.state.start('MainMenu');
                return;
            }


            if (!pause.is_paused) {

                PhaserGame.game.physics.arcade.collide(player.sprite, platforms);
                PhaserGame.game.physics.arcade.collide(player.sprite, movingPlatforms);
                PhaserGame.game.physics.arcade.overlap(player.sprite, coins, collectCoin, null, this);
                PhaserGame.game.physics.arcade.collide(player.sprite, colourPlatforms, makeColor, null, this);
                PhaserGame.game.physics.arcade.collide(ends, platforms);
                PhaserGame.game.physics.arcade.collide(ends, colourPlatforms);
                PhaserGame.game.physics.arcade.collide(ends, movingPlatforms);
                PhaserGame.game.physics.arcade.overlap(player.sprite, ends, finish, null, this);

                function photonRedirection(photon, ends) {
                    photon.body.velocity.y = 200;;
                }
                PhaserGame.game.physics.arcade.overlap(player.refPhotons.photons, ends, photonRedirection);


                var cursors = PhaserGame.game.input.keyboard.createCursorKeys();
                player.updatePositionPlayer(cursors);

                // TEMP : Change of colour (by space key)
                //var keyboard = this.input.keyboard;
                //updateColorPlayer(player, keyboard, this);


                // We restart the game when "R" is pushed
                if (PhaserGame.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                    score = 0;
                    this.create();
                    PhaserGame.game.state.start('Game');
                }

                // We restart the game when the character falls of the map
                if (player.sprite.body.y > PhaserGame.game.world.height - 64) {
                    score = 0;
                    this.create();
                    PhaserGame.game.state.start('Game');
                }

                // Mort du personnage quand coincé entre deux plateformes
                if ((player.sprite.body.touching.down && player.sprite.body.touching.up) || (player.sprite.body.touching.right && player.sprite.body.touching.left)) {
                    score = 0;
                    this.create();
                    PhaserGame.game.state.start('Game');
                }


                // we stop the game when "ESC" is pushed 
                if (PhaserGame.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                    pause.update_pause();
                }


                //Déplacement des plateformes
                platforms.forEach(function (element) {
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

                //Déplacement des plateformes
                colourPlatforms.forEach(function (element) {
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


                function makeColor(sprite, colorplatform) {

                    // Oblige le joueur à etre au dessus 
                    //de la plateforme coloree pour changer de couleur
                    if (sprite.body.touching.down) {

                        // Oblige le joueur à appuyer 
                        //sur la touche du bas pour changer de couleur
                        if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN) || player.changeColor) {
                            player.changePlayerColor(colorplatform.color);
                        }

                    }
                }

                function collectCoin(player, coin) {

                    // Removes the star from the screen
                    coin.kill();

                    //  Add and update the score
                    score += 10;
                    scoreText.text = 'Score: ' + score;

                }


                function finish(player, diamond) {
                    PhaserGame.game.state.start('FinishLevel');
                }

            }
        },

        render: function () { },


    };

    return GameState;
});
