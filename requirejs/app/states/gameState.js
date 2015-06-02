
define(['phaser', 'app/createLevel', 'app/player', 'app/pause', 'app/photon', 'app/phasergame', 'app/touch', 'app/objects/platforms', 'app/objects/coin', 'app/objects/pique', 'app/objects/ennemi', 'app/objects/time', 'app/objects/objectsManager'], function (Phaser, createLevel, player, pause, photon, PhaserGame, Touch, platforms, coinObject, piqueObject, ennemiObject, time, objectsManager) {

    function GameState(game) { }

    // Boolean used to stopped the game where the level can not be loaded
    var stopped = false;

    // Variable used to count a second
    var compt = 0;

    // Object displaying the score
    var scoreText;


    GameState.prototype = {
        preload: function () {
            if (this.currentLevel === 0) {
                if (!PhaserGame.game.cache.checkJSONKey('level0')) {
                    this.load.json('level0', 'http://projetspelight.github.io/assets/levels/Tutoriel.json');
                }
            } else {
                if (!PhaserGame.game.cache.checkJSONKey('level' + this.currentLevel)) {
                    this.load.json('level' + this.currentLevel, 'http://projetspelight.github.io/assets/levels/Level' + this.currentLevel + '.json');
                }
            }
        },

        create: function () {
            // First we initialize the scope variables
            stopped = false;
            coinObject.score = 0;
            compt = 0;


            // Initialization of the physics motor
            PhaserGame.game.physics.startSystem(Phaser.Physics.ARCADE);
            PhaserGame.game.physics.startSystem(Phaser.Physics.P2);


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

            // Initialization of the bject displaying the score
            scoreText = PhaserGame.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
            scoreText.fixedToCamera = true;


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

            function processColor(sprite, colorplatform) {
                if (colorplatform.color == "") {
                    if (!this.game.device.desktop) {
                        Touch.killChangeColorButton();
                    }
                    return false;
                } else {
                    if (!this.game.device.desktop) {
                        Touch.showChangeColorButton();
                    }
                    return true;
                }
            }


            function finish(player, diamond) {
                PhaserGame.game.state.start('FinishLevel');
            }

            // If the level had not been loaded, we return to the main lmenu
            if (stopped) {
                PhaserGame.game.state.start('MainMenu');
                return;
            }

            if (!PhaserGame.game.paused) {

                // Update of the timer
                compt++;
                if (compt == 60) {
                    compt = 0;
                    time.updateTime();
                }


                // Update of the score
                scoreText.text = 'Score: ' + coinObject.score;


                // Update of the objects
                PhaserGame.game.physics.arcade.collide(player.sprite, platforms.group, makeColor, processColor, this);
                
                PhaserGame.game.physics.arcade.collide(player.sprite, platforms.group);

                PhaserGame.game.physics.arcade.collide(ends, platforms.group);
                PhaserGame.game.physics.arcade.overlap(player.sprite, ends, finish, null, this);

                objectsManager.updateObjects();
                coinObject.updateObject();
                piqueObject.updateObject();
                ennemiObject.updateObject();

                player.updatePlayer();





                // We restart the game when "R" is pushed
                if (PhaserGame.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
                    coinObject.score = 0;
                    PhaserGame.game.state.start('RestartGame');
                }

                // We restart the game when the character falls of the map
                if (player.sprite.body.y > PhaserGame.game.world.height - 64) {
                    coinObject.score = 0;
                    PhaserGame.game.state.start('RestartGame');
                }

                // Mort du personnage quand coincé entre deux plateformes
                if ((player.sprite.body.touching.down && player.sprite.body.touching.up) || (player.sprite.body.touching.right && player.sprite.body.touching.left)) {
                    coinObject.score = 0;

                    if (!PhaserGame.game.device.desktop) {
                        Touch.stop();
                    }
                    PhaserGame.game.state.start('RestartGame');
                }

                // we stop the game when "ESC" is pushed 
                if (PhaserGame.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                    if (!PhaserGame.game.paused) {
                        pause.gamePaused();
                    }
                }

                if (PhaserGame.game.input.activePointer.isDown &&
                    PhaserGame.game.input.y < 34 &&
                    PhaserGame.game.input.y > 5 &&
                    (PhaserGame.game.input.x > (PhaserGame.game.camera.width - 86)) &&
                    (PhaserGame.game.input.x < (PhaserGame.game.camera.width - 12))) {
                    pause.gamePaused();
                }
            }
        },

        render: function () {
            /*PhaserGame.game.debug.body(player.sprite);
            for (var i = 0 ; i < piqueObject.group.length ; i++) {
                PhaserGame.game.debug.body(piqueObject.group.children[i]);
            }*/
            /*for (var i = 0 ; i < objectsManager.EnumModule.MIRROR.refGroup.children.length ; i++) {
                PhaserGame.game.debug.body(objectsManager.EnumModule.MIRROR.refGroup.children[i]);
            }*/
        },


    };

    return GameState;
});
