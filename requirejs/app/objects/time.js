define(['app/phasergame', 'app/player'], function (PhaserGame, player) {

    // Variable used to count a second
    var compt;
    
    return {
       
        /***** Attributes *****/
        
        //the number of seconds that remain
        time: 0,
        
        //the number of seconds to finish the level
        timebegin:0,
        
        timeText: null,
        
        /***** Methodes *****/
        
        createTime: function (data) {

            compt = 0;

            if (data == null) {
                this.time=-1;
                return;
            }
            
            this.timeText = PhaserGame.game.add.text(150, 16, 'Time: Infinity ', { fontSize: '32px', fill: '#ffffff' });
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
        updateTime: function () {

            compt++;
            if (compt != 60) {                
                return;
            }

            compt = 0;


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
