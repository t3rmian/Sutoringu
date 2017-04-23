/**
 * Created by Damian Terlecki on 15.04.17.
 */
"use strict";
let Sutoringu = function () {
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', false, false);
};

let jsonp = (function () {
    let call = {};

    call.send = function (src, options) {
        let callback_name = options.callbackName || 'callback',
            on_success = options.onSuccess || function () {
                },
            on_timeout = options.onTimeout || function () {
                },
            timeout = options.timeout || 30;

        let timeoutTrigger = window.setTimeout(function () {
            window[callback_name] = function () {
            };
            on_timeout.call(options.context);
        }, timeout * 1000);

        window[callback_name] = function (data) {
            window.clearTimeout(timeoutTrigger);
            if (data.result === 'success') {
                on_success.call(options.context, data);
            } else {
                on_timeout.call(options.context);
            }
        };

        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = src;

        document.getElementsByTagName('head')[0].appendChild(script);
    };

    return call;
})();

Sutoringu.prototype = {
    start: function () {
        this.game.state.add('Boot', Sutoringu.Boot);
        this.game.state.add('Menu', Sutoringu.Menu);
        this.game.state.add('AdvancedMenu', Sutoringu.AdvancedMenu);
        this.game.state.add('Preload', Sutoringu.Preload);
        this.game.state.add('Play', Sutoringu.Play);
        this.game.state.add('GameOver', Sutoringu.GameOver);
        this.game.state.start('Boot');
    },
};

window.onload = function () {
    new Sutoringu().start();
};
