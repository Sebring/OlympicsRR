Olympics = {
	init: function() {
		return Crafty.e("Scene")
			.attr({'count': 0})
		  

	},
	defaultPlayer_east: function() {
		return Crafty.e("Player")
      .color('teal')
      .setPaddle(Crafty.e("Paddle")
				.place(Game.dimensions.width-6, 20)
				.size(2, 6)
				.multiway(200, { UP_ARROW: -90, DOWN_ARROW: 90 })
      )
      .setScoreboard(Crafty.e("Score")
      	.place(Game.dimensions.width-10, 0.5)
      );
	},
	defaultPlayer_west: function() {
		return Crafty.e('Player')
	    .color('olive')
	    .setPaddle(Crafty.e('Paddle')
				.place(6, 20)
				.size(2, 6)
				.multiway(200, { W: -90, S: 90 })
	    )
	    .setScoreboard(Crafty.e('Score')
	    	.place(2, 0.5)
	    );
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
            if (this.y > Game.width() || this.y < 0) {
                ballLeaveFrameBug(this);
            }
            this.x += this.dX;
            this.y += this.dY;
    	})
    	.checkHits('Wall, Paddle')
    	.bind('HitOn', function(hitData) {ballHitOn(hitData, this)});

			function ballLeaveFrameBug(ball) {
				ball.x = Game.width/2;
				ball.y = Game.height/2;
     	};
     	function ballHitOn(hitData, ball) {
     		var data = hitData[0];
        console.log("Collision with solid detected");
        // WALL 
        if (data.obj.has("Wall")) {
         
        		ball.hitWall(data);
         //   console.log(" - WALL");

        }
        // PADDLE
        if (data.obj.has("Paddle")) {
            var y = ball._y;
            console.log(" - PADDLE");
            var paddle = data.obj;
            var c = paddle._h/2;
            var angle = (-1)*( -ball._h/2 + Number(Number(paddle._y) - Number(ball._y)));
            angle = (angle-c)*0.3;
           // var diff = this.dY-paddle.dY;
            console.log("ball speed " + ball.dY);
            console.log("paddle speed " + paddle.vy);
            ball.dY += angle;
            ball.dX *= -1;
        }
     	};
     	// default wall collisions logic
     	b.hitWall = function(data) {
 		    if (data.obj.has("Vertical")) {
            this.dX *= -1;
        } else if (data.obj.has("Horizontal")) {
            this.dY *= -1;
        }
      	return;
     	};
     	// default point to player 1
     	b.leaveWest = function() {
				console.log("Goal Player 1");
				this.x = Game.width()/2;
				this.dY = 0;
				Scene.p1.addPoint();
			};
			b.leaveEast = function() {
				console.log("Goal Player 2");
				this.x = Game.width()/2;
				this.dY = 0;
				Scene.p2.addPoint();
			};
     	return b;
	}
};

var Scene = Olympics.init();

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
  Scene.destroy();
  Scene = Olympics.init();
	Scene.p1 = Olympics.defaultPlayer_east(); 
  Scene.p2 = Olympics.defaultPlayer_west();
	Scene.ball = Olympics.createDefaultBall();     
  
  Olympics.createDefaultWalls();

});

Crafty.scene('Squash_01', function() {
	Scene.destroy();
	Scene = Olympics.init();
	Scene.p1 = Olympics.defaultPlayer_east();
	Scene.p1.paddle._x -= Game.dimensions.tile;
	Scene.p2 = Olympics.defaultPlayer_west();
	Scene.p2.paddle.place(Game.dimensions.width-6, 40);
	
	// count bounces to toggle player turn
	Scene.count = 0;

	Scene.ball = Olympics.createDefaultBall();
	Scene.ball.dX +=1;
	// override default wall collsions logic
	Scene.ball.hitWall = function(data) {
		if (data.obj.has("Vertical")) {
    	this.dX *= -1;
    	Scene.count++;
    	if (Scene.count%2==1) {
    		Scene.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-5);
    		Scene.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-8);
    	} else {
    		Scene.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-8);
    		Scene.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-5);
    	}
    } else if (data.obj.has("Horizontal")) {
    	this.dY *= -1;
    }
	}
	// override default point system
	Scene.ball.leaveEast = function() {
		if (Scene.count%2==1) {
			console.log("Goal Player 1");
			this.x = Game.width()/2;
			this.dY = 0;
			Scene.count=1;
			Scene.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-5);
			Scene.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-8);
			Scene.p1.addPoint();
		} else {
			console.log("Goal Player 2");
			this.x = Game.width()/2;
			this.dY = 0;
			Scene.count=0;
			Scene.p1.paddle._x = Game.dimensions.tile*(Game.dimensions.width-8);
			Scene.p2.paddle._x = Game.dimensions.tile*(Game.dimensions.width-5);
			Scene.p2.addPoint();
		}
	}
	Scene.ball.color('darkslategray');
	Crafty.background('silver');
	
	Olympics.createDefaultWalls();
	Crafty.e("Wall")
		.place(0, 8)
		.size(4, 50);
	Crafty("Wall").each(function() {
		this.color('maroon');
	});
});