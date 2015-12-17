Game = {
	scene: 0,
	description: {
		name:"Olympics",
		version:"0.2.0",
	},
	scenes: ['Start', 'Tennis_01', 'Squash_01', 'Basket_01'],
	dimensions: {
		tile: 8,
		width: 80,
		height: 60,
	},
	colors: {
		background:'darkgreen'
	},
	setScene: function(idx) {
		console.log('setScene ' + idx);
		console.log('scenes ' + Game.scenes.length);
		if (idx >= Game.scenes.length)
			idx=1; // skip start
		console.log('setScene ' + idx);
		Game.scene = idx;
		Crafty.scene(Game.scenes[idx]);
	},
	reloadScene: function() {
		Crafty.scene(Game.scene);
	},
	width: function() {
		return this.dimensions.width * this.dimensions.tile;
	},
	height: function() {
		return this.dimensions.height * this.dimensions.tile;
	},
	tile: function() {
		return this.dimensions.tile;
	},
	start: function() {
		Crafty.init(Game.width(), Game.height());
		Crafty.background(Game.colors.background);
		Crafty.bind('KeyUp', function(e) {
	    console.log("KeyUp");
	    if (e.key == Crafty.keys.P) {
	    	Crafty.pause();
	    } else if (e.key == Crafty.keys.U) {
	    	console.log('scene');
	    	Game.setScene(Game.scene+1);
	    }
		});
		Crafty.scene('Start');
  },
}
