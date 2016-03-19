'use strict';

var $ = require('jquery');

var Config = require('util/config');

//SETUP

var storageAvailable = window.localStorage != null;
if (storageAvailable) {
	try {
		var availableKey = 'storage_available';
		window.localStorage.setItem(availableKey, availableKey);
		window.localStorage.removeItem(availableKey);
	} catch (e) {
		storageAvailable = false;
		console.error(e);
		if (!Config.TESTING) {
			window.alert('Local storage unavailable! Your signin information cannot be retrieved, or saved for next time you open the page. You may have private browsing enabled, or set a storage quota that is too small for the site to function.');
		}
	}
} else {
	console.error('Local storage undefined');
	window.alert('Local storage unavailable! Your signin information cannot be retrieved, or saved for next time you open the page. Please make sure you are running the latest version of your browser, or allow local storage if it is disabled.');
}

//PUBLIC

module.exports = {

	pluralize: function(amount, countable) {
		if (amount != 1) {
			countable += 's';
		}
		return amount + ' ' + countable;
	},

	hidden: function(selector) {
		return $(selector).css('display') == 'none';
	},

	storage: function(key, value) {
		if (!storageAvailable) {
			return null; //TODO fallback
		}
		if (value === undefined) {
			return window.localStorage.getItem(key);
		}
		if (value === null) {
			window.localStorage.removeItem(key);
			return;
		}
		window.localStorage.setItem(key, value);
	},

};
