define(['phaser', 'app/phasergame', 'app/player', 'app/color'], function (Phaser, PhaserGame, player, Color) {

    /// @function applyFilter
    /// Handler called when the player overlap a filter
    function applyFilter(sprite, filter) {
        player.filterColor(filter.color);
    }

    /// @function applyFilter
    /// Handler called when a photon thrown by the player overlap a filter
    function applyFilterPhoton(photon, filter) {
        // We apply the filter on the photon
        photon.color = Color.subFilterColor(photon.color, Color.getColor(filter.color));
        // If it has no color anymore, it is killed
        if (photon.color.name == 'Black') {
            photon.kill();
            return;
        }
        // Otherwise, we change the frame to display its new color
        photon.frame = (photon.color.value - 1);
    }




    /************ Public part of the module ************/

    return {

        /***** Attributes *****/

        // Object containing the physic group of filters
        group: null,



        /***** Methods *****/

        /// @function preloadObjectImage
        /// Preloads the different images / spritesheets used by this module
        preloadObjectsImages: function () {
            PhaserGame.game.load.image('filterBlue', 'assets/Objects/Filters/FilterBlue.png');
            PhaserGame.game.load.image('filterRed', 'assets/Objects/Filters/FilterRed.png');
            PhaserGame.game.load.image('filterGreen', 'assets/Objects/Filters/FilterGreen.png');
            PhaserGame.game.load.image('filterMagenta', 'assets/Objects/Filters/FilterMagenta.png');
            PhaserGame.game.load.image('filterYellow', 'assets/Objects/Filters/FilterYellow.png');
            PhaserGame.game.load.image('filterCyan', 'assets/Objects/Filters/FilterCyan.png');
        },

        /// @function createObjectsGroup
        /// Create the differents objects defines in the JSON file represented by this module
        /// @param {Array} Array of elements representing 
        createObjectsGroup: function (data, Manager) {
            // Allocation of the group
            this.group = PhaserGame.game.add.physicsGroup();
            // Intialization of the group in the manager
            Manager.EnumModule.FILTER.refGroup = this.group;
            // If no filters are defined in the current level, there is nothing to do
            if (data == null)
                return;

            for (var i = 0 ; i < data.length ; i++) {
                var filterData = data[i];
                // We create a new filter at the position (x,y) with the token "filter + filterData.color" to represent the corresponding image loaded
                var filter = this.group.create(filterData.x, filterData.y, 'filter' + filterData.color);
                // Attribute color
                filter.color = filterData.color;
                filter.objectType = 'filter';
                // Id if defined
                if (filterData.id != null) {
                    filter.id = filterData.id;
                }

                // Boolean indicate if the filter has to be displayed horizontally or vertically
                // True => horizontal
                // False => vertical
                var turned = false;
                if (filterData.turned != null) {
                    turned = filterData.turned;
                }

                // Integer which indicate the scale of the filter
                var size = 1;
                if (filterData.size != null) {
                    size = filterData.size;
                }

                // We apply the two last parameters and change in consequence the hit box
                var height = filter.body.height;
                var width = filter.body.width;

                filter.scale.setTo(1, size);

                if (turned) {
                    filter.anchor.setTo(0.5, 0.5);
                    filter.angle = 90;
                    filter.body.setSize(size * height, width / 2);
                }
            }
        },

        /// @function updateObject
        /// Updates the group of filters (to be called by the update() function of the game state)
        updateObjects: function () {
            PhaserGame.game.physics.arcade.overlap(player.sprite, this.group, applyFilter);
            PhaserGame.game.physics.arcade.overlap(player.refPhotons.photons, this.group, applyFilterPhoton);
        }
    }

});




