/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, 
regexp: true, newcap: true, immed: true, nomen: false, maxerr: 500 */
/*global $contactsui_path:true, runningInBrowser:true, window, enyo  */

$contactsui_path = "$enyo-lib/contactsui"; //uncomment when submitting library to enyo
//$contactsui_path = "/usr/palm/applications/com.palm.app.contacts/contactsui"; //uncomment when submitting library as part of app

runningInBrowser = window.runningInBrowser ? window.runningInBrowser : (window.PalmSystem ? false : true);

if (!runningInBrowser) { //this is a global flag that is set by contacts app
/* device or emulator */
	enyo.depends(
		"/usr/palm/frameworks/mojoloader.js",
		"$enyo-lib/accounts/",
		"$enyo-lib/addressing/",
		"mojoshim/mojo-serviceRequest.js",
		"mojoshim/mojoCore-service.js",
		"mojoshim/importContactsBase.js",
		"Logic/AccountListEnyo.js",
		"UI/resources.js",		// needs to come before the rest of the UI parts
		"UI/FieldGroup.js",
		"UI/PersonList.js",
		"UI/PersonListWidget.js",
		"UI/PseudoDetails.js",
		"UI/DetailsInDialog.js",
		"UI/DetailsDialog.js",
		"UI/ContactPointPickerList.js",
		"UI/PersonListDialog.js",
		"PublicUI/PeoplePicker.js",
		"utils/Utils.js",
		"css/contactsui.css"
	);
} else {
/* browser */
	enyo.depends(
		"$enyo-lib/accounts/",
		"$enyo-lib/addressing/",
		"Logic/AccountListEnyo.js",
		"UI/resources.js",		// needs to come before the rest of the UI parts
		"UI/FieldGroup.js",
		"UI/PersonList.js",
		"UI/PersonListWidget.js",
		"UI/PseudoDetails.js",
		"UI/DetailsInDialog.js",
		"UI/DetailsDialog.js",
		"UI/PersonListDialog.js",
		"PublicUI/PeoplePicker.js",
		"utils/Utils.js",
		"css/contactsui.css"
	);
}
/*if (Mojo && Mojo.Core && Mojo.Core.Service) {
	Mojo.Core.Service.setup();
}*/
