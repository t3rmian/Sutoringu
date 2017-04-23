/**
 * Created by Damian Terlecki on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.Preload = function (game) {
        this.game = game;
    };

    Sutoringu.Preload.prototype = {
        init: function (dictionary = this.dictionary, gameMode = this.gameMode) {
            this.dictionary = dictionary;
            this.gameMode = gameMode;
        },
        create: function () {
            document.getElementById('body').sakura('stop');
            loadJSON.call(this, loadDictionary);

            function loadJSON(callback) {
                let xhr = new XMLHttpRequest();
                xhr.overrideMimeType("application/json");
                xhr.open('GET', 'assets/dictionaries/' + this.dictionary.toLowerCase() + '.json', true);
                xhr.onreadystatechange = (function (xhr, context) {
                    return function () {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            callback.call(context, xhr.responseText);
                        }
                    }
                })(xhr, this);
                xhr.send(null);
            }

            function loadDictionary(response) {
                this.game.state.start('Play', true, false, JSON.parse(response), this.gameMode);
            }
        }
    }

})();