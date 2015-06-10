define(['phaser', 'app/objects/time', 'app/touch', 'app/phasergame', 'app/cookie', 'app/music'], function (Phaser, time, Touch, PhaserGame, cookie, music) {

    function FinishLevelState(game) { }

    FinishLevelState.prototype = {

        create: function () {

            // Background
            title = this.game.add.sprite(0, 0, 'BG_bad');
            var coef = 600 / 720;
            title.scale.x = coef;
            title.scale.y = coef;

            if (!this.game.device.desktop) {
                Touch.stop();
            }

            var wellDone = this.add.text(300, 20, ' Bien joué !', { fontSize: '32px', fill: '#fff' });
            var scoreDone = this.add.text(250, 50, ' Votre score est de ' + PhaserGame.score, { fontSize: '32px', fill: '#fff' });
            var timeDone = this.add.text(230, 80, ' Temps: ', { fontSize: '32px', fill: '#fff' });
            if (time.time >= 0) {
                timeDone.text = 'Temps réalisé : ' + (time.timebegin - time.time) + ' secs !';
            } else {
                timeDone.text = 'Pas de temps pour ce niveau ';
            }
            var scoreFinal = this.add.text(70, 120, 'Score Final (Score + Bonus Temps) : ', { fontSize: '32px', fill: '#f00' });
            var scoreSave;
            if (time.time >= 0) {
                scoreSave = PhaserGame.score + time.time;
                scoreFinal.text = 'Score Final (Score + Bonus Temps) : ' + PhaserGame.score + ' + ' + time.time + ' = ' + scoreSave;
            } else {
                scoreSave = PhaserGame.score;
                scoreFinal.text = 'Score Final (Score + Bonus Temps) : ' + PhaserGame.score + ' + 0 = ' + scoreSave;
            }
            // We search the label 'Level i' in the cookies
            var str = "Level" + this.game.state.states['Game'].currentLevel;
            var nb = cookie.readCookie(str);

            //if this label doesn't exist,
            //we change the text to print the score
            if (nb == null) {
                cookie.createCookie(str, scoreSave, 10);
            } else {
                // if this label exists, we check if the score is bigger than the previous one
                if (nb < scoreSave) {
                    cookie.createCookie(str, scoreSave, 10);
                }
            }

            var button_menu = this.add.button(400, 210, 'RetMenu', this.menuclick, this);
            button_menu.name = 'Returnmenu';
            button_menu.anchor.setTo(0.5, 0.5);
            button_menu.fixedToCamera = true;

            var button_restart = this.add.button(400, 330, 'restart', this.restartclick, this);
            button_restart.name = 'restart';
            button_restart.anchor.setTo(0.5, 0.5);
            button_restart.fixedToCamera = true;

            var button_next = this.add.button(400, 450, 'buttonNextLevel', this.next, this);
            button_next.name = 'next';
            button_next.anchor.setTo(0.5, 0.5);
            button_next.fixedToCamera = true;

            this.add.text(50, 550, 'Appuyer sur Espace pour passer au niveau suivant', { fontSize: '42px', fill: '#fff' });


        },

        menuclick: function () {
            this.state.start('MainMenu');
        },

        restartclick: function () {
            this.state.start('Game');
        },

        next: function () {
            this.game.state.states['Game'].currentLevel += 1;
            if (this.game.nbLevel < this.game.state.states['Game'].currentLevel) {
                this.state.start('MainMenu', true, false);
            } else {
                music.stopMusic();
                this.state.start('Game', true, false);

            }
        },

        update: function () {
            if (PhaserGame.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.next();
            }
        }

    };

    return FinishLevelState;
});
