
/**@
 * #Placeable
 * @category Grid
 * Utility component to easily place an entity in the grid
 */
Crafty.c("Placeable", {
    place: function(x, y) {
        this.x = x*Game.dimensions.tile;
        this.y = y*Game.dimensions.tile;
        return this;
    }
});

/**@
 * #Sizable
 * @category Grid
 * Utility component to set dimensions of a entity. Will also add category component
 * 'Vertical' or 'Horizontal' depending on height/width ratio.
 */
Crafty.c("Sizable", {
    size: function(w, h) {
        this.h = h*Game.dimensions.tile;
        this.w = w*Game.dimensions.tile;
        if (h>w)
            this.addComponent('Vertical');
        else
            this.addComponent('Horizontal');
        return this;
    }
});

Crafty.c('Player', {
    init: function() {
        this.requires('Color');
        this.points = 0;
    },
    setPaddle: function(paddle) {
        this.paddle = paddle;
        this.paddle.color(this.color());
        return this;
    },
    setScoreboard: function(scoreboard) {
        this.scoreboard = scoreboard;
        this.scoreboard.textColor(this.color());
        return this;
    },
    addPoint: function() {
        this.points++;
        this.scoreboard.text(this.points);
    }
});

Crafty.c('Paddle', {
    init: function() {
        this.requires('2D, Canvas, Color, Multiway, Solid, Placeable, Sizable');
        this.points = 0;
        this.vy=0;
    },

});

Crafty.c("Score", {
    init: function() {
        this.requires("DOM, 2D, Color, Text, Placeable");
        this.textFont({family: 'impact', size:'50px', type:'bold'})
    }
});

Crafty.c("Wall", {
    init: function() {
        this.requires("2D, DOM, Color, Solid, Placeable, Sizable");
        this.color('powderblue');
    },
});

Crafty.c("Ball", {
    init: function() {
        this.requires("2D, WebGL, Color, Collision, Placeable");
        this.attr({x: 30*Game.dimensions.tile, y: 20*Game.dimensions.tile, 
            w: Game.dimensions.tile, h: Game.dimensions.tile, dX: 5, dY: 0});
        this.color('salmon');
        this.hitPaddle = function hitPaddle(data) {console.log("ball hit Paddle")};
        this.hitWall = function hitWall(data) {console.log("ball hit wall")};
        this.leaveEast = function leaveEast() {console.log("Ball leaves east")};
        this.leaveWest = function leaveWest() {console.log("Ball leaves west")};
    }
});