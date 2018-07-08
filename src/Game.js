"use strict";

/**
 * Game
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-30
 */

export function Game() {
	this.font = new Font(require('./assets/fonts/biolabsfont.png'));
}

Game.prototype.init = function() {
	//input.bind(KEY.UP_ARROW, 'up');
};

Game.prototype.update = function() {
	// 1. update background layer positions
	// 2. call update on each entity
	// 3. resolve dynamic collisions (Entity vs. Entity) checks collision with every other entity
};

Game.prototype.draw = function() {
	// Add your own drawing code here
	var x = system.width/2,
		y = system.height/2;

	this.font.draw('It works!', x, y, Font.ALIGN.CENTER);

	// TODO:
	// 1. clear screen
	// 2. draw all backgrounds layers
	// 3. draw all entities
};

Game.prototype.run = function() {
	this.update();
	this.draw();
};

Game.prototype.getEntities = function() {

};

//Game.loadLevel();
// holds all entities
// background maps and collision maps
// has update init and draw method
