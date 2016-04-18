'use strict';

var MAJOR_VERSION = 1;
var MINOR_VERSION = 1;
var PATCH_VERSION = 18;

//PUBLIC

module.exports = {

	VERSION: [MAJOR_VERSION, MINOR_VERSION, PATCH_VERSION].join('.'),
	COMPATIBLE_VERSION: [MAJOR_VERSION, MINOR_VERSION].join('.'),

	LIBERAL: 'liberal',
	FASCIST: 'fascist',

	FASCIST_POLICIES_REQUIRED: 6,
	LIBERAL_POLICIES_REQUIRED: 5,

};
