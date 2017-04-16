/**
 * Created by t3r on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.Menu = function (game) {
        this.game = game;
    };

    Sutoringu.Menu.prototype = {
        create: function () {
            this.game.state.start('Play');
        }
    }

})();