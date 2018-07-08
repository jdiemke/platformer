"use strict";

/**
 * Sound Manager Singleton
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-14
 */

export function SoundManager() {

	/**
	 * Singleton Constructor
	 *
	 * @see https://code.google.com/p/jslibs/wiki/JavascriptTips#Singleton_pattern
	 */
	if(SoundManager.instance) {
		return SoundManager.instance;
	} else {
		SoundManager.instance = this;
	}

}

var soundManager = new SoundManager();

soundManager.JUMP_SOUND 	= new Audio(require("./assets/sounds/17.-fortress.mp3"));
soundManager.JUMP_SOUND2	= new Audio(require("./assets/sounds/smb_jump-small.wav"));
soundManager.COIN 			= new Audio(require("./assets/sounds/smb3_coin.wav"));
soundManager.LEVEL_BEGIN 	= new Audio(require("./assets/sounds/smb3_enter_level.wav"));
soundManager.DIED 			= new Audio(require("./assets/sounds/smb3_player_down.wav"));
soundManager.STOMP 			= new Audio(require("./assets/sounds/smb3_stomp.wav"));
soundManager.ONE_UP 		= new Audio(require("./assets/sounds/smb3_1-up.wav"));
soundManager.THWOMP 		= new Audio(require("./assets/sounds/smw_thud.wav"));
soundManager.QUESTION 		= new Audio(require("./assets/sounds/smw_shell_ricochet.wav"));


