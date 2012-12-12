var PrintManagerError = (function() {
	return {
		getErrorText: function(inErrorCode) {
			if (inErrorCode) {
				// User errors
				if (-200 >= inErrorCode && inErrorCode > -300) 
				{
					switch (inErrorCode) {
					case -203:	// PM_ERR_PRINTER_NO_RESPONSE_MANUAL
						return PrintDialogString.load("PRINTER_NO_RESPONSE_MANUAL");
					case -204:	// PM_ERR_PRINTER_DUPLICATE_ID
					case -205:	// PM_ERR_PRINTER_DUPLICATE_IP
						return PrintDialogString.load("PRINTER_ALREADY_EXISTS");
					case -206:	// PM_ERR_PRINTER_IP_NOT_VALID
						return PrintDialogString.load("PRINTER_IP_NOT_VALID");
					case -233:	// PM_ERR_JOB_TEMP_FILE_NO_ROOM
					case -243:	// PM_ERR_JOB_NO_JOB_HANDLES
						return PrintDialogString.load("PRINTING_ERROR_TEMP_FILE_NO_ROOM", {error: inErrorCode});
					case -238:	// PM_ERR_PRINTER_NOT_SUPPORTED
						return PrintDialogString.load("PRINTER_NOT_SUPPORTED");
					case -245:	// PM_ERR_PRINTER_DUPLICATE_IP_ZERO
						return PrintDialogString.load("PRINTER_ALREADY_EXISTS_ZERO");
					case -298:	// PM_ERR_NO_WIFI_CONNECTION
						return PrintDialogString.load("NO_WIFI_CONNECTION");
					}
				}
				
				// Communication errors
				if (-400 >= inErrorCode && inErrorCode > -500) {
					return PrintDialogString.load("COMMUNICATION_ERROR", {error: inErrorCode});
				}
/***
				// Rendering errors
				else if (-300 >= inErrorCode && inErrorCode > -400) {
				}
				// Informational errors
				else if (-500 >= inErrorCode && inErrorCode > -600) {
				}
				// Programming errors
				else if (-600 >= inErrorCode && inErrorCode > -700) {
				}
				// System errors
				else if (-700 >= inErrorCode && inErrorCode > -800) {
				}
***/
				return PrintDialogString.load("PRINTING_ERROR_WITH_NUMBER", {error: inErrorCode});
			}
			return PrintDialogString.load("PRINTING_ERROR");
		}
	}
}());
