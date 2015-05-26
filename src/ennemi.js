// DAns create level 

ennemis = game.add.group();
ennemis.enableBody = true;


//Dans createObjects
 // Creation of the ennemies
    createEnnemies(levelData);


// en dessous dans createLevel.js
function createEnnemies(levelData) {
    var dataEnnemis = levelData.ennemis;
    for (var i = 0 ; i < dataEnnemis.length ; i++) {
        var ennemiData = dataEnnemis[i];
        var ennemi = ennemis.create(ennemiData.x, ennemiData.y, 'baddie');
        if (ennemiData.speed.x != 0) {
            ennemi.body.sprite.leftBounds = ennemiData.bounds.left;
            ennemi.body.sprite.rightBounds = ennemiData.bounds.right;
            ennemi.body.velocity.x = ennemiData.speed.x;
        }
        //pas sur non plus de ces 3 la
        //platform.body.immovable = platformData.immovable;
        ennemi.body.bounce.y = 0;
        ennemi.body.gravity.y = 1000;
    }
    
}





// Dans game.js 


this.physics.arcade.collide(player, ennemis);
this.physics.arcade.collide(photons,ennemis);


//Deplacement des ennemis
            ennemis.forEach(function (element) {
                if (element.body.x >= element.body.sprite.rightBounds) {
                    element.body.velocity.x *= -1;
                } else if (element.body.x <= element.body.sprite.leftBounds) {
                    element.body.velocity.x *= -1;
                }
                if (element.body.y <= element.body.sprite.topBounds) {
                    element.body.velocity.y *= -1;
                } else if (element.body.y >= element.body.sprite.bottomBounds) {
                    element.body.velocity.y *= -1;
                }
            })
            
            
            
 function killPlayer(player, ennemi) {
                
                this.state.start('FinishLevel');
                
            }
            
function killEnnemi(photon, ennemi){
                ennemi.kill();
}