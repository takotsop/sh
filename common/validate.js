'use strict';

module.exports = {

	// Email

	email: function(email) {
		var regexEmailSections = /\S+@\S+\.\S+/;
		if (!regexEmailSections.test(email)) {
			return 'Invalid email address';
		}
	},

	emailProcess: function(value) {
		return value.trim();
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
		return value.trim();
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

		var invalidStartStrings = ['guest', 'admin', 'mod'];
		var lowercaseUsername = username.toLowerCase();
		for (var idx in invalidStartStrings) {
			var check = invalidStartStrings[idx];
			if (lowercaseUsername.indexOf(check) === 0) {
				return 'Your username may not start with "'+check+'"';
			}
		}
	},

	usernameProcess: function(value) {
		return value.replace(/\s\s+/g, ' ').trim();
	},

};
