'use strict';

module.exports = {

	timestamp: function() {
		return Math.round(Date.now() * 0.001);
	},

	pluralize: function(amount, countable) {
		if (amount != 1) {
			countable += 's';
		}
		return amount + ' ' + countable;
	},

};
