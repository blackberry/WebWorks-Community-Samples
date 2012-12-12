//* @protected

Tellurium.noAppName = "noname.enyoapps";

/*
 * Subscribes to Tellurium commands.
 */
Tellurium.subscribeToCommands = function() {
	Tellurium.stageType = "card";
	console.log("Tellurium : Subscribe Service...");
	
	var params = {
		'subscribe': true,
		'appInfo': Tellurium.fetchAppInfo(),
		'baseURI': window.document.baseURI,
		'width': window.innerWidth,
		'height': window.innerHeight,
		'name': window.name || "", 
		'type': Tellurium.stageType,
		// FIXME: does not apply to enyo
		'scene': "phone",
		'version': Tellurium.nubVersion
	};

	Tellurium.subscribeRequest = new Tellurium.enyo.PalmService({
		service: Tellurium.identifier,
		method: "subscribeToCommands",
		subscribe: true,
		responseSuccess: Tellurium.handleCommands,
		responseFailure: Tellurium.reqFailed
	});
	Tellurium.subscribeRequest.call(params);
};

Tellurium.fetchAppInfo = function() {
	var appInfo = Tellurium.enyo.fetchAppInfo();
	if (!appInfo)
		appInfo = { };
	if (!appInfo.id || appInfo.id == "") {
		appInfo.id = Tellurium.enyo.fetchAppId();
		if (!appInfo.id || appInfo.id == "")
			appInfo.id = Tellurium.noAppName;
	}
	return appInfo;
};

/*
 * Send an event notification to the service so it can be broadcasted to event listeners.
 * 
 * @param {Object} params
 */
Tellurium.notifyEvent = function(params) {
	if (!Tellurium.serviceAvailable) {
		//console.log("Tellurium.notifyEvent: " + enyo.json.stringify(params));
		return;
	}
	//console.log(" ENYO TELLURIUM : notifyEvent: " + enyo.json.stringify(params));
	if (Tellurium.stageId && (!Tellurium.inVerifyDialog || params.event === "verify")) {
		params.stageId = Tellurium.stageId;
		params.appId = Tellurium.appId;
		//
		Tellurium.notifyRequest = Tellurium.notifyRequest || new Tellurium.enyo.PalmService({
			service: Tellurium.identifier,
			method: "notifyEvent"
		});
		Tellurium.notifyRequest.call(params);
	} else {
		// Record events 
		Tellurium.delayedEvents.push(params);
	}
};

/*
 * Handle failed request to Tellurium service
 */
Tellurium.reqFailed = function() {
	console.log("Tellurium service not available.");
	Tellurium.serviceAvailable = false;
};

/*
 * Clone the given array - This is a plain copy from the $A prototype.
 * @param {Object} iterable
 */
Tellurium.cloneArray = function(iterable) {
	if (!iterable) {
		return [];
	}
	if (iterable.toArray) {
		return iterable.toArray();
	}
	var length = iterable.length || 0, results = new Array(length);
	while (length--) {
		results[length] = iterable[length];
	}
	return results;
};
	
/*
 * Handles commands from the Tellurium service.
 * Commands are converted to function calls with the arguments
 * passed in the args array in the payload. Payload must include
 * the tellurium Id of the caller and must reply with that same Id.
 * 
 * @param {Object} request
 */
Tellurium.handleCommands = function(request) {
	var payload = request.response;
	// Reuse the payload for reply (we need telluriumId and commandId in the reply)
	var reply = payload;
	
	if (payload.command) {
		try {
			// Handle command
			reply.result = Tellurium[payload.command].apply(this, payload.args);
			reply.returnValue = true;
		} catch(e) {
			reply.returnValue = false;
			reply.error = e.message || "Unkown error";
			reply.errorStack = e.stack;
		}
		Tellurium.replyToCommand(reply);
	} else if(payload.stageId) {
		// We just subscribed to Tellurium commands - no need to reply.
		Tellurium.stageId = payload.stageId;
		Tellurium.appId = Tellurium.enyo.fetchAppId();
		if (!Tellurium.appId || Tellurium.appId == "")
			Tellurium.appId = Tellurium.noAppName;
		// Push delayed events
		if(Tellurium.delayedEvents.length > 0) {
			for(var i = 0; i < Tellurium.delayedEvents.length; i++) {
				Tellurium.notifyEvent(Tellurium.delayedEvents[i]);
			}
			Tellurium.delayedEvents = [];
		}
	} else {
		// No commands, no stageId, wtf?
		reply.returnValue = false;
		reply.error = "Invalid command payload";
		Tellurium.replyToCommand(reply);
	}
};

/*
 * Sends a reply to the Tellurium service.
 * The payload must have: stageId, telluriumId, commandId
 * 
 * @param {Object} payload
 */
Tellurium.replyToCommand = function(payload) {
	if(Tellurium.replyReq) {
		Tellurium.replyReq.destroy();
	}
	// Send result 
	Tellurium.replyReq = new Tellurium.enyo.PalmService({
		service: Tellurium.identifier,
		method: "replyToCommand",
		responseFailure:  function() { console.error("[Tellurium] replyToCommand Failure"); }
	});
	Tellurium.replyReq.call(payload);
};

/*
 * Get properties of a valid object; each "property = value" ends with EOL(\n); functions not included by default, but if included are multi-line
 * @param {Object} object
 * @param {Object} includefunctions
 */
Tellurium.dumpProperties = function(object,includefunctions) {
	var buffer = [];
	for (var arg in object) {
		if(typeof(object[arg]) == "function")
			if(!includefunctions)
				continue;
		buffer.push(arg + " = " + object[arg] + "\n");
	}
	return buffer.join("");
};
