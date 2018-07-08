/**
 * System
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-30
 */

"use strict";

// TODO: make singleton
function System() {
	this.scale = 1;
	this.fps = 30;
	this.width = 0;
	this.height =0;
	this.scale =1;
	this.context = null;
	this.game = null;
	this.version = '2.00';
	this.touchDevice = false;
	this.canvas = '';
	// init all subsystems:soundmanager etc
	// start preloader
	// start game
};

System.prototype.setGame = function(game) {
	this.game = game;
};

System.prototype.log = function(text) {
	console.log(text);
};

System.prototype.main = function() {

	// load using preloader
	// set up inetrvall that calls run
};

System.prototype.run = function() {
	this.game.run();
};

// construct this in /lib/game/main.js
system = new System();

// takes care of starting and stopping the
// game loop
// game.run();
//de.slideshare.net/Leyart1/introduction-to-html5-game-programming-with-impact-js
