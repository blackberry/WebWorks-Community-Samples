enyo.kind({
	name: "enyo.Fittable",
	published: {
		stretch: true
	},
	classes: "enyo-fittable",
	components: [
		// box offsetHeight equals Rows content height, which is otherwise unavailable with calculations
		{name: "box", classes: "enyo-0 enyo-stretch", components: [
			// top offsetHeight will be sum of child heights (including child pad-border-margin) which otherwise requires calculations
			{name: "pre", classes: "enyo-0"},
			// flex can be sized without regard to child pad-border-margin, sizing child directly would require calculations
			{name: "flex", classes: "enyo-0 enyo-fittable-flex"},
			// bottom offsetHeight will be sum of child heights (including child pad-border-margin) which otherwise requires calculations
			{name: "post", classes: "enyo-0"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		if (!this.stretch) {
			this.stretchChanged();
		}
	},
	stretchChanged: function() {
		this.$.box.addRemoveClass("enyo-stretch", this.stretch);
	},
	flow: function() {
		var recontain = function(o, c) {
			if (o.container != c) {
				o.setContainer(c);
			}
		}
		var c$ = this.getClientControls();
		for (var i=0, c; c=c$[i]; i++) {
			if (c.fit) {
				recontain(c, this.$.flex);
				break;
			}
			recontain(c, this.$.pre);
		}
		for (i++; c=c$[i]; i++) {
			recontain(c, this.$.post);
		}
	}
});