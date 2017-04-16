/**
 * Created by Damian Terlecki on 15.04.17.
 */
"use strict";

let Sutoringu = function () {
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', false, false);
};

Sutoringu.prototype = {
    start: function () {
        this.game.state.add('Boot', Sutoringu.Boot);
        this.game.state.add('Menu', Sutoringu.Menu);
        this.game.state.add('Play', Sutoringu.Play);
        this.game.state.add('GameOver', Sutoringu.GameOver);
        this.game.state.start('Boot');
    },
};

window.onload = function () {
    new Sutoringu().start();
};
