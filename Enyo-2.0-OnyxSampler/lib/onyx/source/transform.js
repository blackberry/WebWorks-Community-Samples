//@ protected
// add some useful static methods to enyo.Layout as statics
enyo.mixin(enyo.Layout, {
	canAccelerate: function() {
		return this.accelerando !== undefined ? this.accelerando: document.body && (this.accelerando = this.calcCanAccelerate());
	},
	calcCanAccelerate: function() {
		var b = document.body;
		var p$ = ["perspective", "msPerspective", "MozPerspective", "WebkitPerspective", "OPerspective"];
		for (var i=0, p; p=p$[i]; i++) {
			if (typeof document.body.style[p] != "undefined") {
				return true;
			}
		}
		return false;
	},
	domTransformProps: ["-webkit-transform", "-moz-transform", "-ms-transform", "-o-transform", "transform"],
	cssTransformProps: ["webkitTransform", "MozTransform", "msTransform", "OTransform", "transform"],
	transformValue: function(inControl, inTransform, inValue) {
		var d = inControl.domTransforms = inControl.domTransforms || {};
		d[inTransform] = inValue;
		this.transformsToDom(inControl);
	},
	accelerate: function(inControl, inValue) {
		var v = inValue == "auto" ? this.canAccelerate() : inValue;
		if (v) {
			this.transformValue(inControl, "translateZ", 0);
		}
	},
	transform: function(inControl, inTransforms) {
		var d = inControl.domTransforms = inControl.domTransforms || {};
		enyo.mixin(d, inTransforms);
		this.transformsToDom(inControl);
	},
	domTransformsToCss: function(inTransforms) {
		var n, v, text = '';
		for (n in inTransforms) {
			v = inTransforms[n];
			if ((v !== null) && (v !== undefined) && (v !== "")) {
				text +=  n + '(' + v + ') ';
			}
		}
		return text;
	},
	transformsToDom: function(inControl) {
		var t = this.domTransformsToCss(inControl.domTransforms);
		var ds = inControl.domStyles;
		// FIXME: it'd be better to only set the supported property...
		for (var i=0, p; (p=this.domTransformProps[i]); i++) {
			ds[p] = t;
		}
		if (inControl.hasNode()) {
			var s = inControl.node.style;
			for (var i=0, p; (p=this.cssTransformProps[i]); i++) {
				s[p] = t;
			}
		} else {
			inControl.domStylesChanged();
		}
	}
});