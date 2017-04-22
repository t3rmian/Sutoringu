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
        this.serverScore = null;
        this.missedCharacters = null;
        this.scoreChart = null;
        this.loadingLabels = ["Loading ranking", "Loading ranking.", "Loading ranking..", "Loading ranking..."]
        this.loadingIndex = 1;
    };

    Sutoringu.GameOver.prototype = {
        init: function (score, missedCharacters, gameMode) {
            this.score = score;
            this.missedCharacters = missedCharacters;
            this.gameMode = gameMode;
        },

        preload: function () {
            this.game.load.spritesheet('button', 'assets/button.png', 384, 64);
            this.game.load.spritesheet('scoreChart', 'assets/scoreChart.png', 64, 64, 6);
            document.getElementById('body').sakura('start', this.game.state.states['Boot'].sakuraFallOptions);
        },

        create: function () {
            let horizontalCenter = this.game.width / 2;
            this.serverScore = this.game.add.text(horizontalCenter, 16 + 32 * 2 + 16, this.loadingLabels[this.loadingIndex], {
                fontSize: '32px',
                fill: '#000'
            });
            this.serverScore.anchor.setTo(0.5, 0);
            this.game.time.events.add(Phaser.Timer.SECOND * 0.5, loadingAnimation, this);
            this.log = SparkMD5.hash(Math.floor(new Date() / 1000).toString() + this.score.toString());
            let url = "https://script.google.com/macros/s/AKfycbyGlzl8cHe5l__ub3LsoIORsHAjIhN07jk9b8Fu11D1XLleBcI/exec";
            let params = "log=" + this.log + "&score=" + this.score + "&gameMode=" + this.gameMode.toLowerCase();
            let callbackName = 'onScoresUpdate';
            jsonp.send(url + "?" + params + "&callback=" + callbackName, {
                callbackName: callbackName,
                onSuccess: function (json) {
                    this.loadingIndex = -1;
                    if (this.game.state.current !== 'GameOver') {
                        return;
                    }
                    let horizontalCenter = this.game.width / 2;
                    let placedLabel = "You placed ";
                    this.serverScore.text = placedLabel + json.scoreRow + " out of " + json.rows;
                    this.serverScore.anchor.setTo(0.5, 0);
                    this.serverScore.addColor('#ff0044', placedLabel.length);
                    let value = ((json.rows - json.scoreRow + 1) / json.rows * 100).toFixed(2);
                    let thatLabel = "That makes you ";
                    let prefixLabel = thatLabel + "better than ";
                    let scorePercentage = this.game.add.text(horizontalCenter, 16 + 32 * 3 + 16, prefixLabel + value + "% of players", {
                        fontSize: '32px',
                        fill: '#000'
                    });
                    this.scoreChart.frame = Math.round(value / 100 * 5);
                    scorePercentage.anchor.setTo(0.5, 0);
                    scorePercentage.addColor('#ff0044', thatLabel.length);
                },
                onTimeout: function () {
                    this.loadingIndex = -1;
                    if (this.game.state.current !== 'GameOver') {
                        return;
                    }
                    this.serverScore.text = "";
                    this.game.add.text(horizontalCenter, 16 + 32 * 2 + 16, "Connection to the server has been lost", {
                        fontSize: '32px',
                        fill: '#000'
                    }).anchor.setTo(0.5, 0);
                },
                timeout: 30,
                context: this
            });

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
            score.addColor('#ff0044', scoreLabel.length);

            let verticalCenter = this.game.height / 2;
            this.scoreChart = this.game.add.sprite(horizontalCenter, verticalCenter - 64 - 32 + 8, 'scoreChart');
            this.scoreChart.smoothed = true;
            this.scoreChart.anchor.setTo(0.5, 0.5);
            new LabelButton(this.game, horizontalCenter,
                verticalCenter, "button", 'Restart', onRestartClick, 1, 0, 2);
            new LabelButton(this.game, horizontalCenter,
                verticalCenter + 64 + 32, "button", 'Menu', onMenuClick, 1, 0, 2);
            if (this.missedCharacters.length !== 0) {
                this.missingButton = new LabelButton(this.game, horizontalCenter,
                    verticalCenter + (64 + 32) * 2 + 32, "button", 'Missed characters', onMissedClick, 1, 0, 2, this);
            }

            function loadingAnimation() {
                if (this.loadingIndex >= 0) {
                    this.loadingIndex += 1;
                    this.loadingIndex %= this.loadingLabels.length;
                    this.serverScore.text = this.loadingLabels[this.loadingIndex];
                    this.game.time.events.add(Phaser.Timer.SECOND * 0.5, loadingAnimation, this);
                }
            }

            function onRestartClick() {
                this.game.state.start('Preload');
            }

            function onMenuClick() {
                this.game.state.start('Menu');
            }

            function onMissedClick() {
                let isKanji = this.context.gameMode.toLowerCase().includes('kanji');
                let output = "<div style='font-size: 1.3em; text-align: center;'><b>Missed " + (isKanji ? "words" : "characters")
                    + " (" + this.context.gameMode + "):</b><ol style='text-align: left'>";
                let prefix = "<li>";

                for (let i = 0; i < this.context.missedCharacters.length; i++) {
                    let entry = this.context.missedCharacters[i];
                    output += prefix + "<b style='font-size: 1.3em;color: #ff0044;'>" + entry.string + "</b>" + getMissedItemDescription(entry, isKanji);
                    prefix = "</li><li>";
                }
                output += "</li></ol></div>";
                document.getElementById('modal').style.display = "block";
                document.getElementById('modal-content').innerHTML = output;
                setTimeout(function (context) {
                    context.missingButton.frame = 3;
                    context.missingButton.resetFrame();
                }, 10, this.context);

                function getMissedItemDescription(entry, isKanji) {
                    if (isKanji) {
                        let output = " - ";
                        let prefix = "";
                        for (let i = 0; i < entry.meaning.length; i++) {
                            output += prefix + entry.meaning[i];
                            prefix = ", ";
                        }
                        output += "<br/><b>On'yomi</b><ul>";
                        prefix = "<li>";
                        for (let i = 0; i < entry.onyomi.length; i++) {
                            output += prefix + entry.onyomi[i];
                            prefix = "</li><li>";
                        }
                        output += "</li></ul><b>Kun'yomi</b><ul>";
                        prefix = "<li>";
                        for (let i = 0; i < entry.kunyomi.length; i++) {
                            output += prefix + entry.kunyomi[i];
                            prefix = "</li><li>";
                        }
                        output += "</li></ul><br/>";
                        return output;
                    } else {
                        return " - " + entry.romaji;
                    }
                }
            }
        },
    }


})();