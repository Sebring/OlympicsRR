Crafty.scene('Start', function() {
	game = Olympics.init();
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

/** TENNIS **/
Crafty.scene('Tennis_01', function() {
  game.destroy();
  game = Olympics.init()
  	.setTitle('Tennis 01')
  	.setBackground('darkgreen');
	game.p1 = Olympics.getPlayer(Olympics.getPlayerSettings({player:1, orientation:'vertical'})); 
  game.p2 = Olympics.getPlayer(Olympics.getPlayerSettings({player:2, orientation:'vertical'}));
	game.ball = Olympics.createDefaultBall()
		.size(1.5, 1.5);
  Olympics.createDefaultWalls();
});

/** SQUASH **/
Crafty.scene('Squash_01', function() {
	game.destroy();
	game = Olympics.init()
		.setTitle('Squash 01')
		.setBackground('silver');
	game.p1 = Olympics.getPlayer(Olympics.getPlayerSettings({player:1, orientation:'vertical'})); 
  game.p2 = Olympics.getPlayer(Olympics.getPlayerSettings({player:2, orientation:'vertical'}));
	
	var tile = Game.dimensions.tile;

	game.p2.paddle.place(Game.dimensions.width-6, 40);

	game.speedIncrease = 1.15;	
	game.maxSpeed = {x:{min:-100*tile,max:100*tile}, y:{min:-70*tile,max:70*tile}};
	// count bounces to toggle player turn
	game.count = 0;

	game.ball = Olympics.createDefaultBall()
		.color('darkslategray');
	game.ball.vx = 300;
	
	// override default ball hits paddle
	game.ball.hitPaddle = function squashPaddle(data) {
  	// bounce and increase speed
  	this.vx *= -1;
  	this.increaseSpeed();
  	// this keep track of player turn
  	game.count++;
    // set ball at angle
    var paddle = data.obj;
    var c = paddle._h/2;
    var angle = (-1)*( -this._h/2 + Number(Number(paddle._y) - Number(this._y)));
    angle = (angle-c);
    this.vy += angle*10;
    // swap player position delay
		Crafty.e('Delay').delay(function() {
  		if (game.count%2==1) {
				game.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-tile);
				game.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-tile*2);
  		} else {
  			game.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-tile*2);
  			game.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-tile);
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
			game.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-tile);
			game.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-tile*2);
			game.p1.addPoint();
		} else {
			console.log("Goal Player 2");
			this.reset();
			game.count=0;
			game.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-tile*2);
			game.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-tile);
			game.p2.addPoint();
		}
	}
	
	
	Olympics.createDefaultWalls();
	Crafty.e("Wall")
		.place(0, 8)
		.size(tile, Game.dimensions.height-8);
	Crafty("Wall").each(function() {
		this.color('maroon');
	});
});

/** BASKET **/
Crafty.scene('Basket_01', function() {
	game.destroy();
	game = Olympics.init()
		.setTitle('Basket 01')
		.setBackground('darkslategray');
	var tile = Game.dimensions.tile;
	Crafty('Title').get(0).textColor('darkslategray');
	game.maxSpeed = {x:{min:-65*tile,max:65*tile}, y:{min:-95*tile,max:95*tile}};
	game.startPlacement = {x:10, y:50};
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
		.size(4, Game.dimensions.height-8);
	Crafty.e("Wall")
		.place(Game.dimensions.width-4, 8)
		.size(4, Game.dimensions.height-8);
	// solid hoops
	var hoop_y = tile*2.5;
	var hoop_x = tile*1.5;

	var hoop_w = tile*1.2;
	Crafty.e('Wall').place(hoop_x, hoop_y).size(hoop_w, 3);
	Crafty.e('Wall').place(Game.dimensions.width-hoop_x-hoop_w, hoop_y).size(hoop_w, 3);
	Crafty("Wall, Score").each(function() {
		this.color('darkgoldenrod');
	});
	
	// add net hoops - check collision for these on wall collissions
	Crafty.e('Wall').place(hoop_x+tile/4, hoop_y).size(tile*0.7, 1).color('cornsilk').addComponent('Goal1');
	Crafty.e('Wall').place(Game.dimensions.width-hoop_x-tile/4-tile*0.7, hoop_y).size(tile*0.7, 1).color('cornsilk').addComponent('Goal2');

	// ball
	game.ball = Olympics.createDefaultBall()
		.color('chocolate')
		.size(2.5, 2.5);
	game.startSpeed = {x:150, y:0};
	game.ball.reset();
	
	// each frame
	var p1min = Game.dimensions.width/2 * Game.dimensions.tile;
	var p2max = (Game.dimensions.width/2 * Game.dimensions.tile) - game.p2.paddle._w;
	game.ball.step = function() {
		// simulate gravity
		this.vy += tile*2;
		// clamp paddle positions
		game.p1.paddle._x = Crafty.math.clamp(game.p1.paddle._x, p1min, 1023);
		game.p2.paddle._x = Crafty.math.clamp(game.p2.paddle._x, -100, p2max);
	};

	// overriden to add bounce and clamp ball speed
	game.ball.hitPaddle = function(data) {
    var y = this._y;
    var paddle = data.obj;
    var c = paddle._w/2;
    var angle = (-1)*( -this._w/2 + Number(Number(paddle._x) - Number(this._x)));
    angle = (angle-c);
 
    this.vy *= -1;
    this.vx = this.vx*0.5 + angle*10;
    this.vy -= tile;
		this.vx = Crafty.math.clamp(this.vx, game.maxSpeed.x['min'], game.maxSpeed.x['max']);
		this.vy = Crafty.math.clamp((this.vy*game.speedIncrease), game.maxSpeed.y['min'], game.maxSpeed.y['max']);

    console.log('speed y: ' + this.vy);
    console.log('speed x: ' + this.vx)
	};

	game.ball.leaveWest = function() {
		this.reset();
	}
	game.ball.leaveEast = function() {
		this.reset();
	}

	// overriden to check for goals
	game.ball.hitWall  = function(data) {
 		if (this.hit('Goal1')) {
 			console.log("Goal Player 1");
			game.p1.addPoint();
			game.startSpeed = {x:-150, y:0};
			game.startPlacement = {x:Game.dimensions.width-tile*2 , y:50};
			this.reset();
 			return;
 		}
 		if (this.hit('Goal2')) {
 			console.log("Goal Player 2");
			game.p2.addPoint();
			game.startSpeed = {x:150, y:0};
			game.startPlacement = {x:tile, y:50};
			this.reset();
 			return;
 		}
 		if (data.obj.has("Vertical")) {
      this.vx *= -1;
    } else if (data.obj.has("Horizontal")) {
      this.vy *= -1;
    }
  	return;
	}
});

/** HOCKEY **/
Crafty.scene('Hockey_01', function() {
  game.destroy();
  game = Olympics.init()
  	.setTitle('Hockey 01')
  	.setBackground('powderblue');
	var tile = Game.dimensions.tile;

  // players
	game.p1 = Olympics.getPlayer(Olympics.getPlayerSettings({player:1, orientation:'vertical'})); 
  game.p2 = Olympics.getPlayer(Olympics.getPlayerSettings({player:2, orientation:'vertical'}));
	// position players
	game.p2.paddle.place(27, 20);
	game.p1.paddle.place(Game.dimensions.width-28, 29);

	// ball
	game.ball = Olympics.createDefaultBall()
		.size(1.5, 1.5)
		.color('#100');

  // walls
	Olympics.createDefaultWalls();
	Crafty.e("Wall")
		.place(0, 8)
		.size(4, Game.dimensions.height-8);
	Crafty.e("Wall")
		.place(Game.dimensions.width-4, 8)
		.size(4, Game.dimensions.height-8);
	// goals
	Crafty.e("Wall").place(15, 32).size(2, 20)
	Crafty.e("Wall").place(17, 32).size(5, 2);
	Crafty.e("Wall").place(17, 50).size(5, 2);
	Crafty.e("Wall").place(Game.dimensions.width-17, 32).size(2, 20);
	Crafty.e("Wall").place(Game.dimensions.width-22, 32).size(5, 2);
	Crafty.e("Wall").place(Game.dimensions.width-22, 50).size(5, 2);
	Crafty("Wall").each(function() {
		this.color("brown");
	});
	Crafty.e("Wall").place(17, 34).size(2, 16).color('cornsilk').addComponent('Goal1');
	Crafty.e("Wall").place(Game.dimensions.width-19, 34).size(2, 16).color('cornsilk').addComponent('Goal2');
	
	game.startPlacement = {x:Game.dimensions.width/2 , y:20};
	game.ball.leaveWest = function() {this.reset();}
	game.ball.leaveEast = function() {this.reset();}
	game.ball.leaveNorth = function() {this.reset();}
	game.ball.leaveSouth = function() {this.reset();}
	// overriden to check for goals
	game.ball.hitWall  = function(data) {
 		if (this.hit('Goal1')) {
 			console.log("Goal Player 1");
			game.p1.addPoint();
			game.startSpeed = {x:-tile*30, y:20};
			
			this.reset();
 			return;
 		}
 		if (this.hit('Goal2')) {
 			console.log("Goal Player 2");
			game.p2.addPoint();
			game.startSpeed = {x:tile*30, y:20};
			this.reset();
 			return;
 		}
 		if (data.obj.has("Vertical")) {
      this.vx *= -1;
    } else if (data.obj.has("Horizontal")) {
      this.vy *= -1;
    }
  	return;
	}
});
