/**
 * This module implements the functions that create and animate platforms
 */

define(['phaser', 'app/phasergame'], function (Phaser, PhaserGame) {

    /// @function setParameters
    /// Create and initialize a platforms with default value or specified ones stored in the argument
    /// @param {Object} a JSON object that contains the informations for the initialisation of the platform
    function setParameters(platformData) {
        var color = platformData.color;
        if (color == null)
            // default value. (the platform has no color)
            color = "";

        var skin = platformData.skin;
        if (skin == null)
            // default value.
            skin = "ground";

        var platform;
        if (platformData.position == null)
            platform = platforms.create(platformData.positions[0].x, platformData.positions[0].y, skin + color);
        else
            platform = platforms.create(platformData.position.x, platformData.position.y, skin + color);
        platform.color = color;

        var size = platformData.size;
        if (size != null) {
            if (size.x == null)
                size.x = 1;
            if (size.y == null) 
                size.y = 1;
            platform.scale.setTo(size.x, size.y);
        } else 
            // default value. (the platform has the side given by it's skin)
            platform.scale.setTo(1, 1);

        platform.body.allowGravity = false;
        if (platformData.immovable == false)
            platform.body.immovable = false;
        else
            // default value. (the platform does not collapse
            platform.body.immovable = true;
        // if the platform is set as crossable the player can jump through it from beow and cross it from side to side
        if (platformData.crossable == true) {
            platform.body.checkCollision.up = true;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;
            platform.body.checkCollision.down = false;
        }
        return platform;
    }



    /// @function createStillPlatforms
    /// Create and initialize all stillPlatforms (platforms with no movement)
    /// @param {Object} the JSON object used to store the current level's informations
    function createStillPlatforms(levelData) {
        var dataPlatforms = levelData.platforms;
        for (var i = 0 ; i < dataPlatforms.length ; i++) {
            var platformData = dataPlatforms[i];
            var platform = setParameters(platformData);
        }
    }

    /// @function createBackAndForthPlatforms
    /// Create and initialize all backAndForthPlatforms (platforms with a movement that repeats in the opposite direction when it's done) and make a list of all these platforms to make the update of those platform's movement easier
    /// @param {Object} the JSON object used to store the current level's informations
    function createBackAndForthPlatforms(levelData) {
        var dataPlatforms = levelData.backAndForthPlatforms;
        this.backAndForthPlatforms = new Array();
        if (dataPlatforms != null) {
            for (var i = 0 ; i < dataPlatforms.length ; i++) {
                var platformData = dataPlatforms[i];
                var platform = setParameters(platformData);
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
    function createLoopingPlatforms(levelData) {
        var dataPlatforms = levelData.loopingPlatforms;
        this.loopingPlatforms = new Array();
        if (dataPlatforms != null) {
            for (var i = 0 ; i < dataPlatforms.length ; i++) {
                var platformData = dataPlatforms[i];
                var platform = setParameters(platformData);
                platform.positions = platformData.positions;
                platform.current = 0;
                platform.body.velocity.x = platformData.positions[0].speed.x;
                platform.body.velocity.y = platformData.positions[0].speed.y;
                this.loopingPlatforms.push(platform);
            }
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
                    element.body.velocity.x = element.positions[element.current].speed.x;
                    element.body.velocity.y = element.positions[element.current].speed.y;
                    if (element.current == element.positions.length - 1) {
                        element.increment = -1;
                        element.body.velocity.x = -element.positions[element.current - 1].speed.x;
                        element.body.velocity.y = -element.positions[element.current - 1].speed.y;
                    }
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
                }
            }
        })
    }



    return {
        // Both of the array are used to store a certain number of platforms in order to optimize the updating of moving platforms
        backAndForthPlatforms: new Array(),
        loopingPlatforms: new Array(),

        // Create all the object of type platform
        createObjectGroup: function (levelData) {
            createStillPlatforms(levelData);
            createBackAndForthPlatforms(levelData);
            createLoopingPlatforms(levelData);
        },

        // Update the movement of moving platforms
        updateObject: function () {
            updateLoopingPlatforms();
            updateBackAndForthPlatforms();
        },



    }
});
