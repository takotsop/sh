'use strict';

var $ = require('jquery');

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
