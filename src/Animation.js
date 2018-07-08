/**
 * Animation
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2015-01-01
 */

"use strict";

import { timer, context } from './main';

// TODO: make frameTime milliseconds of each frame!
export function Animation2(sheet, frameTime, sequence, stop) {
	this.sheet = sheet;
	this.frameTime = frameTime;
	this.sequence = sequence;
	this.stop = stop || false;
	this.startTime = timer.now;
	this.animSheetX = 0;
	this.animSheetY = 0;
	this.flipx = false;
	this.flipy = false;
	this.noAnimation = sequence.length == 1 ? true : false;

	if(this.noAnimation) {
		this.currentIndex = this.sequence[0];

		// var xposition = currentIndex % 16;
		// using binary AND to compute modulo 16
		this.xposition = this.currentIndex & 15;
		this.yposition = (this.currentIndex / 16) | 0;

		this.animSheetX = this.xposition * this.sheet.width;
		this.animSheetY = this.yposition * this.sheet.height
	}
};

Animation2.prototype.update = function() {

	if(this.noAnimation)
		return;

	this.frameNumber;

	if(this.stop) {
		this.frameNumber = Math.min((Math.max((timer.now - this.startTime), 0) * this.frameTime) | 0, this.sequence.length-1);
	} else {
		this.frameNumber = (((timer.now - this.startTime) * this.frameTime) % this.sequence.length) | 0;
	}

	this.currentIndex = this.sequence[this.frameNumber];

	// var xposition = currentIndex % 16;
	// using binary AND to compute modulo 16
	this.xposition = this.currentIndex & 15;
	this.yposition = (this.currentIndex / 16) | 0;

	this.animSheetX = this.xposition * this.sheet.width;
	this.animSheetY = this.yposition * this.sheet.height
};

Animation2.prototype.rewind = function() {
	this.startTime = timer.now;
	return this;
};

Animation2.prototype.setStartTime = function(time) {
	this.startTime = time;
	return this;
};

Animation2.prototype.draw = function(x, y) {
	// TODO: change context to pge.system.context
	// Date.now() is 3 times faster than new Date().getTime

	if(this.flipx || this.flipy) {
		context.save();
		context.translate((x+8) | 0, (y+8) | 0);
		//context.rotate((timer.now-this.startTime)*0.1);
		context.scale(this.flipx ? -1 : 1, this.flipy ? -1 : 1);
		context.translate(-(x+8) | 0, -(y+8) | 0);

		context.drawImage(this.sheet.image.image, this.animSheetX,
			this.animSheetY, this.sheet.width, this.sheet.height,
			x | 0, y | 0, this.sheet.width, this.sheet.height);

		context.restore();
	} else {
		context.drawImage(this.sheet.image.image, this.animSheetX,
			this.animSheetY, this.sheet.width, this.sheet.height,
			x | 0, y | 0, this.sheet.width, this.sheet.height);

	}
};

/**
 * Developer Test
 */
//var animSheet = new pge.AnimationSheet('media/images/mario.png', 16, 16);
//var anim = new pge.Animation(animSheet, 1, [0, 1, 2]);
//anim.draw(0,9);
/**
 * Example: var run = new Animation( sheet, 0.07, [6,7,8,9,10,11]);
 * Means that the run animtation has 6 frames, uses sheet and each frame is shown 0.07 seconds
 */
