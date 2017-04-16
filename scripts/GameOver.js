/**
 * Created by t3r on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.GameOver = function (game) {
        this.game = game;
        this.score = 0;
    };

    Sutoringu.GameOver.prototype = {

        init: function (score) {
            this.score = score;
        },

        create: function () {
            this.game.add.text(this.game.width / 2, this.game.height / 2, 'GAME OVER!', {
                fontSize: '32px',
                fill: '#000'
            });
            this.game.add.text(this.game.width / 2, this.game.height / 2 + 64, 'Score: ' + this.score, {
                fontSize: '32px',
                fill: '#000'
            });
            let restart = this.game.add.text(this.game.width / 2, this.game.height / 2 + 2 * 64, 'Restart', {
                fontSize: '32px',
                fill: '#000'
            });
            restart.inputEnabled = true;
            restart.events.onInputDown.add(onRestartPress, this)

            function onRestartPress() {
                console.log("pressed");
                this.game.state.start('Preload');
            }
        }
    }

})();