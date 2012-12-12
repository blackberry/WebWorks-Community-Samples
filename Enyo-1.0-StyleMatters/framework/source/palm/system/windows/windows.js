/**
enyo.windows provides a variety of utility methods for interacting with application windows.

To open a window or activate an existing window, use the enyo.windows.activate. For example,

	enyo.windows.activate(undefined, "SearchWindow");

Or, to open the window if it does not exist, add a url (the url may be absolute or relative).

	enyo.windows.activate("search/index.html", "SearchWindow");

To facilitate communication between application windows, parameters can be sent.
To send parameters to the window to be activated, add a params object:

	enyo.windows.activate("search/index.html", "SearchWindow", {query: "oranges"});

Note that the activated window will fire a windowParamsChange event. The window parameters
are available in the enyo.windowParams object. For example,

	windowParamsChangeHandler: function() {
		this.$.searchQueryInput.setValue(enyo.windowParams.query);
	}

To send parameters to a window without activating it, use the setWindowParams method. For example,

	var searchWindow = enyo.windows.fetchWindow("SearchWindow");
	enyo.windows.setWindowParams(searchWindow, {safeSearch: true});

When a window is activated and deactivated by the user or system, corresponding events will fire
on any created <a href="#enyo.ApplicationEvents">enyo.ApplicationEvents</a> objects.  To respond
to activation, provide a listener for its _onWindowActivated_ event; to respond to deactivation,
provide a hander for _onWindowDeactivated_.

	{kind: enyo.ApplicationEvents, 
	 onWindowActivated: "wakeup",
	 onWindowDeactivated: "sleep"},

An application may be launched while it is already running (relaunch). By default, the 
application is simply brought into focus when this happens. This can occur either when a user
launches the running application or a system service does so. In either case, new window 
params may be sent to the application. An application can customize its response to being 
relaunched based on this information by implementing a handler for the _onApplicationRelaunch_
event as follows:

	{kind: enyo.ApplicationEvents, 
	 onApplicationRelaunch: "relaunchHandler"},
	...
	relaunchHandler: function(inSender, inEvent) {
		if (enyo.windowParams.openSearchWindow = true) {
			enyo.windows.activate("search/index.html", "SearchWindow");
			return true;
		}
	},
	...

Notice the event handler activates a window and then returns true.  The return value indicates 
the event has been handled and the default action, focusing the root application window, should not occur.

The applicationRelaunch event is always sent to the root window of an application. The root window is, by default, 
the first window created by the application.  That window-level handler passed on the event to the various
enyo.ApplicationEvents objects that have been created.

When the application is headless (specifies noWindow: true in the appinfo) the root window is always the headless, 
non-displayed window. When the application is not headless, the root window may change. This occurs if the user 
closes the root window. In this case, the root window becomes the next opened window by the application. 
That window will now receive the applicationRelaunchHandler.

Applications should be careful to consider that on the root window, enyo.windowParams are set by the system. On other
windows this object is private to the application. Applications can use the applicationRelaunch to note that 
enyo.windowParams have been changed by the system.
*/

/*
	NOTES:
	We allow opening or activating a window with params as a way to communicate with that window.
	Opening is an asynchronous process and params allow us to comm with a window without
	having to worry about that asynchronicity. Other options include: callbacks or an event.

	Alternatives: Windows could be launched by a Service. The Service would hook window.onload and
	return when this is fired. In this case passing params to a window would go away in favor of an event.
	
*/
enyo.windows = {
	//* @public
	/**
	Opens an application window. This method can also be used to open a specialized window by 
	specifying inAttributes and inWindowInfo.

	* inUrl {String} Url for the window html file. May be absolute or relative.
	* inName {String} Name of the window. This name can be used to retrieve the window.
		If one is not specified, a default name is supplied.
	* inParams {Object} Data to send to the opened window. Will be available as enyo.windowParams.
	* inAttributes {Object} Optional window attributes. Use to customize the window type.
	* inWindowInfo {String} Optional window information. Use to provide extra system info.

	Example:

		enyo.windows.openWindow("search/index.html", "Search", {query: "oranges"});

	*/
	openWindow: function(inUrl, inName, inParams, inAttributes, inWindowInfo) {
		var attributes = inAttributes || {};
		attributes.window = attributes.window || "card";
		// NOTE: make the root window open all windows.
		var root = attributes._enyoOpener || this.getRootWindow();
		delete attributes._enyoOpener;
		var w = this.fetchWindow(inName)
		// need a unique name before opening window
		if (w) {
			console.warn('Window "' + inName + '" already exists, activating it');
			this.activateWindow(w, inParams);
		} else {
			// new window may be in a different security domain, so params need to be specified in the url,
			// since we can't just set them in finishOpenWindow/assignWindowParams.
			if(inParams) {
				// Some apps are passing invalid JSON structures as windowParams.  
				// This is not really allowed, but we can't break them atm.
				var rootPath = enyo.fetchAppRootPath();
				if((inUrl[0] === '/' && inUrl.indexOf(rootPath.slice(7)) !== 0) || (inUrl.indexOf('file:///') === 0 && inUrl.indexOf(rootPath) !== 0)) {
					inUrl = inUrl+"?enyoWindowParams="+encodeURIComponent(enyo.json.stringify(inParams));
				}				
			}
			w = this.agent.open(root, inUrl, inName || "", attributes, inWindowInfo);
			// call finish here instead of depending on launch in case window doesn't load enyo.
			this.finishOpenWindow(w, inParams);
			this.manager.setPendingParamsList(w, []);
		}
		return w;
	},
	//* @protected
	//* @protected
	// note: called when a window is spawned via openWindow and during enyo bootstrapping.
	// this ensures our root window (not opened via openWindow) gets recorded.
	finishOpenWindow: function(inWindow, inParams) {
		inWindow.name = enyo.windows.ensureUniqueWindowName(inWindow, inWindow.name);
		this.assignWindowParams(inWindow, inParams);
		this.manager.addWindow(inWindow);
	},
	ensureUniqueWindowName: function(inWindow, inName) {
		var windows = this.getWindows();
		var w = windows[inName];
		if (this.agent.isValidWindowName(inName) && (!w || w == inWindow)) {
			return inName;
		} else {
			return this.calcUniqueWindowName();
		}
	},
	calcUniqueWindowName: function() {
		var windows = this.getWindows();
		var prefix = "window";
		for (var i=1, name; Boolean(windows[name=prefix+(i > 1 ? String(i) : "")]); i++);
			return name;
	},
	//* @public
	/**
	Opens an application dashboard.

	* inUrl {String} Url for the window html file. May be absolute or relative.
	* inName {String} Name of the window. This name can be used to retrieve the window.
	If one is not specified, a default name is supplied.
	* inParams {Object} Data to send to the opened window. Will be available as enyo.windowParams.
	* inAttributes {Object} Specify optional attributes, e.g., {webosDragMode:"manual"} to enable 
	custom handling of drag events in dashboards, or {clickableWhenLocked:true} to make dashboards 
	usable through the lock screen.
	*/
	openDashboard: function(inUrl, inName, inParams, inAttributes) {
		inAttributes = inAttributes || {};
		inAttributes.window = "dashboard";
		return this.openWindow(inUrl, inName, inParams, inAttributes);
	},
	/**
	Opens an application popup.

	* inUrl {String} Url for the window html file. May be absolute or relative.
	* inName {String} Name of the window. This name can be used to retrieve the window.
	If one is not specified, a default name is supplied.
	* inParams {Object} Data to send to the opened window. Will be available as enyo.windowParams.
	* inAttributes {Object} Specify optional attributes for special behavior.
	* inHeight {Integer} Height for the popup.
	* throb: {Boolean} 'true' to enable the LED throbber.
	*/
	openPopup: function(inUrl, inName, inParams, inAttributes, inHeight, throb) {
		inAttributes = inAttributes || {};
		inAttributes.window = "popupalert";
		var w = this.openWindow(inUrl, inName, inParams, inAttributes, "height=" + (inHeight || 200));
		if(throb && w.PalmSystem) {
			w.PalmSystem.addNewContentIndicator();
		}
		return w;
	},
	
	//* @public
	/** 
	Activate an application window by name. If the window is not already open and a url is specified,
	the window will be opened.

	* inUrl {String} Url for the window to open if it is not already opened. May be absolute or relative.
	* inName {String} Name of the window to activate.
	* inParams {Object} Data to send to the activated window. Will be available as enyo.windowParams.
	* inAttributes {Object} Optional window attributes. Use to customize the window type.
	* inWindowInfo {String} Optional window information. Use to provide extra system info.

	Example:

		enyo.windows.activate("search/index.html", "Search", {query: "oranges"});

	*/
	activate: function(inUrl, inName, inParams, inAttributes, inWindowInfo) {
		var n = this.fetchWindow(inName);
		if (n) {
			this.activateWindow(n, inParams);
		} else if (inUrl) {
			n = this.openWindow(inUrl, inName, inParams, inAttributes, inWindowInfo);
		}
		return n;
	},
	/**
	Activate a window by window reference. Optionally send window params to the window.

	* inWindow {Object} Reference to the window to be activated.
	* inParams {Object} Optional window params to send to the window.

	Example:

		enyo.windows.activateWindow(myWindow, {message: "Hello World"});
	*/
	activateWindow: function(inWindow, inParams) {
		this.agent.activate(inWindow);
		if (inParams) {
			this.setWindowParams(inWindow, inParams);
		}
	},
	/**
		Deactivate a window by name.
	*/
	deactivate: function(inName) {
		var n = this.fetchWindow(inName);
		this.deactivateWindow(n);
	},
	/**
		Deactivate a window by reference.
	*/
	deactivateWindow: function(inWindow) {
		if (inWindow) {
			this.agent.deactivate(inWindow);
		}
	},
	//* @public
	/**
	Adds a banner message; it will be displayed briefly before disappearing.
		
	* inMessage: (required) message to display
	* inJson: (required) JSON-formatted string to pass to enyo.relaunch if banner is tapped
	* inIcon: icon to display
	* inSoundClass: sound class to play
	* inSoundPath: path to sound to play
	* inSoundDuration: duration of sound to play
	*/
	addBannerMessage: function(inMessage, inJson, inIcon, inSoundClass, inSoundPath, inSoundDuration) {
		return this.agent.addBannerMessage.apply(this.agent, arguments);
	},
	/**
	Removes a banner message
		
		* inId: returned by addBannerMessage
	*/
	removeBannerMessage: function(inId) {
		this.agent.removeBannerMessage.apply(this.agent, arguments);
	},
	
	/**
	 Set webOS system properties of the window.  Pass in a window reference (use 'window' for self) to modify and JS object with name/value pairs as inProps.

	 Possible property values include:
	 <table border="1">
	 <tr><td>blockScreenTimeout</td><td>Boolean.  If true, the screen will not dim or turn off in the absence of user activity.  If false, the timeout behavior will be reinstated.</td></tr>
	 <tr><td>setSubtleLightbar</td><td>Boolean.  If true, the light bar will be made somewhat dimmer than normal.  If false, it will return to normal.</td></tr>
	 <tr><td>fastAccelerometer</td><td>Boolean.  If true, the accelerometer rate will increase to 30 hz; false by default, rate is at 4 hz. Note fast rate is active only for apps when maximized.</td></tr>
	 </table>
	 */
	setWindowProperties: function(inWindow, inProps) {
		this.agent.setWindowProperties.apply(this.agent, arguments);
	},	

	/**
	Send parameters to the given window. Application windows can communicate by sending window
	parameters to each other. Note, this method does not activate the window; if you 
	want to activate the window use enyo.windows.activate.

	The window specified by inWindow will fire a windowParamsChange event asynchronously which can be implemented
	to perform work related to window parameters changing.

	* inWindow {Object} Window reference.
	* inParams {Object} Parameters to send to the window. This object will be made available 
	as enyo.windowParams.  Restricted to valid JSON (no functions, cycles, etc.).
	*/
	setWindowParams: function(inWindow, inParams) {
		var pending = this.manager.getPendingParamsList(inWindow);
		if(pending) {
			pending.push(inParams);
		} else {
			inWindow.postMessage("enyoWindowParams="+enyo.json.stringify(inParams), "*");
		}
	},
	//* @protected
	// sets window params silently, no event.
	assignWindowParams: function(inWindow, inParams) {
		var params;
		try {
			params = inParams && enyo.isString(inParams) ? enyo.json.parse(inParams) : inParams || {};
		} catch(e) {
			console.error("Invalid window params: " + e);
			params = {};
		}
		inWindow.enyo = inWindow.enyo || {};
		inWindow.enyo.windowParams = params || {};
	},
	// Note: facade public methods on manager.
	//* @public
	/**
	Returns a reference to the window object specified by the given name.

	The specified name must correspond to a currently opened application window, i.e.
	a window in the list returned by enyo.windows.getWindows().
	*/
	fetchWindow: function(inName) {
		return this.manager.fetchWindow(inName);
	},
	/**
	Returns the root application window.
	*/
	getRootWindow: function() {
		return this.manager.getRootWindow();
	},
	/**
	Returns an object listing the open windows by name, e.g.
	
		{window1: <window object>, window2: <window object> }
	*/
	getWindows: function() {
		return this.manager.getWindows();
	},
	/**
	Returns a reference to the window object of the currently active application window.
	*/
	getActiveWindow: function() {
		return this.manager.getActiveWindow();
	},
	/**
	Renames a window. Note that the final window name could be different than that specified, if a collision occurs
	*/
	renameWindow: function(inWindow, inName) {
		var pending = this.manager.getPendingParamsList(inWindow);
		this.manager.removeWindow(inWindow);
		inWindow.name = enyo.windows.ensureUniqueWindowName(inWindow, inName);
		this.manager.addWindow(inWindow);
		this.manager.setPendingParamsList(inWindow, pending);
		return inWindow.name;
	}
}
