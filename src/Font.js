/**
 * Font Class
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-30
 */

"use strict";

/**
 * Font constructor
 */
export function Font(image) {
	this.image = new Image();
	this.image.src = require('./assets/fonts/biolabsfont.png');
};

/**
 * Text alignment enum
 */
Font.ALIGN = Object.freeze({
	LEFT: 0,
	RIGHT: 1,
	CENTER: 2
});

/**
 *
 */
Font.prototype.draw = function(text, x, y, alignment) {
	for(var i = 0; i < text.length; i++) {
		var index = text.charCodeAt(i) - 32;
		context.drawImage(this.image, index*8, 0, 8, 8, x, y, 8, 8);
	}
};

