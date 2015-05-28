define(['phaser', 'app/player', 'app/phasergame'], function (Phaser, player, PhaserGame) {

    function createObjects(levelData) {

        // Creation of the fixed platforms
        createPlatform(levelData);

        // Creation of the coins
        createCoin(levelData);
        
        // Creation of the ennemies
        createEnnemis(levelData);

        // Creation of the ends
        createEnds(levelData);
    }

    function createWorld(levelData) {
        //  Creation of the background
        var background = PhaserGame.game.add.sprite(levelData.background.position.x, levelData.background.position.y, levelData.background.skin);
        background.fixedToCamera = true;
        

        // Creation of the "frame" of the level
        var worldBounds = levelData.worldBounds;
        PhaserGame.game.world.setBounds(worldBounds.leftBound, worldBounds.upperBound, worldBounds.rightBound, worldBounds.lowerBound);

    }

    function createPlatform(levelData) {
        var dataPlatforms = levelData.platforms;
        for (var i = 0 ; i < dataPlatforms.length ; i++) {
            var platformData = dataPlatforms[i];
            var platform;
            // Create a normal or coloured platform
            if (platformData.color != "") {
                platform = colourPlatforms.create(platformData.position.x, platformData.position.y, platformData.skin + platformData.color);
                platform.color = platformData.color;
            } else {
                platform = platforms.create(platformData.position.x, platformData.position.y, platformData.skin);
            }
            platform.scale.setTo(platformData.size.x, platformData.size.y);
            // If the platform moves along the x axis set the bounds of the movement
            if (platformData.speed.x != 0) {
                platform.body.sprite.leftBounds = platformData.bounds.left;
                platform.body.sprite.rightBounds = platformData.bounds.right;
                platform.body.velocity.x = platformData.speed.x;
            }
            // If the platform moves along the y axis set the bounds of the movement
            if (platformData.speed.y != 0) {
                platform.body.sprite.topBounds = platformData.bounds.upper;
                platform.body.sprite.bottomBounds = platformData.bounds.lower;
                platform.body.velocity.y = platformData.speed.y;
            }
            platform.body.allowGravity = false;
            platform.body.immovable = platformData.immovable;
            PhaserGame.game.physics.enable(platform, Phaser.Physics.ARCADE);

        }
    }

    function createEnds(levelData) {
        var dataEnds = levelData.ends;
        for (var i = 0 ; i < dataEnds.length ; i++) {
            var endData = dataEnds[i];
            var end = ends.create(endData.x, endData.y, 'diamond');
            end.body.bounce.y = 0;
            end.body.gravity.y = 1000;
        }
    }

    function createCoin(levelData) {
        var dataCoins = levelData.coins;
        for (var i = 0 ; i < dataCoins.length ; i++) {
            var coinData = dataCoins[i];
            var coin = coins.create(coinData.x, coinData.y, 'coin');
            coin.body.gravity.y = 0;
        }
    }
    
    function createEnnemis(levelData) {
        var dataEnnemis = levelData.ennemis;
       
        for (var i = 0 ; i < dataEnnemis.length ; i++) {
            var ennemiData = dataEnnemis[i];
            var ennemi = ennemis.create(ennemiData.x, ennemiData.y, 'baddie');
            ennemi.frame = 1;
            if (ennemiData.speed.x != 0) {
                ennemi.body.sprite.leftBounds = ennemiData.bounds.left;
                ennemi.body.sprite.rightBounds = ennemiData.bounds.right;
                ennemi.body.velocity.x = ennemiData.speed.x;
            }
            //pas sur non plus de ces 3 la
            //platform.body.immovable = platformData.immovable;
            //ennemi.body.immovable = ennemiData.immovable;
            ennemi.body.bounce.y = 0;
            ennemi.body.gravity.y = 1000;
        }
    
    }
    

    function createStart(element) {
        player.initializePlayer(PhaserGame.game, element.x, element.y);
    }

    function createLevel(str) {

        //var game = this;
        //  We're going to be using physics, so enable the Arcade Physics system
        PhaserGame.game.physics.startSystem(Phaser.Physics.ARCADE);

        // We parse the JSON file
        var levelData = PhaserGame.game.cache.getJSON(str);
        if (levelData == null) {
            return false;
        }


        createWorld(levelData);

        // Create the differents groups of objects
        platforms = PhaserGame.game.add.physicsGroup();
        movingPlatforms = PhaserGame.game.add.physicsGroup();
        colourPlatforms = PhaserGame.game.add.physicsGroup();
        ends = PhaserGame.game.add.group();
        coins = PhaserGame.game.add.group();
        ennemis = PhaserGame.game.add.physicsGroup();
        //test = true;
        

        //  We will enable physics for any object that is created in those group
        platforms.enableBody = true;
        coins.enableBody = true;
        ends.enableBody = true;
        colourPlatforms.enableBody = true;
        ennemis.enableBody = true;


        // Creation of the level's objects
        createObjects(levelData);


        // Creation of the player
        createStart(levelData.playerStart, PhaserGame.game);

        return true;
    }



    return createLevel;

});
