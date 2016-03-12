'use strict';

require('styles/lobby/lobby');

var $ = require('jquery');

var Config = require('util/config');
var Util = require('util/util');

var Chat = require('ui/chat');

var App = require('ui/app');

var Action = require('socket/action');
var Socket = require('socket/socket');

var Welcome = require('lobby/welcome');

var Start = require('game/start');
var State = require('game/state');

//LOCAL

var countdownInterval, startTime;

var clearCountdown = function() {
	if (countdownInterval) {
		clearTimeout(countdownInterval);
		countdownInterval = null;
	}
};

var updateCountdown = function() {
	var secondsRemaining = startTime - Util.timestamp();
	if (secondsRemaining < 0) {
		clearCountdown();
	} else {
		$('#lobby-countdown').text('waiting ' + secondsRemaining + ' seconds...');
	}
};

var updateLobby = function(data) {
	if (data.started) {
		Start.play(data);
		return;
	}
	showLobbySection('wait');

	clearCountdown();

	State.players = data.players;
	var lobbyPlayerCount = data.players.length;
	startTime = data.startTime;
	if (startTime) {
		updateCountdown();
		countdownInterval = setInterval(updateCountdown, 1000);
	} else {
		var playersNeeded = 5 - lobbyPlayerCount;
		$('#lobby-countdown').text(playersNeeded + ' more...');
	}

	$('#lobby-player-summary').text(lobbyPlayerCount + ' of ' + data.maxSize);
	var nameList = '';
	data.players.forEach(function(player, index) {
		var floatClass = index % 2 == 0 ? 'left' : 'right';
		nameList += '<div class="player-slot '+floatClass+'"><h2>' + player.name + '</h2></div>';
	});
	$('#lobby-players').html(nameList);

	var privateGame = data.private == true;
	$('#lobby-privacy').toggle(privateGame);
	if (privateGame) {
		var gid = data.gid;
		$('#lobby-private-code').html('<a href="/join/'+gid+'" target="_blank">https://secrethitler.online/join/<strong>' + gid + '</strong></a>');
	}
};

var showLobbySection = function(subsection) {
	$('#s-lobby > *').hide();
	$('#lobby-'+subsection).show();
	Chat.toggle(subsection == 'wait');
};

var connectToLobby = function() {
	$('.chat-container').html('');

	showLobbySection('start');

	var connectData = {};
	if (Config.pageAction == 'join') {
		connectData.join = Config.pageTarget;
		Config.pageAction = null;
	}
	Socket.emit('lobby join', connectData);
};

var showLobby = function() {
	State.gameOver = true;
	Chat.voiceDisconnect();
	App.showSection('lobby');
	connectToLobby();
};

var quitGame = function() {
	Action.emit('quit', null, showLobby);
};

var joinGame = function(gid, failDestination) {
	Socket.emit('room join', {gid: gid}, function(response) {
		if (response.error) {
			window.alert('Unable to join game: ' + response.error);
		}
		showLobbySection(response.success ? 'wait' : failDestination);
	});
};

//EVENTS

$('.lobby-leave').on('click', connectToLobby);

$('#lobby-button-quick-play').on('click', function() {
	showLobbySection('');
	Socket.emit('room quickjoin', null, function(response) {
		showLobbySection(response.success ? 'wait' : 'start');
	});
});

$('#lobby-button-create').on('click', function() {
	showLobbySection('create');
});

$('#lobby-button-join-private').on('click', function() {
	showLobbySection('join-private');
});

$('#lobby-button-signout').on('click', function() {
	var confirmed = window.confirm('Are you sure you want to sign out of your account?');
	if (confirmed) {
		Welcome.hideSplash();
		Welcome.showSignin();
	}
});

$('#lobby-create-confirm').on('click', function() {
	var createData = {
		size: $('#create-game-size').val(),
		private: $('#create-game-privacy').prop('checked'),
	};
	Socket.emit('room create', createData, function(response) {
		showLobbySection(response.success ? 'wait' : 'start');
	});
});

$('#lobby-submit-private').on('click', function() {
	var gid = $('#join-private-code').val();
	if (!gid) {
		window.alert('Please enter a valid private game code');
		return;
	}

	$('#join-private-code').val('');
	showLobbySection('');
	joinGame(gid, 'join-private');
});

$('#lobby-open-games').on('click', 'li', function() {
	joinGame($(this).data('gid'), 'start');
});

//SOCKET

Socket.on('lobby games list', function(games) {
	var hasGame = games.length > 0;
	$('#lobby-open-games').toggle(hasGame);
	$('#lobby-open-games-empty').toggle(!hasGame);

	$('#lobby-open-games').html(games.reduce(function(combined, game) {
		return combined + '<li data-gid="'+game.gid+'"><h4>'+game.size+'p Secret Hitler</h4><p>'+game.names+'</p></li>';
	}, ''));
});

Socket.on('lobby game data', updateLobby);

window.onbeforeunload = function() {
	if (!Config.TESTING && !State.gameOver) {
		return "You WILL NOT be removed from the game. If you'd like to leave permanently, please quit from the menu first so your fellow players know you will not return. Thank you!";
	}
};

//PUBLIC

module.exports = {

	show: showLobby,

	quitToLobby: quitGame,

};
