/**
 * Sound
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-31
 */

"use strict";

// multichannel says whether multiple channesls should be created!
// multichannel is optional! TODO:
export function Sound(filename, multichannel) {
	this.path = filename;
	this.loop = false; // continuously loop sound
	this.volume = 1.0;
	this.channels = 4;
	this.multichannel = multichannel;
}

/**
 * Static variables
 */
// global setting whether sound and music is enabled!
Sound.enabled = true;

// Number of channels per Sound.
// Internally copys of the same sound are handled in
// a mod fashion in order to play several instances of the same
// sound simuktaniously
// example:
// this.channel[Math.floor(currentChannel++%pge.Sound.channels)].play();
Sound.channels = 1;

Sound.prototype.play = function() {

};

Sound.prototype.stop = function() {

};
