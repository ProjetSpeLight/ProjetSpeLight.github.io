define(['phaser', 'app/phasergame', 'app/player'], function (Phaser, PhaserGame, player) {

    function collectCoin(player, coin) {
        // Removes the star from the screen
        coin.destroy();
        //  Add and update the score
        PhaserGame.score += coin.value;
    }

    return {


        // Object containing the physic group of coins
        group: null,

        /// @function preloadObjectImage
        /// Preloads the different images / spritesheets used by this module
        preloadObjectsImages: function () {
            PhaserGame.game.load.image('coin', 'assets/star.png');
        },

        /// @function createObjectsGroup
        /// Create the differents objects defines in the JSON file represented by this module
        /// @param {Array} Array of elements representing 
        createObjectsGroup: function (data, Manager) {

            // Allocation of the group
            this.group = PhaserGame.game.add.physicsGroup();
            // Intialization of the group in the manager
            Manager.EnumModule.COIN.refGroup = this.group;

            if (data == null) {
                return;
            }


            for (var i = 0 ; i < data.length ; i++) {
                var coinData = data[i];

                var coin = this.group.create(coinData.x, coinData.y, 'coin');
                if (coinData.value == null)
                    coin.value = 1;
                else
                    coin.value = coinData.value;


            }
        },

        updateObjects: function () {
            //when the player touches a coin, the score improves
            PhaserGame.game.physics.arcade.overlap(player.sprite, this.group, collectCoin, null, this);
        }


    }




});
