/**
 * Created by Damian Terlecki on 23.04.17.
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
            "Kanji": {
                "Kanji I grade": "kanji_1",
                "Kanji II grade": "kanji_2",
                "Kanji III grade": "kanji_3",
                "Kanji IV grade": "kanji_4",
                "Kanji V grade": "kanji_5",
                "Kanji VI grade": "kanji_6"
            }
        };
        this.gameMode = null;
        this.authorData = null;
    };

    Sutoringu.AdvancedMenu.prototype = {
        init: function (gameMode) {
            this.gameMode = gameMode;
        },

        create: function () {
            setUpBackground.call(this);
            let horizontalCenter = this.game.width / 2;
            let title = this.game.add.text(horizontalCenter, 16, this.title, {
                fontSize: '48px',
                fill: '#ff0044',
                boundsAlignH: "center",
                font: 'Molle'
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
            let verticalCenter = this.game.height / 2;
            for (let label in labels) {
                if (!labels.hasOwnProperty(label)) {
                    continue;
                }
                let halfTotalHeight = (Object.keys(labels).length - 1) * (64 + 32) / 2;
                let itemHeight = i * (64 + 32);
                verticalPosition = verticalCenter - halfTotalHeight + itemHeight;
                new LabelButton(this.game, horizontalCenter,
                    verticalPosition,
                    "button", label, onGameplayClick, 1, 0, 2, this);
                ++i;
            }

            let isKanjiGameMode = this.gameMode === 'Kanji';
            let menuButton = new LabelButton(this.game, horizontalCenter,
                verticalPosition + 64 + 32 + 32,
                "button", "Menu", onMenuClick, 1, 0, 2, this, isKanjiGameMode);
            if (isKanjiGameMode) {
                menuButton.y = verticalCenter;
                menuButton.x = 32;
            }

            function setUpBackground() {
                const sakuraCanvas = this.game.make.bitmapData(this.game.world.width, this.game.world.height);
                new Sakura(sakuraCanvas, '#ff000000', '#ffa7c5').create().paint();
                sakuraCanvas.addToWorld();
            }

            function onMenuClick() {
                this.context.game.state.start('Menu');
            }

            function onGameplayClick() {
                this.game.state.start('Preload', true, false, this.context.labels[this.context.gameMode][this.label.text], this.label.text);
            }
        }
    };

})();