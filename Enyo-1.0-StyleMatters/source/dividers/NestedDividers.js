enyo.kind({
	name: "dividers.NestedDividers",
	kind: HeaderView,
	components: [
		{kind: "Divider", caption: "SECTION 1 LOREM IPSUM TRUNCATICUM SECTION UNO SECTION EINS"},
		{kind: "Item", className: "enyo-first", components: [
			{content: "Example 1"},
			{content: "An example", className: "enyo-item-secondary"}
		]},
		{kind: "Item", className: "enyo-last", components: [
			{content: "Example 2"},
			{content: "An example", className: "enyo-item-secondary"}
		]},
		{kind: "Divider", caption: "SECTION 2", components: [
			{kind: "Divider", caption: "8:21pm"}
		]},
		{kind: "Item", className: "enyo-first enyo-last", components: [
			{content: "Example 3 is used in messaging app time stamps"},
			{content: "An example", className: "enyo-item-secondary"}
		]},
		{kind: "Divider", caption: "SECTION 3 LOREM IPSUM TRUNCATICUM SECTION TRES SECTION DREI", components: [
			{kind: "Divider", caption: "GMAIL"}
		]},
	]
});