"use strict";

/**
 * 2D Collision Detection Library
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-15
 */

// by default all entities trace against the collision map
// as part of their update cycle

export function Circle(position, radius) {
	this.center = position;
	this.radius = radius;
}

Circle.prototype.intersects = function(circle) {

	var dx = this.center.x - circle.center.x;
	var dy = this.center.y - circle.center.y;

	var dist = Math.sqrt((dx * dx) + (dy * dy));
	return dist <= (this.radius + circle.radius);
};

// http://buildnewgames.com/broad-phase-collision-detection/
// http://www.metanetsoftware.com/technique/tutorialB.html
//http://gamedev.stackexchange.com/questions/44729/space-efficient-data-structures-for-broad-phase-collision-detection
// http://codeincomplete.com/posts/2013/5/18/javascript_gauntlet_collision_detection/
//http://buildnewgames.com/garbage-collector-friendly-code/
/**
 * http://devmag.org.za/2009/04/13/basic-collision-detection-in-2d-part-1/
 * http://devmag.org.za/2009/04/17/basic-collision-detection-in-2d-part-2/
 * http://devmag.org.za/2009/08/25/basic-vector-recipes/
 * http://devmag.org.za/2009/08/12/vector-fundamentals/
 * http://melonjs.github.io/tutorial-platformer/#part8
 * http://games.greggman.com/game/programming_m_c__kids/
 * https://www.youtube.com/channel/UCn7FE3Tx391g1tWPv-1tv7Q
 * http://deepnight.net/a-simple-platformer-engine-part-2-collisions/
 *
 */

