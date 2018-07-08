/**
 * UserException
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2015-03-16
 */

"use strict";

export function UserException(message) {
	this.message = message;
	this.name = 'UserException';
};

UserException.prototype.toString = function() {
	return this.name + ': "' + this.message + '"';
};

// developer test
try {
	throw new UserException('Out of Memory');
} catch(e) {
	console.log('Caught Exception ' + e);
}
