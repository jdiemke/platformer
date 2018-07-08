

/**
 * http://impactjs.com/documentation/class-reference/entity
 * http://impactjs.com/documentation/class-reference/animation
 * http://impactjs.com/documentation/collision
 * http://impactjs.com/documentation/animations
 * http://impactjs.com/documentation/entity-pooling
 *
 * http://impactjs.com/documentation/class-reference/entity
 * http://impactjs.com/documentation/class-reference/collisionmap#trace
 * https://books.google.de/books?id=LBA66A8YYq0C&pg=PT100&lpg=PT100&dq=impactjs+check+method&source=bl&ots=l21D_gB7zF&sig=TSNrz1DEOO6Ud7-Mneo4OzIG7Dc&hl=de&sa=X&ei=IF2sVOO1IcfvOf_LgDA&ved=0CHAQ6AEwCA#v=onepage&q=impactjs%20check%20method&f=false
 * http://www.remcodraijer.nl/quintus/tutorial.html
 * http://research.ncl.ac.uk/game/mastersdegree/gametechnologies/aifinitestatemachines/AI%20Tutorial%201%20-%20FSM.pdf
 * http://gameprogrammingpatterns.com/state.html
 * http://gamedevelopment.tutsplus.com/tutorials/finite-state-machines-theory-and-implementation--gamedev-11867
 */

export function Entity() {
	this.size = {
		width: 32,
		height: 32
	};

	this.offset = {
		x: 0,
		y: 0
	};

	this.velocity = {
		x: 0,
		y: 0
	};
	this.collides = Entity.COLLIDES.ACTIVE;
	this.bounciness = 1;
	this.animSheet = new AnimationSheet(require('./assets/mariotiles.png'), 32, 32);
	this.anims = {};
}

Entity.COLLIDES = Object.freeze({
	ACTIVE: 0,
	FIXED: 1
});

Entity.prototype.addAnim = function(name, time, sequence) {
	this.anims[name] = new Animation(this.animSheet, time, sequence);
};

//called when a collision occurs with the colliding opponent
Entitiy.prototype.check = function(other) {

};

Entity.prototype.kill = function() {
	// release resources for object pool?
};

Entity.prototype.update = function() {
	// move entity according to its physics properties:
	// - position
	// - velocity
	// - bounciness
	// and takes games collision map into account but not other entities

	// Call the parent update() method to move the entity
    // according to its physics
	Entity.prototype.update.call(this);
};

Entity.prototype.init = function() {
	this.addAnim('idle', 0.1, [1,2,3]);
	this.velocity = {x:1, y:1};
};

// interactive objects in the game world
// are subclassed from entitity
// provides animation
// drawing and basic physics
// can be added to the game world
// react to collision map and other
// entities
