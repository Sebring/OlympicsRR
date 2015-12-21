Olympics = {
	init: function(name) {
		this.halfX = Game.width()/2;
		this.halfY = Game.height()/2;
		return Crafty.e('Olympics');
		
	},
	getPlayerSettings: function(flags) {
		var s = {speed: 40*Game.dimensions.tile, h:6, w:2, pId:flags.player-1};
		
		if (flags.player === 1) {
			s.color = 'teal';
			s.x = Game.dimensions.width-Game.dimensions.tile*0.8;
			s.y = 20;
			if (flags.orientation === 'vertical') {
				s.controls = {UP_ARROW:-90, DOWN_ARROW:90};
			} else if (flags.orientation === 'horizontal') {
				s.controls = {RIGHT_ARROW:0, LEFT_ARROW:180};
			}
		} else if (flags.player === 2) {
			s.color = 'olive';
			s.x = Game.dimensions.tile/2;
			s.y = 20;
			if (flags.orientation === 'vertical') {
				s.controls = {W:-90, S:90};
			} else if (flags.orientation === 'horizontal') {
				s.controls = {A:180, D:0};
			}
		}
	  
		if (flags.orientation === 'horizontal') {
			s.w = Game.dimensions.tile*1;
			s.h = 1.5;
			s.y = Game.dimensions.height-Game.dimensions.tile*1.8;
		}
		return s;
	},
	getPlayer: function(settings) {
		var settings = settings ||  {};
		var player = Crafty.e('Player')
			.color(settings.color || 'teal');
		player.playerId = settings.pId;
		var paddle = Crafty.e('Paddle')
			.place(settings.x, settings.y)
			.size(settings.w, settings.h)
			.multiway(settings.speed, settings.controls);
		player.setPaddle(paddle);
		this.addScoreBoard(player);
		return player;
	},
	addScoreBoard: function(player) {
		if (player.playerId === 0) {
			player.setScoreboard(Crafty.e('Score')
				.place(Game.dimensions.width-10, 0.5)
			);
		}
		else if (player.playerId === 1) {
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
        this.step();
    	})
    	.place(12, 22)
    	.checkHits('Wall, Paddle')
    	.bind('HitOn', function(hitData) {ballHitOn(hitData, this)});
     	function ballHitOn(hitData, ball) {
     		if (hitData.length > 1) {
     			console.log('Is this a corner?');
     			console.log(hitData);
     	//		Crafty.pause();
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
     	};

     	b.increaseSpeed = function() {
     		this.vx = Crafty.math.clamp((this.vx*game.speedIncrease), game.maxSpeed.x['min'], game.maxSpeed.x['max']);
     	};

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
     	};
     	b.leaveSouth = function() {
     		this.reset();
     	};
     	// default point to player 1
     	b.leaveWest = function() {
				console.log("Goal Player 1");
				game.p1.addPoint();
				this.reset()
				this.vx *= -1;
				this.place(Game.dimensions.width - game.startPlacement.x, game.startPlacement.y);
			};
			b.leaveEast = function() {
				console.log("Goal Player 2");
				game.p2.addPoint();
				this.reset();
			};
			b.reset = function() {
				this.vx = game.startSpeed.x;
				this.vy = game.startSpeed.y;
				this.place(game.startPlacement.x, game.startPlacement.y);
			};
			b.step = function() {};
     	return b;
	},
	absoluteYAxisChange: function(e) {
  	this.y = Olympics.halfY + Olympics.halfY * e.value;
  },
  absoluteXAxisChange: function(e) {
  	this.x = Olympics.halfX + Olympics.halfX * (e.value*-1);
  }

};
