/**
 * 1. Always define a class using a constuctor function
 * 2. Only save attributes in the constructor
 * 3. define all instance methods using the prototype by adding a function to the prototype
 * 4. define subclasses using a constructor function AND claling the constuctir of the baseclass
 *    AND (!) save an instance of the baseclasses prototype (!) created with Object.create
 *    in the subclasses prototype
 * 5. define new methods inside the subclasses prototype
 * 6. you can override methods of the baseclass by using the same name in the subclases prototype
 *    In addition te base clases implementation can be called inside the overridden method
 *
 * @see http://ncombo.wordpress.com/2013/07/11/javascript-inheritance-done-right/
 */

"use strict";

function BaseClass(name) {
	this.name = name;
}

// Define all methods of BaseClass in the prototype!
BaseClass.prototype.foo = function(arg) {
	return "This is the foo method with argument: " + arg;
};

function SubClass(name) {
	// Call baseclass constructor
	BaseClass.call(this, name);
}

SubClass.prototype = Object.create(BaseClass.prototype);

SubClass.prototype.sub = function() {
	return "This is the sub method.";
}

SubClass.prototype.foo = function(arg) {
	return BaseClass.prototype.foo.call(this, arg) + "SUB";
}

console.log(new SubClass("name1").foo("arg2"));