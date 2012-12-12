(function(){
	enyo.requiresWindow = function(inFunction) {
		if (enyo.isBuiltin && windowTimeTasks) {
			windowTimeTasks.push(inFunction);
		} else {
			inFunction();
		}
	};

	var windowTimeTasks = [];

	enyo.hasWindow = function() {
		for (var i=0, h; h=windowTimeTasks[i]; i++) {
			h();
		}
		windowTimeTasks = null;
	};
})();
