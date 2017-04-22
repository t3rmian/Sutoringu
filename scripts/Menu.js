/**
 * Created by t3r on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.Menu = function (game) {
        this.game = game;
        this.title = "Sutoringu";
        this.labels = ["Hiragana", "Katakana", "Kanji"];
        this.about = "About";
        this.authorData = null;
    };

    Sutoringu.Menu.prototype = {
        preload: function () {
            this.game.load.spritesheet('button', 'assets/button.png', 384, 64);
            this.game.load.image('favicon', 'assets/favicon.ico', 256, 256);
        },

        create: function () {
            setUpBackground.call(this);
            let horizontalCenter = this.game.width / 2;
            let title = this.game.add.text(horizontalCenter, 16, this.title, {
                fontSize: '48px',
                fill: '#ff0044',
                boundsAlignH: "center"
            });
            let favicon = this.game.add.sprite(0, 0, 'favicon');
            favicon.scale.setTo(0.25, 0.25);
            favicon.x = horizontalCenter - title.width / 2 - 8;
            favicon.y = title.height / 1.5;
            favicon.anchor.setTo(0.5, 0.5);
            title.x += favicon.width / 2 + 8;
            title.anchor.setTo(0.5, 0);
            let verticalPosition;
            for (let i = 0; i < this.labels.length; i++) {
                let verticalCenter = this.game.height / 2;
                let halfTotalHeight = (this.labels.length - 1) * (64 + 32) / 2;
                let itemHeight = i * (64 + 32);
                verticalPosition = verticalCenter - halfTotalHeight + itemHeight;
                new LabelButton(this.game, horizontalCenter,
                    verticalPosition,
                    "button", this.labels[i], onGameplayClick, 1, 0, 2);
            }

            this.aboutButton = new LabelButton(this.game, horizontalCenter,
                verticalPosition + 64 + 32 + 32,
                "button", this.about, onAboutClick, 1, 0, 2, this);

            function setUpBackground() {
                this.game.stage.backgroundColor = 0xffffff;
                const sakuraCanvas = this.game.make.bitmapData(this.game.world.width, this.game.world.height);
                new Sakura(sakuraCanvas, '#ff000000', '#ffa7c5').create().paint();
                sakuraCanvas.addToWorld();
            }

            function onGameplayClick() {
                this.game.state.start('Preload', true, true, this.label.text);
            }

            function onAboutClick() {
                document.getElementById('modal').style.display = "block";
                document.getElementById('modal-content').innerHTML =
                    "<div id='author' style='font-size: 1.5em;text-align: center;'>" +
                    "<img src='assets/favicon.ico' style='width: 64px;height: 64px;margin-bottom: 16px'/></br>" +
                    "<b>Sutoringu v1.0.0</br>Created by <a href='https://t3r1jj.github.io'>Damian Terlecki</a></b>" +
                    "<div id='author-loader' class='author-loader' style='margin-left: auto;margin-right:auto;margin-top: 8px;'></div></br>" +
                    "<div style='text-align: center'><b>Attributions; build on:</b>" +
                    "<ul style='font-size: 0.67em;text-align: left'><li><a href='https://phaser.io/'>Phaser</a> CE v2.7.6 - Copyright (c) 2017 Richard Davey, Photon Storm Ltd.</li>" +
                    "<li><a href='https://github.com/timoschaefer/jQuery-Sakura'>jQuery-Sakura</a> - Copyright (c) 2014 Timo Schäfer</li>" +
                    "<li>Image assets - <a href='https://pixabay.com/'>Pixabay</a></li></ul></div>";
                setTimeout(function (context) {
                    context.aboutButton.frame = 3;
                    context.aboutButton.resetFrame();
                }, 10, this);
                let url = 'https://script.google.com/macros/s/AKfycbyu4wyBly1IlJbHQpbs9TFBUOO7MyjWT-flleHMjcD1h7J3crR3/exec';
                let callbackName = 'onAboutReceiveInfo';
                if (this.authorData !== null) {
                    let elementById = document.getElementById('author-loader');
                    elementById.classList.remove('author-loader');
                    elementById.innerHTML += this.authorData;
                } else {
                    jsonp.send(url + "?callback=" + callbackName, {
                        callbackName: callbackName,
                        onSuccess: function (json) {
                            let elementById = document.getElementById('author-loader');
                            elementById.classList.remove('author-loader');
                            elementById.innerHTML += json.data;
                            this.authorData = json.data;
                        },
                        onTimeout: function () {
                            let elementById = document.getElementById('author-loader');
                            elementById.classList.remove('author-loader');
                            elementById.innerText = "Connection to the server has been lost";
                        },
                        timeout: 30,
                        context: this
                    });
                }
            }
        }
    };

})();