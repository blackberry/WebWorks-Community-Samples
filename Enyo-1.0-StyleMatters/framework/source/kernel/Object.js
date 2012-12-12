/**
enyo.Object implements the property publishing system for Components.
Published properties are declared by providing a _published_ property within a call to
_enyo.kind_. Getter and setter methods are automatically generated for
properties declared in this manner.

	enyo.kind({
		name: "MyObject",
		kind: enyo.Object,

		// declare 'published' properties
		published: {
			myValue: 3
		},

		// these methods will be automatically generated:
		//	getMyValue: function() ...
		//	setMyValue: function(inValue) ...

		// optional method that is fired whenever setMyValue is called
		myValueChanged: function(inOldValue) {
			this.delta = this.myValue - inOldValue;
		}
	});

In the above example, _myValue_ becomes a regular property on the MyObject
prototype (with a default value of 3), and the getter and setter methods are generated
as noted in the comments.

	myobj = new MyObject();
	var x = myobj.getMyValue(); // x gets 3

You may choose to declare a _changed_ method to observe set calls on a property. 
The _myValueChanged_ method in the example above is called whenever _setMyValue_ is called.

	myobj.setMyValue(7); // myValue becomes 7; myValueChanged side-effect sets delta to 4

_Changed_ methods are called whenever setters are invoked, whether the actual value has changed
or not.

Published properties are stored as regular properties on the object prototype, so it's possible
to query or set their values directly (changed methods are not called if you set a property directly).

	var x = myobj.myValue;

enyo.Object also provides some utility functions for all of its subkinds.
*/
enyo.kind({
	name: "enyo.Object",
	//* @protected
	constructor: function() {
		enyo._objectCount++;
	},
	destroyObject: function(inName) {
		if (this[inName] && this[inName].destroy) {
			this[inName].destroy();
		}
		this[inName] = null;
	},
	getProperty: function(n) {
		return this[n];
	},
	_setProperty: function(n, v, cf) {
		if (this[cf]) {
			var old = this[n];
			this[n] = v;
			this[cf](old); 
		} else {
			this[n] = v;
		}
	},
	setProperty: function(n, v) {
		this._setProperty(n, v, n + "Changed");
	},
	//* @public
	/**
		Sends a log message to the console, prepended with the name of the kind and method from which log was invoked. Multiple arguments are coerced to String and joined with spaces.

			enyo.kind({
				name: "MyObject",
				kind: enyo.Object,
				hello: function() {
					this.log("says", "hi");
					// shows in the console: MyObject.hello: says hi
				}
			});
	*/
	log: function() {
		this._log("log", arguments);
	},
	//* Same as _log_, except uses the console's warn method (if it exists).
	warn: function() {
		this._log("warn", arguments);
	},
	//* Same as _log_, except uses the console's error method (if it exists).
	error: function() {
		this._log("error", arguments);
	},
	//* @protected
	_log: function(inMethod, inArgs) {
		enyo.logging.log(inMethod, [inArgs.callee.caller.nom + ": "].concat(enyo.cloneArray(inArgs)));
	}
});

//* @protected

enyo._objectCount = 0;

enyo.Object.subclass = function(ctor, props) {
	this.publish(ctor, props);
};

enyo.Object.publish = function(ctor, props) {
	var pp = props.published;
	if (pp) {
		var cp = ctor.prototype;
		for (var n in pp) {
			enyo.Object.addGetterSetter(n, pp[n], cp);
		}
	}
};

enyo.Object.addGetterSetter = function(inName, inValue, inProto) {
	var priv_n = inName;
	inProto[priv_n] = inValue;
	//
	var cap_n = priv_n.slice(0, 1).toUpperCase() + priv_n.slice(1);
	var get_n = "get" + cap_n;
	if (!inProto[get_n]) {
		inProto[get_n] = function() { 
			return this.getProperty(priv_n); 
		};
	}
	//
	var set_n = "set" + cap_n;
	var change_n = priv_n + "Changed";
	if (!inProto[set_n]) {
		inProto[set_n] = function(v) { 
			this._setProperty(priv_n, v, change_n); 
		};
	}
};
