/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global Foundations, PalmCall, Future, _, ContactsLib, document, enyo, console */

enyo.kind({
	name: "com.palm.library.contactsui.FieldGroup",
	kind: "RowGroup",
	published: {
		fields: null
	},
	events: {
		onGetFieldValue: "",
		onGetFieldType: "",
		onGetFieldTypeOptions: "",
		onFieldClick: "",
		onShowArrow: "",
		onMouseHold: "",
		onGetActionIcon: "",
		onActionIconClick: ""
	},
	fieldsChanged: function () {
		this.renderGroup();
	},
	destroy: function ()
	{
		this.destroyControls();
		this.inherited(arguments);
	},
	renderGroup: function () {
		this.destroyControls();
		this.renderFields();
		this.render();
	},
	renderFields: function () {
		var i,
			c,
			f,
			icon;

		this.setShowing(this.fields && this.fields.length > 0);
		icon = this.doGetActionIcon();
		
		for (i = 0; this.fields && (f = this.fields[i]); i += 1) {
			c = this.createComponent(
				{onclick: "itemClick", layoutKind: "HFlexLayout", tapHighlight: true, onmousehold: "itemMouseHold", field: f, components: [
					{kind: "Control", flex: 1, components: [
						{content: this.getFieldValue(f), className: "value"},
						{content: this.getFieldTypeDisplay(f), className: "label"}

					]},
					{name: "dropdownArrow", className: "button-arrow"},
					{kind: "IconButton", icon: icon, caption: "", onclick: "actionIconClick", className: "action", showing: icon ? true : false}
				]});
			this.$.dropdownArrow.setShowing(this.doShowArrow(this.getFieldType(f)));
			this.$.dropdownArrow.setOwner(c);
		}
	},
	getFieldValue: function (inField) {
		var val = this.doGetFieldValue(inField) || inField.value || inField.getDisplayValue() || "";
		val = enyo.string.escapeHtml(val);
		val = val.replace(/\n/g, "<br />"); //excplicitly change newline to <br> for addressing widget
		return val;
	},
	getFieldTypeDisplay: function (inField) {
		return (inField.x_displayType) || "";
	},
	getFieldType: function (inField) {
		return this.doGetFieldType(inField) || 
			(inField.getType && inField.getType()) || 
			"";
	},
	getFieldTypeOptions: function () {
		return this.doGetFieldTypeOptions();
	},
	itemClick: function (inSender, inEvent) {
		this.doFieldClick(inEvent, inSender.field);
	},
	actionIconClick: function (inSender, inEvent) {
		this.doActionIconClick(inEvent, inSender.getParent().field);
		inEvent.stopPropagation(); //prevent the "itemClick" handler from also going

	},
	itemMouseHold: function (inSender, inEvent) 
	{
		this.doMouseHold(inEvent, inSender.field);
	}
});
