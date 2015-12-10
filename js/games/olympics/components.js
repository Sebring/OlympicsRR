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

Crafty.c('Olympics', {
  init: function() {
    this.count = 0;
    this.startSpeed = {x:220, y:0};
    this.startPlacement = {x:15, y:30};
    this.winPoints = 15;
    this.maxSpeed = {x:{min:-500,max:500}, y:{min:-100,max:100}};
    this.speedIncrease = 1.05;
    this.bind('pointsChanged', this.onPointsChanged);
    this.bind('playerWin', this.onPlayerWin);
  },
  onPointsChanged: function(player) {
    
    if (player.points >= this.winPoints) {
      console.log('onPointAdded %o', player.playerId, player.points);
      Crafty.trigger('playerWin', player);
    }
  },
  onPlayerWin: function(player) {
    console.log(player.playerId + ' wins!');
    Crafty.pause();
  }
});

Crafty.c('Player', {
    init: function() {
        this.requires('Color');
        this.points = 0;
        this.playerId = 0;
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
        Crafty.trigger('pointsChanged', this);
    }
});

Crafty.c('Paddle', {
    init: function() {
        this.requires('2D, WebGL, Color, Multiway, Solid, Placeable, Sizable');
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
        this.requires("2D, WebGL, Color, Solid, Placeable, Sizable");
        this.color('powderblue');
    },
});

Crafty.c("Ball", {
    init: function() {
        this.requires("2D, WebGL, Color, Collision, Motion, Placeable, Sizable");
        this.size(1, 1);
        this.color('yellowgreen');
        this.vy = 0;
        this.vx = 200;
        this.hitPaddle = function hitPaddle(data) {console.log("ball hit Paddle")};
        this.hitWall = function hitWall(data) {console.log("ball hit wall")};
        this.leaveEast = function leaveEast() {console.log("Ball leaves east")};
        this.leaveWest = function leaveWest() {console.log("Ball leaves west")};
    }

});