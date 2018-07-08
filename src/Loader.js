/**
 * Preloader
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-30
 */

"use strict";

import { context, context2 } from './main';
import { GameEngine, drawText, canvas2 } from './main';
import { Util } from './Util';

export function Loader() {

	if(Loader.instance != null) {
		return Loader.instance;
	} else {
		this.loadedResources = 0;
		this.neededResources = 0;
		this.done = false;
		this.status = 0;
		Loader.instance = this;
	}

};

Loader.instance = null;

Loader.getInstance = function() {
	return new Loader();
};

Loader.prototype.addCallback = function(callback) {
	this.callback = callback;
};

Loader.prototype.loaded = function() {
	this.loadedResources++;
	this.status = this.loadedResources / this.neededResources;
	this.draw();
	//requestAnimationFrame(this.draw);

	console.log('loaded count ' + this.loadedResources);
	console.log('needed count ' + this.neededResources);
	if(this.loadedResources == this.neededResources) {
		this.callback();
	}
};

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

Loader.prototype.preload = function() {

	for(var i = 0; i < arguments.length; i++) {
		if(!arguments[i].isCached) {
			this.neededResources++;
		}
	}

	this.draw();

	var that = this;


	for(var i = 0; i < arguments.length; i++) {
		if(!arguments[i].isCached) {

				that.loadResource.call(that, arguments[i]);

		}
	}
console.log('loaded count ' + this.loadedResources);
	console.log('needed count ' + this.neededResources);
	if(this.neededResources == 0) {
		this.callback();
	}
};

Loader.prototype.loadResource = function(res) {


				res.load(this);// this is the callback#

				console.log('loadRessource: ' +res.path);

};

/**
 * called during load to update the progress bar
 */

 // http://www.onextrapixel.com/2012/09/24/assets-loading-in-html5-game-development/
 // https://geeksretreat.wordpress.com/2012/08/13/a-progress-bar-using-html5s-canvas/
 // http://homepage.ntlworld.com/ray.hammond/progress/
Loader.prototype.draw = function() {
	 var percentage = (this.status * 100)|0;
	 console.log('loader progress: '+percentage);
	 context.fillStyle = 'black';
	 context.fillRect(0, 0, GameEngine.width, GameEngine.height);
	 context.fillStyle = 'white';
	 context.fillRect(0, GameEngine.height/2-10, GameEngine.width*this.status, 20);
	 drawText(100, 0, Util.prefixInteger(percentage, 3));
	 drawText(16, 26, 'PRELOADING GAME ASSETS.');
	 context2.drawImage(canvas2,0,0,GameEngine.width*GameEngine.scale,GameEngine.height*GameEngine.scale);
};
