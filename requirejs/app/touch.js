﻿/**
 * This module implements the joypad for touch devices
 */


define(['phaser', 'app/phasergame', 'app/player'], function (Phaser, PhaserGame, Player) {
    
    var options = { frequency: 100 };
    var watchID = null;
    var inGame = false;
    var orientationDroite = true;
    var zoneMorte = 3;

    function initJoypad() {
        buttonjump = PhaserGame.game.add.button(600, 500, 'buttonjump', null, this, 0, 1, 0, 1);
        buttonjump.fixedToCamera = true;
        buttonjump.events.onInputOver.add(function () { Player.activeJump = true; });
        buttonjump.events.onInputOut.add(function () { Player.activeJump = false; });
        buttonjump.events.onInputDown.add(function () { Player.activeJump = true;});
        buttonjump.events.onInputUp.add(function () { Player.activeJump = false; });

        buttonfire = PhaserGame.game.add.button(700, 500, 'buttonfire', null, this, 0, 1, 0, 1);
        buttonfire.fixedToCamera = true;
        buttonfire.events.onInputOver.add(function () { Player.fireActive = true; });
        buttonfire.events.onInputOut.add(function () { Player.fireActive = false; });
        buttonfire.events.onInputDown.add(function () { Player.fireActive = true; });
        buttonfire.events.onInputUp.add(function () { Player.fireActive = false; });

        buttonleft = PhaserGame.game.add.button(0, 472, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        buttonleft.fixedToCamera = true;
        buttonleft.events.onInputOver.add(function () { Player.moveLeft = true; });
        buttonleft.events.onInputOut.add(function () { Player.moveLeft = false; });
        buttonleft.events.onInputDown.add(function () { Player.moveLeft = true; });
        buttonleft.events.onInputUp.add(function () { Player.moveLeft = false; });

        buttonright = PhaserGame.game.add.button(160, 472, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        buttonright.fixedToCamera = true;
        buttonright.events.onInputOver.add(function () { Player.moveRight = true; });
        buttonright.events.onInputOut.add(function () { Player.moveRight = false; });
        buttonright.events.onInputDown.add(function () { Player.moveRight = true; });
        buttonright.events.onInputUp.add(function () { Player.moveRight = false; });

        buttondown = PhaserGame.game.add.button(96, 536, 'buttonvertical', null, this, 0, 1, 0, 1);
        buttondown.fixedToCamera = true;
        buttondown.events.onInputOver.add(function () { Player.changeColor = true; });
        buttondown.events.onInputOut.add(function () { Player.changeColor = false; });
        buttondown.events.onInputDown.add(function () { Player.changeColor = true; });
        buttondown.events.onInputUp.add(function () { Player.changeColor = false; });
    }
    
    function startWatching() {
        inGame = true;
        Player.accelerometerOn = true;
    }

    function onDeviceReady() {
        this.watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    }

    function stopWatching() {
        inGame = false;
        Player.accelerometerOn = false;
    }

    function onSuccess(acceleration) {
        if (inGame) {
            var signe;
            if(acceleration.x < 0){
                signe = -1;
            } else {
                signe = 1;
            }
            if (Math.abs(acceleration.y) > zoneMorte) {
                if(acceleration.y > 0){
                    Player.velocity = signe * (acceleration.y - zoneMorte) / (9.80 - zoneMorte) * 300;
                } else {
                    Player.velocity = signe * (acceleration.y + zoneMorte) / (9.80 - zoneMorte) * 300;
                }
            } else {
                Player.velocity = 0;
            }
        }
    } 

    function onError(){
        alert("Acceleromètre ne marche pas");
    }


    return {
        initJoypad: initJoypad,
        startMobile: startWatching,
        stopMobile: stopWatching,
        onDeviceReady: onDeviceReady
    };
});