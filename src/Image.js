/**
 * pge.Image
 *
 * A thin wrapper for html5 images.
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-30
 */

"use strict";

import { AssetCache } from './AssetCache';

/**
 * This is the image constructor. It acts as a thin wrapper for an html5 image
 * object. In addition to being a thin wrapper the pge.Image also supports
 * caching using the AssetCache. The constructor first checks whether the Image
 * is in the cache and iff it is in the Asset Cache the cached version is returned.
 * In case the image is not available in the cache a new pge.Image is constructed and
 * added to the cache.
 *
 * @param path The path to an image file. The path is always relative to
 * 			   the .html file in which your game is running.
 * @returns A pge.Image instance
 */
export function Image2(path, usePreloader) {

	/*
	 * When usePreloader is not activly set
	 */
	this.usePreloader = usePreloader || false;

	if(AssetCache.getInstance().containsKey(path)) {
	//	this.isCached = true;
		return AssetCache.getInstance().get(path);
	} else {

		this.path = path;

		this.image = new Image();
		AssetCache.getInstance().add(path, this);
		console.log("usePreloader "+this.path + " " +this.usePreloader);
		if(this.usePreloader == false) {
					this.isCached = true;
			console.log("false");
			this.image.onload = function() {
				console.log("loaded const " +path);
			};

			this.image.src = path;
		}
	}

};

Image2.prototype.load = function(callback) {
	var path = this.path;
	console.log('TEST');
	this.image.onload = function() {
		console.log('onload ' + path);


		callback.loaded();
	};


   console.log('set src ' + path);
	this.image.src = this.path;
}

Image2.prototype.getImage = function() {
	return this.image;
};

Image2.prototype.draw = function(x, y) {
	// TODO: implement
};

Image2.prototype.drawTile = function(x, y, index, tileSize) {
	// TODO: implement
};

console.log('AssetCache.getInstance().size(): ' + AssetCache.getInstance().size());
//new pge.Image('media/images/back.png');
//new pge.Image('media/images/back2.png');
//new pge.Image('media/images/back.png');
AssetCache.getInstance().getAllKeys();


// WICHTIG: laden und cachen funktiert bereits
// ABER: wie bekommt man es hin, dass der Loader
// die assets laed und vorher nicht anfaengt!?
// http://impactjs.com/documentation/working-with-assets
// http://gamedev.stackexchange.com/questions/24102/resource-loader-for-an-html5-and-javascript-game
// http://fragged.org/preloading-images-using-javascript-the-right-way-and-without-frameworks_744.html
// http://www.mattlautz.us/impact-demos/initials-entry-screen/
// http://www.mattlautz.us/impact-demos/map-scrolling-with-arrow-keys/
// http://impactjs.com/documentation/entity-pooling
// http://impactjs.com/documentation/animations
// http://impactjs.com/documentation/collision
// http://impactjs.com/documentation/working-with-assets
// http://impactjs.com/documentation/weltmeister
// http://www.adobe.com/devnet/dreamweaver/articles/developing-html5-games-with-impactjs.html
