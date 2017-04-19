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

        preload: function () {
            this.game.load.spritesheet('button', 'assets/button.png', 384, 64);
        },

        create: function () {
            let horizontalCenter = this.game.width / 2;
            let gameOver = this.game.add.text(horizontalCenter, 16, 'GAME OVER!', {
                fontSize: '32px',
                fill: '#000'
            });
            gameOver.anchor.setTo(0.5, 0);

            let scoreLabel = 'Score: ';
            let score = this.game.add.text(horizontalCenter, 16 + 32 + 16, scoreLabel + this.score, {
                fontSize: '32px',
                fill: '#000'
            });
            score.anchor.setTo(0.5, 0);
            score.addColor('pink', scoreLabel.length);

            let verticalCenter = this.game.height / 2;
            new LabelButton(this.game, horizontalCenter,
                verticalCenter, "button", 'Restart', onRestartClick, 1, 0, 2);
            new LabelButton(this.game, horizontalCenter,
                verticalCenter + 64 + 32, "button", 'Menu', onMenuClick, 1, 0, 2);

            function onRestartClick() {
                this.game.state.start('Preload');
            }

            function onMenuClick() {
                this.game.state.start('Menu');
            }
        }
    }

})();