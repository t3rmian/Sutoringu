/**
 * Created by Damian Terlecki on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.Play = function (game) {
        this.game = game;
        this.font = "48px Courier New";
        this.gravity = 100;
        this.gravityRange = [100, 1000];
        this.wordsDelayRange = [0.5, 3];
        this.bounce = 0.5;
        this.loadedDictionary = null;
        this.platforms = null;
        this.texts = null;
        this.score = 0;
        this.scoreText = null;
        this.textInput = null;
        this.dictionary = [];
        this.missedCharacters = [];
        this.deletableSprites = [];
        this.deletableTracks = [];
        this.maxWordsDelaySec = 0;
        this.game = undefined;
        this.isKanjiGameplay = undefined;
        this.sliderValue = 0;
    };

    function updateScore(newScore) {
        this.score = Math.round(newScore);
        this.scoreText.text = 'Score: ' + this.score;
        if (this.loadedDictionary.length <= 0 && this.dictionary.length <= 0) {
            this.textInput.style.visibility = 'hidden';
            this.forfeitButton.style.visibility = 'hidden';
            this.muteLabel.style.visibility = 'hidden';
            this.muteButton.style.visibility = 'hidden';
            setTimeout(function () {
                this.forfeit();
            }.bind(this), 1000);
        }
    }

    function calculateScore(scorePercentage) {
        return Math.round(10 + Math.pow(9.5 * scorePercentage, 2));
    }

    function calculateMaxWordDelay(value) {
        return this.wordsDelayRange[1] - (this.wordsDelayRange[1] - this.wordsDelayRange[0]) * value;
    }

    function calculateSliderValue() {
        return (this.gravity - this.gravityRange[0]) / (this.gravityRange[1] - this.gravityRange[0]);
    }

    Sutoringu.Play.prototype = {

        init: function (dictionary, gameMode) {
            this.dictionary = [];
            this.missedCharacters = [];
            this.deletableSprites = [];
            this.deletableTracks = [];
            this.loadedDictionary = dictionary;
            this.gameMode = gameMode;
            this.score = 0;
            this.isKanjiGameplay = gameMode.toLowerCase().includes('kanji');

            if (this.isKanjiGameplay) {
                this.wordsDelayRange[1] = 3;
                this.maxWordsDelaySec = calculateMaxWordDelay.call(this, calculateSliderValue.call(this));
            } else {
                this.wordsDelayRange[1] = 1.5;
                this.maxWordsDelaySec = calculateMaxWordDelay.call(this, calculateSliderValue.call(this));
            }
        },

        preload: function () {
            this.slickUI = this.game.plugins.add(Phaser.Plugin.SlickUI);
            this.slickUI.load('assets/theme/kenney.json');
        },

        create: function () {
            setUpHtmlUI.call(this);
            setUpSlider.call(this);
            setUpBackground(this.game);
            setUpFloor(this);
            setUpTexts(this);
            this.game.time.events.add(Phaser.Timer.SECOND, startGeneratingWords, this);

            function setUpHtmlUI() {
                this.textInput = this.game.state.states['Boot'].textInput;
                this.forfeitButton = this.game.state.states['Boot'].forfeitButton;
                this.muteButton = this.game.state.states['Boot'].muteButton;
                this.muteLabel = this.game.state.states['Boot'].muteLabel;
                this.forfeitButton.style.visibility = 'visible';
                this.muteButton.style.visibility = 'visible';
                this.muteLabel.style.visibility = 'visible';
                this.textInput.style.visibility = 'visible';
                this.textInput.focus();
            }

            function setUpSlider() {
                let slider = new SlickUI.Element.Slider(this.game.world.width - 150 - 32 + 8, 30, 150);
                let value = calculateSliderValue.call(this);
                slider._value = value;
                this.sliderValue = value;
                this.slickUI.add(slider);
                slider.onDrag.add(onSpeedChange.bind(this));
                slider.onDragStart.add(onSpeedChange.bind(this));
                slider.onDragStop.add(onSpeedChange.bind(this));

                function onSpeedChange(value) {
                    this.gravity = this.gravityRange[0] + (this.gravityRange[1] - this.gravityRange[0]) * value;
                    this.maxWordsDelaySec = calculateMaxWordDelay.call(this, value);
                    this.sliderValue = value;
                }
            }

            function setUpBackground(game) {
                const sakuraCanvas = game.make.bitmapData(game.world.width, game.world.height);
                sakuraCanvas.ctx.globalAlpha = 0.5;
                new Sakura(sakuraCanvas, '#ff000000', '#ffa7c5').create().paint();
                sakuraCanvas.addToWorld();
            }

            function setUpFloor(play) {
                play.platforms = play.game.add.group();
                play.platforms.enableBody = true;
                const groundPieces = play.game.world.width / 32;
                for (let x = 0; x < groundPieces; x++) {
                    const ground = play.platforms.create(x * 32, play.game.world.height - 32, 'floor');
                    ground.body.immovable = true;
                    ground.anchor.setTo(0, 0);
                }
            }

            function setUpTexts(play) {
                play.scoreText = play.game.add.text(8, 0, 'Score: 0', {
                    fontSize: '32px',
                    fill: '#000',
                    font: 'Candal'
                });
                play.texts = play.game.add.group();
                play.texts.enableBody = true;
            }

            function startGeneratingWords() {
                if (this.loadedDictionary.length <= 0) {
                    return;
                }
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                let dictionaryIndex = Math.round(Math.random() * (this.loadedDictionary.length - 1));
                let entry = this.loadedDictionary[dictionaryIndex];
                this.loadedDictionary.splice(dictionaryIndex, 1);
                const textStyle = {font: this.font, fill: "#ff0044", fontStyle: "bold"};
                const text = this.game.add.text(0, 0, entry.string, textStyle);
                text.anchor.setTo(0.5, 0.5);
                const textSprite = this.texts.create(0, 0, null);
                textSprite.anchor.setTo(0.5, 0);
                textSprite.addChildAt(text, 0);
                textSprite.x = Math.random() * (this.game.width - textSprite.width) + textSprite.width / 2;
                textSprite.body.bounce.y = this.bounce;
                textSprite.body.gravity.y = this.gravity;
                textSprite.body.collideWorldBounds = true;
                textSprite.body.setSize(textSprite.body.width, textSprite.body.height, 0, -textSprite.body.height / 2);
                entry.textSprite = textSprite;
                entry.gameText = text;
                this.dictionary.push(entry);
                this.game.time.events.add(Phaser.Timer.SECOND * (this.maxWordsDelaySec + Math.random() + Math.random()), startGeneratingWords, this);
            }
        },


        update: function () {
            const textToRemove = this.textInput.value;
            const isRemoved = this.removeText(textToRemove);
            if (isRemoved) {
                this.textInput.value = "";
            }
            this.game.physics.arcade.collide(this.texts, this.platforms, collisionHandler, shouldCollide, this);
            drawTrack.call(this);

            function shouldCollide(textSprite, platform) {
                return textSprite.body.collideWorldBounds;
            }

            function collisionHandler(textSprite, platform) {
                if (textSprite.body.touching.down && textSprite.body.hasCollided) {
                    textSprite.children[0].addColor('#666666', 0);
                    textSprite.checkWorldBounds = true;
                    textSprite.events.onOutOfBounds.add(function () {
                        this.context.deletableSprites.splice(this.context.deletableSprites.indexOf(this.sprite), 1);
                        this.sprite.kill();
                    }, {context: this, sprite: textSprite});
                    for (let i = 0; i < this.dictionary.length; i++) {
                        if (this.dictionary[i].textSprite === textSprite) {
                            this.missedCharacters.push(this.dictionary[i]);
                            let item = this.dictionary.splice(i, 1)[0];
                            if (this.muteButton.checked) break;
                            try {
                                const msg = new SpeechSynthesisUtterance(item.string);
                                msg.rate = 1;
                                msg.lang = 'ja-JP';
                                window.speechSynthesis.speak(msg);
                            } catch (e) {
                                console.warn("Speech not supported")
                            }
                            break;
                        }
                    }
                    this.deletableSprites.push(textSprite);
                    textSprite.body.collideWorldBounds = false;
                    textSprite.body.velocity.y = -Math.sqrt(this.gravity / 2);
                    updateScore.call(this, this.score - 10 * (1 + this.sliderValue));
                } else {
                    textSprite.body.hasCollided = true;
                }
            }

            function drawTrack() {
                for (let i = 0; i < this.deletableSprites.length; i++) {
                    let textSprite = this.deletableSprites[i];
                    let horizontalVelocity = textSprite.body.velocity.x;
                    if (horizontalVelocity !== 0) {
                        textSprite.angle += Math.sign(horizontalVelocity) * 5;
                        let dot = this.game.add.graphics(0, 0);
                        dot.beginFill(0x666666, 1);
                        dot.anchor.setTo(0.5, 0.5);
                        dot.drawCircle(textSprite.x, textSprite.y, 3);
                        this.deletableTracks.push(dot);
                        if (textSprite.delayedTrackInitialization) {
                            textSprite.delayedTrackInitialization = false;
                            dot = this.game.add.graphics(0, 0);
                            dot.beginFill(0xff0000, 1);
                            dot.anchor.setTo(0.5, 0.5);
                            dot.drawCircle(textSprite.x, textSprite.y, 10);
                            this.deletableTracks.push(dot);
                        }
                    }
                    if (textSprite.initializeTrack) {
                        textSprite.delayedTrackInitialization = true;
                        textSprite.initializeTrack = false;
                    }
                }
                for (let i = 0; i < this.deletableTracks.length; i++) {
                    this.deletableTracks[i].alpha -= 0.025;
                    if (this.deletableTracks[i].alpha <= 0) {
                        this.deletableTracks[i].kill();
                        this.deletableTracks.splice(i, 1);
                        --i;
                    }
                }
            }
        },

        removeText: function (text) {
            for (let i = 0; i < this.dictionary.length; i++) {
                let entry = this.dictionary[i];
                if (inputMatches(text, entry, this.isKanjiGameplay)) {
                    let textSprite = entry.textSprite;
                    textSprite.body.velocity.x = (textSprite.x < (this.game.world.width / 2)) ? -500 : 500;
                    textSprite.body.velocity.y = -500;
                    textSprite.body.collideWorldBounds = false;
                    entry.gameText.addColor('#666666', 0);
                    textSprite.initializeTrack = true;
                    this.deletableSprites.push(textSprite);
                    textSprite.checkWorldBounds = true;
                    textSprite.events.onOutOfBounds.add(function () {
                        this.context.deletableSprites.splice(this.context.deletableSprites.indexOf(this.sprite), 1);
                        this.sprite.kill();
                    }, {context: this, sprite: textSprite});
                    this.dictionary.splice(i, 1);
                    updateScore.call(this, this.score +
                        (textSprite.body.hasCollided ? 10 * (1 + this.sliderValue)
                            : calculateScore(1 - (textSprite.body.y - 32) / (this.game.world.height - 32)) * (1 + this.sliderValue)));
                    return true;
                }
            }
            return false;

            function inputMatches(input, entry, isKanji) {
                if (isKanji) {
                    input = input.toLowerCase();
                    for (let i = 0; i < entry.onyomi.length; i++) {
                        if (input === entry.onyomi[i].toLowerCase()) {
                            return true;
                        }
                    }
                    for (let i = 0; i < entry.kunyomi.length; i++) {
                        if (input === entry.kunyomi[i].toLowerCase()) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    return entry.romaji.toLowerCase() === input.toLowerCase();
                }
            }
        }
        ,

        forfeit: function () {
            this.textInput.style.visibility = 'hidden';
            this.forfeitButton.style.visibility = 'hidden';
            this.muteLabel.style.visibility = 'hidden';
            this.muteButton.style.visibility = 'hidden';
            this.game.state.start('GameOver', true, false, this.score, this.missedCharacters, this.gameMode);
        }

    }
})
();
