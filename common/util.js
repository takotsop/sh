'use strict';

module.exports = {

	now: function() {
		return Math.round(Date.now() * 0.001);
	},

	removeWhitespace: function(string) {
		return string.replace(/\s+/g, '');
	},

};
