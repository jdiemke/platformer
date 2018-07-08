/**
 * Main Game
 */
//http://codeflow.org/entries/2013/feb/15/soft-shadow-mapping/

//use web audio api???

//************
// https://hacks.mozilla.org/2013/05/optimizing-your-javascript-game-for-firefox-os/
// https://mudcu.be/journal/2011/11/bitwise-gems-and-other-optimizations/
// http://updates.html5rocks.com/2012/08/When-milliseconds-are-not-enough-performance-now
// http://www.html5rocks.com/en/tutorials/canvas/performance/
//************************

// >>>>>>>>>>>> do not use real time but game time for animation! not date.now()

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// READ THIS:
// http://codeincomplete.com/posts/2013/12/3/javascript_game_foundations_loading_assets/
import { Font } from './Font';
import { Timer } from './Timer';
import { AnimationSheet } from './AnimationSheet';
import { AssetCache } from './AssetCache';
import { Vector2d } from './Vector2d';
import { Circle } from './Collision';
import { Animation2 } from './Animation';
import { Collection} from './Collection';
import { Loader } from './Loader';
import { SoundManager } from './SoundManager';
import { Image2 } from './Image';
import { Util } from './Util';

"use strict";

var image;
var tiles;
var font;
var mario;
var back, back2, display;
export var context;
export var context2;
var canvas;
export var canvas2;
var touchPoints = [];
var myFont = new Font("");
export var timer = new Timer();

/**
 * Trigonometry lookup tables
 * 6 times faster than sin/cos
 */
export var sinLookupTable = [];
export var cosLookupTable = [];

var hitTime = 0;

for(var i=0; i < 512; i++) {
	sinLookupTable[i] = Math.sin(Math.PI * 2.0 * i / 512);
	cosLookupTable[i] = Math.cos(Math.PI * 2.0 * i / 512);
}

/**
 * Enums
 */

var TileType = Object.freeze({
	WALKABLE	: 0,
	SOLID		: 1,
	CLOUD		: 2,
	SLOPE		: 3,
	SPIKES		: 4,
	LAVA		: 5,
	WATER		: 6,
	LADDER 		: 7
});

export var GameEngine = {
	fps: 30,
	width: 256,
	height: 224,
	scale: 2.0
};

/**
 * TODO: put it in its own file and refactor!!!
 */
function Tile(walkable, animation, ttype) {

	this.walkable = walkable;
	this.animation = animation;
	this.tileType = ttype;

	this.update = function() {
		if(this.tileType != TileType.WALKABLE)
			this.animation.update();
	};

	this.draw = function(x, y) {
		if(this.tileType != TileType.WALKABLE)
			this.animation.draw(x, y);
	};

}

var tileAnimSheet = new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16);

var LavaTile		= new Tile(true, new Animation2(tileAnimSheet, 0.007, [5,6,7,8]) , TileType.LAVA);
var CastleStone		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [0]), TileType.SOLID);
var CloudTile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [32]), TileType.CLOUD);
var EmptyTile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [10]), TileType.WALKABLE);
var QuestionTile	= new Tile(true, new Animation2(tileAnimSheet, 0.006, [11,12,13,14]), TileType.SOLID);
var SpikeTile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [4]), TileType.LAVA);
var BallTile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [42]), TileType.SOLID);
var FlowerTile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [46]), TileType.LADDER);
var Ladder1Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [47]), TileType.LADDER);
var Ladder2Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [48]), TileType.LADDER);
var Ladder3Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [49]), TileType.LADDER);
var Ladder4Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [50]), TileType.LADDER);
var Ladder5Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [51]), TileType.LADDER);
var Ladder6Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [52]), TileType.LADDER);
var Ladder7Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [53]), TileType.LADDER);
var Ladder8Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [54]), TileType.LADDER);
var Ladder9Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [55]), TileType.LADDER);

var castleBk1Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [59]), TileType.SOLID);
var castleBk2Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [60]), TileType.SOLID);
var castleBk3Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [61]), TileType.SOLID);
var castleBk4Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [62]), TileType.SOLID);
var castleBk5Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [63]), TileType.SOLID);
var castleBk6Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [64]), TileType.SOLID);
var castleBk7Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [65]), TileType.SOLID);
var castleBk8Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [66]), TileType.SOLID);
var castleBk9Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [67]), TileType.SOLID);
var castleBk10Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [68]), TileType.SOLID);
var castleBk11Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [69]), TileType.SOLID);
var castleBk12Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [70]), TileType.SOLID);
var castleBk13Tile		= new Tile(true, new Animation2(tileAnimSheet, 0.01, [71]), TileType.SOLID);


var TileSet = [];
TileSet[ 0] = CastleStone;
TileSet[ 1] = LavaTile;
TileSet[ 2] = QuestionTile;
TileSet[ 3] = SpikeTile;
TileSet[ 4] = BallTile;
TileSet[ 5] = FlowerTile;
TileSet[ 6] = Ladder1Tile;
TileSet[ 7] = Ladder2Tile;
TileSet[ 8] = Ladder3Tile;
TileSet[ 9] = Ladder4Tile;
TileSet[ 10] = Ladder5Tile;
TileSet[ 11] = Ladder6Tile;
TileSet[ 12] = Ladder7Tile;
TileSet[ 13] = Ladder8Tile;
TileSet[ 14] = Ladder9Tile;
TileSet[33] = EmptyTile;
TileSet[32] = CloudTile;
TileSet[34] = castleBk1Tile;
TileSet[35] = castleBk2Tile;
TileSet[36] = castleBk3Tile;
TileSet[37] = castleBk4Tile;
TileSet[38] = castleBk5Tile;
TileSet[39] = castleBk6Tile;
TileSet[40] = castleBk7Tile;
TileSet[41] = castleBk8Tile;
TileSet[42] = castleBk9Tile;
TileSet[43] = castleBk10Tile;
TileSet[44] = castleBk11Tile;
TileSet[45] = castleBk12Tile;
TileSet[46] = castleBk13Tile;

function Coin(x, y) {

	this.x= x;
	this.y= y;
	this.width= 16;
	this.height= 16;

	this.visible = true;
	this.collected = false;

	this.anims = {
		animRotate: new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.007, [16, 17, 18, 19]),
		sparkle1: new Animation2(new AnimationSheet(require('./assets/images/sparkle.png'), 8, 8), 0.01, [8,0,1,2,3,4,5,6,7,8], true),
		sparkle2: new Animation2(new AnimationSheet(require('./assets/images/sparkle.png'), 8, 8), 0.01, [8,0,1,2,3,4,5,6,7,8], true),
		sparkle3: new Animation2(new AnimationSheet(require('./assets/images/sparkle.png'), 8, 8), 0.01, [8,0,1,2,3,4,5,6,7,8], true),
		sparkle4: new Animation2(new AnimationSheet(require('./assets/images/sparkle.png'), 8, 8), 0.01, [8,0,1,2,3,4,5,6,7,8], true)
	};

	this.currentAnim = this.anims.animRotate;

	this.collect = function() {
		this.collected= true;
		this.collectTime = timer.now;

		this.anims.sparkle1.setStartTime(this.collectTime +50);
		this.anims.sparkle2.setStartTime(this.collectTime +180);
		this.anims.sparkle3.setStartTime(this.collectTime +260);
		this.anims.sparkle4.setStartTime(this.collectTime +300);
	}


	// TODO: remove update from draw method!
	this.draw= function() {
		if(!this.collected) {
			//drawTile2(this.animationFrames[pos], this.x,this.y);
			this.currentAnim.update();
			this.currentAnim.draw(this.x, this.y);
		}

		// length = length of anim(900 = 100*frames) + last start of anim (300)
		if(this.collected && timer.now < this.collectTime+900+300) {

			this.anims.sparkle1.update();
			this.anims.sparkle1.draw(this.x-4, this.y);

			this.anims.sparkle2.update();
			this.anims.sparkle2.draw(this.x+8, this.y-4);

			this.anims.sparkle3.update();
			this.anims.sparkle3.draw(this.x+4, this.y+6);

			this.anims.sparkle4.update();
			this.anims.sparkle4.draw(this.x+12, this.y+12);
		}
	};

}

function Mushroom(xpos, ypos) {
	this.size = {width: 16, height: 16};
	this.velocity = {x: 0,y: 0.0};
	this.offset = {x: 0, y: 1};
	this.position = {x: xpos, y: ypos};
	this.isJumping = false;
	this.collisionCircle = new Circle(this.position, 8.0);

	/**
	 * A factor, indicating with which force the entity will bounce back after a
	 * collision. With a .bounciness set to 1, the entity will bounce back with
	 * the same speed it has hit the other entity/collision map. Default 0.
	 */
	this.bounciness = 0.0;
	this.jumpspeed = 3;
	this.gravity = 0.0;
	this.animSheet = new AnimationSheet(require('./assets/images/jumper.png'), 16, 24);
	this.anims = {};
	this.dead = false;
	this.deathTime =0;


	this.active = true;
	this.anims = {
		animMushroom: new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.007, [33]),
	};

	this.currentAnim = this.anims.animMushroom;

	this.draw= function() {
		this.currentAnim.draw(this.position.x, this.position.y+1);
	};


	this.update = function() {
		doPhysics(this, this.velocity);
	};

	this.onHit = function() {
		this.velocity.x*=-1;
		//this.stateMachine.currentState.onHit.call(this);
	};

	this.onFalling = function() {
		//this.stateMachine.currentState.onFall.call(this);
	};

	this.onFloor = function() {
		//this.stateMachine.currentState.onFloor.call(this);
	};

	/**
	 * TODO: The circle center should be the center of the sprite
	 * and NOT the upper left corner of the sprite!
	 */
	this.intersects = function(player) {
		return this.collisionCircle.intersects(player.collisionCircle);
	};

}

function LaserBall(x, y) {
	this.xpos = x;
	this.ypos = y;
	this.width = 16;
	this.height = 16;
	this.speed = 1;
	this.jumpspeed =3;
	this.active = true;
	this.right = false;
	this.startTime = timer.now;
	this.vector = new Vector2d(0,0);

	this.anims = {
		animBall: new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.02, [34, 35, 36, 37, 38, 39, 40, 41]),
	};

	this.currentAnim = this.anims.animBall;

	this.draw= function() {

		var time = timer.now - this.startTime;

		this.currentAnim.update();
		//this.vector.fromAngle(time*0.0008, 16 * 1);
		//this.currentAnim.draw(this.xpos+this.vector.x, this.ypos+this.vector.y);
		//this.vector.fromAngle(time*0.0008, 16 * 2);
		//this.currentAnim.draw(this.xpos+this.vector.x, this.ypos+this.vector.y);
		var angle = (time>>5)&0x1ff;
		var angle2 = (angle+255)&0x1ff;
		this.vector.fromAngle(angle, 16 * 3);
		this.currentAnim.draw(this.xpos+this.vector.x, this.ypos+this.vector.y);
		this.vector.fromAngle(angle2, 16 * 3);
		this.currentAnim.draw(this.xpos+this.vector.x, this.ypos+this.vector.y);
	};

	/*this.intersects = function(player) {
		return new Circle(this.xpos,this.ypos, 8).intersects(new Circle(player.xpos, player.ypos, 8));
	};
	*/
}

var laserBall = new LaserBall(16*19,16*7);
var mush = new Mushroom(16*52,16*8+-1);

function Flame(x, y) {

	this.x= x;
	this.y= y;
	this.posx =x;
	this.posy=y;
	this.width= 16;
	this.height= 16;
	this.timeOffset = Math.random()*1000;

	this.visible = true;

	this.anims = {
		animUp: new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.02, [20,21,22]),
		animDown: new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.02, [23,24,25]),
		spit: new Animation2(new AnimationSheet(require('./assets/images/spit.png'), 16, 16), 0.01, [0,1,2,3,4,5,6], true)
	};

	this.currentAnim = this.anims.animUp;

	this.collides = function(player) {
		var center1x = this.posx + this.width/2;
		var center1y = this.posy + this.height/2;
		var center2x = player.position.x + player.width/2;
		var center2y = player.position.y + player.height/2;
		var distx = center1x - center2x;
		var disty = center1y - center2y;

		return Math.sqrt((distx*distx)+(disty*disty)) <= this.width/2 + player.width/2;
	};

	this.update = function() {
		// use a state machine to define flame as entity
	};

	this.draw= function() {
			if(this.visible) {
				this.currentAnim.update();
				var sin = ((timer.now+this.timeOffset)>>3)&0x1ff;
				if(cosLookupTable[sin]<0) {
					this.posy =this.y +Math.floor(sinLookupTable[sin]*16*7);
					this.currentAnim = this.anims.animUp;
				} else {
					this.posy = this.y+Math.floor(sinLookupTable[sin]*16*7)
					this.currentAnim = this.anims.animDown;
				}

				var temp = sinLookupTable[sin];
				if(temp <0 && temp > -0.1)
					this.anims.spit.rewind();

				this.currentAnim.draw(this.posx, this.posy);
				this.anims.spit.update();
				this.anims.spit.flipx = false;
				this.anims.spit.draw(this.x-16, this.y-16+4);
				this.anims.spit.flipx = true;
				this.anims.spit.draw(this.x+16, this.y-16+4);
			}
	};
}

function doPhysics(entity, velocity) {

	//var tempVel = {x: 0, y: 0};


	if(entity.velocity.x > 0) {
		if(!hit(entity.position.x + (entity.size.width - 1) + velocity.x, entity.position.y) &&
		   !hit(entity.position.x + (entity.size.width - 1) + velocity.x, entity.position.y + (entity.size.height - 1))) {
			entity.position.x += velocity.x;
		} else {
			var pos = entity.position.x += velocity.x;
			entity.position.x = (Math.floor((entity.position.x+(entity.size.width-1)+velocity.x)/16))*16-entity.size.width;
			if(entity.bounciness > 0) {
				//tempVel.x = (entity.position.x-pos) * entity.bounciness;
			}
			entity.onHit();
		}
	} else {

		if(!hit(entity.position.x+velocity.x, entity.position.y) &&
		   !hit(entity.position.x+velocity.x, entity.position.y+(entity.size.height-1)) ) {
			entity.position.x+=velocity.x;

		} else { // hit!
			if(entity.bounciness > 0) {
				var pos = entity.position.x+velocity.x;
				entity.position.x =  (((entity.position.x/16) | 0) * 16);
				//tempVel.x = (entity.position.x-pos) * entity.bounciness;
			} else {
				entity.position.x = ((entity.position.x/16) | 0) * 16;
			}

			entity.onHit();
		}
	}

	// recursive call to resolve bounciness
	// problematic because gravity for falling is computed again!!!!

	//if(tempVel.x > 0 || tempVel.y > 0) {
	//	doPhysics(entity, tempVel);
	//}

				// same check as the falling down check!!!!
	var isOnCloud = (onCloud(entity.position.x, entity.position.y+(entity.size.height-1)+1) &&
			         !onCloud(entity.position.x, entity.position.y+(entity.size.height-1)) ||
				     onCloud(entity.position.x+(entity.size.width-1), entity.position.y+(entity.size.height-1)+1) &&
			         !onCloud(entity.position.x+(entity.size.width-1), entity.position.y+(entity.size.height-1)));

	//falling
	if(!hit(entity.position.x, entity.position.y+(entity.size.height-1)+1) &&
	   !hit(entity.position.x + (entity.size.width-1), entity.position.y+(entity.size.height-1)+1) &&
	   !entity.isJumping &&
	   !isOnCloud) {
		entity.jumpspeed = 0;
		entity.isJumping = true;
		entity.onFalling();
	}

	if(entity.isJumping) {

		entity.jumpspeed = entity.jumpspeed + entity.gravity;
		if(entity.jumpspeed > 8) entity.jumpspeed = 8;

		if(entity.jumpspeed < 0) { //jumping up

			if(!hit(entity.position.x, entity.position.y+entity.jumpspeed) &&
			   !hit(entity.position.x+(entity.size.width-1), entity.position.y+entity.jumpspeed)) {
				entity.position.y+=entity.jumpspeed;
			} else {
				entity.position.y = Math.floor(entity.position.y/16)*16;
				entity.isJumping =true;
				entity.jumpspeed=0;
				entity.onHit();
			}

		} else { //falling
			// kinda tricky: test wether on cloud by checking wether the old y pos was not on cloud
			// we know two things at this poing: we are falling down AND if the previous pos
			// of the bottom sprite was not on cloud we crossed the cloud from top!!! because
			// we can jump max 16 pixel at once!
			var isOnCloud = (onCloud(entity.position.x, entity.position.y+(player.height-1)+entity.jumpspeed) &&
			            !onCloud(entity.position.x, entity.position.y+(entity.size.height-1)) ||
				     onCloud(entity.position.x+(entity.size.width-1), entity.position.y+(entity.size.height-1)+entity.jumpspeed) &&
			            !onCloud(entity.position.x+(entity.size.width-1), entity.position.y+(entity.size.height-1)));


			if(!hit(entity.position.x, entity.position.y+(entity.size.height-1)+entity.jumpspeed) &&
			   !hit(entity.position.x+(entity.size.width-1), entity.position.y+(entity.size.height-1)+entity.jumpspeed) &&
			   !isOnCloud
			   ) {
				entity.position.y+=entity.jumpspeed;

			} else {
				entity.position.y = Math.floor((entity.position.y+(entity.size.height-1)+entity.jumpspeed)/16)*16 -entity.size.height;
				entity.isJumping =false;
				entity.onFloor();
			}

		}
	}

}

// A Ball Mario shoots to kill enemies
function Fireball(xpos, ypos) {
	this.position = {x: xpos, y: ypos};
	this.size = {width: 8, height:8};
	this.animSheet = new AnimationSheet(require('./assets/images/fireball.png'), 9, 9);
	this.anims = {};

this.bounciness = 0.0;
	this.jumpspeed = 3;
	this.gravity = 0.5;
	this.velocity = {x: 1.99,y: 0.0};
	this.isJumping = false;
	this.addAnim = function(name, time, sequence) {
		this.anims[name] = new Animation2(this.animSheet, time, sequence);
	};

	this.init = function() {
		this.addAnim('anim', 0.008, [0, 1, 2, 3]);
		this.currentAnim = this.anims.anim.rewind();
	};

	this.init();
	this.inactive = false;

this.stateMachine = {
		states: {
			WALK: {
				onHit: function() {
					this.velocity.x *= -1;
					// no state transition, reflexiv transition
				},
				onFall: function() {
					//this.currentAnim = this.anims.animStanding;
					//this.velocity.x = 0;
					this.stateMachine.currentState = this.stateMachine.states.FALLING;
				},
				onFloor: function() {

				},
				onTimeOut: function() {
					// check timeout condition and do transition if needed!
				}
			},
			FALLING: {
				onHit: function() {
					this.velocity.x *= -1;
					this.inactive = true;
					//this.currentAnim.flipx = true;
				},
				onFall: function() {

				},
				onFloor: function() {

					//this.velocity = {x: 0.29,y: 0.0};
						this.jumpspeed = -6;
					this.isJumping = true;
					//this.currentAnim = this.anims.animRun;
					//this.stateMachine.currentState = this.stateMachine.states.FALLING;
				}
			}
		},

		currentState: null
	};

	this.stateMachine.currentState = this.stateMachine.states.FALLING;

	this.onHit = function() {
		this.stateMachine.currentState.onHit.call(this);
	};

	this.onFalling = function() {
		this.stateMachine.currentState.onFall.call(this);
	};

	this.onFloor = function() {
		this.stateMachine.currentState.onFloor.call(this);
	};

	this.update = function() {

		if(!this.dead) {
			doPhysics(this, this.velocity);
		}


	};

	this.draw = function() {

			this.currentAnim.update();
			this.currentAnim.draw(this.position.x, this.position.y);

	};
}


function Jumper(xpos, ypos) {

	this.size = {width: 16, height: 24};
	this.velocity = {x: -2.29,y: 0.0};
	this.offset = {x: 0, y: 1};
	this.position = {x: xpos, y: ypos};
	this.isJumping = false;
	this.collisionCircle = new Circle(this.position, 8.0);

	/**
	 * A factor, indicating with which force the entity will bounce back after a
	 * collision. With a .bounciness set to 1, the entity will bounce back with
	 * the same speed it has hit the other entity/collision map. Default 0.
	 */
	this.bounciness = 0.0;
	this.jumpspeed = 3;
	this.gravity = 0.4;
	this.animSheet = new AnimationSheet(require('./assets/images/jumper.png'), 16, 24);
	this.anims = {};
	this.dead = false;
	this.deathTime =0;

	/**
	 * TODO: implement state charts like proposed by harel, i.e.
	 * timers that fire transitions after a given time in a state!
	 */
	this.stateMachine = {
		states: {
			WALK: {
				onHit: function() {
					this.velocity.x *= -1;
					// no state transition, reflexiv transition
				},
				onFall: function() {
					//this.currentAnim = this.anims.animStanding;
					//this.velocity.x = 0;
					this.stateMachine.currentState = this.stateMachine.states.FALLING;
				},
				onFloor: function() {

				},
				onTimeOut: function() {
					// check timeout condition and do transition if needed!
				}
			},
			FALLING: {
				onHit: function() {
					this.velocity.x *= -1;
				},
				onFall: function() {

				},
				onFloor: function() {

					//this.velocity = {x: 0.29,y: 0.0};
						this.jumpspeed = -6;
					this.isJumping = true;
					//this.currentAnim = this.anims.animRun;
					//this.stateMachine.currentState = this.stateMachine.states.FALLING;
				}
			}
		},

		currentState: null
	};

	this.stateMachine.currentState = this.stateMachine.states.FALLING;

	this.addAnim = function(name, time, sequence) {
		this.anims[name] = new Animation2(this.animSheet, time, sequence);
	};

	this.init = function() {
		this.addAnim('animRun', 0.003, [0, 1]);
		this.currentAnim = this.anims.animRun.rewind();
	};

	this.init();

	this.collides = function(player) {

		if(this.dead) {
			return false;
		}

		if(this.collisionCircle.intersects(player.collisionCircle)) {

			if(!player.dead && player.position.y < this.collisionCircle.center.y) {
				this.dead = true;
				player.position.y = this.position.y - player.height;
				player.isJumping = true;
				player.jumpspeed = -9;
				player.animation='jumping.right';
				//http://stackoverflow.com/questions/14926306/javascript-play-sound-on-hover-stop-and-reset-on-hoveroff
				//https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
				SoundManager().STOMP.pause();
				SoundManager().STOMP.currentTime = 0;
				SoundManager().STOMP.volume = 1.0;
				SoundManager().STOMP.play();
				this.deathTime = timer.now;
				//this.currentAnim = this.anims.animDead.rewind();
				player.points += 50;
			} else if(!player.dead){
				player.dead=true;

				player.animation='dieing';
				player.deathTime = timer.now;


				SoundManager().JUMP_SOUND.pause();
				SoundManager().DIED.pause();

				SoundManager().DIED.currentTime = 0.0;
				SoundManager().DIED.play();
			}
		}
	};

	/**
	 * @see http://www.bennadel.com/blog/2265-changing-the-execution-context-of-javascript-functions-using-call-and-apply.htm
	 * for description of call method
	 */
	this.onHit = function() {
		this.stateMachine.currentState.onHit.call(this);
	};

	this.onFalling = function() {
		this.stateMachine.currentState.onFall.call(this);
	};

	this.onFloor = function() {
		this.stateMachine.currentState.onFloor.call(this);
	};

	this.update = function() {

		if(!this.dead) {
			doPhysics(this, this.velocity);
		}

	};

	this.draw = function() {

		if(this.dead &&  timer.now < this.deathTime+1100) {
			var alpha = Util.fastCosineInterpolate(this.deathTime+100,this.deathTime+1100, timer.now);
			context.globalAlpha = 1-Math.min(alpha,1);
			this.currentAnim.draw(this.position.x + this.offset.x, this.position.y + this.offset.y);
			context.globalAlpha = 1.0;
		} else if(!this.dead) {
			this.currentAnim.update();
			this.currentAnim.draw(this.position.x + this.offset.x, this.position.y + this.offset.y);
		}

	};

};

/**
 * RAFCTOR:
 * - a moving platform can have a set of frame points that define positions in space for the platform
 * - these positions are interpolated during time
 * - its improtant, that movement is always the same speed
 * - there should be at least two modes:
 *   + loop mode (moves from last pos to start pos) and
 *   + return mode (goes back all points to the start point)
 *   + fall after last point.
 *   + manual path definition by function f(time) -> (x,y)
 *   + different interpolation method: linear, cosine, spline
 */
function MovingPlatform(xpos, ypos) {
	this.position = {x: xpos, y: ypos};
	this.size = {width: 16*3, height: 16};
	this.animSheet = new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16);
	this.xstart  =xpos;
	this.ystart  =ypos;
	this.anims = {};
	this.addAnim = function(name, time, sequence) {
		this.anims[name] = new Animation2(this.animSheet, time, sequence);
	};

	this.init = function() {
		this.addAnim('animRun1', 0.004, [56]);
		this.addAnim('animRun2', 0.004, [57]);
		this.addAnim('animRun3', 0.004, [58]);
		this.currentAnim = this.anims.animRun1.rewind();
	};

	this.init();

	this.update = function() {
		this.oldx = this.position.x;
		this.oldy = this.position.y;
		var sin = sinLookupTable[(Math.round(timer.now *0.09) ) % 512];
		this.position.x = Math.round(this.xstart + ((sin+1.0) * (5*16) * 0.5));

		var cos = cosLookupTable[(Math.round(timer.now *0.09) ) % 512];
		//this.position.y = Math.round(this.ystart - ((cos+1.0) * (5*16) * 0.5));

	};


	this.draw = function() {
		this.anims.animRun1.draw(this.position.x  + 0*16, this.position.y);
		this.anims.animRun2.draw(this.position.x  + 1*16, this.position.y);
		this.anims.animRun3.draw(this.position.x  + 2*16, this.position.y);

	};

		this.contains =function(x, y) {
		return x >= this.position.x && x <= this.position.x+this.size.width-1 &&
		       y >= this.position.y && y <= this.position.y+this.size.height-1;
	};
}

function Knall(xpos, ypos) {

	this.size = {width: 24, height: 32};


	this.velocity = {x: 0.0,y: 0.0};
	this.offset = {x: 0, y: 1};
	this.position = {x: xpos, y: ypos};
	this.isJumping = false;
	this.collisionCircle = new Circle(this.position, 8.0);

	/**
	 * A factor, indicating with which force the entity will bounce back after a
	 * collision. With a .bounciness set to 1, the entity will bounce back with
	 * the same speed it has hit the other entity/collision map. Default 0.
	 */
	this.bounciness = 0.0;
	this.jumpspeed = 3;
	this.gravity = 0.0;//1.7;

	this.anims = {};
	this.dead = false;
	this.deathTime =0;

	this.animSheet = new AnimationSheet(require('./assets/images/knall.png'), 24, 32);

	this.anims = {};
	this.moveup = false;

	this.back = true;
	this.addAnim = function(name, time, sequence) {
		this.anims[name] = new Animation2(this.animSheet, time, sequence);
	};

	this.init = function() {
		this.addAnim('animRun', 0.004, [0]);
		this.currentAnim = this.anims.animRun.rewind();
	};

	this.init();

	this.onFalling = function() {

	};

	this.onFloor = function() {
		hitTime = timer.now;
		this.isJumping = true;
		this.jumpspeed = -1.2;
		this.gravity = 0.0;

		SoundManager().THWOMP.pause();

				SoundManager().THWOMP.currentTime = 0.0;
				SoundManager().THWOMP.play();
	};

	this.onHit = function() {
		this.gravity = 0.0;
		this.jumpspeed = 0.0;
		this.isJumping = true;
		this.back = true;
	};

	this.xoff = 0.0;
	this.update = function() {
		var center = (this.position.x + this.size.width/2);
		var dist = Math.abs(center - (player.position.x + player.width/2));
		if(dist < (12+8) && this.back) {
			this.gravity =1.7;
			this.back = false;
			this.xoff = 0.0;
		} else if(dist < (12+8+16) && this.back) {
			this.xoff = 1*sinLookupTable[((timer.now)|0)%0x1ff];
		}

		doPhysics(this, this.velocity);
	};

	this.draw = function() {
		this.currentAnim.draw(this.position.x +this.xoff, this.position.y);
	};

}

var platforms = [];
platforms.push(new MovingPlatform(16*31,16*6));
platforms.push(new MovingPlatform(16*31,16*10));

var fireballs = [];
fireballs.push(new Fireball(16*20,16*8));

var knall = new Knall(16*24+4, 16*1);

function Goomba(xpos, ypos) {

	this.size = {width: 16, height: 16};
	this.velocity = {x: 0.49,y: 0.0};
	this.offset = {x: 0, y: 1};
	this.position = {x: xpos, y: ypos};
	this.isJumping = false;
	this.collisionCircle = new Circle(this.position, 8.0);

	/**
	 * A factor, indicating with which force the entity will bounce back after a
	 * collision. With a .bounciness set to 1, the entity will bounce back with
	 * the same speed it has hit the other entity/collision map. Default 0.
	 */
	this.bounciness = 1.0;
	this.jumpspeed = 3;
	this.gravity = 0.4;
	this.animSheet = new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16);
	this.anims = {};
	this.dead = false;
	this.deathTime =0;

	/**
	 * TODO: implement state charts like proposed by harel, i.e.
	 * timers that fire transitions after a given time in a state!
	 */
	this.stateMachine = {
		states: {
			WALK: {
				onHit: function() {
					this.velocity.x *= -1;
					// no state transition, reflexiv transition
				},
				onFall: function() {
					this.currentAnim = this.anims.animStanding;
					//this.velocity.x = 0;
					this.stateMachine.currentState = this.stateMachine.states.FALLING;
				},
				onFloor: function() {

				},
				onTimeOut: function() {
					// check timeout condition and do transition if needed!
				}
			},
			FALLING: {
				onHit: function() {},
				onFall: function() {},
				onFloor: function() {
					this.velocity.x = 0.49;
					this.velocity.y = 0.0;
					this.currentAnim = this.anims.animRun;
					this.stateMachine.currentState = this.stateMachine.states.WALK;
				}
			}
		},

		currentState: null
	};

	this.stateMachine.currentState = this.stateMachine.states.WALK;

	this.addAnim = function(name, time, sequence) {
		this.anims[name] = new Animation2(this.animSheet, time, sequence);
	};

	this.init = function() {
		this.addAnim('animRun', 0.004, [43, 44]);
		this.addAnim('animStanding', 0.004, [43]);
		this.addAnim('animDead', 0.004, [45]);
		this.currentAnim = this.anims.animRun.rewind();
	};

	this.init();

	this.collides = function(player) {

		if(this.dead) {
			return false;
		}

		if(this.collisionCircle.intersects(player.collisionCircle)) {

			if(!player.dead && player.position.y < this.collisionCircle.center.y) {
				this.dead = true;
				player.position.y = this.position.y - player.height;
				player.isJumping = true;
				player.jumpspeed = -9;
				player.animation='jumping.right';
				//http://stackoverflow.com/questions/14926306/javascript-play-sound-on-hover-stop-and-reset-on-hoveroff
				//https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
				SoundManager().STOMP.pause();
				SoundManager().STOMP.currentTime = 0;
				SoundManager().STOMP.volume = 1.0;
				SoundManager().STOMP.play();
				this.deathTime = timer.now;
				this.currentAnim = this.anims.animDead.rewind();
				player.points += 50;
			} else if(!player.dead){
				player.dead=true;

				player.animation='dieing';
				player.deathTime = timer.now;


				SoundManager().JUMP_SOUND.pause();
				SoundManager().DIED.pause();

				SoundManager().DIED.currentTime = 0.0;
				SoundManager().DIED.play();
			}
		}
	};

	/**
	 * @see http://www.bennadel.com/blog/2265-changing-the-execution-context-of-javascript-functions-using-call-and-apply.htm
	 * for description of call method
	 */
	this.onHit = function() {
		this.stateMachine.currentState.onHit.call(this);
	};

	this.onFalling = function() {
		this.stateMachine.currentState.onFall.call(this);
	};

	this.onFloor = function() {
		this.stateMachine.currentState.onFloor.call(this);
	};

	this.update = function() {

		if(!this.dead) {
			doPhysics(this, this.velocity);
		}

	};

	this.draw = function() {
		this.currentAnim.update();


		var alpha = Util.fastCosineInterpolate(this.deathTime+100,this.deathTime+1100, timer.now)
				// fade pit eme,y after death! :)
				if(this.dead)
				context.globalAlpha = 1-Math.min(alpha,1);
				this.currentAnim.draw(this.position.x + this.offset.x, this.position.y + this.offset.y);
				context.globalAlpha = 1.0;


	};

};

var goomba = new Goomba(16*12,16*2);
var jumper = new Jumper(16*12,16*2);

function QuestionBox(xpos, ypos) {
	this.size = {width: 16, height: 16};
	this.position = {x: xpos, y: ypos};
	this.xcenter = 16*17;
	this.hitTime =0;
	this.empty = false;
	this.isFilled = true;

	this.anims = {
		question: 		new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.003, [11,12,13,14]),
		used: 		new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.003, [72])
		};

		this.currentAnim = this.anims.question.rewind();
		mush.active = false;
		this.draw = function() {
		// TODO: if visible do things!
		this.currentAnim.update();
		//this.position.x = this.xcenter +sinLookupTable[((timer.now>>5)|0)%0x1ff]*32
		var alpha = Util.fastCosineInterpolate(this.hitTime+0,this.hitTime+100, timer.now)
					-Util.fastCosineInterpolate(this.hitTime+100,this.hitTime+200, timer.now);

		if(timer.now >= (this.hitTime+200) && timer.now <= (this.hitTime+500) && this.isFilled==false) {
			mush.active = true;
		mush.position.y=this.position.y - 16*Util.fastCosineInterpolate(this.hitTime+200,this.hitTime+500, timer.now);
	}
		if(this.empty==true &&timer.now > (this.hitTime+600)) {this.empty =false;
		this.currentAnim = this.anims.used;
			mush.jumpspeed = -4;
					mush.isJumping = true;
					mush.velocity.x=1.7;
					mush.gravity = 0.3;

				}


		this.currentAnim.draw(this.position.x, this.position.y-alpha*8);

	};

	this.hit = function () {
			if(this.isFilled==true) {
				this.isFilled=false;
				this.empty=true;
			this.hitTime = timer.now;
			SoundManager().STOMP.pause();
				SoundManager().STOMP.currentTime = 0;
				SoundManager().STOMP.volume = 1.0;
				SoundManager().STOMP.play();
			}
	};

	this.contains =function(x, y) {
		return x >= this.position.x && x <= this.position.x+this.size.width-1 &&
		       y >= this.position.y && y <= this.position.y+this.size.height-1;
	};
}

function Monster(xpos, ypos) {

	this.width= 16;
	this.height= 16;

	this.size = {width: 16, height: 16};
	this.velocity = {x: -0.49,y: 0.0};
	this.offset = {x: 0, y: 1};
	this.position = {x: xpos, y: ypos};
	this.isJumping = false;
	this.gravity = 0.4;
	this.visible = true;
	this.debug=true;
	this.deathTime =0;
	this.speed =0.5;
	this.jumpspeed = 3;
	this.right = false;

	/**
	 * SETUP ANIMATIONS
	 */
	this.anims = {
		animRun: 		new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.003, [28, 29]),
		animDie: 		new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.003, [30, 31], true),
		animSpikesUp: 	new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.01, [27, 26], true),
		animSpikesDown: new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.01, [26, 27], true)
	};

	this.currentAnim = this.anims.animRun.rewind();

	/**
	 * SETUP STATES
	 */
	this.states = {
		WALKING: 0,
		SPIKES: 1,
		DEAD: 2,
	};

	this.currentState = this.states.WALKING;
	this.startTime = timer.now + (Math.random()*5000);
	this.collides = function(player) {
		if(!this.visible) return;
		var center1x = this.position.x + this.size.width/2;
		var center1y = this.position.y + this.size.height/2;
		var center2x = player.position.x + player.width/2;
		var center2y = player.position.y + player.height/2;
		var distx = center1x - center2x;
		var disty = center1y - center2y;
		//console.log(center2x + " " + center2y);
		//console.log("dist "+Math.sqrt((distx*distx)+(disty*disty)) );
		if(Math.sqrt((distx*distx)+(disty*disty)) <= this.width/2 + player.width/2) {

			if(!player.dead &&center2y < center1y && !(this.currentState == this.states.SPIKES)) {
				this.visible = false;
				player.position.y = this.position.y - player.height;
				player.isJumping = true;
				player.jumpspeed = -9;
				player.animation='jumping.right';
				//http://stackoverflow.com/questions/14926306/javascript-play-sound-on-hover-stop-and-reset-on-hoveroff
				//https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
				SoundManager().STOMP.pause();
				SoundManager().STOMP.currentTime = 0;
				SoundManager().STOMP.volume = 1.0;
				SoundManager().STOMP.play();
				this.deathTime = timer.now;
				this.currentAnim = this.anims.animDie.rewind();
				player.points += 50;
			} else if(!player.dead){
				player.dead=true;

				player.animation='dieing';
				player.deathTime = timer.now;


				SoundManager().JUMP_SOUND.pause();
				SoundManager().DIED.pause();

				SoundManager().DIED.currentTime = 0.0;
				SoundManager().DIED.play();
			}
		}
	};



	this.onFalling = function() {

	};

	this.onFloor = function() {

	};

	this.onHit = function() {
		this.velocity.x *= -1;
		this.right = !this.right;
	};

	this.update = function() {
		/**
		 * update:
		 * - artificial intelligence
		 * - physical simulation
		 */
		if(this.visible) {// not ded! ;) FIX THIS!!
			var elapsedInSec = ((timer.now - this.startTime) / 1000) | 0;
			if(this.currentState != this.states.SPIKES && (elapsedInSec % 10) < 5) {
				this.currentState =this.states.SPIKES;
				this.currentAnim = this.anims.animSpikesUp.rewind();
				this.anims.animSpikesDown.rewind();
			} else if(this.currentState != this.states.WALKING && !((elapsedInSec % 10) < 5)) {
				this.currentState =this.states.WALKING;
				this.currentAnim = this.anims.animRun;//rewind();
			}

			if(this.currentState == this.states.SPIKES &&  (elapsedInSec % 10) >= 4) {
				this.currentAnim = this.anims.animSpikesDown;
			}

			if(this.currentState == this.states.WALKING)
				//moveMushroom(this);
				doPhysics(this, this.velocity);

			if(this.right) {
				this.currentAnim.flipx = true;
			} else {
				this.currentAnim.flipx = false;
			}
		}
	};

	this.draw = function() {
		// TODO: if visible do things!
		this.currentAnim.update();
		if(this.visible) {
			this.currentAnim.draw(this.position.x, this.position.y+1);
		} else {

			if((timer.now-this.deathTime) * 0.003 < 5 ) {
				var alpha = Util.fastCosineInterpolate(this.deathTime+100,this.deathTime+1100,timer.now)
				// fade pit eme,y after death! :)
				context.globalAlpha = 1-Math.min(alpha,1);
				this.currentAnim.draw(this.position.x, this.position.y+1);
				context.globalAlpha = 1.0;
			} else { //remove from collection
				// this is buggy since the  draw cpde loops over the array size and this method reduces it while looping
				//monsterCollection.remove(this);

			}
		}
	};

}

var monsterCollection = new Collection();
monsterCollection.add(new Monster(16*9,16*7));
monsterCollection.add(new Monster(16*17,16*6));
monsterCollection.add(new Monster(16*22,16*10));

var flame = new Flame(16*6,16*11);
var flame2 = new Flame(16*12,16*11);

var coinCollection = new Collection();

coinCollection.add(new Coin(32,16));
coinCollection.add(new Coin(16,16*10));
coinCollection.add(new Coin(16*3,16*7));
coinCollection.add(new Coin(16*7,16*7));
coinCollection.add(new Coin(16,16*5));
coinCollection.add(new Coin(16*31,16*5));
coinCollection.add(new Coin(16*32,16*5));
coinCollection.add(new Coin(16*33,16*5));
coinCollection.add(new Coin(16*34,16*5));
coinCollection.add(new Coin(16*35,16*5));
coinCollection.add(new Coin(16*36,16*5));
coinCollection.add(new Coin(16*37,16*5));
coinCollection.add(new Coin(16*38,16*5));

coinCollection.add(new Coin(16*49,16*6));
coinCollection.add(new Coin(16*49,16*7));
coinCollection.add(new Coin(16*49,16*8));

var Keyboard = {
	pressed: [],

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	CTRL: 17,
	ALT: 18,
	ENTER: 13,
	W: 'W'.charCodeAt(0),
	E: 'E'.charCodeAt(0),
	R: 'R'.charCodeAt(0),

	isPressed: function(keyCode) {
		return this.pressed[keyCode];
	},

	setKeyStatus: function(event, status) {
		this.pressed[event.keyCode] = status;


		if(event.keyCode ==13 && status==true) {
			toggleFullScreen();
		}
	}
};

function Animation(name, frames, speed) {
	this.name = name;
	this.frames = frames;
	this.speed = speed;
}

var time = 30;

var question = new QuestionBox(16*52, 16*8);

function Player() {

	this.position = {x: 16*55, y: 16*2};
	this.collisionCircle = new Circle(this.position, 8.0);
	this.lives = 5; // start with 3 lives!
	this.coins = 0;
	this.points = 0;
	this.width = 16-4;
	this.height = 14;
	this.isJumping = false;
	this.gravity = 1.1;//1.3,
	this.speed = 2.9; // can be changed if mario is running!
	this.debugMode = true;
	this.frames = [0,2];
	this.animation = 'walking.left';
	this.animations = {
		'standing.left': new Animation('run:left', [0], 0.008),
		'standing.right': new Animation('run:left', [2], 0.008),
		'walking.left': new Animation('run:left', [0,1], 0.008),
		'walking.right': new Animation('run:left', [2,3], 0.008),
		'jumping.left': new Animation('run:left', [4], 0.008),
		'jumping.right': new Animation('run:left', [5], 0.008),
		'dieing': new Animation('run:left', [6], 0.008),
		'climbing': new Animation('run:left', [7,8], 0.004),
		'climbing.pause': new Animation('run:left', [7], 0.008)
	};

	this.anims = {
		animStanding: 	new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.003, [0]),
		animWalking: 	new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.003, [0, 1]),
		animJumping: 	new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.003, [4]),
		animdieing: 	new Animation2(new AnimationSheet(require('./assets/images/mariotiles.png'), 16, 16), 0.003, [6]),
	};

	this.currentAnim = this.anims.animStanding.rewind();

	this.dead= false;
	this.deathTime= 0;

	this.intersects = function(coin) {

		return !(coin.x > this.position.x+this.width-1
        	|| coin.x+15 < this.position.x
        	|| coin.y > this.position.y+this.height-1
        	|| coin.y+15 < this.position.y);

	};

	this.draw = function(context) {

		var addDeathY=0;
		if(this.dead) {
			var elapsed = timer.now -this.deathTime;
			addDeathY = (1-Util.fastCosineInterpolate(500, 2500, elapsed))*60-60+Util.fastCosineInterpolate(2500, 3500, elapsed)*80;

			//addDeathY = Math.floor(-Math.sin(()*0.0005) * 16*10);

		}

			var pos = Math.floor((timer.now*this.animations[this.animation].speed)%this.animations[this.animation].frames.length);

			drawTile(this.animations[this.animation].frames[pos], Math.floor(this.position.x)-2, Math.floor(this.position.y)-1+addDeathY);
	};
};

var player = new Player();

var world = [
	[ 0, 0,33,33,33,33,33,33,33,33,33, 0,33,33,33,33,33,33,33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,33, 6, 7, 7, 7, 7, 7, 7, 7, 8,33,33,33,33,33,33,33,33,33, 33,33,33,33, 33,33,33,33, 33],
	[ 0, 5,33,33,33,33,33,33,33,33,33, 5,33,33,33,33,33,33,33, 0, 0, 0, 0, 0,33,33, 0, 0, 0,33, 9,10,10,10,10,10,10,10,11,33,33,33,33,33,33,33,33,33, 33,33,33,33, 33,33,33,33, 33],
	[ 0, 5, 2,33,33,32,33,33,33,33,33, 5,33,33,33,33,33,33,33, 0, 0, 0, 0, 0,33,33,33,33,33,33, 9,10,10,10,10,10,10,10,11,33,33,33,33,33,33,33,33,33, 33,33,33,33, 33,33,33,33, 33],
	[ 0, 5,33, 2, 2, 2,33,33,32,32,33, 5,33,33,33,33,33,33,33, 0, 0, 0, 0, 0,33,33,33,33,33,33, 9,10,10,10,10,10,10,10,11,33,33, 0,33,33,33,33,33,33, 33,33,33,33, 33,33,33,33, 0],
	[ 0, 5,33,33,33,33,33,33,33,33,33, 5,32,32,32,32,33,33,33,33,33,33,33,33,33,33,33,33,33,33,12,13,13,13,13,13,13,13,14,33,33, 5,33,33,33,33,33,33, 33,33,33,33, 33,33,33,33, 0],
	[ 0, 5,33,33,33,33,33,33, 2,33, 2, 5,33,33, 0, 0,33,33,33,33,33,33,33,33,33,33,33,33, 0, 0, 0,33,33,33,33,33,33,33,33, 0, 0, 5, 0,33,33,33,33,33, 33,33,33,33, 33,33,33,33, 0],
	[ 0, 5,33,33,33,33,33,33,33,33,33, 5,33,33, 0, 0,33,33,33,33,33,33,33,33,33,33,33,33, 0, 0, 0,33,33,33,33,33,33,33,33, 0, 0, 5, 0,33,33,33,33,33, 33,33,33,33, 33,33,33,33, 0],
	[ 0, 5,33,33,33,33,33,33,33,33,33, 5,33,33, 0, 0, 0, 0, 0, 4,33,33,33,33,33,33,33,33, 0, 0, 0,33,33,33,33,33,33,33,33, 0, 0, 5, 0,33,33,33,33, 0, 33,33,33,33, 33,33,33,33, 0],
	[ 0, 5,33, 0, 0,33,33, 0, 0, 0, 0, 0,33,33, 0, 0, 0, 0, 0, 0,33,33,33,33, 0, 0, 0, 0, 0, 0,33,33,33,33, 0, 0,33,33,33,33,33, 5, 0,33,33,33, 0, 0, 33,33,33,33, 33,33,33,33, 0],
	[ 0, 5,33, 0, 0,33,33,33,33,33,33,33,33,33, 0, 0, 0, 0, 0, 0,33,33,33,33, 0, 0, 0, 0, 0, 0,33,33,33,33, 0, 0,33,33,33,33,33, 5, 0,33,33, 0, 0, 0, 0,33,33,33, 33,33,33,33, 0],
	[ 0, 5,33, 0, 0,33,33,33,33,33,33,33,33,33, 0, 0, 0, 0, 0, 0,33,33,33,33, 0, 0, 0, 0, 0, 0, 0,33,33,33,33,33,33,33,33, 0, 0, 0, 0,33, 0, 0, 0, 0, 0,33,33,33, 33,33,33,33, 0],
	[ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0,0,0,0,0,0]
];

var background = [
	[34, 34, 34, 34],
	[34, 35, 36, 37],
	[38, 39, 40, 41],
	[42, 40, 40, 40],
	[43, 40, 40, 40],
	[43, 40, 40, 40],
	[43, 40, 40, 40],
	[43, 40, 40, 40],
	[43, 40, 40, 40],
	[43, 40, 40, 40],
	[43, 40, 40, 40],
	[45, 46, 40, 44]
];

function drawTile(tile, x, y) {
	var xoff= tile & 15;
	var yoff= (tile / 16) | 0;
	context.drawImage(mario, xoff*16, yoff*16, 16, 16, x, y, 16, 16);
}

/*
 * Draws the given text at position (x,y)
 * important: xoff and yoff need image width / tile width as constant
 */
export function drawText(x, y, text) {
	for(var c=0; c <text.length; c++) {
		var asciiCode = text.charCodeAt(c);
		var index = asciiCode - 32;
		var xoff=index%32; // mod image with /tile width!
		var yoff=(index/32) | 0;
		context.drawImage(font, xoff*8, yoff*8, 8, 8,  x + 8 * c, y, 8, 8);
	}
}

/**
 * change this method accoinrd to the bound handling that is wanted for off level
 * walking and jumping: you can return false or true for horizontal and vertical offscren
 * running. also refactir to set the max and min x,y values based on the level size
 * and not hardcoded!!!
 */


 /**
  * PROBLEM: contains test is WROOONG in this section! since the collision response is tailored
  * to work only with tile array boundarys alignments to 16*16
  * TODO: do a special check for moving tiles that are not aligned. Handle collision cases
  * that can happen when the moving object moves into the player!
  *
  */
function hit(x, y) {
	if(((y/16)|0) > 11 || ((y/16)|0) < 0) return false; // set to max numcolumns
	//var boxContains = question.contains(x,y);
	return TileSet[world[((y/16)|0)][((x/16)|0)]].tileType==TileType.SOLID;// || boxContains;
}


function onCloud(x, y) {
	if(((y/16)|0) > 11 || ((y/16)|0) < 0) return false; // set to max numcolumns
	return TileSet[world[((y/16)|0)][((x/16)|0)]].tileType==TileType.CLOUD;
}

function onLadder(x, y) {
	if(((y/16)|0) > 11 || ((y/16)|0) < 0) return false; // set to max numcolumns
	return TileSet[world[((y/16)|0)][((x/16)|0)]].tileType==TileType.LADDER;
}

// TODO: remove floor
function onSlope(x, y) {
	if(((y/16)|0)>11 ||Math.floor(y/16)<0 ) return false; // set to max numcolumns
	return world[Math.floor(y/16)][Math.floor(x/16)]==111; //wrong id
}



var countDownStart = timer.now;
var timeOld;

function update() {
	timer.update()
	for(var x in TileSet) {
		TileSet[x].update();
	}

	timeOld = time;
	time = Math.max(30 - (((timer.now - countDownStart) / 1000)|0) ,0);


	//var oldY = player.position.y;


	/**
	 * TODO:
	 * - update all platforms here
	 * - check whether platfrom grabbed player or entity
	 * - if player has platform, then move according to platform AND do collision check againts tile map
	 */

	for(var i=0; i < platforms.length; i++) {
		platforms[i].update();
	}

	if(player.platform != null) {
		var velx = player.platform.position.x -player.platform.oldx;
		var vely = player.platform.position.y -player.platform.oldy;

		if(velx < 0) {
			if(!hit(player.position.x+velx, player.position.y) &&
		   !hit(player.position.x+velx, player.position.y+(player.height-1)))  {
			player.position.x+=velx;

			} else {
				player.position.x = Math.floor(player.position.x/16)*16;
			}
		} else if(velx > 0){
			if(!hit(player.position.x+(player.width-1)+velx, player.position.y) &&
		   !hit(player.position.x+(player.width-1)+velx, player.position.y+(player.height-1))) {
				player.position.x+=velx;
			} else {
				player.position.x = (Math.floor((player.position.x+(player.width-1)+velx)/16))*16-player.width;
			}

		}

		player.position.y +=vely;
	}

	if(!player.dead) {

		if(Keyboard.isPressed(Keyboard.W)) {
			player.speed = 4.2; // run
		} else {
			player.speed = 2.9;
		}

	if((Keyboard.isPressed(Keyboard.UP) || Keyboard.isPressed(Keyboard.DOWN)) &&
		(onLadder(player.position.x,player.position.y) ||
			onLadder(player.position.x+player.width-1,player.position.y)) ) {

		player.platform=null;

		if(Keyboard.isPressed(Keyboard.UP))
		if(Keyboard.isPressed(Keyboard.UP) && !hit(player.position.x, player.position.y-player.speed) &&
		   !hit(player.position.x+(player.width-1), player.position.y-player.speed) ){
			player.position.y +=-player.speed;

		} else {
			player.position.y = (Math.floor((player.position.y)/16))*16;
		}

		if(Keyboard.isPressed(Keyboard.DOWN)){

			for(var i=0; i < platforms.length; i++) {
				var onPlatform =!platforms[i].contains(player.position.x+(player.width-1), player.position.y+(player.height-1)+1) &&
					!platforms[i].contains(player.position.x, player.position.y+(player.height-1)+1);
				if(onPlatform) break;
			}

			if(Keyboard.isPressed(Keyboard.DOWN) && !hit(player.position.x, player.position.y+(player.height-1)+player.speed) &&
		   		!hit(player.position.x+(player.width-1), player.position.y+(player.height-1)+player.speed) &&
				onPlatform){
				player.position.y +=+player.speed;
			} else {
				player.position.y = (Math.floor((player.position.y+(player.height-1)+player.speed)/16))*16-player.height;
			}
		}

		player.gravity = 0;
		player.onLadder = true;
		player.isJumping = false;
		player.animation = "climbing";
	} else if(player.onLadder) {
		player.animation = "climbing.pause";
	}

	if(!(onLadder(player.position.x,player.position.y) ||
			onLadder(player.position.x+player.width-1,player.position.y))) {
		player.gravity = 1.1;
		player.onLadder = false;
	}

	if(Keyboard.isPressed(Keyboard.R)) {
		var fball = fireballs[0];
		fball.position.x = player.position.x;
		fball.position.y = player.position.y;
		fball.inactive = false;
		fball.jumpspeed = 0;
		if(player.animation == 'standing.right') {
			fball.velocity = {x: 1.99,y: 0.4};
			fball.isJumping=true;
		}
		else {
			fball.velocity = {x: -1.99,y: 0.4};
			fball.isJumping=true;
		}
	}

	if(Keyboard.isPressed(Keyboard.E) && !player.isJumping) {

		if(player.onLadder) {
			player.isJumping = true;
			player.jumpspeed = -5;
			player.gravity = 1.1;
			player.onLadder = false;
		} else {
			player.isJumping = true;
			player.jumpspeed = -13;
			player.gravity = 1.1;
		}
		player.platform=null;

		//http://stackoverflow.com/questions/14926306/javascript-play-sound-on-hover-stop-and-reset-on-hoveroff
		//https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
		SoundManager().JUMP_SOUND2.pause();
		SoundManager().JUMP_SOUND2.currentTime = 0;
		SoundManager().JUMP_SOUND2.volume = 0.7;
		SoundManager().JUMP_SOUND2.play();

		if(player.animation=='walking.left' || player.animation=='standing.left')
			player.animation ='jumping.left';
		else
			player.animation ='jumping.right';
	}

	if(Keyboard.isPressed(Keyboard.RIGHT)) {

		var onPlatform= false;
		for(var i=0; i < platforms.length; i++) {
				var onPlatform = platforms[i].contains(player.position.x+(player.width-1), player.position.y+(player.height-1)+1) ||
								 platforms[i].contains(player.position.x, player.position.y+(player.height-1)+1);
				if(onPlatform) {
					player.platform = platforms[i];
					break;
				}
			}

		if(!onPlatform) {
			player.platform = null;
		}

		if(player.onLadder == true)
				player.animation = "climbing";
			else
				player.animation='walking.right';

		if(!hit(player.position.x+(player.width-1)+player.speed, player.position.y) &&
		   !hit(player.position.x+(player.width-1)+player.speed, player.position.y+(player.height-1)) ||
		   onSlope(Math.floor(player.position.x)+Math.floor(player.width/2)+player.speed, Math.floor(player.position.y)+(player.height-1))) {
			player.position.x+=player.speed;

		//move left against entity
				if(question.contains(player.position.x+(player.width-1), player.position.y) ||
					question.contains(player.position.x+(player.width-1), player.position.y+(player.height-1) )) {
						player.position.x = question.position.x-player.width;
										}
			if(onSlope(Math.floor(player.position.x)+Math.floor(player.width/2), Math.floor(player.position.y)+(player.height-1))) {
				var dist = Math.floor(player.position.x)+Math.floor(player.width/2)-
						Math.floor((Math.floor(player.position.x)+Math.floor(player.width/2))/16)*16;
							//console.log(dist);

				player.position.y = Math.floor((Math.floor(player.position.y)+(player.height-1))/16)*16-dist+1;
			}
		} else {
			player.position.x = (Math.floor((player.position.x+(player.width-1)+player.speed)/16))*16-player.width;
		}
	} else {
		if(player.animation=='walking.right')
			player.animation='standing.right';
	}

	if(Keyboard.isPressed(Keyboard.LEFT)) {

	var onPlatform= false;
		for(var i=0; i < platforms.length; i++) {
				var onPlatform = platforms[i].contains(player.position.x+(player.width-1), player.position.y+(player.height-1)+1) ||
								 platforms[i].contains(player.position.x, player.position.y+(player.height-1)+1);
				if(onPlatform) {
					player.platform = platforms[i];
					break;
				}
			}

		if(!onPlatform) {
			player.platform = null;
		}

			if(player.onLadder == true)
				player.animation = "climbing";
			else
				player.animation='walking.left';

		if(!hit(player.position.x-player.speed, player.position.y) &&
		   !hit(player.position.x-player.speed, player.position.y+(player.height-1)) ||
		   onSlope(Math.floor(player.position.x)+Math.floor(player.width/2)-player.speed, Math.floor(player.position.y)+(player.height-1))) {
			player.position.x-=player.speed;

			// move left against entity
				if(question.contains(player.position.x, player.position.y) ||
					question.contains(player.position.x, player.position.y+(player.height-1) )) {
						player.position.x = question.position.x+question.size.width;
										}

			if(onSlope(Math.floor(player.position.x)+Math.floor(player.width/2), Math.floor(player.position.y)+(player.height-1))) {
				var dist = Math.floor(player.position.x)+Math.floor(player.width/2)-
						Math.floor((Math.floor(player.position.x)+Math.floor(player.width/2))/16)*16;
							//console.log(dist);

				player.position.y = Math.floor((Math.floor(player.position.y)+(player.height-1))/16)*16-dist+1;
			}

		} else {
			player.position.x = Math.floor(player.position.x/16)*16;
		}
	}else {
		if(player.animation=='walking.left')
			player.animation='standing.left';
	}
		// same check as the falling down check!!!!
		var isOnCloud = (onCloud(player.position.x, player.position.y+(player.height-1)+1) &&
			            !onCloud(player.position.x, player.position.y+(player.height-1)) ||
				     onCloud(player.position.x+(player.width-1), player.position.y+(player.height-1)+1) &&
			            !onCloud(player.position.x+(player.width-1), player.position.y+(player.height-1))
			            );

	var onPlatform= false;
		for(var i=0; i < platforms.length; i++) {
				var onPlatform = platforms[i].contains(player.position.x+(player.width-1), player.position.y+(player.height-1)+1) ||
								 platforms[i].contains(player.position.x, player.position.y+(player.height-1)+1);
				if(onPlatform) break;
			}

	var onQuestion = question.contains(player.position.x, player.position.y+(player.height-1)+1) ||
					question.contains(player.position.x+(player.width-1), player.position.y+(player.height-1)+1 );
	//falling?
	if(!player.isJumping && !player.onLadder && !hit(player.position.x, player.position.y+(player.height-1)+1) &&
	   !hit(player.position.x+(player.width-1), player.position.y+(player.height-1)+1) &&
	   !onSlope(player.position.x+Math.floor(player.width/2), player.position.y+(player.height-1)) &&
	!isOnCloud && !onPlatform && !onQuestion
	   ) {
		player.jumpspeed = 0;
		player.isJumping = true;
		player.platform=null;
		if(player.animation=='walking.left' || player.animation=='standing.left')
			player.animation ='jumping.left';
		else
			player.animation ='jumping.right';
	}

	if(player.isJumping) {

		player.jumpspeed = player.jumpspeed + player.gravity;
		if(player.jumpspeed > 8) player.jumpspeed = 8;

		if(player.jumpspeed < 0) { //jumping up

			if(!hit(player.position.x, player.position.y+player.jumpspeed) &&
			   !hit(player.position.x+(player.width-1), player.position.y+player.jumpspeed)) {
				player.position.y+=player.jumpspeed;

				// jump with head against entity like questionmark
				if(question.contains(player.position.x, player.position.y) ||
					question.contains(player.position.x+(player.width-1), player.position.y)) {
						player.position.y = question.position.y+question.size.height;
						player.isJumping =true;
						player.jumpspeed=0;
						question.hit();
				}
			} else {
				player.position.y=Math.floor(player.position.y/16)*16;
				player.isJumping =true;
				player.jumpspeed=0;
			}

		} else { //falling
			// kinda tricky: test wether on cloud by checking wether the old y pos was not on cloud
			// we know two things at this poing: we are falling down AND if the previous pos
			// of the bottom sprite was not on cloud we crossed the cloud from top!!! because
			// we can jump max 16 pixel at once!
			var isOnCloud = (onCloud(player.position.x, player.position.y+(player.height-1)+player.jumpspeed) &&
			            !onCloud(player.position.x, player.position.y+(player.height-1)) ||
				     onCloud(player.position.x+(player.width-1), player.position.y+(player.height-1)+player.jumpspeed) &&
			            !onCloud(player.position.x+(player.width-1), player.position.y+(player.height-1)));
			// console.log('falling');

			if(!hit(player.position.x, player.position.y+(player.height-1)+player.jumpspeed) &&
			   !hit(player.position.x+(player.width-1), player.position.y+(player.height-1)+player.jumpspeed) &&
			   !isOnCloud
			   ) {
				player.position.y+=player.jumpspeed;

				//move left against entity
				if(question.contains(player.position.x, player.position.y+(player.height-1)) ||
					question.contains(player.position.x+(player.width-1), player.position.y+(player.height-1) )) {
						player.position.y = question.position.y-player.height;
					player.isJumping = false;
						player.animation ='standing.left';
										}

				// platform check

				for(var i=0; i<platforms.length;i++) {
					if(player.position.y+(player.height-1) >= platforms[i].position.y) {
						if(platforms[i].contains(player.position.x, player.position.y + (player.height-1)) ||
						platforms[i].contains(player.position.x+player.width-1, player.position.y + (player.height-1))) {
							player.position.y = platforms[i].position.y-player.height;
						player.isJumping = false;
						player.animation ='standing.left';
						player.platform = platforms[i];
						//console.log('standing');
						}
					}
				}

				if(onSlope(player.position.x+Math.floor(player.width/2), player.position.y+(player.height-1))){
					// WRONG HNADLING, if go down dont fall in the beginning but use the midpoint to slide
					var dist = Math.floor(player.position.x)+Math.floor(player.width/2)-
						Math.floor((Math.floor(player.position.x)+Math.floor(player.width/2))/16)*16;
							//console.log(dist);
				player.isJumping =false;
				player.position.y = Math.floor((Math.floor(player.position.y)+(player.height-1))/16)*16-dist+1;
				}
			} else {
				player.position.y = Math.floor((player.position.y+(player.height-1)+player.jumpspeed)/16)*16 -player.height;
				player.isJumping =false;
					if(player.animation=='jumping.left')
					player.animation ='standing.left';
					else
					player.animation ='standing.right';
			}

		}
	}

}


	/**
	 * intersection test for coins!
	 */


	for(var i = 0; i < coinCollection.size(); i++) {
		if(!coinCollection.get(i).collected && player.intersects(coinCollection.get(i))) {

			coinCollection.get(i).collect();
			player.coins++;

			SoundManager().COIN.pause();
			SoundManager().COIN.currentTime = 0.0;
			SoundManager().COIN.play();
		}
	}

	for(var i = 0; i < monsterCollection.size(); i++) {
		monsterCollection.get(i).update();
		monsterCollection.get(i).collides(player);
	}

	for(var i = 0; i < fireballs.length; i++) {
		if(fireballs[i].inactive ==false)
		fireballs[i].update();
	}

	goomba.update();
	goomba.collides(player);

	jumper.update();
	jumper.collides(player);
	knall.update();
	flame.update();
	flame2.update();

			if(flame.collides(player) && !player.dead) {
				player.dead=true;
				//console.log("dead");
				player.animation='dieing';
				player.deathTime = timer.now;

				SoundManager().JUMP_SOUND.pause();
				SoundManager().DIED.pause();

				SoundManager().DIED.currentTime = 0.0;
				SoundManager().DIED.play();
			}

			//moveMushroom(mush);
			mush.update();

			if(mush.intersects(player) && mush.active==true) {
				//console.log("mush active :" +mush.xpos + ","+mush.ypos+","+player.xpos + ","+player.ypos);
   				mush.active=false;
   				player.lives++;

   				SoundManager().ONE_UP.pause();

				SoundManager().ONE_UP.currentTime = 0.0;
				SoundManager().ONE_UP.play();
   			}
   			//console.log("mush active :" +mush.active);

	if(Math.floor(player.position.y/16)<13 && Math.floor(player.position.y/16)>0 &&
	   Math.floor(player.position.x/16)<world[0].length && Math.floor(player.position.x/16)>0) {
		var tileId = world[Math.floor(player.position.y/16)][Math.floor(player.position.x/16)];
		var tile = TileSet[tileId];

		if(tile.tileType ==TileType.LAVA && !player.dead) {
			player.dead=true;
			player.animation='dieing';
			player.deathTime = timer.now;
			player.lives--;
			SoundManager().JUMP_SOUND.pause();
			SoundManager().DIED.pause();

			SoundManager().DIED.currentTime = 0.0;
			SoundManager().DIED.play();

		}
	}
 	//console.log("monster count: " + monsterCollection.size());
}

//var centerx = GameEngine.width/2;

/**
 * maybe render like a normal level but with scale and mod to loop????
 */
function renderBackground() {

	// compute visible start and end tiles
	var levelWidth = 16*world[0].length; // level width in pixel
	var centerx = Math.min(Math.max(GameEngine.width/2,player.position.x),levelWidth -GameEngine.width/2);

	var startx = Math.max(((centerx*0.25/16)|0)-2, 0);
	var endx   = Math.min(((centerx*0.25/16)|0)+15,world[0].length); // length = width in tiles

	// render background
	context.setTransform(1,0,0,1,-((centerx*0.25) | 0)+(GameEngine.width/2*0.25)+(xShutter),0+(yShutter));

	for(var x=startx; x <endx; x++) {
		for(var y=0; y < 12; y++) {
			TileSet[background[(y%background.length)|0][(x%background[0].length)|0]].draw(x*16, y*16);
		}
	}

}
/**
 * Optimizations:
 * - dont draw items outside the screen!
 * - round with " | 0" insteatd of using Math.floor or Math.round
 * - Don’t scale images in drawImage https://hacks.mozilla.org/2013/05/optimizing-your-javascript-game-for-firefox-os/
 *
 */
var timeCountDown = 0;
var xShutter;
var yShutter;

function draw() {
	/*
	context.fillStyle = "#111111";
	context.fillRect(0, 0, 160*2, 120*2);
	*/
	//clear

	var levelWidth = 16*world[0].length; // level width in pixel

	// stomper shutter
	var time2 = timer.now;
	var damp = 1.0-Util.fastCosineInterpolate(hitTime, hitTime+550, time2);
	xShutter = (3*sinLookupTable[((time2*5.4)|0)&0x1ff]*damp)|0;
	yShutter = (3*sinLookupTable[((time2*6.3)|0)&0x1ff]*damp)|0;

	// compute the center of the screen in level coordinates based on the
	// players x position. the center coord is clamped so the level bounds are
	// never overstepped. based on that value the level is transformed.
	var centerx = Math.min(Math.max(GameEngine.width/2,player.position.x),levelWidth -GameEngine.width/2);
	//var targetx = Math.min(Math.max(GameEngine.width/2,player.xpos),levelWidth -GameEngine.width/2);
	// use easing
	// http://www.somethinghitme.com/2013/11/13/snippets-i-always-forget-movement/
	//centerx += (targetx - centerx)/5.5;
	context.fillStyle = "#000000";
	context.fillRect(0,0,GameEngine.width, GameEngine.height-32);


	renderBackground();
	//transform second background
	//seems setTransform is faster according to jsperf
	//context.save();
	//--context.setTransform(1,0,0,1,-Math.round(centerx*0.25)+(GameEngine.width/2*0.25),0);//-player.ypos+(240/2));
	//context.translate(-(((centerx)*0.25)|0)+(GameEngine.width/2*0.25),0);//-player.ypos+(240/2));
	//--context.drawImage(back2.image,xShutter,yShutter);
	//context.restore();

	//transform first background
	//**context.setTransform(1,0,0,1,-Math.round(centerx*0.5)+(GameEngine.width/2*0.5),0);//-player.ypos+(240/2));
	//**context.drawImage(back.image,xShutter,yShutter);


	//transform level
	context.setTransform(1,0,0,1,-(centerx | 0)+(GameEngine.width/2)+(xShutter),0+(yShutter));//-player.ypos+(240/2));

	flame.draw();
	flame2.draw();

	//compuete visible part of the world array
	var startx = Math.max(((centerx/16)|0)-8, 0);
	var endx   = Math.min(((centerx/16)|0)+9,world[0].length); // length = width in tiles

	// render level
	for(var x=startx; x <endx; x++) {
		for(var y=0; y < 12; y++) {
			TileSet[world[y][x]].draw(x*16, y*16);
		}
	}


	for(var i = 0; i < monsterCollection.size(); i++) {
		monsterCollection.get(i).draw();
	}






	laserBall.draw();
	goomba.draw();
	jumper.draw();
	for(var i=0; i < platforms.length; i++) {
		platforms[i].draw();
	}


	for(var i=0; i < fireballs.length; i++) {
		if(fireballs[i].inactive ==false)
		fireballs[i].draw();
	}

	knall.draw();

	player.draw(context);





if(mush.active) {
		mush.draw();
	}

	question.draw();

	// draw player
	for(var i=0; i < coinCollection.size(); i++) {
		if(coinCollection.get(i).visible) {
			coinCollection.get(i).draw();
		}
	}
	context.setTransform(1,0,0,1,0,0);




	/*if(player.dead) {

		context.globalAlpha=0.75;
		context.fillStyle = "#333333";
		context.fillRect(16*4.5,16*4.5,GameEngine.width-2*16*4.5,GameEngine.height-2*16*5.5);
		context.globalAlpha=1.0;
		drawText((GameEngine.width/2)-Math.floor((9*9)/2),16*12/2-4,"GAME OVER");
	}*/

	// print points


		//context.fillStyle = "#000000";
		// draw status display
	//context.fillRect(0,GameEngine.height-32,GameEngine.width,GameEngine.height);
	context.drawImage(display,0,GameEngine.height-32);

	drawText(144, 199, Util.prefixInteger(player.coins, 2));
	drawText(40, 207, Util.prefixInteger(player.lives, 2));
	drawText(64, 207, Util.prefixInteger(player.points, 7));

	if(timeOld!=time)
		timeCountDown = time;

	drawText(136, 207, Util.prefixInteger(timeCountDown, 3));


		//drawText((GameEngine.width/2)-Math.floor((9*9)/2),16*12/2-4,"GAME OVER");
	// draw backbuffer to frontbuffer
	//loader.draw();

	/**
	 * BENCHMARK THOSE 2 OPTIONS*/
	context2.drawImage(canvas2,0,0,GameEngine.width*GameEngine.scale,GameEngine.height*GameEngine.scale);

	//var data = context.getImageData(0,0,


//context2.fillStyle = "#FF0000";
/*
for(var i=0; i < touchPoints.length; i++)
		context2.fillRect(touchPoints[i].x-16, touchPoints[i].y-16,32, 32 );

	context2.globalAlpha=0.75;
	context2.beginPath();
        context2.arc(50, 400, 50, 0, 2 * Math.PI, false);
	context2.arc(50+100, 400, 50, 0, 2 * Math.PI, false);
	context2.arc(jumpButton.xpos,jumpButton.ypos, jumpButton.radius, 0, 2 * Math.PI, false);
        context2.fillStyle = 'green';
        context2.fill();
	context2.globalAlpha=1.0;
*/
}

var leftButton = {
	xpos:  50,
	ypos: 400,
	radius: 50

};

var rightButton = {
	xpos:  150,
	ypos: 400,
	radius: 50

};

var jumpButton = {
	xpos:  450,
	ypos: 400,
	radius: 50

};



// just empty methods for touch support (later)
function onTouchStart(event) {

// http://www.html5rocks.com/de/mobile/touch/
event.preventDefault();
	touchPoints = new Array();
	var x,y;

	var left = false;
	var right = false;
	var jump= false;

	for(var i=0; i < event.touches.length; i++) {
		x = event.touches[i].pageX-canvas.offsetLeft;
		y = event.touches[i].pageY-canvas.offsetTop;
		touchPoints[i] = {x: x,y:y};
		if(inButton(x, y, jumpButton)) {
			jump=true;
		}

		if(inButton(x, y, leftButton)) {
			left=true;
		}

		if(inButton(x, y, rightButton)) {
			right=true;
		}
	}

	Keyboard.pressed[Keyboard.CTRL] = jump;
	Keyboard.pressed[Keyboard.LEFT] = left;
	Keyboard.pressed[Keyboard.RIGHT] = right;

	//console.log(touchpos.x + ", " + touchpos.y);

}

function inButton(x, y, button) {
	var deltaX = x - button.xpos;
	var deltaY = y - button.ypos;
	return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)) < button.radius;
}




function onTouchMove(event) {
	event.preventDefault();
	var x,y;
	var left = false;
	var right = false;
	var jump= false;

	for(var i=0; i < event.touches.length; i++) {
		x = event.touches[i].pageX-canvas.offsetLeft;
		y = event.touches[i].pageY-canvas.offsetTop;
		touchPoints[i] = {x: x,y:y};
		if(inButton(x, y, jumpButton)) {
			jump=true;
		}

		if(inButton(x, y, leftButton)) {
			left=true;
		}

		if(inButton(x, y, rightButton)) {
			right=true;
		}
	}

	Keyboard.pressed[Keyboard.CTRL] = jump;
	Keyboard.pressed[Keyboard.LEFT] = left;
	Keyboard.pressed[Keyboard.RIGHT] = right;
}

function onTouchEnd(event) {
event.preventDefault();


	//touchPoints = new Array();
	var x,y;
	var left = false;
	var right = false;
	var jump= false;

	for(var i=0; i < event.touches.length; i++) {
		x = event.touches[i].pageX-canvas.offsetLeft;
		y = event.touches[i].pageY-canvas.offsetTop;
		touchPoints[i] = {x: x,y:y};
		if(inButton(x, y, jumpButton)) {
			jump=true;
		}

		if(inButton(x, y, leftButton)) {
			left=true;
		}

		if(inButton(x, y, rightButton)) {
			right=true;
		}
	}

	Keyboard.pressed[Keyboard.CTRL] = jump;
	Keyboard.pressed[Keyboard.LEFT] = left;
	Keyboard.pressed[Keyboard.RIGHT] = right;

}


function myFunction() {
	canvas = document.getElementById('canvas');
	canvas.width = GameEngine.width*GameEngine.scale;
	canvas.height = GameEngine.height*GameEngine.scale;
	canvas.style.border   = "1px solid #000000";
	canvas.style.opacity = 1;

	canvas2 = document.createElement('canvas');
	canvas2.width=GameEngine.width;
	canvas2.height=GameEngine.height;

	context = canvas2.getContext("2d");

	context2 = canvas.getContext("2d");
	// disable smoothing
	context2.webkitImageSmoothingEnabled = false;
	context2.mozImageSmoothingEnabled = false;
	context2.imageSmoothingEnabled = false;



	mario = new Image();
	mario.src = require('./assets/images/mario.png');

	display = new Image();
	display.src = require('./assets/images/display.png');

	player.debugMode = false;

	// is touch devise??
	var isTouchable = true;// 'createTouch' in document;

	if(isTouchable) {
		canvas.addEventListener('touchstart', onTouchStart, false);
		canvas.addEventListener('touchmove', onTouchMove, false);
		canvas.addEventListener('touchend', onTouchEnd, false);
	}

	SoundManager().LEVEL_BEGIN.play();
	SoundManager().JUMP_SOUND.loop = true;
	SoundManager().JUMP_SOUND.volume = 0.1;
	SoundManager().JUMP_SOUND.play();

	/*
	setInterval(function() {
		update();
		draw();
	}, 1000/GameEngine.fps);

	*/



	window.addEventListener('keydown', function(event) { Keyboard.setKeyStatus(event, true); }, false);
	window.addEventListener('keyup', function(event) { Keyboard.setKeyStatus(event, false); }, false);

	context.globalAlpha = "1.0";

	//console.log(myFunction);
	//throw new Error("Lame Mario clone!");
	//console.log(JSON.stringify(world));
	startTime = performance.now();


//		loadJSON(function(response) {
//var jsonresponse = JSON.parse(response);
//console.log("world" + jsonresponse);
//world = jsonresponse.level;
//	});

	// the loader does not work in chrome
	Loader.getInstance().addCallback(
		function() {
			back = new Image2(require('./assets/images/back.png'));
			tiles = new Image2(require('./assets/images/mariotiles.png'));
			back2 = new Image2(require('./assets/images/back2.png'));
			setTimeout(function() {
				startTime = performance.now();
				loop();
			}, 0);
		}
	);



	font = new Image();
	font.onload = function() {
			Loader.getInstance().preload(
				new Image2(require('./assets/images/mariotiles.png'), true),
				new Image2(require('./assets/images/back.png'), true),
				new Image2(require('./assets/images/back2.png'), true)
			);
	};

	font.src = require('./assets/images/font2.png');

//http://www.askyb.com/javascript/load-json-file-locally-by-js-without-jquery/
}
/*
function loadJSON(callback) {

var xobj = new XMLHttpRequest();
xobj.overrideMimeType("application/json");
xobj.open('GET', 'media/levels/level.json', true);
xobj.onreadystatechange = function () {
if (xobj.readyState == 4 && xobj.status == "200") {

// .open will NOT return a value but simply returns undefined in async mode so use a callback
callback(xobj.responseText);

}
}
xobj.send(null);

}
*/
var startTime = performance.now(); //Date.now();
var elapsedTime;
var currentTime = startTime;
var simulationCycles;
var cycleCount = 0;
var frameDelta = 1000/28; // 28 simulation steps each 1000 ms!

function loop() {
	// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://updates.html5rocks.com/2012/08/When-milliseconds-are-not-enough-performance-now
	requestAnimationFrame(loop);

	currentTime = performance.now();//Date.now();
	elapsedTime = currentTime - startTime;

	simulationCycles = ((elapsedTime / frameDelta) | 0) - cycleCount;
	cycleCount += simulationCycles;

	for(var i = 0; i < simulationCycles; i++) {
		update();
	}

	if(simulationCycles > 0) {
		draw();
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    } else if (document.body.msRequestFullscreen) {
      document.body.msRequestFullscreen();
    } else if (document.body.mozRequestFullScreen) {
      document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullscreen) {
      document.body.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*
 * Game.init
 *     .update
 *     .draw
 *
 */

myFunction();
