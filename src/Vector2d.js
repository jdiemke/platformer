/**
 * Vector2d
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2015-01-01
 */

"use strict";

import { cosLookupTable, sinLookupTable} from './main';

export function Vector2d(x, y) {
	this.x = x;
	this.y = y;
};

Vector2d.prototype.add = function(vector) {
	this.x += vector.x;
	this.y += vector.y;
};

Vector2d.prototype.sub = function(vector) {
	this.x -= vector.x;
	this.y -= vector.y;
};

Vector2d.prototype.getMagnitude = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector2d.prototype.getAngle = function() {
	return Math.atan2(this.y, this.x);
};

Vector2d.prototype.fromAngle = function(angle, magnitude) {
	this.x = magnitude * cosLookupTable[angle];
	this.y = magnitude * sinLookupTable[angle];
};
