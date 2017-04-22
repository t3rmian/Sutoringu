/**
 * Created by t3r on 23.04.17.
 */
(function () {
    'use strict';

    Sutoringu.AdvancedMenu = function (game) {
        this.game = game;
        this.title = "Sutoringu";
        this.labels = {
            "Hiragana": {
                "Basic hiragana": "hiragana",
                "Advanced hiragana": "hiragana_advanced"
            },
            "Katakana": {
                "Basic katakana": "katakana",
                "Advanced katakana": "katakana_advanced"
            },
            "Kanji": {"Kanji I grade": "kanji_1"}
        };
        this.gameMode = null;
        this.authorData = null;
    };

    Sutoringu.AdvancedMenu.prototype = {
        init: function (gameMode) {
            this.gameMode = gameMode;
        },

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
            let i = 0;
            let labels = this.labels[this.gameMode];
            for (let label in labels) {
                if (!labels.hasOwnProperty(label)) {
                    continue;
                }
                let verticalCenter = this.game.height / 2;
                let halfTotalHeight = (Object.keys(labels).length - 1) * (64 + 32) / 2;
                let itemHeight = i * (64 + 32);
                verticalPosition = verticalCenter - halfTotalHeight + itemHeight;
                new LabelButton(this.game, horizontalCenter,
                    verticalPosition,
                    "button", label, onGameplayClick, 1, 0, 2, this);
                ++i;
            }

            new LabelButton(this.game, horizontalCenter,
                verticalPosition + 64 + 32 + 32,
                "button", "Menu", onMenuClick, 1, 0, 2, this);

            function setUpBackground() {
                this.game.stage.backgroundColor = 0xffffff;
                const sakuraCanvas = this.game.make.bitmapData(this.game.world.width, this.game.world.height);
                new Sakura(sakuraCanvas, '#ff000000', '#ffa7c5').create().paint();
                sakuraCanvas.addToWorld();
            }

            function onMenuClick() {
                this.context.game.state.start('Menu');
            }

            function onGameplayClick() {
                this.game.state.start('Preload', true, true, this.context.labels[this.context.gameMode][this.label.text], this.label.text);
            }
        }
    };

})();