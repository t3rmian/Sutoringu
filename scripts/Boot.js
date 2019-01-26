/**
 * Created by Damian Terlecki on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.Boot = function (game) {
        this.game = game;
        this.textInput = null;
        this.forfeitButton = null;
        this.muteButton = null;
        this.sakuraFallOptions = {
            // blowAnimations: [
            //     'blow-soft-left',
            // ],
            // swayAnimations: [
            //     'sway-0',
            // ],
            className: 'sakura',
            fallSpeed: 1,
            maxSize: 14,
            minSize: 9,
            newOn: 300
        }
    };

    Sutoringu.Boot.prototype = {
        preload: function () {
            this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.game.scale.setResizeCallback(this.resizeCallback, this);
            this.game.load.image('favicon', 'assets/images/favicon.ico', 256, 256);
            this.game.load.image('floor', 'assets/images/floor.png');
            this.game.load.spritesheet('button', 'assets/images/button.png', 384, 64);
            this.game.load.spritesheet('scoreChart', 'assets/images/scoreChart.png', 64, 64, 6);
        },
        create: function () {
            this.game.stage.backgroundColor = 0xffffff;
            this.forfeitButton = document.getElementById('forfeit');
            this.muteButton = document.getElementById('mute');
            this.muteLabel = document.getElementById('muteLabel');
            this.textInput = document.getElementById("textInput");
            this.muteButton.checked = !this.game.device.desktop;
            this.textInput.addEventListener("keydown", this.onKeyPressed.bind(this));
            swapWithCanvas(this.textInput);
            this.game.state.start('Menu');
            let modal = document.getElementById('modal');
            let span = document.getElementsByClassName("close")[0];
            window.addEventListener('popstate', function (event) {
                removeAboutHash();
                modal.style.display = "none";
            });
            span.onclick = function () {
                removeAboutHash();
                modal.style.display = "none";
            };
            this.forfeitButton.addEventListener("click", function forfeit() {
                const state = this.game.state.current;
                if (state === 'Play') {
                    this.game.state.states[this.game.state.current].forfeit();
                }
            }.bind(this));
            window.onclick = function (event) {
                if (event.target === modal) {
                    removeAboutHash();
                    modal.style.display = "none";
                }
            };
            document.addEventListener("keydown", function keyDownTextField(e) {
                var keyCode = e.keyCode;
                if (keyCode == 27) {
                    removeAboutHash();
                    modal.style.display = "none";
                }
            }, false);
            document.getElementById('body').sakura('start', this.sakuraFallOptions);

            function swapWithCanvas(a) {
                const aParent = a.parentNode;
                const aSibling = aParent.getElementsByTagName('canvas')[0];
                aParent.insertBefore(aSibling, a);
            }

            function removeAboutHash() {
                if (window.history.state && window.history.state.generatedInternally) {
                    window.history.back();
                } else {
                    history.replaceState(null, null, ' ');
                }
            }
        },

        onKeyPressed: function (e) {
            "use strict";
            const state = this.game.state.current;
            if (state === 'Play') {
                const code = (e.keyCode ? e.keyCode : e.which);
                if (code === 27) {
                    this.textInput.value = "";
                } else if (code === 13) {
                    const text = this.textInput.value;
                    const removed = this.game.state.states[state].removeText(text);
                    if (removed) {
                        this.textInput.value = "";
                    }
                }
            }
        },

        resizeCallback: function () {
            if (this.game._cacheWidth !== window.innerWidth || this.game._cacheHeight !== window.innerHeight) {
                this.game._cacheWidth = window.innerWidth;
                this.game._cacheHeight = window.innerHeight;
            } else {
                return
            }
            let gameWidth = this.game._width;
            let uiHeight = this.game._uiHeight;
            let gameHeight = this.game._height;
            let ratio = gameWidth / gameHeight;
            if (window.innerHeight < (gameHeight + uiHeight) || window.innerWidth < gameWidth) {
                if (window.innerWidth < (window.innerHeight - uiHeight) * ratio) {
                    gameHeight = window.innerWidth / ratio;
                    gameWidth = window.innerWidth;
                } else {
                    gameHeight = window.innerHeight - uiHeight;
                    gameWidth = (window.innerHeight - uiHeight) * ratio;
                }
            }
            this.game.scale.maxHeight = gameHeight;
            this.game.scale.maxWidth = gameWidth;
            this.game.scale.refresh();
        }
    }

})();