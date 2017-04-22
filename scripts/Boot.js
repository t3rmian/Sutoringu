/**
 * Created by t3r on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.Boot = function (game) {
        this.game = game;
        this.textInput = null;
        this.forfeitButton = null;
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
        create: function () {
            this.game.stage.backgroundColor = 0xffffff;
            this.forfeitButton = document.getElementById('forfeit');
            this.textInput = document.getElementById("textInput");
            this.textInput.addEventListener("keydown", this.onKeyPressed.bind(this));
            swapWithCanvas(this.textInput);
            this.game.state.start('Menu');
            let modal = document.getElementById('modal');
            let span = document.getElementsByClassName("close")[0];
            span.onclick = function () {
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
                    modal.style.display = "none";
                }
            };
            document.addEventListener("keydown", function keyDownTextField(e) {
                var keyCode = e.keyCode;
                if (keyCode == 27) {
                    modal.style.display = "none";
                }
            }, false);
            document.getElementById('body').sakura('start', this.sakuraFallOptions);

            function swapWithCanvas(a) {
                const aParent = a.parentNode;
                const aSibling = aParent.getElementsByTagName('canvas')[0];
                aParent.insertBefore(aSibling, a);
            }
        },

        onKeyPressed: function (e) {
            "use strict";
            const state = this.game.state.current;
            if (state === 'Play') {
                const code = (e.keyCode ? e.keyCode : e.which);
                if (code === 27) {
                    this.textInput.value = "";
                }
                else if (code === 13) {
                    const text = this.textInput.value;
                    const removed = this.game.state.states[state].removeText(text);
                    if (removed) {
                        this.textInput.value = "";
                    }
                }
            }
        }
    }

})();