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
    };

    Sutoringu.Menu.prototype = {
        preload: function () {
            this.game.load.spritesheet('button', 'assets/button.png', 384, 64);
        },

        create: function () {
            setUpBackground.call(this);
            let horizontalCenter = this.game.width / 2;
            let title = this.game.add.text(horizontalCenter, 16, this.title, {
                fontSize: '48px',
                fill: 'pink',
                boundsAlignH: "center"
            });
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
                document.getElementById('modal-content').innerText = "Created by Damian Terlecki\n\nasdasd";

                setTimeout(function (context) {
                    context.aboutButton.frame = 3;
                    context.aboutButton.resetFrame();
                }, 10, this);
            }
        }
    };

})();