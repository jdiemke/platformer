/**
 * HashMap
 *
 * Based on the Java HashMap class
 *
 * @see http://stackoverflow.com/questions/8877666/how-is-a-javascript-hash-map-implemented/8877719#8877719
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-30
 */

"use strict";

export function HashMap() {
	this.map = {};
};

/**
 *
 * @param key
 * @param value
 */
HashMap.prototype.put = function(key, value) {
	this.map[key] = value;
};

/**
 *
 * @param key
 */
HashMap.prototype.get = function(key) {
	return this.map[key];
};

/**
 *
 * @param key
 */
HashMap.prototype.remove = function(key) {
	delete this.map[key];
};

HashMap.prototype.clear = function() {
	this.map = {};
};

HashMap.prototype.containsKey = function(key) {
	return this.map.hasOwnProperty(key);
};

HashMap.prototype.containsValue = function(value) {

	for(var x in this.map) {
		if(this.map[x] == value) {
			return true;
		}
	}

	return false;
};

HashMap.prototype.isEmpty = function() {
	//TODO: implement
};

HashMap.prototype.getAllKeys = function() {
	console.log("ALL KEYS!!!!");
	for(var x in this.map) {
		console.log("key: "+x);
	}
}

HashMap.prototype.size = function() {
	var count = 0;

	for(var x in this.map) {
		count++;
	}

	return count;
};

var map = new HashMap();
map.put("file01", 1);
map.put("file02", 1337);
console.log("map size: " + map.size());
console.log("get(file02): " + map.get('file02'));
console.log("get(file01): " + map.get('file01'));
//map.remove('file02');
console.log("map size: " + map.size());
console.log("contains file02 " + map.containsKey('file01'));
map.getAllKeys();
