Olympics = {
	init: function() {
		return Crafty.e('Olympics');
	},
	getPlayerSettings: function(flags) {
		var s = {speed: 200, h:6, w:2, id:flags.player};
		
		if (flags.player === 1) {
			s.color = 'teal';
			s.x = Game.dimensions.width-6;
			s.y = 20;
			if (flags.orientation === 'vertical') {
				s.controls = {UP_ARROW:-90, DOWN_ARROW:90};
			} else if (flags.orientation === 'horizontal') {
				s.controls = {RIGHT_ARROW:0, LEFT_ARROW:180};
			}
		} else if (flags.player === 2) {
			s.color = 'olive';
			s.x = 2;
			s.y = 20;
			if (flags.orientation === 'vertical') {
				s.controls = {W:-90, S:90};
			} else if (flags.orientation === 'horizontal') {
				s.controls = {A:180, D:0};
			}
		}
	  
		if (flags.orientation === 'horizontal') {
			s.w = 6;
			s.h = 2;
			s.y = Game.dimensions.height-16;
		}
		return s;
	},
	getPlayer: function(settings) {
		var settings = settings ||  {};
		var player = Crafty.e('Player')
			.color(settings.color || 'teal');
		var paddle = Crafty.e('Paddle')
			.place(settings.x, settings.y)
			.size(settings.w, settings.h)
			.multiway(settings.speed, settings.controls);
		player.setPaddle(paddle);
		player.playerId = settings.id;
		this.addScoreBoard(player);
		return player;
	},
	addScoreBoard: function(player) {
		if (player.playerId === 1) {
			player.setScoreboard(Crafty.e('Score')
				.place(Game.dimensions.width-10, 0.5)
			);
		}
		else if (player.playerId === 2) {
			player.setScoreboard(Crafty.e('Score')
	    	.place(2, 0.5)
	    );
		}
	},
	createDefaultWalls: function() {
		Crafty.e("Wall")
			.place(0, 8)
      .size(Game.width(), 4);
		Crafty.e("Wall")
			.place(0, Game.dimensions.height-8)
      .size(Game.width(), 8);		
	},
	createDefaultBall: function() {
		var b = Crafty.e("Ball")
     	.bind('EnterFrame', function () {
        if (this.x > Game.width()) {
        	this.leaveEast();
        }
        if (this.x < 0) {
        	this.leaveWest();              
        }
        if (this.y > Game.height() ) {
        	this.leaveNorth();
        }
        if (this.y < 0) {
          this.leaveSouth();
        }
    	})
    	.checkHits('Wall, Paddle')
    	.bind('HitOn', function(hitData) {ballHitOn(hitData, this)});
     	function ballHitOn(hitData, ball) {
     		if (hitData.length > 1) {
     			console.log('Is this a corner?');
     			console.log(hitData);
     			Crafty.pause();
     		}
     		var data = hitData[0];
        if (data.obj.has("Wall")) {
        	ball.hitWall(data);
        } 
        // don't use else if to handle cornering
        if (data.obj.has("Paddle")) {
        	ball.hitPaddle(data);
        }
     	};
     	// default paddle collission
     	b.hitPaddle = function(data) {
        var y = this._y;
        console.log(" - PADDLE");
        var paddle = data.obj;
        var c = paddle._h/2;
        var angle = (-1)*( -this._h/2 + Number(Number(paddle._y) - Number(this._y)));
        angle = (angle-c);

        console.log("ball speed x " + this.vx);
        console.log("angle " + angle);
        this.vy += angle*10;
        this.vx *= -1;
        this.increaseSpeed();
     	}

     	b.increaseSpeed = function() {
     		this.vx = Crafty.math.clamp((this.vx*game.speedIncrease), game.maxSpeed.x['min'], game.maxSpeed.x['max']);
     	}

     	// default wall collisions logic
     	b.hitWall = function(data) {
 		    if (data.obj.has("Vertical")) {
            this.vx *= -1;
        } else if (data.obj.has("Horizontal")) {
            this.vy *= -1;
        }
      	return;
     	};
     	b.leaveNorth = function() {
     		this.reset();
     	}
     	b.leaveSouth = function() {
     		this.reset();
     	}
     	// default point to player 1
     	b.leaveWest = function() {
				console.log("Goal Player 1");
				game.p1.addPoint();
				this.reset()
				this.vx *= -1;
				this.x = Game.width()/1.5;
			};
			b.leaveEast = function() {
				console.log("Goal Player 2");
				game.p2.addPoint();
				this.reset();
			};
			b.reset = function() {
				this.vx = game.startSpeed.x;
				this.vy = game.startSpeed.y;
				this.x = Game.width()/3;
			}
     	return b;
	}
};

var game = Olympics.init();

Crafty.scene('Start', function() {
	Crafty.e('Text, DOM, Color')
		.attr({x:100, y:100, w:300})
		.textColor('powderblue')
		.text('Olympics RR')
		.textFont({family: 'impact', size:'50px', type:'bold'})
	
	Crafty.e('Text, DOM, Color')
		.attr({x:100, y:180, w:500})
		.textColor('goldenrod')
		.text('Press [ U ] to start')
		.textFont({family:'impact', size:'24px'});
	Crafty.e('Text, DOM, Color')
		.attr({x:100, y:220, w:500})
		.textColor('goldenrod')
		.text('Press [ P ] to pause')
		.textFont({family:'impact', size:'24px'});
	Crafty.e('Text, DOM, Color')
		.attr({x:100, y:260, w:500})
		.textColor('goldenrod')
		.text('Press [ U ] to change sport')
		.textFont({family:'impact', size:'24px'});
	
});

Crafty.scene('Tennis_01', function() {
  game.destroy();
  game = Olympics.init();
	game.p1 = Olympics.getPlayer(Olympics.getPlayerSettings({player:1, orientation:'vertical'})); 
  game.p2 = Olympics.getPlayer(Olympics.getPlayerSettings({player:2, orientation:'vertical'}));
	game.ball = Olympics.createDefaultBall();     
  Olympics.createDefaultWalls();
	Crafty.background('darkgreen');
});

Crafty.scene('Squash_01', function() {
	game.destroy();
	game = Olympics.init();
	game.maxSpeed = [-650, 650];
	game.p1 = Olympics.getPlayer(Olympics.getPlayerSettings({player:1, orientation:'vertical'})); 
  game.p2 = Olympics.getPlayer(Olympics.getPlayerSettings({player:2, orientation:'vertical'}));
	game.p1.paddle._x -= Game.dimensions.tile;
	game.p2.paddle.place(Game.dimensions.width-6, 40);
	
	// count bounces to toggle player turn
	game.count = 0;

	game.ball = Olympics.createDefaultBall();
	game.ball.vx = 300;
	
	// override default ball hits paddle
	game.ball.hitPaddle = function(data) {
	  // alter and restrict speed
  	this.vx = Crafty.math.clamp((this.vx*-1.1), -650, 650);
  	
  	game.count++;
        
    var paddle = data.obj;
    var c = paddle._h/2;
    var angle = (-1)*( -this._h/2 + Number(Number(paddle._y) - Number(this._y)));
    angle = (angle-c);
    this.vy += angle*10;
        
		Crafty.e('Delay').delay(function() {
  		if (game.count%2==1) {
    		game.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-5);
    		game.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-8);
  		} else {
  			game.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-8);
  			game.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-5);
  		}
  	}, 500);
	}

	// override default point system
	game.ball.leaveWest = function() {
		// this should not happen in squash ;)
		this.reset();
	}
	game.ball.leaveEast = function() {
		if (game.count%2==1) {
			console.log("Goal Player 1");
			this.reset();
			game.count=1;
			game.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-5);
			game.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-8);
			game.p1.addPoint();
		} else {
			console.log("Goal Player 2");
			this.reset();
			game.count=0;
			game.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-8);
			game.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-5);
			game.p2.addPoint();
		}
	}
	game.ball.color('darkslategray');
	Crafty.background('silver');
	
	Olympics.createDefaultWalls();
	Crafty.e("Wall")
		.place(0, 8)
		.size(4, 50);
	Crafty("Wall").each(function() {
		this.color('maroon');
	});
});

Crafty.scene('Basket_01', function() {
	game.destroy();
	game = Olympics.init();

	// players
	game.p1 = Olympics.getPlayer(
		Olympics.getPlayerSettings(
			{player:1, orientation:'horizontal'}));
	game.p2 = Olympics.getPlayer(
		Olympics.getPlayerSettings(
			{player:2, orientation:'horizontal'}));
	
	// walls
	Olympics.createDefaultWalls();
		Crafty.e("Wall")
			.place(0, 8)
			.size(4, 50);
	Crafty.e("Wall")
		.place(Game.dimensions.width-8, 8)
		.size(4, 50);
	Crafty("Wall").each(function() {
		this.color('maroon');
	});

	// ball
	game.ball = Olympics.createDefaultBall();
	game.ball.moveBall = function() {
		this.dY += 0.3;
		this.x += this.dX;
    this.y += this.dY;
	};
	game.ball.hitPaddle = function(data) {
    var y = this._y;
    console.log(" - PADDLE");
    var paddle = data.obj;
    var c = paddle._h/2;
    var angle = (-1)*( -this._h/2 + Number(Number(paddle._y) - Number(this._y)));
    angle = (angle-c)*0.3;
    
    
    this.dY *= -1;
    this.dX = angle;
    this.dY--;
 	// need better control of angle, and p2 angle seems bugged
	}

});

Crafty.scene('Tennis_02', function() {
	game.destroy();
	game = Olympics.init();
		// players
	game.p1 = Olympics.getPlayer(
		Olympics.getPlayerSettings(
			{player:1, orientation:'vertical'}));
	game.p2 = Olympics.getPlayer(
		Olympics.getPlayerSettings(
			{player:2, orientation:'vertical'}));
	Olympics.createDefaultWalls();
	game.ball = Olympics.createDefaultBall();
	game.ball.addComponent('Gravity').gravity('Wall');
});