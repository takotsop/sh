'use strict';

var Config = require('util/config');
var Data = require('util/data');

var Socket = require('socket/socket');

var Lobby = require('lobby/lobby');
var Welcome = require('lobby/welcome');

//SOCKET

Socket.on('connect', function(data) {
	if (!Data.uid || !Data.auth) {
		Welcome.showSignin();
	}
});

Socket.on('auth', function(data) {
	Data.username = data.name;

	if (data.invalid) {
		Welcome.showSignin();
	} else {
		Lobby.show();
	}
});

Socket.on('reload', function(data) {
	if (!Config.TESTING) { 
		window.alert('Secret Hitler Online has been updated to v'+data.v+'! Automatically reloading the page to download the latest improvements and bug fixes.');
	}
	window.location.reload();
});
