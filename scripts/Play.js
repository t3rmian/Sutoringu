/**
 * Created by Damian Terlecki on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.Play = function (game) {
        this.game = game;
        this.font = "48px Courier New";
        this.gravity = 1000;
        this.bounce = 0.4;
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
        this.game = undefined;
    };

    function updateScore(newScore) {
        this.score = newScore;
        this.scoreText.text = 'Score: ' + this.score;
        if (this.loadedDictionary.length <= 0 && this.dictionary.length <= 0) {
            this.textInput.style.visibility = 'hidden';
            this.forfeitButton.style.visibility = 'hidden';
            setTimeout(function () {
                this.forfeit();
            }.bind(this), 1000);
        }
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
        },

        preload: function () {
            this.game.load.image('floor', 'assets/images/floor.png');
            this.textInput = this.game.state.states['Boot'].textInput;
            this.forfeitButton = this.game.state.states['Boot'].forfeitButton;
            this.forfeitButton.style.visibility = 'visible';
            this.textInput.style.visibility = 'visible';
            this.textInput.focus();
        },

        create: function () {
            setUpBackground(this.game);
            setUpFloor(this);
            setUpTexts(this);
            this.game.time.events.add(Phaser.Timer.SECOND, startGeneratingWords, this);

            function setUpBackground(game) {
                game.stage.backgroundColor = 0xffffff;
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
                play.texts = play.game.add.group();
                play.texts.enableBody = true;
                play.scoreText = play.game.add.text(16, 16, 'Score: 0', {
                    fontSize: '32px',
                    fill: '#000',
                    font: 'Candal'
                });
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
                this.game.time.events.add(Phaser.Timer.SECOND * (1 + Math.random()), startGeneratingWords, this);
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
                if (textSprite.body.touching.down && Math.abs(textSprite.body.velocity.y) < 9) {
                    textSprite.children[0].addColor('#666666', 0);
                    textSprite.checkWorldBounds = true;
                    textSprite.events.onOutOfBounds.add(function () {
                        this.context.deletableSprites.splice(this.context.deletableSprites.indexOf(this.sprite), 1);
                        this.sprite.kill();
                    }, {context: this, sprite: textSprite});
                    for (let i = 0; i < this.dictionary.length; i++) {
                        if (this.dictionary[i].textSprite === textSprite) {
                            this.missedCharacters.push(this.dictionary[i]);
                            this.dictionary.splice(i, 1);
                            break;
                        }
                    }
                    this.deletableSprites.push(textSprite);
                    textSprite.body.collideWorldBounds = false;
                    updateScore.call(this, this.score - 10);
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
                if (inputMatches(text, entry, this.gameMode)) {
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
                    updateScore.call(this, this.score + 10);
                    return true;
                }
            }
            return false;

            function inputMatches(input, entry, gameMode) {
                if (gameMode.toLowerCase().includes('kanji')) {
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
        },

        forfeit: function () {
            this.textInput.style.visibility = 'hidden';
            this.forfeitButton.style.visibility = 'hidden';
            this.game.state.start('GameOver', true, false, this.score, this.missedCharacters, this.gameMode);
        }

    }
})();
