'use strict';

require('styles/lobby/timeout');

var $ = require('jquery');

var Config = require('util/config');
var Util = require('util/util');

var Socket = require('socket/socket');

var State = require('game/state');

//TIMERS

var lobbyInterval, socketInterval;
var inGameLobby;

var resetTimeout = function(waiting) {
	if (typeof waiting === 'boolean') {
		inGameLobby = waiting;
	}

	if (lobbyInterval) {
		clearInterval(lobbyInterval);
		lobbyInterval = null;
	}
	if (inGameLobby) {
		var waitDuration = Util.hidden('#lobby-wait-afk') ? 89 : 44;
		lobbyInterval = setTimeout(function() {
			if (Util.hidden('#lobby-wait')) {
				lobbyInterval = null;
				return;
			}
			$('#lobby-wait-afk').toggle();
			if (!Util.hidden('#lobby-wait-afk')) {
				Socket.emit('lobby afk');
				resetTimeout();
			} else {
				require('lobby/lobby').connectToStart();
				window.alert('You\'ve been taken back to the main lobby due to inactivity.');
			}
		}, waitDuration * 1000);
	}

	if (socketInterval) {
		clearInterval(socketInterval);
		lobbyInterval = null;
	}
	lobbyInterval = setTimeout(function() {
		Socket.close();
		$('#lobby-wait-afk').hide();
		$('#overlay-disconnected').show();
	}, 10 * 60000);
};

//EVENTS

$('#lobby-wait-afk').on('click', function() {
	$('#lobby-wait-afk').hide();
	resetTimeout();
});

$('#overlay-disconnected').on('click', function() {
	window.location.reload();
});

$(window.document).on('click', resetTimeout);

$(window.document).on('keypress', resetTimeout);

//WINDOW

window.onbeforeunload = function() {
	if (!Config.TESTING && State.inGame) {
		return "You WILL NOT be removed from the game. If you'd like to leave permanently, please quit from the menu first so your fellow players know you will not return. Thank you!";
	}
};

window.onbeforeunload = function() {
	if (!Config.TESTING && State.inGame) {
		return "You WILL NOT be removed from the game. If you'd like to leave permanently, please quit from the menu first so your fellow players know you will not return. Thank you!";
	}
};

window.focus = resetTimeout;

//PUBLIC

module.exports = {

	reset: resetTimeout,

};
