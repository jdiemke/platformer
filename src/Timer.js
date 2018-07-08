/**
 * Timer
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-30
 */

"use strict";


export function Timer() {
	this.startTime = Date.now();
	this.now = 0;
};

Timer.prototype.update = function() {
	this.now = Date.now() - this.startTime;
};
