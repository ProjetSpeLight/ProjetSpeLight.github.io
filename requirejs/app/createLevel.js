
define(['app/player', 'app/phasergame', 'app/objects/time', 'app/objects/objectsManager'], function (player, PhaserGame, time, Manager) {

   
    function createWorld(levelData) {
        //  Creation of the background
        var background = PhaserGame.game.add.sprite(0, 0, levelData.background);
        background.fixedToCamera = true;
        // We change the tint according to the level
        var temp = PhaserGame.game.state.states['Game'].currentLevel;
        background.tint = temp * 0x111111;


        // Creation of the "frame" of the level
        var worldBounds = levelData.worldBounds;
        PhaserGame.game.world.setBounds(worldBounds.leftBound, worldBounds.upperBound, worldBounds.rightBound, worldBounds.lowerBound);
    }

    return {

        createLevel: function (str) {

            // We parse the JSON file
            var levelData = PhaserGame.game.cache.getJSON(str);
            if (levelData == null) {
                return false;
            }

            createWorld(levelData);          

            // Creation of the level's objects
            Manager.createObjects(levelData); // Creation of the objects handled by the manager
            time.createTime(levelData.time);

            // Creation of the player
            player.initializePlayer(PhaserGame.game, levelData.playerStart.x, levelData.playerStart.y);

            return true;
        },


    };

});
