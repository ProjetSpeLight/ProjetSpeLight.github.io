
define(['phaser', 'app/player', 'app/phasergame', 'app/objects/coin', 'app/objects/pique', 'app/objects/ennemi', 'app/objects/time', 'app/objects/objectsManager'], function (Phaser, player, PhaserGame, coinObject, piqueObject, ennemiObject, time, Manager) {

    function createObjects(levelData, createLevel) {
        // Creation of the objects handled by the manager
        Manager.createObjects(levelData);
        time.createTime(levelData.time);


        // Creation of texts
        

    }

    function createWorld(levelData) {
        //  Creation of the background
        var background = PhaserGame.game.add.sprite(0, 0, levelData.background);
        background.fixedToCamera = true;

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
            createObjects(levelData, this);


            // Creation of the player
            player.initializePlayer(PhaserGame.game, levelData.playerStart.x, levelData.playerStart.y);

            return true;
        },


    };

});
