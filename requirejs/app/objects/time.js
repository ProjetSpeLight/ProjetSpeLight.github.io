/**
  * This module defines the text representing the time
  *
  */

define(['phaser', 'app/phasergame', 'app/player'], function (Phaser, PhaserGame, player, coinObject, photon) {
    
    return {
       
        /***** Attributes *****/
        
        //the number of seconds that remain
        time: 0,
        
        //the number of seconds to finish the level
        timebegin:0,
        
        timeText: null,
        
        /***** Methodes *****/
        
        createTime: function(data) {
            if (data == null) {
                this.time=-1;
                return;
            }
            
            this.timeText = PhaserGame.game.add.text(150, 16, 'Time: Infinity ', { fontSize: '32px', fill: '#000' });
            this.timeText.fixedToCamera = true;
            
            for (var i = 0 ; i < data.length ; i++) {
                
                var timeData = data[i];
                this.time = timeData.value;
                this.timebegin = timeData.value;
                this.timeText.text= 'Temps: '+this.time;
            
            }
        },
        
        // @function updateTime
        /// update the time and kill the player if the time is equal to 0 
        updateTime: function() {
            if (this.time>0){
                this.time --;
                this.timeText.text = 'Temps: ' + this.time;
            }
            if (this.time == 0) {
                PhaserGame.game.state.states['Dead'].message = 'Temps écoulé';
                PhaserGame.game.state.start('Dead');
            }
        }
    }


});
