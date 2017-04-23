/**
 * Created by Damian Terlecki on 19.04.17.
 */
'use strict';
let LabelButton = function (game, x, y, key, label, onClick, overFrame, outFrame, downFrame, context, vertical) {
    Phaser.Button.call(this, game, x, y, key, onClick, this, overFrame, outFrame, downFrame, null);
    this.style = {'font': '32px Candal', 'fill': 'white'};
    this.anchor.setTo(0.5, 0.5);
    if (vertical) {
        this.angle = 90;
        label = label.split('').join('\n');
    }
    this.label = new Phaser.Text(game, 0, 0, label, this.style);
    this.label.anchor.setTo(0.5, 0.5);
    this.addChild(this.label);
    if (vertical) {
        this.label.angle = -90;
    }
    this.setLabel(label);
    this.game = game;
    this.context = context;
    game.add.existing(this);
};
LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton;
LabelButton.prototype.setLabel = function (label) {
    this.label.setText(label);
};