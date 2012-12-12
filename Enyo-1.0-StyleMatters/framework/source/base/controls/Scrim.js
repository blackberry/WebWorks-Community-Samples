/**
A scrim is used to temporarily disable an application's user interface.
It covers the screen with a translucent layer.

It's possible to create a scrim in a components block, but this usage is not common. Typically, a scrim is
shown using enyo.scrim.show().

To show a scrim for 5 seconds:

	buttonClick: function() {
		enyo.scrim.show();
		setTimeout(enyo.scrim.hide, 5000);
	}
	
To show a scrim while a service is in flight:

	components: [
		{kind: "PalmService", onResponse: "serviceResponse"},
		{kind: "Button", caption: "Call Service", onclick: "buttonClick"}
	],
	buttonClick: function() {
		this.$.service.call();
		enyo.scrim.show();
	},
	serviceResponse: function() {
		enyo.scrim.hide();
	}

To show a scrim and then hide it when the user clicks on it:

	components: [
		{kind: "Button", caption: "Show scrim", onclick: "buttonClick"},
		{kind: "Scrim", onclick: "scrimClick"}
	],
	buttonClick: function() {
		this.$.scrim.show();
	},
	scrimClick: function() {
		this.$.scrim.hide();
	}
*/
enyo.kind({
	name: "enyo.Scrim",
	kind: enyo.Control,
	showing: false,
	className: "enyo-scrim",
	transparent: false,
	showingClassName: "enyo-scrim-dim", 
	animateShowing: true,
	//*@ protected
	create: function() {
		this.inherited(arguments);
		this.zStack = [];
		this.animateShowing = this.animateShowing && this.showingClassName;
		if (this.transparent) {
			this.showingClassName = "enyo-scrim-transparent";
			this.animateShowing = false;
		}
	},
	rendered: function() {
		this.inherited(arguments);
		this.addListeners();
	},
	teardownRender: function() {
		this.removeListeners();
		this.inherited(arguments);
	},
	addListeners: function() {
		if (this.hasNode()) {
			this.transitionEndListener = enyo.bind(this, "webkitTransitionEndHandler");
			this.node.addEventListener("webkitTransitionEnd", this.transitionEndListener, false);
		}
	},
	removeListeners: function() {
		if (this.hasNode()) {
			this.node.removeEventListener("webkitTransitionEnd", this.transitionEndListener, false);
		}
	},
	showingChanged: function() {
		if (!this.generated && this.showing) {
			this.flow();
			this.renderNode();
		}
		// FIXME: removing fade out animation to prevent bug:
		// if parent is hidden while transitioning, webkitTransitionEnd event will never fire,
		// and scrim will never hide, making ui unusable.
		//if (!this.generated || this.showing || !this.animateShowing || this._endingTransition) {
			this.inherited(arguments);
		//}
		enyo.asyncMethod(this, "addRemoveShowingClassName", this.showing);
	},
	webkitTransitionEndHandler: function() {
		if (!this.showing) {
			this._endingTransition = true;
			this.setShowing(false);
			this._endingTransition = false;
		}
	},
	//* @public
	//* Add or remove the specified class
	addRemoveShowingClassName: function(inAdd) {
		this.addRemoveClass(this.showingClassName, inAdd);
	},
	//* @protected
	addZIndex: function(inZIndex) {
		if (enyo.indexOf(inZIndex, this.zStack) < 0) {
			this.zStack.push(inZIndex);
		}
	},
	removeZIndex: function(inControl) {
		enyo.remove(inControl, this.zStack);
	},
	//* @public
	//* Show Scrim at the specified ZIndex
	showAtZIndex: function(inZIndex) {
		this.addZIndex(inZIndex);
		if (inZIndex !== undefined) {
			this.setZIndex(inZIndex);
		}
		this.show();
	},
	//* Hide Scrim at the specified ZIndex
	hideAtZIndex: function(inZIndex) {
		this.removeZIndex(inZIndex);
		if (!this.zStack.length) {
			this.hide();
		} else {
			var z = this.zStack[this.zStack.length-1];
			this.setZIndex(z);
		}
	},
	//* Set scrim to show at `inZIndex`
	setZIndex: function(inZIndex) {
		this.zIndex = inZIndex;
		this.applyStyle("z-index", inZIndex);
	},
	//* @protected
	make: function() {
		return this;
	}
});

//* @protected
//
// Scrim singleton exposing a subset of Scrim API. 
// After a call to 'show' or 'showAtZIndex', this object
// is replaced with a proper enyo.Scrim instance.
//
enyo.kind({
	name: "enyo.scrimSingleton",
	constructor: function(inName, inProps) {
		this.instanceName = inName;
		enyo.setObject(this.instanceName, this);
		this.props = inProps || {};
	},
	make: function() {
		// NOTE: scrim singleton is rendered in the popup layer, where all popups live.
		var p = enyo.mixin(this.props, {parent: enyo.getPopupLayer()});
		var s = new enyo.Scrim(p);
		enyo.setObject(this.instanceName, s);
		s.renderNode();
		return s;
	},
	show: function() {
		// NOTE: replaces enyo.scrim (this) with an enyo.Scrim instance so this is only invoked once.
		var s = this.make();
		s.show();
	},
	showAtZIndex: function(inZIndex) {
		var s = this.make();
		s.showAtZIndex(inZIndex);
	},
	// in case somebody does this out of order
	hideAtZIndex: enyo.nop,
	hide: enyo.nop,
	destroy: enyo.nop
});

new enyo.scrimSingleton("enyo.scrim");
new enyo.scrimSingleton("enyo.scrimTransparent", {showingClassName: "enyo-scrim-transparent", animateShowing: false});
