enyo.kind({
	// doesn't support top/bottom margin on child elements (left/right ok)
	name: "enyo.FittableColumns",
	kind: "enyo.Fittable",
	initComponents: function() {
		this.inherited(arguments);
		this.$.box.addClass("enyo-fittable-col-box");
	},
	reflow: function() {
		var l = this.$.pre.getBounds().width;
		var r = this.$.post.getBounds().width;
		var w = this.$.box.getBounds().width;
		this.$.flex.applyStyle("width", w - l - r + "px");
	}
});