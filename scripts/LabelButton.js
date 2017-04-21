/**
 * Created by t3r on 19.04.17.
 */
'use strict';
let LabelButton = function (game, x, y, key, label, onClick, overFrame, outFrame, downFrame, context) {
    Phaser.Button.call(this, game, x, y, key, onClick, context || this, overFrame, outFrame, downFrame, null);
    this.style = {'font': '32px Arial', 'fill': 'white'};
    this.anchor.setTo(0.5, 0.5);
    this.label = new Phaser.Text(game, 0, 0, label, this.style);
    this.label.anchor.setTo(0.5, 0.5);
    this.addChild(this.label);
    this.setLabel(label);
    this.game = game;
    game.add.existing(this);
};
LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton;
LabelButton.prototype.setLabel = function (label) {
    this.label.setText(label);
};
