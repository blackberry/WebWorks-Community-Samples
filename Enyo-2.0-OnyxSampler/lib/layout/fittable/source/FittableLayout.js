enyo.kind({
	name: "enyo.FittableLayout",
	kind: "Layout",
	//* @protected
	calcFitIndex: function() {
		for (var i=0, c$=this.container.children, c; c=c$[i]; i++) {
			if (c.fit && c.showing) {
				return i;
			}
		}
	},
	getFitControl: function() {
		var c$=this.container.children;
		var f = c$[this.fitIndex];
		if (!(f && f.fit && f.showing)) {
			this.fitIndex = this.calcFitIndex();
			f = c$[this.fitIndex];
		}
		return f;
	},
	getLastControl: function() {
		var c$=this.container.children;
		var i = c$.length-1;
		var c = c$[i];
		while ((c=c$[i]) && !c.showing) {
			i--;
		}
		return c;
	},
	_reflow: function(measure, cMeasure, mAttr, nAttr) {
		this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
		var f = this.getFitControl();
		// no sizing if nothing is fit.
		if (!f) {
			return;
		}
		//
		// determine container size, available space
		var s=0, a=0, b=0, p;
		var n = this.container.hasNode();
		// calculate available space
		if (n) {
			// measure 1
			var p = enyo.FittableLayout.calcPaddingExtents(n);
			// measure 2
			s = n[cMeasure] - (p[mAttr] + p[nAttr]);
			//console.log("overall size", s);
		}
		//
		// calculate space above fitting control
		// measure 3
		var fb = f.getBounds();
		// offset - container padding.
		a = fb[mAttr] - p[mAttr];
		//console.log("above", a);
		//
		// calculate space below fitting control
		var l = this.getLastControl();
		if (l) {
			// measure 4
			var mb = enyo.FittableLayout.getComputedStyleValue(l.hasNode(), "margin-" + nAttr) || 0;
			if (l != f) {
				// measure 5
				var lb = l.getBounds();
				// fit offset + size
				var bf = fb[mAttr] + fb[measure];
				// last offset + size + ending margin
				var bl = lb[mAttr] + lb[measure] + mb;
				// space below is bottom of last item - bottom of fit item.
				b = bl - bf;
			} else {
				b = mb;
			}
		}
		
		// calculate appropriate size for fit control
		var fs = s - (a + b);
		//console.log(f.id, fs);
		// note: must be border-box;
		f.applyStyle(measure, fs + "px");
	},
	reflow: function() {
		if (this.orient == "h") {
			this._reflow("width", "clientWidth", "left", "right");
		} else {
			this._reflow("height", "clientHeight", "top", "bottom");
		}
	},
	statics: {
		_ieCssToPixelValue: function(inNode, inValue) {
			var v = inValue;
			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
			var s = inNode.style;
			// store style and runtime style values
			var l = s.left;
			var rl = inNode.runtimeStyle && inNode.runtimeStyle.left;
			// then put current style in runtime style.
			if (rl) {
				inNode.runtimeStyle.left = inNode.currentStyle.left;
			}
			// apply given value and measure its pixel value
			s.left = v;
			v = s.pixelLeft;
			// finally restore previous state
			s.left = l;
			if (rl) {
				s.runtimeStyle.left = rl;
			}
			return v;
		},
		_pxMatch: /px/i,
		getComputedStyleValue: function(inNode, inProp, inComputedStyle) {
			var s = inComputedStyle || enyo.dom.getComputedStyle(inNode);
			if (s) {
				return parseInt(s.getPropertyValue(inProp));
			} else if (inNode && inNode.currentStyle) {
				var v = inNode.currentStyle[inProp];
				if (!v.match(this._pxMatch)) {
					v = this._ieCssToPixelValue(inNode, v);
				}
				return parseInt(v);
			}
			return 0;
		},
		calcBoxExtents: function(inNode, inBox) {
			var s = enyo.dom.getComputedStyle(inNode);
			return {
				top: this.getComputedStyleValue(inNode, inBox + "-top", s),
				right: this.getComputedStyleValue(inNode, inBox + "-right", s),
				bottom: this.getComputedStyleValue(inNode, inBox + "-bottom", s),
				left: this.getComputedStyleValue(inNode, inBox + "-left", s)
			};
		},
		//* Get the calculated padding of a node
		calcPaddingExtents: function(inNode) {
			return this.calcBoxExtents(inNode, "padding");
		},
		//* Get the calculated margin of a node
		calcMarginExtents: function(inNode) {
			return this.calcBoxExtents(inNode, "margin");
		}
	}
});

enyo.kind({
	name: "enyo.FittableColumnsLayout",
	kind: "FittableLayout",
	orient: "h",
	layoutClass: "enyo-fittable-columns-layout"
});

enyo.kind({
	name: "enyo.FittableRowsLayout",
	kind: "FittableLayout",
	layoutClass: "enyo-fittable-rows-layout",
	orient: "v"
});
