/**
	A control which provides a layer for controls which should be displayed above an application. The onyx.floatingLayer singleton
	can be set as a control parent to have the control float above an application. 

	Note: it's not intended that users create an onyx.FloatingLayer.

		create: function() {
			this.inherited(arguments);
			this.setParent(onyx.floatingLayer);
		}

*/
//@ protected
enyo.kind({
	name: "onyx.FloatingLayer",
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.setParent(null);
	},
	render: function() {
		this.parentNode = document.body;
		return this.inherited(arguments);
	},
	generateInnerHtml: function() {
		return "";
	},
	beforeChildRender: function() {
		if (!this.hasNode()) {
			this.render();
		}
	},
	teardownChildren: function() {
	}
});

onyx.floatingLayer = new onyx.FloatingLayer({classes: "onyx"});