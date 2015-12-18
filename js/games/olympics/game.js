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
		height: 45,
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
	width: function(w) {
		this.dimensions.width = w? w/this.dimensions.tile : this.dimensions.width;
		return this.dimensions.width*this.dimensions.tile;
	},
	height: function(h) {
		this.dimensions.height = h? h/this.dimensions.tile : this.dimensions.height;
		return this.dimensions.height*this.dimensions.tile;
	},
	tile: function(tile) {
		this.dimensions.tile = tile || this.dimensions.tile;
		return this.dimensions.tile;
	},
	start: function() {
		var h = Crafty.math.clamp(window.innerHeight-80, 480, 1200);
		h -= h%80;
		var w = Math.round(h*1.25);
		this.tile(Math.round(h/80));
		this.width(w);
		this.height(h);
		Crafty.init(w, h);
		Crafty.background(Game.colors.background);
		Crafty.bind('KeyUp', function(e) {
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
