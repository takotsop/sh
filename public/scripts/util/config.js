'use strict';

var pageLoad = window.location;

var pathItems = pageLoad.pathname.split('/');

module.exports = {

	TESTING: pageLoad.hostname == 'localhost',

	pageAction: pathItems[1],

	pageTarget: pathItems[2],

};
