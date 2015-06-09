/**
 * This module implements the functions that create and animate platforms
 */

define(['phaser', 'app/phasergame', 'app/player', 'app/touch'], function (Phaser, PhaserGame, player, Touch) {

    /// @function setParameters
    /// Create and initialize a platforms with default value or specified ones stored in the argument
    /// @param {Object} a JSON object that contains the informations for the initialisation of the platform
    function setParameters(platformData, platforms) {

        // We get the differents attributes from the JSON file

        // Attribute color
        var color = platformData.color;
        if (color == null)
            // default value. (the platform has no color)
            color = "";

        // Attribute skin
        var skin = platformData.skin;
        if (skin == null)
            // default value.
            skin = "platform";

        // Attribute immovable
        var immovable = platformData.immovable;
        if (immovable == null) {
            // default value. (the platform does not collapse)
            immovable = true;
        }

        // Attribute id
        var id = platformData.id;
        if (id == null) {
            id = -1;
        }

        var platform;
        if (platformData.position == null)
            platform = platforms.create(platformData.positions[0].x, platformData.positions[0].y, skin + color);
        else
            platform = platforms.create(platformData.position.x, platformData.position.y, skin + color);

        // We set the attributes
        platform.color = color;
        platform.body.immovable = immovable;
        platform.body.allowGravity = false;
        platform.id = id;
        platform.objectType = 'platform';

        var size = platformData.size;
        if (size != null) {
            if (size.x == null)
                size.x = 1;
            if (size.y == null)
                size.y = 1;
            platform.scale.setTo(size.x, size.y);
        } else {
            // default value. (the platform has the side given by it's skin)
            platform.scale.setTo(1, 1);
        }

        // if the platform is set as crossable the player can jump through it from beow and cross it from side to side
        if (platformData.crossable == true) {
            platform.body.checkCollision.up = true;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;
            platform.body.checkCollision.down = false;
        } else {
            platform.body.checkCollision.up = true;
            platform.body.checkCollision.left = true;
            platform.body.checkCollision.right = true;
            platform.body.checkCollision.down = true;
        }

        return platform;
    }



    /// @function createStillPlatforms
    /// Create and initialize all stillPlatforms (platforms with no movement)
    /// @param {Object} the JSON object used to store the current level's informations
    function createStillPlatforms(levelData, platforms) {
        var dataPlatforms = levelData.platforms;
        if (dataPlatforms != null)
            for (var i = 0 ; i < dataPlatforms.length ; i++) {
                var platformData = dataPlatforms[i];
                var platform = setParameters(platformData, platforms);
            }

    }

    /// @function createBackAndForthPlatforms
    /// Create and initialize all backAndForthPlatforms (platforms with a movement that repeats in the opposite direction when it's done) and make a list of all these platforms to make the update of those platform's movement easier
    /// @param {Object} the JSON object used to store the current level's informations
    function createBackAndForthPlatforms(levelData, platforms) {
        var dataPlatforms = levelData.backAndForthPlatforms;
        this.backAndForthPlatforms = new Array();
        if (dataPlatforms != null) {
            for (var i = 0 ; i < dataPlatforms.length ; i++) {
                var platformData = dataPlatforms[i];
                var platform = setParameters(platformData, platforms);
                platform.positions = platformData.positions;
                platform.increment = 1;
                platform.current = 0;
                platform.body.velocity.x = platformData.positions[0].speed.x;
                platform.body.velocity.y = platformData.positions[0].speed.y;
                this.backAndForthPlatforms.push(platform);
            }
        }
    }

    /// @function createLoopingPlatforms
    /// Create and initialize all loopingPlatforms (platforms with a movement that repeats) and make a list of all these platforms to make the update of those platform's movement easier
    /// @param {Object} the JSON object used to store the current level's informations
    function createLoopingPlatforms(levelData, platforms) {
        var dataPlatforms = levelData.loopingPlatforms;
        this.loopingPlatforms = new Array();
        if (dataPlatforms != null) {
            for (var i = 0 ; i < dataPlatforms.length ; i++) {
                var platformData = dataPlatforms[i];
                var platform = setParameters(platformData, platforms);
                platform.positions = platformData.positions;
                platform.current = 0;
                platform.body.velocity.x = platformData.positions[0].speed.x;
                platform.body.velocity.y = platformData.positions[0].speed.y;
                this.loopingPlatforms.push(platform);
            }
        }
    }

    /// @function makeColor
    /// If the player is on a colored platform and is pressing the down key it will call the changing color method of the player
    function makeColor(sprite, colorPlatform) {
        // Oblige le joueur à etre au dessus 
        //de la plateforme coloree pour changer de couleur
        if (playerRidingPlatform(colorPlatform)) {
            // Oblige le joueur à appuyer 
            //sur la touche du bas pour changer de couleur
            if (PhaserGame.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || player.changeColor) {
                player.changePlayerColor(colorPlatform.color);
            }
        }
    }

    function processColor(sprite, colorplatform) {
        if (colorplatform.color == "") {
            if (!PhaserGame.game.device.desktop) {
                Touch.killChangeColorButton();
            }
            return false;
        } else {
            if (!PhaserGame.game.device.desktop) {
                Touch.showChangeColorButton();
            }
            return true;
        }
    }

    /// @function isNear
    /// Create and initialize all loopingPlatforms (platforms with a movement that repeats) and make a list of all these platforms to make the update of those platform's movement easier
    /// @param {Object} the JSON object used to store the current level's informations
    function isNear(x, y, w, z, epsillon) {
        var d = (x - w) * (x - w) + (y - z) * (y - z);
        return (d <= epsillon);
    }

    /// @function updateLoopingPlatforms
    /// Go through the list of looping platforms and update their speed if needs to be
    function updateLoopingPlatforms() {
        this.loopingPlatforms.forEach(function (element) {
            var next = element.positions[(element.current + 1) % (element.positions.length)];
            // When the platform reaches one of the spot it is rerouted to the next one 
            if (isNear(element.body.x, element.body.y, next.x, next.y, 1)) {
                element.current = (element.current + 1) % (element.positions.length);
                element.body.velocity.x = element.positions[element.current].speed.x;
                element.body.velocity.y = element.positions[element.current].speed.y;
                if (playerRidingPlatform(element))
                    setPlayerSpeed(player.sprite, element);
            }
        })
    }

    /// @function updateBackAndForthPlatforms
    /// Go through the list of back and forth platforms and update their speed if needs to be
    function updateBackAndForthPlatforms() {
        this.backAndForthPlatforms.forEach(function (element) {
            // When the platform reaches one of the spot it is rerouted to the next one 
            var next = element.positions[(element.current + element.increment)];
            if (isNear(element.body.x, element.body.y, next.x, next.y, 1)) {
                if (element.increment == 1) {
                    element.current = element.current + element.increment;
                    if (element.current == element.positions.length - 1) {
                        element.increment = -1;
                        element.body.velocity.x = -element.positions[element.current - 1].speed.x;
                        element.body.velocity.y = -element.positions[element.current - 1].speed.y;
                    } else {
                        element.body.velocity.x = element.positions[element.current].speed.x;
                        element.body.velocity.y = element.positions[element.current].speed.y;
                    }
                    if (playerRidingPlatform(element))
                        setPlayerSpeed(player.sprite, element);
                } else {
                    element.current = element.current + element.increment;
                    if (element.current == 0) {
                        element.increment = 1;
                        element.body.velocity.x = element.positions[element.current].speed.x;
                        element.body.velocity.y = element.positions[element.current].speed.y;
                    } else {
                        element.body.velocity.x = -element.positions[element.current - 1].speed.x;
                        element.body.velocity.y = -element.positions[element.current - 1].speed.y;
                    }
                    if (playerRidingPlatform(element))
                        setPlayerSpeed(player.sprite, element);
                }
            }
        })
    }

    function playerRidingPlatform(platform) {
        var bool = player.sprite.body.y < platform.body.y;
        bool = bool && player.sprite.body.x > platform.body.x - player.sprite.body.width && player.sprite.body.x < platform.body.x + platform.body.width + player.sprite.body.width;
        bool = bool && platform.body.touching.up && player.sprite.body.touching.down;
        return bool;
    }

    function setPlayerSpeed(sprite, platform) {
        sprite.body.velocity.y = platform.body.velocity.y;
    }


    return {

        // Both of the array are used to store a certain number of platforms in order to optimize the updating of moving platforms
        backAndForthPlatforms: new Array(),
        loopingPlatforms: new Array(),

        group: null,

        /// @function preloadObjectImage
        /// Preloads the different images / spritesheets used by this module
        preloadObjectsImages: function () {
            PhaserGame.game.load.image('platform', 'assets/platform.png');
            PhaserGame.game.load.image('platformRed', 'assets/platform_Rouge.png');
            PhaserGame.game.load.image('platformBlue', 'assets/platform_Bleu.png');
            PhaserGame.game.load.image('platformGreen', 'assets/platform_Vert.png');
            // PhaserGame.game.load.image('groundYellow', 'assets/platform_Jaune.png');
        },

        // Create all the object of type platform
        createObjectsGroup: function (levelData, Manager) {
            this.group = PhaserGame.game.add.physicsGroup();
            
            // Intialization of the group in the manager
            Manager.EnumModule.PLATFORM.refGroup = this.group;
            createStillPlatforms(levelData, this.group);
            createBackAndForthPlatforms(levelData, this.group);
            createLoopingPlatforms(levelData, this.group);
        },

        // Update the movement of moving platforms
        updateObjects: function () {
            PhaserGame.game.physics.arcade.overlap(player.refPhotons.photons, this.group, player.refPhotons.killPhoton);
            PhaserGame.game.physics.arcade.collide(player.sprite, this.group, makeColor, processColor, PhaserGame);
            PhaserGame.game.physics.arcade.collide(player.sprite, this.group);
            updateLoopingPlatforms();
            updateBackAndForthPlatforms();
        },



    }
});
