

function createLevel(game) {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // We parse the JSON file
    var levelData = game.cache.getJSON('level');

    createWorld(levelData, game);


    // Create the differents groups of objects
    platforms = game.add.physicsGroup();
    movingPlatforms = game.add.physicsGroup();
    colourPlatforms = game.add.physicsGroup();
    ends = game.add.group();
    coins = game.add.group();


    //  We will enable physics for any object that is created in those group
    platforms.enableBody = true;
    coins.enableBody = true;
    ends.enableBody = true;
    colourPlatforms.enableBody = true;


    // Creation of the level's objects
    createObjects(levelData);


    // Creation of the player
    createStart(levelData.playerStart, game);


}

function createObjects(levelData) {

    // Creation of the fixed platforms
    createPlatform(levelData);

    // Creation of the coins
    createCoin(levelData);

    // Creation of the ends
    createEnds(levelData);   
}

function createWorld(levelData, game) {
    //  Creation of the background
    var background = game.add.sprite(levelData.background.position.x, levelData.background.position.y, levelData.background.skin);
    background.fixedToCamera = true;

    // Creation of the "frame" of the level
    var worldBounds = levelData.worldBounds;
    game.world.setBounds(worldBounds.leftBound, worldBounds.upperBound, worldBounds.rightBound, worldBounds.lowerBound);

}

function createPlatform(levelData) {
    var dataPlatforms = levelData.platforms;
    for (var i = 0 ; i < dataPlatforms.length ; i++) {
        var platformData = dataPlatforms[i];
        var platform;
        // Create a normal or coloured platform
        if (platformData.colour != "") {
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

function createStart(element, game) {
    // The player and its settings
    player = game.add.sprite(element.x, element.y, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.0;
    player.body.gravity.y = 1000;
    game.camera.follow(player);
    player.body.collideWorldBounds = true;


    // Initialization of the player animations
    initializePlayerAnimations(player);
    player.color = ColorEnum.BLUE;
}
