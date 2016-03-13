'use strict';

require('styles/lobby/lobby');

var $ = require('jquery');

var CommonUtil = require('common/util');

var Config = require('util/config');
var Util = require('util/util');

var Chat = require('ui/chat');

var App = require('ui/app');

var Action = require('socket/action');
var Socket = require('socket/socket');

var Welcome = require('lobby/welcome');

var Start = require('game/start');
var State = require('game/state');

//TIMERS

var countdownInterval, startTime, afkInterval;

var clearCountdown = function() {
	if (countdownInterval) {
		clearTimeout(countdownInterval);
		countdownInterval = null;
	}
};

var updateCountdown = function() {
	var secondsRemaining = startTime - CommonUtil.now();
	if (secondsRemaining < 0) {
		clearCountdown();
	} else {
		$('#lobby-countdown').text('waiting ' + secondsRemaining + ' seconds...');
	}
};

var gameTimeout = function(enabled) {
	if (afkInterval) {
		clearInterval(afkInterval);
		afkInterval = null;
	}
	if (enabled && !State.started) {
		var waitDuration = Util.hidden('#lobby-wait-afk') ? 59 : 29;
		afkInterval = setTimeout(function() {
			if (Util.hidden('#lobby-wait')) {
				afkInterval = null;
				return;
			}
			if (Util.hidden('#lobby-wait-afk')) {
				$('#lobby-wait-afk').show();
				Socket.emit('lobby afk');
				gameTimeout(true);
			} else {
				$('#lobby-wait-afk').hide();
				connectToStart();
				window.alert('You\'ve been taken back to the main lobby due to inactivity.');
			}
		}, waitDuration * 1000);
	} else {
		$('#lobby-wait-afk').hide();
	}
};

//LOCAL

var updateLobby = function(data) {
	if (data.started) {
		gameTimeout(false);
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
		$('#lobby-countdown').text('waiting for ' + playersNeeded + ' more...');
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

var showLobbySection = function(subsection, forced) {
	if (!forced && !Util.hidden('#lobby-'+subsection)) {
		return;
	}

	$('#s-lobby > *').hide();
	$('#lobby-'+subsection).show();

	var isGameLobby = subsection == 'wait';
	Chat.toggle(isGameLobby);
	gameTimeout(isGameLobby);
};

var connectToStart = function(ifShowing) {
	if (ifShowing && (Util.hidden('#s-lobby') || !Util.hidden('#lobby-start'))) {
		return;
	}
	$('.chat-container').html('');

	showLobbySection('start', true);

	var connectData = {};
	if (Config.pageAction == 'join') {
		connectData.join = Config.pageTarget;
		Config.pageAction = null;
	}
	Socket.emit('lobby join', connectData);
	return true;
};

var showLobby = function() {
	State.gameOver = true;
	Chat.voiceDisconnect();
	App.showSection('lobby');
	connectToStart();
};

var quitGame = function() {
	Action.emit('quit', null, showLobby);
};

var joinGame = function(gid, failDestination) {
	showLobbySection('');
	Socket.emit('room join', {gid: gid}, function(response) {
		if (response.error) {
			window.alert('Unable to join game: ' + response.error);
		}
		showLobbySection(response.success ? 'wait' : failDestination);
	});
};

//EVENTS

$('.lobby-leave').on('click', connectToStart);

$('#lobby-button-quick-play').on('click', function() {
	showLobbySection('');
	Socket.emit('room quickjoin', null, function(response) {
		if (response.gid) {
			console.log('Quick rejoin', response);
		} else {
			showLobbySection(response.success ? 'wait' : 'start');
		}
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
		Config.manual = true;
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
	joinGame(gid, 'join-private');
});

$('#lobby-open-games').on('click', 'li', function() {
	joinGame($(this).data('gid'), 'start');
});

$('#lobby-wait-afk').on('click', function() {
	gameTimeout(false);
	gameTimeout(true);
});

//SOCKET

Socket.on('lobby games stats', function(data) {
	if (data.games) {
		var hasGame = data.games.length > 0;
		$('#lobby-open-games').toggle(hasGame);
		$('#lobby-open-games-empty').toggle(!hasGame);

		$('#lobby-open-games').html(data.games.reduce(function(combined, game) {
			return combined + '<li data-gid="'+game.gid+'"><h4>'+game.size+'p Secret Hitler</h4><p>'+game.names+'</p></li>';
		}, ''));
	}
	if (data.players) {
		var onlineCount = data.players.online;
		var showsDetails = onlineCount > 1;
		$('#lobby-count-details').toggle(showsDetails);
		if (showsDetails) {
			$('#lobby-count-playing').text(data.players.playing);
			$('#lobby-count-lobby').text(data.players.lobby);
		}
		$('#lobby-count-online').text(Util.pluralize(onlineCount, 'player'));

	}
});

Socket.on('lobby game data', updateLobby);

//WINDOW

window.onbeforeunload = function() {
	if (!Config.TESTING && !State.gameOver) {
		return "You WILL NOT be removed from the game. If you'd like to leave permanently, please quit from the menu first so your fellow players know you will not return. Thank you!";
	}
};

window.onbeforeunload = function() {
	if (!Config.TESTING && !State.gameOver) {
		return "You WILL NOT be removed from the game. If you'd like to leave permanently, please quit from the menu first so your fellow players know you will not return. Thank you!";
	}
};

window.focus = function() {
	if (afkInterval) {
		gameTimeout(true);
	}
};

$(window.document).on('click', function() {
	if (afkInterval) {
		gameTimeout(true);
	}
});

$(window.document).on('keypress', function() {
	if (afkInterval) {
		gameTimeout(true);
	}
});

//PUBLIC

module.exports = {

	show: showLobby,

	quitToLobby: quitGame,

	connectToStart: connectToStart,

};
