var DB = require.main.require('./tools/db');
var Utils = require.main.require('./tools/utils');

var Game = require.main.require('./play/game');

//LOCAL

var joinGameById = function(socket, gid) {
	var player = socket.player;
	var oldGame = player.game;
	if (!oldGame || oldGame.finished) {
		var games = Game.games();
		for (var gidx in games) {
			var game = games[gidx];
			if (game.gid == gid) {
				if (game.started) {
					return 'started';
				}
				if (game.isFull()) {
					return 'full';
				}
				if (game.isOpen()) {
					game.addPlayer(socket, player);
					return true;
				}
				break;
			}
		}
	}
	return false;
};

var joinAvailableGame = function(socket) {
	var joiningGame;
	var player = socket.player;

	var oldGame = player.game;
	if (oldGame && !oldGame.finished) {
		joiningGame = oldGame;
	} else {
		var games = Game.games();
		for (var gidx in games) {
			var game = games[gidx];
			if (!game.private && game.isOpen()) {
				joiningGame = game;
				break;
			}
		}
	}

	if (!joiningGame) {
		joiningGame = new Game(10);
	}
	joiningGame.addPlayer(socket, player);
	return true;
};

//PUBLIC

module.exports = function(socket) {

	socket.on('lobby join', function(data, callback) {
		socket.player.leaveCurrentGame();
		socket.join('lobby');
	});

	socket.on('room create', function(data, callback) {
		var player = socket.player;
		player.leaveCurrentGame();
		joiningGame = new Game(data.size || 10, data.private);
		joiningGame.addPlayer(socket, player);
	});

	socket.on('room quickjoin', function(data, callback) {
		var response = {};
		if (joinAvailableGame(socket)) {
			response.success = true;
		}
		callback(response);
	});

	socket.on('room join private', function(data, callback) {
		var response = {};
		var gid = data.gid;
		if (!gid) {
			response.error = 'Invalid code';
		} else {
			var joined = joinGameById(socket, data.gid);
			if (joined == 'full') {
				response.error = 'Game full';
			} else if (joined == 'started') {
				response.error = 'Game started';
			} else if (joined == true) {
				response.success = true;
			} else {
				response.error = 'Game not found';
			}
		}
		callback(response);
	});

	socket.on('feedback', function(data, callback) {
		DB.insert('feedback', {username: socket.player.name, report_type: data.type, feedback: data.body}, null, callback);
	});

};
