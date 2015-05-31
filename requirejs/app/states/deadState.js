define([
    'phaser',
    'app/phasergame',
], function (
    Phaser,
     PhaserGame
) { 
    //'use strict';

    function DeadState(game) {
    };
    
    DeadState.prototype = {
        create: function () {
             dead=this.add.sprite(0, 0, 'dead');
                this.state.start('RestartGame');
            
            
            
        },
        
        playGame: function () {
            
            //dead.destroy();
            //dead.destroy();
            this.state.start('RestartGame');
        }
        

    };
    
    
    return DeadState;
});
