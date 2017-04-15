/**
 * Created by Damian Terlecki on 15.04.17.
 */
window.onLoad = function () {

    const game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});
    let gravity = 2000;

    function preload() {
        "use strict";

    }

    function create() {
        "use strict";
        setUpBackground();
        this.dropTimer = this.game.time.create(false);
        this.dropTimer.start();
        game.time.events.add(Phaser.Timer.SECOND * (1 + 3 * Math.random()), generateWord, game);
    }

    function update() {
        "use strict";
    }

    function generateWord() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        const textStyle = {font: "32px Arial", fill: "#ff0044", backgroundColor: "#ffff00"};
        const text = game.add.text(Math.random() * game.width, 0, "ABC", textStyle);
        text.anchor.setTo(0, 0);
        const textSprite = game.add.sprite(0, 0, null);
        game.physics.arcade.enable(textSprite);
        textSprite.addChild(text);
        textSprite.body.bounce.y = 0.4;
        textSprite.body.gravity.y = gravity;
        textSprite.body.collideWorldBounds = true;
        game.time.events.add(Phaser.Timer.SECOND * (1 + Math.random()), generateWord, game);
    }

    function setUpBackground() {
        "use strict";
        game.stage.backgroundColor = Phaser.Color.getRandomColor(0, 255, 255);
    }
};