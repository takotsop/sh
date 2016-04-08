'use strict';

var CommonUtil = require('./util');

//LOCAL

var preprocess = function(value) {
	return value.trim();
};

//PUBLIC

module.exports = {

	// Email

	email: function(email) {
		if (email.length < 6) {
			return 'Invalid email address';
		}
		if (email.length > 254) {
			return 'Invalid email address';
		}
		var regexEmailSections = /\S+@\S+\.\S+/;
		if (!regexEmailSections.test(email)) {
			return 'Invalid email address';
		}
		var emailSplit = email.split('@');
		var emailLocal = emailSplit[0];
		if (!emailLocal || emailLocal.length > 64) {
			return 'Invalid email address';
		}
		var emailDomain = emailSplit[1];
		if (!emailDomain || emailDomain.length < 4) {
			return 'Invalid email address';
		}
	},

	emailProcess: function(value) {
		return preprocess(value);
	},

	// Passkey

	passkey: function(passkey) {
		if (passkey.length != 6) {
			return 'Invalid passkey, must be 6 digits';
		}
		var regexOnlyDigits = /^[0-9]+$/;
		if (!regexOnlyDigits.test(passkey)) {
			return 'Invalid passkey, must be 6 digits';
		}
	},

	passkeyProcess: function(value) {
		return preprocess(value);
	},

	// Username

	username: function(username) {
		if (username.length < 4) {
			return 'Username must be at least 4 characters';
		}
		if (username.length > 12) {
			return 'Username must be no more than 12 characters';
		}

		var regexLetters = /[A-Za-z]/g;
		if (!regexLetters.test(username)) {
			return 'Username must contain letters';
		}
		var regexOnlyLettersNumbersSpaces = /^[A-Za-z0-9 ]+$/;
		if (!regexOnlyLettersNumbersSpaces.test(username)) {
			return 'Username must only consist of letters, numbers, and up to one space';
		}

		var splitBySpaces = username.split(' ');
		if (splitBySpaces.length > 2) {
			return 'Username must not have more than one space';
		}

		var invalidStartStrings = ['guest', 'admin', 'hitler'];
		var lowercaseNowhitespaceUsername = CommonUtil.removeWhitespace(username.toLowerCase());
		for (var idx in invalidStartStrings) {
			var check = invalidStartStrings[idx];
			if (lowercaseNowhitespaceUsername.indexOf(check) === 0) {
				return 'Your username may not start with "'+check+'"';
			}
		}
	},

	usernameProcess: function(value) {
		return preprocess(value.replace(/\s\s+/g, ' '));
	},

};
