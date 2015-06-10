define(['phaser', 'app/phasergame', 'app/player'], function (Phaser, PhaserGame, player) {


    return {
        // Object containing the physic group of coins
        group: null,

        /// @function preloadObjectImage
        /// Preloads the different images / spritesheets used by this module
        preloadObjectsImages: function () { },

        /// @function createObjectsGroup
        /// Create the differents objects defines in the JSON file represented by this module
        /// @param {Array} Array of elements representing 
        createObjectsGroup: function (data, Manager) {
            this.group = PhaserGame.game.add.group();
            // Intialization of the group in the manager
            Manager.EnumModule.TEXT.refGroup = this.group;

            if (data != null) {
                var style = { font: "24px Arial", fill: "#ffffff", align: "center" };
                for (var i = 0 ; i < data.length ; i++) {
                    var textData = data[i];
                    var text = PhaserGame.game.add.text(textData.x, textData.y, textData.fr, style);
                }
            }
        },

        updateObjects: function () { }
    }

});
