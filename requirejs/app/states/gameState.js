
define(['phaser', 'app/createLevel', 'app/player', 'app/pause', 'app/phasergame', 'app/touch', 'app/objects/time', 'app/objects/objectsManager', 'app/music', 'app/objects/switch'], function (Phaser, createLevel, player, pause, PhaserGame, Touch, time, objectsManager, musicObject, moduleSwitch) {

    function GameState(game) { }

    // Boolean used to stopped the game where the level can not be loaded
    var stopped = false;

    // Object displaying the score
    var scoreText;

    var adresse_json = "http://localhost:4200/assets/levels/";
    //var adresse_json = "http://projetspelight.github.io/assets/levels/";


    GameState.prototype = {
        /// @function preload
        /// Preloads the current level if it has not been done before
        preload: function () {
            // We check if the level requested is the tutorial because the file name is different
            if (this.currentLevel === 0) {
                if (!PhaserGame.game.cache.checkJSONKey('level0')) {
                    this.load.json('level0', adresse_json + 'Tutoriel.json');
                }
            } else {
                if (!PhaserGame.game.cache.checkJSONKey('level' + this.currentLevel)) {
                    this.load.json('level' + this.currentLevel, adresse_json + 'Level' + this.currentLevel + '.json');
                }
            }
        },

        create: function () {
            // First we initialize the scope variables
            stopped = false;

            // Initialization of the score
            PhaserGame.score = 0;

            // Initialize the variable which indicate if the player has lost
            PhaserGame.dead = false;

            // Initialize the booleans used to display animation when a switch is hitten
            PhaserGame.freezeGame = false;
            PhaserGame.relaunchGame = false;


            // Initialization of the physics motor
            PhaserGame.game.physics.startSystem(Phaser.Physics.ARCADE);

            // We load the level
            if (!createLevel.createLevel('level' + this.currentLevel)) {
                // If we failed to load the level, we stop the game and return to the main menu
                alert('Niveau ' + this.currentLevel + ' indisponible');
                stopped = true;
                return;
            }

            // Initialization of the controls for mobile
            if (!PhaserGame.game.device.desktop) {
                Touch.init();
            }

            // Initialization of the label displaying the score
            scoreText = PhaserGame.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });
            scoreText.fixedToCamera = true;

            musicObject.create();
            
            // Initialization of the pause button
            var button_pause = PhaserGame.game.add.sprite(750, 20, 'pause');
            button_pause.inputEnabled = true;
            button_pause.name = 'pause';
            button_pause.anchor.setTo(0.5, 0.5);
            button_pause.fixedToCamera = true;
            
            // Signal binding for the pause mode
            PhaserGame.game.input.onDown.add(pause.unpause, self);
            
        
        },

        update: function () {

            // If the level had not been loaded, we return to the main menu
            if (stopped) {
                PhaserGame.game.state.start('MainMenu');
                return;
            }

            /********** Animation to show the action of a switch **************/

            // If the game is on the freeze (i.e. the camera is moving on its own)
            if (PhaserGame.freezeGame) {
                // First, we freeze the game if it is the first time (the functions will idle if the game has already been freezed)
                objectsManager.freezeGame(PhaserGame.handlerSwitchObj.onArgs.target);
                player.freezeGame();
                // Then, we check if the object is on the screen by doing the intersection between the camera and the object itself
                var cameraView = PhaserGame.game.camera.view;
                var contains = Phaser.Rectangle.containsRect(PhaserGame.rectObj, cameraView);
                if (contains) {
                    // If the object is on the screen, we trigger the action associated to the switch and pass to the relaunch state
                    moduleSwitch.triggerAction(PhaserGame.handlerSwitchObj);
                    PhaserGame.freezeGame = false;
                    PhaserGame.relaunchGame = true;
                    PhaserGame.countRelaunch = 0;
                } else {
                    // If not, we move the camera toward the object
                    if (cameraView.x > PhaserGame.rectObj.x) {
                        PhaserGame.game.camera.view.x -= 4;
                    } else if (cameraView.x < PhaserGame.rectObj.x) {
                        PhaserGame.game.camera.view.x += 4;
                    }

                    if (cameraView.y > PhaserGame.rectObj.y) {
                        PhaserGame.game.camera.view.y -= 4;
                    } else if (cameraView.y < PhaserGame.rectObj.y) {
                        PhaserGame.game.camera.view.y += 4;
                    }
                }
            }

            // If the game is in the relaunch state (i.e. the camera has been moved and the action triggered, we just wait a little and replace the camera)
            if (PhaserGame.relaunchGame) {
                // We wait a little
                PhaserGame.countRelaunch++;
                if (PhaserGame.countRelaunch == 60) {
                    // We have waited enough
                    PhaserGame.relaunchGame = false;
                    // We relaunch the game
                    objectsManager.relaunchGame();
                    player.relaunchGame();
                    // We replace the camera
                    PhaserGame.game.camera.follow(player.sprite);
                }
            }


            /************** Animation for the death of the player ***************/
            if (PhaserGame.dead) {

                player.sprite.animations.play('finalDeath', 10);


                if (player.sprite.timePreAnimationDeath > 0) {
                    player.sprite.timePreAnimationDeath--;
                    return;
                }

                if (player.sprite.timePreAnimationDeath == 0) {
                    player.sprite.timePreAnimationDeath--;
                    player.sprite.body.velocity.y = -300;
                    return;
                }

                if (player.sprite.body.y <= player.jumpMinY) {
                    player.sprite.body.velocity.y *= -1;
                }

                if (player.sprite.body.y > player.maxY) {
                    PhaserGame.game.state.start('Dead');
                }
                return;
            }




            if (!PhaserGame.game.paused) {

                // Update of the timer
                time.updateTime();

                // Update of the score
                scoreText.text = 'Score: ' + PhaserGame.score;

                musicObject.update();

                Touch.update();

                objectsManager.updateObjects();

                if (!PhaserGame.relaunchGame && !PhaserGame.freezeGame)
                    player.updatePlayer();




                /*********** Events ***********/

                // We restart the game when "R" is pushed
                if (PhaserGame.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                    PhaserGame.game.state.start('RestartGame');
                }
                
                // We stop the music when "D" is pushed
                if (PhaserGame.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                        musicObject.music.stop();
                        musicObject.pause= true;
                }
                
                // We restart the music when "D" is pushed
                if (PhaserGame.game.input.keyboard.isDown(Phaser.Keyboard.U)) {
                    if (!musicObject.music.isPlaying) {
                        musicObject.music.play();
                        musicObject.pause=false;
                    }
                }


                // We stop the game when "ESC" is pushed 
                if (PhaserGame.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                    if (!PhaserGame.game.paused) {
                        pause.gamePaused();
                    }
                }

                // We pause if the gamer has clicked on the pause button
                if (PhaserGame.game.input.activePointer.isDown &&
                    PhaserGame.game.input.y < 34 &&
                    PhaserGame.game.input.y > 5 &&
                    (PhaserGame.game.input.x > (PhaserGame.game.camera.width - 86)) &&
                    (PhaserGame.game.input.x < (PhaserGame.game.camera.width - 12))) {
                    pause.gamePaused();
                }

                /*********** Death ***********/

                // We restart the game when the character falls of the map
                if (player.sprite.body.y > PhaserGame.game.world.height - 64) {
                    PhaserGame.game.state.start('Dead');
                }

                // Mort du personnage quand coincé entre deux plateformes
                if ((player.sprite.body.touching.down && player.sprite.body.touching.up) || (player.sprite.body.touching.right && player.sprite.body.touching.left)) {
                    if (!PhaserGame.game.device.desktop) {
                        Touch.stop();
                    }
                    player.kill();
                }


            }
        },

        render: function () {
            //this.game.debug.cameraInfo(this.game.camera, 32, 32);
            //PhaserGame.game.debug.body(player.sprite);
            /*for (var i = 0 ; i < piqueObject.group.length ; i++) {
                PhaserGame.game.debug.body(piqueObject.group.children[i]);
            }*/

            /* for (var i = 0 ; i < objectsManager.EnumModule.MIRROR.refGroup.children.length ; i++) {
                 PhaserGame.game.debug.body(objectsManager.EnumModule.MIRROR.refGroup.children[i]);
             }*/
            /*for (var i = 0 ; i < objectsManager.EnumModule.PLATFORM.refGroup.children.length ; i++) {
                var child = objectsManager.EnumModule.PLATFORM.refGroup.children[i];
                if (child.spriteColor != null) {
                    PhaserGame.game.debug.spriteInfo(child.spriteColor, 30, 100*i);
                }
            }*/
            

           /* for (var i = 0 ; i < objectsManager.EnumModule.BUTTON.refGroup.children.length ; i++) {
                PhaserGame.game.debug.body(objectsManager.EnumModule.BUTTON.refGroup.children[i]);
            }*/
            //PhaserGame.game.debug.spriteInfo(player.sprite, 32, 32);
            //PhaserGame.game.debug.body(player.sprite);
        },


    };

    return GameState;
});
