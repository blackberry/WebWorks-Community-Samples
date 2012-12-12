enyo.kind({
	name: "enyo.FittableRows",
	kind: "enyo.Fittable",
	initComponents: function() {
		this.inherited(arguments);
		this.$.box.addClass("enyo-fittable-row-box");
	},
	reflow: function() {
		var t = this.$.pre.getBounds().height;
		var b = this.$.post.getBounds().height;
		var h = this.$.box.getBounds().height;
		this.$.flex.applyStyle("height", h - t -b + "px");
	}
});