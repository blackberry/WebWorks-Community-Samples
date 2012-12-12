//* @protected
enyo.xhr = {
	/**
		<code>inParams</code> is an Object that may contain these properties:

		- _url_: The URL to request (required).
		- _method_: The HTTP method to use for the request. Defaults to GET.
		- _callback_: Called when request is completed.
		- _body_: Specific contents for the request body for POST method.
		- _headers_: Request headers.
		- _username_: The optional user name to use for authentication purposes.
		- _password_: The optional password to use for authentication purposes.
	*/
	request: function(inParams) {
		var xhr = this.getXMLHttpRequest();
		//
		var method = inParams.method || "GET";
		var async = ("sync" in inParams) ? !inParams.sync : true;
		//
		if (inParams.username) {
			xhr.open(method, enyo.path.rewrite(inParams.url), async, inParams.username, inParams.password);
		} else {
			xhr.open(method, enyo.path.rewrite(inParams.url), async);
		}
		this.makeReadyStateHandler(xhr, inParams.callback);
		if (inParams.headers) {
			for (var key in inParams.headers) {
				xhr.setRequestHeader(key, inParams.headers[key]);
			}
		}
		try {
			xhr.send(inParams.body || null);
			if (!async) {
				xhr.onreadystatechange(xhr);
			}
		} catch(e) {
			console.error("enyo.xhr.request() exception: "+e.toString());
			xhr=undefined;
		}
		return xhr;
	},
	//* @protected
	getXMLHttpRequest: function() {
		try {
			return new XMLHttpRequest();
		} catch (e) {}
		try {
			return new ActiveXObject('Msxml2.XMLHTTP');
		} catch (e) {}
		try {
			return new ActiveXObject('Microsoft.XMLHTTP');
		} catch (e) {}
		return null;
	},
	makeReadyStateHandler: function(inXhr, inCallback) {
		inXhr.onreadystatechange = function() {
			if (inXhr.readyState == 4) {
				inCallback && inCallback.apply(null, [inXhr.responseText, inXhr]);
			}
		}
	}
};

//* @public

/**
	Performs an XMLHttpRequest GET with features described as _inArgs_.
	Supported properties for inArgs are:

	* _url_: The URL to request (required).
	* _load_: Function, called when request is completed with arguments (responseText, xhrObject)
	* _username_: The optional user name to use for authentication purposes.
	* _password_: The optional password to use for authentication purposes.
	* _headers_: Request headers, an object with header names as keys.
*/
enyo.xhrGet = function(inArgs) {
	inArgs.callback = inArgs.load;
	enyo.xhr.request(inArgs);
};

/**
	Performs an XMLHttpRequest POST with features described as _inArgs_.
	Supported properties for inArgs are:

	* _url_: The URL to request (required).
	* _load_: Function, called when request is completed with arguments (responseText, xhrObject)
	* _body_: Specific contents for the request body for POST method, a string.
	* _username_: The optional user name to use for authentication purposes.
	* _password_: The optional password to use for authentication purposes.
	* _headers_: Request headers, an object with header names as keys.  You should 
	  provide at least a "Content-Type" field here to identify the format of your
	  POST data, e.g.

			{ "Content-Type":"application/x-form-urlencoded". }
*/
enyo.xhrPost = function(inArgs) {
	inArgs.callback = inArgs.load;
	inArgs.method = "POST";
	enyo.xhr.request(inArgs);
};
