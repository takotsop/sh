var countdownInterval, startTime;

var clearCountdown = function() {
	if (countdownInterval) {
		clearTimeout(countdownInterval);
		countdownInterval = null;
	}
};

var updateCountdown = function() {
	var secondsRemaining = startTime - timestamp();
	if (secondsRemaining < 0) {
		clearCountdown();
	} else {
		$('#lobby-countdown').text('waiting ' + secondsRemaining + ' seconds...');
	}
};

var updateLobby = function(data) {
	if (data.started) {
		startGame(data);
		return;
	}
	showLobbySection('wait');

	clearCountdown();

	var playerCount = data.players.length;
	startTime = data.startTime;
	if (startTime) {
		updateCountdown();
		countdownInterval = setInterval(updateCountdown, 1000);
	} else {
		var playersNeeded = 5 - playerCount;
		$('#lobby-countdown').text(playersNeeded + ' more...');
	}

	$('#lobby-player-summary').text(playerCount + ' of ' + data.maxSize);
	var nameList = '';
	data.players.forEach(function(player, index) {
		floatClass = index % 2 == 0 ? 'left' : 'right';
		nameList += '<div class="player-slot '+floatClass+'"><h2>' + player.name + '</h2></div>';
	});
	$('#lobby-players').html(nameList);

	var privateGame = data.private == true;
	$('#lobby-privacy').toggle(privateGame);
	if (privateGame) {
		$('#lobby-private-code').text(data.gid);
	}
};

var showLobbySection = function(subsection) {
	$('#s-lobby > *').hide();
	$('#lobby-'+subsection).show();
};

var connectToLobby = function() {
	showLobbySection('start');

	socket.emit('lobby join');
};

var showLobby = function() {
	gameOver = true;
	if (webrtc) {
		webrtc.disconnect();
		webrtc = null;
	}

	showAppSection('lobby');
	connectToLobby();
};

var quitGame = function() {
	emitAction('quit');
};

//EVENTS

$('.lobby-leave').on('click', connectToLobby);

$('#lobby-button-quick-play').on('click', function() {
	showLobbySection('');
	socket.emit('room quickjoin', null, function(response) {
		showLobbySection(response.success ? 'wait' : 'start');
	});
});

$('#lobby-button-create').on('click', function() {
	showLobbySection('create');
});

$('#lobby-button-join-private').on('click', function() {
	showLobbySection('join-private');
});

$('#lobby-create-confirm').on('click', function() {
	var createData = {
		size: $('#create-game-size').val(),
		private: $('#create-game-privacy').prop('checked'),
	};
	socket.emit('room create', createData, function(response) {
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
	socket.emit('room join private', {gid: gid}, function(response) {
		if (response.error) {
			window.alert('Unable to join game: ' + response.error);
		}
		showLobbySection(response.success ? 'wait' : 'join-private');
	});
});

socket.on('lobby game data', updateLobby);

window.onbeforeunload = function() {
	if (!TESTING && !gameOver) {
		return "You WILL NOT be removed from the game. If you'd like to leave permanently, please quit from the menu first so your fellow players know you will not return. Thank you!";
	}
};
