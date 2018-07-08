/**
 * Asset Cache Singleton
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-31
 */

"use strict";

import { HashMap } from './HashMap';

export function AssetCache() {

	if(AssetCache.instance != null) {
		return AssetCache.instance;
	} else {
		HashMap.call(this);
		AssetCache.instance = this;
	}

};

AssetCache.instance = null;

AssetCache.getInstance = function() {
	return new AssetCache();
};

AssetCache.prototype = Object.create(HashMap.prototype);

// change so the asset without name can be added and the name is used from the path property
AssetCache.prototype.add = function(name, asset) {
	this.put(name, asset);
};

/**
 * Developer Test
 */
// out commented because image is loaded in index.html after asset cache
// pge.AssetCache.getInstance().add('image01', new pge.Image(''));
// pge.AssetCache.getInstance().add('image02', new pge.Image(''));
// console.log('AssetCache.size(): ' + pge.AssetCache.getInstance().size());
