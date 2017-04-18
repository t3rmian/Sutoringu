/**
 * Created by t3r on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.Boot = function (game) {
        this.game = game;
        this.textInput = null;
    };

    Sutoringu.Boot.prototype = {
        create: function () {
            this.textInput = document.getElementById("textInput");
            this.textInput.addEventListener("keydown", this.onKeyPressed.bind(this));
            swapWithCanvas(this.textInput);
            this.textInput.focus();
            this.game.state.start('Menu');

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
                    console.log(this.textInput.value);
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