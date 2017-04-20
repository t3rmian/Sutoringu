/**
 * Created by t3r on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.GameOver = function (game) {
        this.game = game;
        this.gameMode = undefined;
        this.log = undefined;
        this.score = 0;
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
                on_success.call(options.context, data);
            };

            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = src;

            document.getElementsByTagName('head')[0].appendChild(script);
        };

        return call;
    })();

    Sutoringu.GameOver.prototype = {
        init: function (score) {
            this.score = score;
        },

        preload: function () {
            this.game.load.spritesheet('button', 'assets/button.png', 384, 64);
        },

        create: function () {
            this.gameMode = this.game.state.states['Preload'].dictionary;
            let url = "https://script.google.com/macros/s/AKfycbyGlzl8cHe5l__ub3LsoIORsHAjIhN07jk9b8Fu11D1XLleBcI/exec";
            let params = "log=" + this.log + "&score=" + this.score + "&gameMode=" + this.gameMode.toLowerCase();
            let callbackName = 'onScoresUpdate';
            jsonp.send(url + "?" + params + "&callback=" + callbackName, {
                callbackName: callbackName,
                onSuccess: function (json) {
                    let placedLabel = "You placed ";
                    let scorePosition = this.game.add.text(horizontalCenter, 16 + 32 * 2 + 16, placedLabel + json.scoreRow + " out of " + json.rows, {
                        fontSize: '32px',
                        fill: '#000'
                    });
                    scorePosition.anchor.setTo(0.5, 0);
                    scorePosition.addColor('pink', placedLabel.length);
                    let value = ((json.rows - json.scoreRow + 1) / json.rows * 100).toFixed(2);
                    let thatLabel = "That makes you ";
                    let prefixLabel = thatLabel + "better than ";
                    let scorePercentage = this.game.add.text(horizontalCenter, 16 + 32 * 3 + 16, prefixLabel + value + "% of players", {
                        fontSize: '32px',
                        fill: '#000'
                    });
                    scorePercentage.anchor.setTo(0.5, 0);
                    scorePercentage.addColor('pink', thatLabel.length);
                },
                onTimeout: function () {
                    this.game.add.text(horizontalCenter, 16 + 32 * 2 + 16, "Connection to the server has been lost", {
                        fontSize: '32px',
                        fill: '#000'
                    }).anchor.setTo(0.5, 0);
                },
                timeout: 30,
                context: this
            });

            let horizontalCenter = this.game.width / 2;
            let gameOver = this.game.add.text(horizontalCenter, 16, 'GAME OVER!', {
                fontSize: '32px',
                fill: '#000'
            });
            gameOver.anchor.setTo(0.5, 0);

            let scoreLabel = this.gameMode + ' score: ';
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