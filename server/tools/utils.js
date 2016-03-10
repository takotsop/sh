'use strict';

var rng = function(generator) {
	return generator.int32();
};

module.exports = {

	TESTING: process.env.NODE_ENV != 'production',

	now: function() {
		return Math.round(Date.now() * 0.001);
	},

	uuid: function(length) {
		return Math.random().toString(36).substr(2, length || 16);
	},

	code: function() {
		return Math.floor(Math.random() * 900000) + 100000;
	},

	rangeCheck: function(number, min, max, defaultValue) {
		if (!number) {
			return defaultValue;
		}
		if (number < min) {
			return min;
		}
		if (number > max) {
			return max;
		}
		return number;
	},

//RANDOM

	rngInt: function(generator, max) {
		return Math.abs(rng(generator)) % max;
	},

	randomize: function(generator, array) {
		var result = [], swapIndex;
		var Utils = this;
		array.forEach(function(val, idx) {
			if (!idx) {
				result[0] = val;
			} else {
				swapIndex = Utils.rngInt(generator, idx + 1);
				result[idx] = result[swapIndex];
				result[swapIndex] = val;
			}
		});
		return result;
	},

};
