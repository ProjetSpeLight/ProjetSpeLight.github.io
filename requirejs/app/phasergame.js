define(['phaser'], function (Phaser) {
    return {
        game: null,
        start: function () {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, '');
        }
    }
});
