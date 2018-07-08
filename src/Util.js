"use strict";

import { cosLookupTable } from './main';

/**
 * Util Methods
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-14
 */

export function Util() {

}

/**
 * This method prefixes an integer with zeros
 */
Util.prefixInteger = function(number, length) {
	return ('000000' + number).slice(-length);
}

Util.cosineInterpolate = function(start, end, time) {

	if(time <start) return 0;
	if(time >end) return 1;

	var mu = (time-start)/(end - start);
	return (1-Math.cos(mu*Math.PI))/2;
}

Util.fastCosineInterpolate = function(start, end, time) {

	if(time < start) {
		return 0;
	}

	if(time > end) {
		return 1;
	}

	var mu = (time-start)/(end - start);
	return (1 - cosLookupTable[(mu * 511/2) | 0]) / 2;
}

//http://shichuan.github.io/javascript-patterns/
