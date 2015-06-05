/**
 * This module implements the joypad for touch devices
 */


define(['phaser', 'app/phasergame', 'app/player'], function (Phaser, PhaserGame, Player) {
    
    var options = { frequency: 100 };
    var watchID = null;
    var inGame = false;
    var orientationDroite = true;
    var zoneMorte = 2;
    var buttonjump;
    var buttonfire;
    var buttonleft;
    var buttonright;
    var buttondown;
    var buttonsOn = true;
    var buttonBouton;
    var buttonAccelerometre;
    var opacity = 0.3;

    function initJoypad() {
        buttonjump = PhaserGame.game.add.button(625, 500, 'buttonSaut', null, this);
        buttonjump.fixedToCamera = true;
        buttonjump.alpha = opacity;
        buttonjump.scale = new Phaser.Point(0.75, 0.75);
        buttonjump.events.onInputOver.add(function () { Player.activeJump = true; });
        buttonjump.events.onInputOut.add(function () { Player.activeJump = false; });
        buttonjump.events.onInputDown.add(function () { Player.activeJump = true;});
        buttonjump.events.onInputUp.add(function () { Player.activeJump = false; });

        buttonfire = PhaserGame.game.add.button(700, 450, 'buttonTir', null, this);
        buttonfire.fixedToCamera = true;
        buttonfire.alpha = opacity;
        buttonfire.scale = new Phaser.Point(0.75, 0.75);
        buttonfire.events.onInputOver.add(function () { Player.fireActive = true; });
        buttonfire.events.onInputOut.add(function () { Player.fireActive = false; });
        buttonfire.events.onInputDown.add(function () { Player.fireActive = true; });
        buttonfire.events.onInputUp.add(function () { Player.fireActive = false; });
      

        buttonleft = PhaserGame.game.add.button(25, 560, 'buttonGauche', null, this);
        buttonleft.fixedToCamera = true;
        buttonleft.alpha = opacity;
        //PhaserGame.game.input.pointer1.button = buttonleft;
        //pointer_dir.button = buttonleft;
        
        buttonleft.events.onInputOver.add(function () { Player.moveLeft = true; });
        buttonleft.events.onInputOut.add(function () { Player.moveLeft = false; });
        buttonleft.events.onInputDown.add(function () { Player.moveLeft = true; });
        buttonleft.events.onInputUp.add(function () { Player.moveLeft = false; });

        buttonright = PhaserGame.game.add.button(125, 560, 'buttonDroite', null, this);
        buttonright.fixedToCamera = true;
        buttonright.alpha = opacity;
        buttonright.events.onInputOver.add(function () { Player.moveRight = true; });
        buttonright.events.onInputOut.add(function () { Player.moveRight = false; });
        buttonright.events.onInputDown.add(function () { Player.moveRight = true; });
        buttonright.events.onInputUp.add(function () { Player.moveRight = false; });

        
    }

    function boutonsSwitch() {
        if (buttonsOn) {
            buttonBouton = PhaserGame.game.add.button(50, 50, 'bouton', changementBouton, this, 0, 1, 0, 1);
            buttonBouton.fixedToCamera = true;
        } else {
            buttonAccelerometre = PhaserGame.game.add.button(50, 50, 'accelerometre', changementBouton, this, 0, 1, 0, 1);
            buttonAccelerometre.fixedToCamera = true;
        }
    }

    function showChangeColorButton() {
        buttondown.visible = true;
    }

    function killChangeColorButton() {
        //Player.changeColor = false;
        buttondown.visible = false;
    }

    function changementBouton() {
        if (buttonsOn) {
            buttonsOn = false;
            buttonBouton.kill();
            if (inGame) {
                changeControls();
            }
            boutonsSwitch();
        } else {
            buttonsOn = true;
            buttonAccelerometre.kill();
            if (inGame) {
                changeControls();
            }
            boutonsSwitch();
        }
    }
    
    function startWatching() {
        Player.accelerometerOn = true;

        buttonjump = PhaserGame.game.add.button(0, 0);
        buttonjump.fixedToCamera = true;
        buttonjump.height = 600;
        buttonjump.width = 200;
        buttonjump.events.onInputOver.add(function () { Player.activeJump = true; });
        buttonjump.events.onInputOut.add(function () { Player.activeJump = false; });
        buttonjump.events.onInputDown.add(function () { Player.activeJump = true; });
        buttonjump.events.onInputUp.add(function () { Player.activeJump = false; });

        buttonfire = PhaserGame.game.add.button(600,0);
        buttonfire.fixedToCamera = true;
        buttonfire.height = 600;
        buttonfire.width = 200;
        buttonfire.events.onInputOver.add(function () { Player.fireActive = true; });
        buttonfire.events.onInputOut.add(function () { Player.fireActive = false; });
        buttonfire.events.onInputDown.add(function () { Player.fireActive = true; });
        buttonfire.events.onInputUp.add(function () { Player.fireActive = false; });
    }

    function onDeviceReady() {
        watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    }

    function stopWatching() {
        Player.accelerometerOn = false;
    }

    function onSuccess(acceleration) {
        if (inGame) {            
            var signe;
            if (window.orientation == 90 ){//acceleration.x < 0) {
                signe = -1;
            } else {
                signe = 1;
            }
            var temp
            if (Math.abs(acceleration.y) > zoneMorte) {
                if(acceleration.y > 0){
                    temp = signe * (acceleration.y - zoneMorte) / (9.80 - zoneMorte) * 1200;
                    if(Math.abs(temp) >= 300){
                        Player.velocity = signe * 300;
                    } else {
                        Player.velocity = temp;   
                    }
                } else {
                    temp = signe * (acceleration.y + zoneMorte) / (9.80 - zoneMorte) * 1200;
                    if(-Math.abs(temp) <= - 300){
                        Player.velocity = - signe * 300;
                    } else {
                        Player.velocity = temp;   
                    }
                }
            } else {
                Player.velocity = 0;
            }
        }
    }

    function killBoutonsSwitch() {
        if (buttonsOn) {
            buttonBouton.kill();
        } else {
            buttonAccelerometre.kill();
        }
    }
    
    function changeControls(){
        if(buttonsOn){
            startWatching();
            buttonjump.kill();
            buttonfire.kill();
            buttonleft.kill();
            buttonright.kill();
            buttonsOn = false;
        } else {
            stopWatching();
            initJoypad();
            buttonsOn = true;
        }
    }
    
    function init() {
        inGame = true;
        buttondown = PhaserGame.game.add.button(350, 0, 'buttonChangeColor', null, this);
        buttondown.fixedToCamera = true;
        buttondown.visible = false;
        buttondown.events.onInputOver.add(function () { Player.changeColor = true; });
        buttondown.events.onInputOut.add(function () { Player.changeColor = false; });
        buttondown.events.onInputDown.add(function () { Player.changeColor = true; });
        buttondown.events.onInputUp.add(function () { Player.changeColor = false; });
        if(buttonsOn){
            initJoypad();
        } else {
            startWatching();
        }
    }
    
    function stop() {
        inGame = false;
        if(!buttonsOn){
            stopWatching();
        } else {
            Player.moveRight = false;
            Player.moveLeft = false;
            Player.fireActive = false;
            Player.activeJump = false;
            Player.changeColor = false;
        }
    }

    function onError(){
        alert("Acceleromètre ne marche pas");
    }
    
    function update(){
       /* if(PhaserGame.game.input.pointer1.active && PhaserGame.game.input.pointer1.y <= 595){
            //alert(PhaserGame.game.input.pointer1.y);
            if(PhaserGame.game.input.pointer1.x > 25 && PhaserGame.game.input.pointer1.x < 125){
                Player.moveLeft = true;
                Player.moveRight = false;
            } else if(PhaserGame.game.input.pointer1.x >= 125 && PhaserGame.game.input.pointer1.x < 225){
                Player.moveLeft = false;
                Player.moveRight = true;
            } else {
                Player.moveLeft = false;
                Player.moveRight = false;
                PhaserGame.game.input.pointer1.reset();
            }
        } else {
            Player.moveLeft = false;
            Player.moveRight = false;
            PhaserGame.game.input.pointer1.reset();
        }*/
    }
    

    return {
        init: init,
        stop: stop,
        onDeviceReady: onDeviceReady,
        changeControls: changeControls,
        boutonsSwitch: boutonsSwitch,
        showChangeColorButton: showChangeColorButton,
        killChangeColorButton: killChangeColorButton,
        update: update
    };
});