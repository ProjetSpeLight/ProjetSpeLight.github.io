/**
  * This module defines the text representing the time
  *
  */

define(['phaser', 'app/phasergame', 'app/player'], function (Phaser, PhaserGame, player, coinObject, photon) {
    
    return {
       
        /***** Attributes *****/

        time: 0,
        timebegin:0,
        timeText: null,
        
        /***** Methodes *****/
        
        createTime: function(data) {
        
            this.timeText = PhaserGame.game.add.text(150, 16, 'Time: Infinity ', { fontSize: '32px', fill: '#000' });
            this.timeText.fixedToCamera = true;

            if (data == null) {
                this.time=-1;
                return;
            }

           
            
            for (var i = 0 ; i < data.length ; i++) {
                
                var timeData = data[i];
                this.time = timeData.value;
                this.timebegin = timeData.value;
                this.timeText.text= 'Time: '+this.time;
            
            }
            
        },
        
        updateTime: function() {
            if (this.time>0){
                this.time --;
                this.timeText.text = 'Time: ' + this.time;
            }
            if (this.time==0){
                PhaserGame.game.state.start('RestartGame');
            }
            
        }
        
    
    }


});