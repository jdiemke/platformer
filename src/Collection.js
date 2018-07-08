"use strict";

/**
 * Collection Class
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-16
 */

export function Collection() {
	this.elements = [];
}

Collection.prototype.add = function(element) {
	this.elements.push(element);
};

Collection.prototype.remove = function(element) {
	var index = this.elements.indexOf(element);
	if(index != -1) {
		this.elements.splice(index, 1);
	}
};

Collection.prototype.size = function() {
	return this.elements.length;
};

Collection.prototype.get = function(index) {
	return this.elements[index];
};

// http://stackoverflow.com/questions/9425009/remove-multiple-elements-from-array-in-javascript-jquery
// removeValFromIndex.sort(function(a,b){ return b - a; });
