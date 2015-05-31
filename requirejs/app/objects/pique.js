/**
  * This module defines the sprite representing the piques
  *
  */

define(['phaser', 'app/phasergame','app/player','app/objects/coin','app/objects/platforms','app/objects/ennemi','app/touch'], function (Phaser, PhaserGame,player,coinObject,platform,ennemiObject, Touch) {

   //function which allow the pique to kill the player 
   function killPlayerPique(play, pique) {
                   
       if (!play.invincible){
           if (!PhaserGame.game.device.desktop) {
               Touch.stopMobile();
           }
           coinObject.score = 0;
           //check if the player has a color or not
           if (play.color.value != 0){
               //he has a color so we remove the last color
                player.timeInvincible=1;
                player.removePlayerColor();
           } else {
               //he hasn't so we restart the game
           PhaserGame.game.state.start('RestartGame');
           }
           
       }
   }
   
    //function which allow the pique to kill the ennemis
    function killEnnemiPique(pique, ennemi){
        ennemi.kill();
    }
    
    return {
    
        /***** Attributes *****/

        // Object containing the physic group of piques
        group: null,
        
        /***** Methodes *****/
        
        /// @function createObjectsGroup
        /// Create the differents objects defines in the JSON file represented by this module
        /// @param {Array} Array of elements representing 
        createObjectGroup: function (data) {
            this.group = PhaserGame.game.add.physicsGroup();
            
             if (data == null) {
                return;
            }
            
            for (var i = 0 ; i < data.length ; i++) {
                var piqueData = data[i];
                
                var pique = this.group.create(piqueData.x, piqueData.y, piqueData.skin );
                pique.body.gravity.y=1000;


            }
            
        },
        
        updateObject: function () {
             PhaserGame.game.physics.arcade.collide(this.group, platforms);
            

               
                PhaserGame.game.physics.arcade.collide(this.group, ennemiObject.group, killEnnemiPique, null, this);
                PhaserGame.game.physics.arcade.overlap(player.sprite, this.group, killPlayerPique, null, this);

        }
       
   }

});
