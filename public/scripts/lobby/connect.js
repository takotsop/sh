'use strict';

var $ = require('jquery');

var CommonConsts = require('common/constants');

var Data = require('util/data');

var Socket = require('socket/socket');

var Lobby = require('lobby/lobby');
var Welcome = require('lobby/welcome');

//SOCKET

Socket.on('connect', function() {
	if (!Data.uid || !Data.auth) {
		Welcome.showSignin();
	}
});

Socket.on('disconnect', function() {
	$('#lobby-wait-afk').hide();
	$('#overlay-disconnected').show();
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
	var message;
	if (data.v != CommonConsts.VERSION) {
		message = 'Secret Hitler Online has been updated to v'+data.v+'! Automatically reloading the page to download the latest improvements and bug fixes.';
	} else if (data.error) {
		message = data.error + '. This may be due to inactivity, or a server restart. Reloading the page to reconnect!\n\nIf this issue persists, please submit a bug report from the game menu. Thanks!';
	} else {
		message = 'unknown';
		console.error(message, data);
	}
	window.alert(message);
	window.location.reload();
});
