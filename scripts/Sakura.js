/**
 * Created by Damian Terlecki on 18.04.17.
 */
'use strict';

let Sakura = function (canvas, treeColor, petalsColor) {
    this.canvas = canvas;
    this.ctx = canvas.ctx;
    this.ctx.treeColor = treeColor;
    this.ctx.petalsColor = petalsColor;
};

(function () {
    'use strict';

    Sakura.prototype = {
        create: function () {
            this.trunk = new Branch(null, 1, 1.5);
            this.trunk.angle = 0;
            this.trunk.length = 5;
            this.trunk.tick();
            return this;
        },
        paint: function () {
            this.ctx.lineWidth = this.thickness;
            const position = new Turtle({
                x: this.canvas.width / 2,
                y: this.canvas.height
            }, 270);
            this.trunk.paint(this.ctx, position);
        }
    };

    let Branch = function (branch, depth, thickness = 10) {
        this.branch = branch;
        this.depth = depth;
        this.thickness = thickness;
        this.length = 10;
        this.children = [];
        this.angle = Math.random() * angleFormula(this.depth);
        if (this.depth % 2 === 0) {
            this.angle = -this.angle;
        }

        function angleFormula(depth) {
            if (depth < 8) {
                return Math.sqrt(depth / 8) * 45;
            }
            return 55;
        }
    };

    Branch.prototype.paint = function (ctx, turtle) {
        this.start = turtle.pos;
        let start = turtle.pos;
        let end = turtle.turn(this.angle).fwd(this.length).pos;
        drawConnections.call(this, ctx, end);
        drawBranch.call(this, ctx, start, end);
        for (let i = this.children.length - 1; i >= 0; i--) {
            this.children[i].paint(ctx, turtle.spawn());
        }

        function drawBranch(ctx, start, end) {
            ctx.lineWidth = this.thickness;
            if (this.branch === null) {
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
                drawFlowers.call(this, ctx, start, end);
            } else if (this.depth % 2 === 0) {
                ctx.beginPath();
                ctx.moveTo(this.branch.start.x, this.branch.start.y);
                ctx.quadraticCurveTo(start.x, start.y, end.x, end.y);
                ctx.stroke();
                drawFlowers.call(this, ctx, start, end);
            } else if (this.children.length === 0) {
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
                drawFlowers.call(this, ctx, start, end);
            }
        }

        function drawConnections(ctx, end) {
            ctx.fillStyle = ctx.treeColor;
            if (this.thickness > 10) {
                ctx.beginPath();
                ctx.arc(end.x, end.y, this.thickness / 2, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
            }
        }

        function drawFlowers(ctx, start, end) {
            ctx.fillStyle = ctx.petalsColor;
            if (this.thickness < 1) {
                let flowers = Math.random() * 3;
                let flowerPlaces = flowers + 2;
                while (--flowers > 0) {
                    let pos;
                    if (this.branch !== null && this.children.length !== 0) {
                        pos = bezierAt.call(this, this.branch.start, start, end, (1 + flowers) / flowerPlaces);
                    } else {
                        pos = lineAt.call(this, start, end, (1 + flowers) / flowerPlaces);
                    }
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = shadeColor(ctx.fillStyle, 0.1);
                }
            }
        }

        function shadeColor(color, percent) {
            const f = parseInt(color.slice(1), 16);
            const t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent;
            const R = f >> 16;
            const G = f >> 8 & 0x00FF;
            const B = f & 0x0000FF;
            return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000
                + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
        }


        function bezierAt(p0, p1, p2, t) {
            return {
                x: Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
                y: Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y
            };
        }

        function lineAt(p0, p1, t) {
            return {
                x: (1 - t) * p0.x + t * p1.x,
                y: (1 - t) * p0.y + t * p1.y
            };
        }
    };

    Branch.prototype.tick = function () {
        this.thickness += 16 * Math.random() * Math.pow(0.85, 2.5*this.depth);
        this.length += 8 * this.depth * Math.random();
        if (!isMaxHeight(this)) {
            for (let i = branchesCountFormula(this); i > 0; i--) {
                this.children.push(new Branch(this, this.depth + 1, this.thickness * Math.random()));
            }
        }
        for (let i = this.children.length - 1; i >= 0; i--) {
            this.children[i].tick();
        }

        function isMaxHeight(branch) {
            return (32 - Math.random() * branch.depth * branch.depth) < 0;
        }

        function branchesCountFormula(branch) {
            if (branch.depth < 4) {
                return 1;
            }
            return Math.min(Math.random() * Math.sqrt(branch.depth * branch.depth / 2.5), 6);
        }
    };

    let Turtle = function (pos, angle) {
        this.pos = pos;
        this.angle = angle;
    };

    Turtle.prototype = {
        turn: function (deg) {
            this.angle += deg;
            this.angle %= 360;
            return this;
        },
        fwd: function (length) {
            this.pos = {
                x: this.pos.x + length * Math.cos(this.angle * Math.PI / 180),
                y: this.pos.y + length * Math.sin(this.angle * Math.PI / 180)
            };
            return this;
        },
        spawn: function () {
            return new Turtle(this.pos, this.angle);
        }
    };

})();