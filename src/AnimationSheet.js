/**
 * Animation Sheet
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2015-01-01
 */

"use strict";

import {Image2} from './Image';

import { AssetCache } from './AssetCache';

 export function AnimationSheet(filename, width, height) {
	this.image = new Image2(filename);
 	this.width = width;
 	this.height = height;
};

/**
 * Developer Test
 */
new AnimationSheet(require('./assets/images/mario.png'), 16, 16);
AssetCache.getInstance().getAllKeys();

/**
 * Example: new AnimationSheet("player.png", 16, 16);
 * Means that each animation frame is 16x16
 */
