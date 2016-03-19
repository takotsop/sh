'use strict';

//SETUP

var pageLoad = window.location;

var pathItems = pageLoad.pathname.split('/');

//PUBLIC

module.exports = {

	TESTING: pageLoad.hostname == 'localhost',

	pageAction: pathItems[1],

	pageTarget: pathItems[2],

};
