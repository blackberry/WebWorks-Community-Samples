var AccountsUtil = (function () {
	var accountsRb = new enyo.g11n.Resources({root: "$enyo-lib/accounts"});
	
	function whereEquals(prop, val) {
		return {
			prop: prop,
			op: "=",
			val: val
		};
	}

	// Get the template that matches the given ID.  Template ID's should
	// be unique so the first match is returned.
	function getTemplateById(templates, id) {
		for (var i=0, l=templates.length; i<l; i++) {
			if (templates[i].templateId === id) {
				return templates[i];
			}
		}
		//console.log("getTemplateById: template " + id + " not found");
		return undefined;
	}

	function matchCapabilities(t) {
		// Automatically exclude hidden templates, or those without validators
		if (!t.validator || t.hidden) {
			console.log("matchCapabilities: excluding " + t.templateId + " because it is hidden or doesn't have a validator");
			return false;
		}
		
		// Should this template be excluded?
		if (this.exclude) {
			// Format the excludes consistently (in an array)
			var excludes;
			if (typeof this.exclude === "string") {
				excludes = [this.exclude];
			} else if (this.capability) {
				excludes = this.exclude;
			}
			for (var i=0, l=excludes.length; i<l; i++) {
				console.log("matchCapabilities: excluding " + excludes[i] + "?")
				if (t.templateId === excludes[i]) {
					console.log("matchCapabilities: excluding " + t.templateId)
					return false;
				}
			}
		}

		// Format the sought capability consistently (in an array)
		var capabilities;
		if (typeof this.capability === "string") {
			capabilities = [this.capability];
		} else if (this.capability) {
			capabilities = this.capability;
		}

		// First find out which of the asked-for capabilities match.
		// reject if no matches are found.  not every capability has to be
		// supported.
		if (capabilities) {
			// Loop through the capabilities
			for (var i=0, l=capabilities.length; i<l; i++) {
				for (var j=0, ll=t.capabilityProviders.length; j<ll; j++) {
					if (t.capabilityProviders[j].capability === capabilities[i]) {
						console.log("matchCapabilities: " + t.templateId + " has capability " + capabilities[i]);
						return true;
					}
				}
			}
		}
		return false;
	}

	return {
		// Exported methods
		
		// Get the template that matches the given ID
		// Example: var template = AccountsUtil.getTemplateById(this.templates, "com.palm.yahoo");
		getTemplateById: getTemplateById,

		// Return false if the account's tempate matches the exclusion
		filterTemplateId: function(account) {
			// The simplist case - there is just one exclusion
			if (typeof this.exclude === "string")
				return account.templateId !== this.exclude;
				
			// The exclusions are an array
			for (var i=0, l=this.exclude.length; i<l; i++) {
				if (account.templateId === this.exclude[i])
					return false;
			}
			return true;
		},
		
		toArray: function(object) {
			if (typeof object === "string")
				return(object);
			else if (object)
				return (object);
			return [];
		},
		
		// Iterate through an array of accounts for the one that matches the given accountId
		getAccount: function(accountArray, accountId) {
			for (var i=0, l=accountArray.length; i < l; i++) {
				if (accountArray[i]._id === accountId)
					return accountArray[i];
			}
		},

		// Filter the templates by ID or capability
		// Templates marked hidden or those without a validator will automatically be filtered out
		// Examples:
		// var template = AccountsUtil.filterTemplates(this.templates, {templateId: 'com.palm.yahoo'}); (returns single template)
		// var template = AccountsUtil.filterTemplates(this.templates, {capability: 'MAIL'}); (returns array of templates)
		// var template = AccountsUtil.filterTemplates(this.templates, {capability: ['MAIL', 'CONTACTS']}); (returns array of templates)
		// var template = AccountsUtil.filterTemplates(this.templates, {capability: 'MAIL', exclude:'com.palm.yahoo'}); (returns array of templates, excluding Yahoo)
		// var template = AccountsUtil.filterTemplates(this.templates, {capability: 'MAIL'], exclude: ["com.palm.sim", "com.palm.palmprofile"]});
		filterTemplates: function (templates, filterBy) {
			var selectedTemplates = templates, tmpl;

			if (filterBy) {
				if (filterBy.templateId) {
					console.log("filterTemplates: filterBy.templateId");
					tmpl = getTemplateById(templates, filterBy.templateId);
					if (tmpl == undefined) {
						console.log("filterTemplates: Unable to find template with id=" + filterBy.templateId)
						return undefined;
					}
					return tmpl;
				}
				
				if (filterBy.capability) {
					// First match templates based on capabilities
					selectedTemplates = templates.filter(matchCapabilities, filterBy);
					for (var i=0, l=selectedTemplates.length; i<l; i++)
						console.log("filterBy.capability match =" + selectedTemplates[i].templateId);
					
					return selectedTemplates;
				}
				
				console.log("filterTemplates: Must specify 'templateId' or 'capability' - no filtering performed!")	
			}
			return selectedTemplates;
		},
		
		createWhere: function (filterBy) {
			var where = [];

			if (filterBy) {
				if (filterBy.templateId) {
					where.push(whereEquals("templateId", filterBy.templateId));
				} else if (filterBy.capability) {
					where.push(whereEquals("capabilityProviders.capability", filterBy.capability));
				}
			}
			if (!(filterBy && filterBy.showDeleted)) {
				where.push(whereEquals("beingDeleted", false));
			}

			return (where.length > 0) ? where : undefined;
		},
	
		annotateAccount: function (account) {
			// net effect is totally stitched together acct+template obj,
			// where template props override acct props at both the top level
			// and per-capability
			// (but extra acct props are still present in case accounts need to store supplemental data)

			var result,
				phoneNumber,
				usernameTemplate,
			    template = getTemplateById(this.allTemplates, account.templateId);

			result = enyo.clone(account);

			if (!template) {
				console.warn("annotateAccount: template not found: " + account.templateId);
				// Pretent this account doesn't exist (this is what the account service does too)
				result.invisible = true;
				return result;
			}

			enyo.mixin(result, template);

			// Return all account capabilities given in the template, annotated by the information in the template
			result.capabilityProviders = template.capabilityProviders.map(function (c) {
				// Find the capability in the account
				for (var i=0, l=account.capabilityProviders.length; i<l; i++) {
					if (account.capabilityProviders[i].id === c.id)
						return enyo.mixin(account.capabilityProviders[i], c);
				}
				return c;    
			});
			
			if (account.templateId === "com.palm.sim") {
				result.SIMRemoved = false;
				phoneNumber = (result.username)? result.username: "";
				// Was the SIM removed?
				if (phoneNumber.indexOf("SIMREMOVED ") === 0) {
					phoneNumber = phoneNumber.substring(11);
					result.SIMRemoved = true;
				}
				// Attempt to format the phone number (it could be a SIM ID)
				var phone = new enyo.g11n.PhoneNumber(phoneNumber);
				if (phone.invalid) {
					result.isPhoneNumber = false;
					result.phoneNumber = phoneNumber;
				}
				else {
					var phonefmt = new enyo.g11n.PhoneFmt();
					result.phoneNumber = phonefmt.format(phone);
					result.isPhoneNumber = true;
				}
				// If the SIM has been removed put some nice "SIM Removed" text around it
				result.username = result.phoneNumber;
				if (result.SIMRemoved) {
					var template = new enyo.g11n.Template(AccountsUtil.SIM_REMOVED_TEMPLATE);
					result.username = template.evaluate({phoneNumber: result.phoneNumber});
				}
			}

			return result;
		},
		
		// Promote the capability icons to the main account icons
		promoteCapabilityIcons: function(accounts, capabilities) {
			if (!capabilities || !accounts)
				return;
			
			// Capability might be an array
			if (!enyo.isArray(capabilities))
				capabilities = [capabilities];
				
			for (var i in capabilities) {
				capability = capabilities[i];
				// Loop through all the accounts
				for (var i in accounts) {
					var account = accounts[i];
					// Find the required capability in the account
					for (var cp in account.capabilityProviders) {
						var c = account.capabilityProviders[cp];
						if (c.capability !== capability)
							continue;
						// Does the capability have icons?
						if (!c.icon)
							continue;
						console.log("Promoting icons for " + account.templateId);
						// Promote the icons for this capability
						account.icon = enyo.mixin(account.icon, c.icon);
						// If the capability is "local filestorage" then give it a better name than "HP webOS Account"
						if (capability === "LOCAL.FILESTORAGE") {
							// Use the profile name if it is avialable
							if (account.deviceName && account.deviceName.length)
								account.alias = account.deviceName;
							else {
								// Use the model name (e.g. TouchPad)
								var deviceInfo = window.PalmSystem && JSON.parse(PalmSystem.deviceInfo);
								if (deviceInfo && deviceInfo.modelNameAscii)
									account.alias = deviceInfo.modelNameAscii;
							}
							delete account.username;
							console.log("Local filestore name is " + account.alias);
						}
						break;
					}
				}
			}				
		},
		
		// Dedupe an array, based on the specifies property.  The array passed in is modified by this call.
		dedupeByProperty: function (items, idProp) {
			var hash = {};
			
			//console.log("dedupeByProperty: BEFORE array items: " + items.length);
			for (var i=0, l=items.length; i<l; i++) {
//				console.log("dedupeByProperty: looking at id = : " + items[i][idProp]);
				if (hash[items[i][idProp]] === undefined) {
					hash[items[i][idProp]] = 1;
//					console.log("dedupeByProperty: " + items[i][idProp] + " is unique");
				}
				else {
					items.splice(i, 1);
					i--; l--;
				}
			}
			//console.log("dedupeByProperty: AFTER array items: " + items.length);
		},
		
		getCapabilityText: function (rawName) {
			var capability = this.localizedCapabilities[rawName];
			return capability || rawName; 
		},
		
		getSynergyTitle: function(capability) {
			if (!capability || enyo.isArray(capability))
				return accountsRb.$L("HP Synergy Services");
				
			switch (capability)
			{
				case "CALENDAR":     return accountsRb.$L("Calendar HP Synergy Services");
				case "DOCUMENTS":    return accountsRb.$L("Documents HP Synergy Services");
				case "CONTACTS":     return accountsRb.$L("Contacts HP Synergy Services");
				case "MAIL":         return accountsRb.$L("Email HP Synergy Services");
				case "MEMOS":        return accountsRb.$L("Memos HP Synergy Services");
				case "MESSAGING":    return accountsRb.$L("Messaging HP Synergy Services");
				case "PHONE":        return accountsRb.$L("Phone HP Synergy Services");
				case "PHOTO.UPLOAD": return accountsRb.$L("Photo HP Synergy Services");
				case "TASKS":        return accountsRb.$L("Tasks HP Synergy Services");
				default:
					return accountsRb.$L("HP Synergy Services");
			}
		},

		// The path to the accounts library		
		libPath: enyo.path.paths["-..-lib-accounts"],
		
		// Localized strings
		PAGE_TITLE_ACCOUNTS:		accountsRb.$L("Accounts"),
		PAGE_TITLE_ADD_ACCOUNT:		accountsRb.$L("Add an Account"),
		PAGE_TITLE_SIGN_IN:			accountsRb.$L("Sign In"),
		PAGE_TITLE_ACCOUNT_SETTINGS:accountsRb.$L("Account Settings"),
		BUTTON_ADD_ACCOUNT:			accountsRb.$L("Add an Account"),
		BUTTON_BACK:				accountsRb.$L("Back"),
		BUTTON_CANCEL:				accountsRb.$L("Cancel"),
		BUTTON_SIGN_IN:				accountsRb.$L("Sign In"),
		BUTTON_SIGNING_IN:			accountsRb.$L("Signing In..."),
		BUTTON_CHANGE_LOGIN:		accountsRb.$L("Change Login Settings"),
		BUTTON_REMOVE_ACCOUNT:		accountsRb.$L("Remove Account"),
		BUTTON_REMOVING_ACCOUNT:	accountsRb.$L("Removing Account..."),
		BUTTON_CREATE_ACCOUNT:		accountsRb.$L("Create Account"),
		BUTTON_CREATING_ACCOUNT:	accountsRb.$L("Creating Account..."),
		BUTTON_GO:					accountsRb.$L("Go"),
		BUTTON_DONE:				accountsRb.$L("Done"),
		BUTTON_KEEP_ACCOUNT:		accountsRb.$L("Cancel"),
		LIST_TITLE_USERNAME:		accountsRb.$L("USERNAME"),
		LIST_TITLE_PASSWORD:		accountsRb.$L("PASSWORD"),
		LIST_TITLE_PHONENUMBER:		accountsRb.$L("PHONE NUMBER"),
		LIST_TITLE_SIM_ID:			accountsRb.$L("SIM ID"),
		GROUP_TITLE_ACCOUNT_NAME:	accountsRb.$L("ACCOUNT NAME"),
		GROUP_TITLE_USE_ACCOUNT_WITH: accountsRb.$L("USE ACCOUNT WITH"),
		LOADING_ACCOUNTS:			accountsRb.$L("Loading Accounts..."),
		SIM_REMOVED_TEMPLATE:		accountsRb.$L("#{phoneNumber} - SIM Removed"),
		TEXT_WELCOME:				accountsRb.$L("Welcome!"),
		TEXT_GET_STARTED_PROFILE_ACCOUNT: accountsRb.$L("Get started with your HP webOS account:"),
		TEXT_GET_STARTED_EXISTING_ACCOUNTS: accountsRb.$L("Get started with your existing accounts:"),
		TEXT_OR_ADD_NEW_ACCOUNT:	accountsRb.$L("Or add a new account:"),
		TEXT_FIND_MORE:				accountsRb.$L("Find More ..."),
		TEXT_REMOVE_CONFIRM:		accountsRb.$L("Are you sure you want to remove this account and all associated data from your device? Data from this account will be erased from all applications."),
		TEXT_REMOVE_CAP_CONFIRM:	accountsRb.$L("Are you sure you want to remove this account and all associated data from this application? To remove the account from the device completely, use the accounts application."),
		TEXT_NO_SIM_WIFI_ONLY:		accountsRb.$L("The contacts are on your #{device}, but can't be edited.  You can only edit data on devices that have SIM support."),
		TEXT_NO_SIM_HAS_SIM_SLOT:	accountsRb.$L("The contacts are on your #{device}, but can't be edited.  You can edit data and add new contacts after you re-insert the SIM."),
		TEXT_NUM_CONTACTS:			accountsRb.$L("0#No contacts|1#1 Contact|2>##{num} Contacts"),
		
		localizedCapabilities: {
			"MAIL": accountsRb.$L("Email"),
			"CALENDAR": accountsRb.$L("Calendar"),
			"CONTACTS": accountsRb.$L("Contacts"),
			"REMOTECONTACTS": accountsRb.$L("Address Lookup"),
			"TASKS": accountsRb.$L("Tasks"),
			"MEMOS": accountsRb.$L("Memos"),
			"MESSAGING": accountsRb.$L("Messaging"),
			"PHONE": accountsRb.$L("Phone"),
			"SMS": accountsRb.$L("Text Messaging"),
			"IM": accountsRb.$L("Instant Messaging"),
			"PHOTO.UPLOAD": accountsRb.$L("Photo"),
			"VIDEO.UPLOAD": accountsRb.$L("Video Upload"),
			"DOCUMENTS": accountsRb.$L("Documents"),
			"LOCAL.FILESTORAGE": accountsRb.$L("Local file storage")
		}

	};
}());

