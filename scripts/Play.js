/**
 * Created by Damian Terlecki on 16.04.17.
 */
(function () {
    'use strict';

    Sutoringu.Play = function (game) {
        this.game = game;
        this.gravity = 1000;
        this.textSprites = [];
        this.platforms = null;
        this.texts = null;

        this.score = 0;
        this.scoreText = null;
    };

    function updateScore(newScore) {
        this.score = newScore;
        this.scoreText.text = 'Score: ' + this.score;
    }

    Sutoringu.Play.prototype = {

        preload: function () {
            this.game.load.image('floor', 'assets/floor.png');
        },

        create: function () {
            setUpBackground(this.game);
            setUpFloor(this);
            setUpTexts(this);
            this.game.time.events.add(Phaser.Timer.SECOND, startGeneratingWords, this);

            function setUpBackground(game) {
                game.stage.backgroundColor = Phaser.Color.getRandomColor(0, 255, 255);
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
                play.scoreText = play.game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
            }

            function startGeneratingWords() {
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                const textStyle = {font: "32px Arial", fill: "#ff0044", backgroundColor: "#ffff00"};
                const text = this.game.add.text(Math.random() * this.game.width, 0, "ABC", textStyle);
                text.anchor.setTo(0, 0);
                const textSprite = this.texts.create(0, 0, null);
                textSprite.addChildAt(text, 0);
                textSprite.body.bounce.y = 0.4;
                textSprite.body.gravity.y = this.gravity;
                textSprite.body.collideWorldBounds = true;
                this.textSprites.push(textSprite);
                this.game.time.events.add(Phaser.Timer.SECOND * (1 + Math.random()), startGeneratingWords, this);
            }
        },


        update: function () {
            this.game.physics.arcade.collide(this.texts, this.platforms, collisionHandler, null, this);

            function collisionHandler(textSprite, platform) {
                if (textSprite.body.touching.down && Math.abs(textSprite.body.velocity.y) < 9) {
                    textSprite.kill();
                    this.textSprites.splice(this.textSprites.indexOf(textSprite), 1);
                    updateScore.call(this, this.score - 10);
                }
            }
        },

        removeText: function (text) {
            for (let i = 0; i < this.textSprites.length; i++) {
                if (this.textSprites[i].getChildAt(0).text.toLowerCase() === text.toLowerCase()) {
                    this.textSprites[i].kill();
                    this.textSprites.splice(i, 1);
                    updateScore.call(this, this.score + 10);
                    return true;
                }
            }
            return false;
        }

    }
})();
