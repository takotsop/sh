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

};
