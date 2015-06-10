define(['phaser', 'app/touch', 'app/music', 'app/cutscenes/intro', 'app/objects/time', 'app/phasergame'], function (Phaser, Touch, music, Intro, time, PhaserGame) {


    var musique;

    function MainMenuState(game) {};
    
    MainMenuState.prototype = {

        create: function () {            

            this.game.state.states['Game'].currentLevel = 1;

            //Gestion de du fond
            this.createTitle();

            var button_play = this.add.button(400, 180, 'play', this.playGame, this, 1, 0, 1);
            button_play.name = 'play';
            button_play.anchor.setTo(0.5, 0.5);

            var button_tutorial = this.add.button(400, 300, 'tutorial', this.playTutorial, this, 1, 0, 1);
            button_tutorial.name = 'tutorial';
            button_tutorial.anchor.setTo(0.5, 0.5);

            var button_help = this.add.button(400, 420, 'help', this.help, this, 1, 0, 1);
            button_help.name = 'tutorial';
            button_help.anchor.setTo(0.5, 0.5);

            if(!this.game.device.desktop){
                Touch.stop();
                Touch.boutonsSwitch();
            }
            if (music.music != null) {
                music.stopMusic();
            }
        },

        playGame: function () {
            musique.stop();
            this.state.start('ChooseLevel');
        },

        playTutorial: function () {
            musique.stop();
            this.game.state.states['Game'].currentLevel = 0;
            this.state.start('Game');
        },

        help: function () {
            musique.stop();
            this.state.start('FinishLevel');
        },

        createTitle: function () {
            if (musique != null) {
                musique.stop();
            }
            musique = PhaserGame.game.add.audio('Titre');
            musique.play();
            title = this.game.add.sprite(0, 0, 'ecrantitre');
            var boule = [];
            for (i = 0; i < 3; ++i) {
                boule[i] = Intro.createBoule(Math.floor(Math.random() * 250), Math.floor(100 + Math.random() * 400), i % 3);
                boule[i].animations.play('anim');
            }
            for (i = 0; i < 3; ++i) {
                boule[i] = Intro.createBoule(Math.floor(500 + Math.random() * 250), Math.floor(300 + Math.random() * 250), i % 3);
                boule[i].animations.play('anim');
            }
        },

        update: function () {
            if (!musique.pause) {
                //we check if it is not the first loop 
                // to avoid a useless restart 
                if ((time.time - time.timebegin) != 0) {
                    // For this moment, the only music we have lasts 17 sec
                    // so we check if the time is equal to k*17 sec
                    /* To improve : add a information when we 
                       choose the level with the time of the music for
                       this level */
                    if (((time.timebegin - time.time) % 17) == 0) {

                        musique.stop();
                        musique.play();

                    }

                }
            }
        }

    };
    
    
    return MainMenuState;
});
