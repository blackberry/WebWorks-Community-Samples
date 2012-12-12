//* @protected

enyo.requiresWindow(function() {
	// Touch events are not used by enyo on device, due to the need to process
	// mouse events for over, out, move, click processing.
	// Users should use touch events directly via addEventListener.
	//
	// If we're not on a Palm device, then convert touch events to mouse events
	if (!window.PalmSystem) {
		// add iPhone OS-specific gesture feature
		enyo.dispatcher.features.push(
			function(e) {
				//console.log("iphoneGesture processing ", e.type);
				if (enyo.iphoneGesture[e.type]) {
					enyo.iphoneGesture[e.type](e);
				}
			}
		);
		//
		enyo.iphoneGesture = {
			_send: function(inType, inTouch) {
				//console.log("iphoneGesture._send:", inType);
				//console.log(inTouch.target.tagName);
				var synth = {
					type: inType,
					preventDefault: enyo.nop
				};
				enyo.mixin(synth, inTouch);
				enyo.dispatch(synth);
			},
			touchstart: function(e) {
				this._send("mousedown", e.changedTouches[0]);
				// FIXME: Android 3 will not display keyboard if touch event is prevented
				// note: documentation for android web browser is hard to find.
				if (e.target && e.target.nodeName != "INPUT") {
					e.preventDefault();
				}
			},
			touchmove: function(e) {
				this._send("mousemove", e.changedTouches[0]);
			},
			touchend: function(e) {
				this._send("mouseup", e.changedTouches[0]);
				this._send("click", e.changedTouches[0]); 
			},
			connect: function() {
				document.ontouchstart = enyo.dispatch; 
				document.ontouchmove = enyo.dispatch; 
				document.ontouchend = enyo.dispatch;
			}
		};
		//
		enyo.iphoneGesture.connect();
	}
});