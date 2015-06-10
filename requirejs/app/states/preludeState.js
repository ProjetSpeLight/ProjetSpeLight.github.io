define(['phaser', 'app/phasergame', 'app/player', 'app/cutscenes/intro'], function (Phaser, PhaserGame, player, Intro)
{


    function PreludeState(game) {
        
        var i = 0;
        var passed = false;
    }

    PreludeState.prototype = {
        create: function () {
            //Mise en route du moteur
            PhaserGame.game.physics.startSystem(Phaser.Physics.ARCADE);

            //Boolean pour passer la cutscene
            this.passed = false;

            //Création des 2 sprites
            Intro.BG_good = PhaserGame.game.add.sprite(0, 0, 'BG_good');
            var coef = 600 / 720;
            Intro.BG_good.scale.x = coef;
            Intro.BG_good.scale.y = coef;
            Intro.BG_good.alpha = 0;

            Intro.BG_bad = PhaserGame.game.add.sprite(0, 0, 'BG_bad');
            Intro.BG_bad.scale.x = coef;
            Intro.BG_bad.scale.y = coef;
            Intro.BG_bad.alpha = 0;

            //Activation du moteur pour BG_bad
            PhaserGame.game.physics.arcade.enable(Intro.BG_bad);
            Intro.BG_bad.body.setSize(Intro.BG_bad.width, 150, 0, 600 - 100);
            Intro.BG_bad.body.immovable = true;

            //Création du joueur
            player.initializePlayer(PhaserGame.game, 100, 100);
            player.sprite.body.gravity.y = 30;
            player.sprite.frame = 3;
            player.sprite.alpha = 0;

            //Passage de cutscene
            PhaserGame.game.input.keyboard.onPressCallback = this.passer;
            PhaserGame.game.input.touch.touchStartCallback = this.passer;

            //Mise à jour de la musique
            Intro.musique1 = PhaserGame.game.add.audio('conte');
            Intro.musique2 = PhaserGame.game.add.audio('desastre');
            Intro.musique3 = PhaserGame.game.add.audio('heros');

            sounds = [Intro.musique1,Intro.musique2,Intro.musique3];

            //Lancement de l'intro après chargement des musiques
            //PhaserGame.game.sound.setDecodedCallback(sounds, Intro.intro1, this);
            Intro.intro1();
           
         
        },

        update: function () {
            //Collision entre joueur et bas du BG
            PhaserGame.game.physics.arcade.collide(Intro.BG_bad, player.sprite);
        },
        
        passer: function () {
            if (this.passed) {
                Intro.finIntro();
            } else {
                this.passed = true;
                style = { font: "40px Arial", fill: "#ffffff", align: "center" };
                text = PhaserGame.game.add.text(2 * PhaserGame.game.world.width / 3, 5 * PhaserGame.game.world.height / 6, "Rappuyez pour passer...", style);
                text.anchor.set(0.5);
                PhaserGame.game.time.events.add(2000, function () {
                    this.passed = false;
                    text.destroy();
                }, this);
            }
        },
    };

    return PreludeState;
});
