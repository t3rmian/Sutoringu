/**
 * Created by t3r on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.GameOver = function (game) {
        this.game = game;
    };

    Sutoringu.GameOver.prototype = {
        create: function () {
            this.game.state.start('Menu');
        }
    }

})();