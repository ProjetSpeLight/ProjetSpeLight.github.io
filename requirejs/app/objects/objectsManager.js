// This module gathers the objects related to reflexion of the game to centralize some actions
define(['phaser',
        'app/phasergame',
        'app/objects/mirror',
        'app/objects/filter',
        'app/objects/button',
        'app/objects/switch',
        'app/objects/platforms',
        'app/objects/ennemi',
        'app/objects/pique',
        'app/objects/coin',
        'app/objects/end',
        'app/objects/text',
        'app/objects/wall',
        'app/objects/runner'],
function (Phaser,
          PhaserGame,
          mirror,
          filter,
          button,
          switchObject,
          platforms,
          enemy,
          pique,
          coin,
          end,
          text,
          wall,
          runner) {

    // Enumeration of the different object modules handled by the manager with their id and a reference to their group
    var EnumModule = {
        MIRROR: { idGroup: 0, refGroup: null },
        FILTER: { idGroup: 1, refGroup: null },
        BUTTON: { idGroup: 2, refGroup: null },
        SWITCH: { idGroup: 3, refGroup: null },
        PLATFORM: { idGroup: 4, refGroup: null },
        ENEMY: { idGroup: 5, refGroup: null },
        PIQUE: { idGroup: 6, refGroup: null },
        COIN: { idGroup: 7, refGroup: null },
        END: { idGroup: 8, refGroup: null },
        TEXT: { idGroup: 9, refGroup: null },
        WALL: { idGroup: 10, refGroup: null }
    }

    // Variables used for the switch animation
    var freeze = false;
    var target = null;



    return {

        EnumModule: EnumModule,

        preloadObjects: function () {
            mirror.preloadObjectsImages();
            filter.preloadObjectsImages();
            button.preloadObjectsImages();
            switchObject.preloadObjectsImages();
            platforms.preloadObjectsImages();
            enemy.preloadObjectsImages();
            pique.preloadObjectsImages();
            coin.preloadObjectsImages();
            end.preloadObjectsImages();
            wall.preloadObjectsImages();
            runner.preloadObjectsImages();
        },

        /// @function createObjects
        /// Creates the different groups the manager handles
        /// @param {Object} Data from the JSON file
        createObjects: function (data) {
            // Initialization
            freeze = false;
            target = null;

            // First we create the platforms
            platforms.createObjectsGroup(data, this);

            // Then the other objects
            runner.group = PhaserGame.game.add.group();
            mirror.createObjectsGroup(data.mirrors, this);
            filter.createObjectsGroup(data.filters, this);
            enemy.createObjectsGroup(data.ennemis, this);
            pique.createObjectsGroup(data.piques, this);
            coin.createObjectsGroup(data.coins, this);
            end.createObjectsGroup(data.ends, this);
            wall.createObjectsGroup(data.walls, this);
            text.createObjectsGroup(data.texts, this);

            // We create the objects that can have actions after the others
            switchObject.createObjectsGroup(data.switch, this);
            button.createObjectsGroup(data.buttons, this);


        },

        /// @function updateObjects
        /// Updates the different groups the manager handles
        updateObjects: function () {
            // First, we define the collisions without handler
            wall.updateObjects();
            end.updateObjects();
            coin.updateObjects();
            pique.updateObjects();
            mirror.updateObjects();
            filter.updateObjects();
            button.updateObjects();
            switchObject.updateObjects();
            enemy.updateObjects();
            platforms.updateObjects();
        },

        /// @function getElementGroup
        /// Return the member of the enumeration EnumModule corresponding to the id in argument
        /// @param {Number} Id of the group we are looking for
        /// @return {Array} Member of the enumeration representing the group
        getElementGroup: function (idGroup) {
            for (var id in EnumModule) {
                if (EnumModule[id].idGroup == idGroup) {
                    return EnumModule[id];
                }
            }
            return null;
        },

        /// @function getObject
        /// Returns the object corresponding to the id "idObject" within the group of id "idGroup"
        /// @return the object
        /// @param {Number} the id of the group of which the object should belong to
        /// @param {Number} the id of the object within the group
        getObject: function (idGroup, idObject) {
            var element = this.getElementGroup(idGroup);
            for (var i = 0 ; i < element.refGroup.children.length ; i++) {
                if (element.refGroup.children[i].id == idObject) {
                    return element.refGroup.children[i];
                }
            }
            return null;
        },


        freezeGame: function (targetSwitch) {
            if (freeze) {
                return;
            }
            freeze = true;
            target = targetSwitch;
            for (elt in this.EnumModule) {
                var group = this.EnumModule[elt].refGroup;
                for (var i = 0 ; i < group.length ; ++i) {
                    var child = group.children[i];
                    child.freezeSaveVelocityX = child.body.velocity.x;
                    child.freezeSaveVelocityY = child.body.velocity.y;
                    child.body.velocity.x = 0;
                    child.body.velocity.y = 0;
                }
            }
        },

        relaunchGame: function () {
            if (!freeze) {
                return;
            }
            freeze = false;
            for (elt in this.EnumModule) {
                var group = this.EnumModule[elt].refGroup;
                for (var i = 0 ; i < group.length ; ++i) {
                    var child = group.children[i];
                    if (child != target) {
                        child.body.velocity.x = child.freezeSaveVelocityX;
                        child.body.velocity.y = child.freezeSaveVelocityY;
                    }

                }
            }
        }
    }

});




