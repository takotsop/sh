var DB = require.main.require('./server/tools/db');
var Utils = require.main.require('./server/tools/utils');

var Game = require.main.require('./server/play/game');

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

var joinOngoingGame = function(socket) {
	var player = socket.player;
	var oldGame = player.game;
	if (oldGame && !oldGame.finished) {
		oldGame.addPlayer(socket, player);
		return true;
	}
};

var joinAvailableGame = function(socket) {
	var joiningGame;
	var games = Game.games();
	for (var gidx in games) {
		var game = games[gidx];
		if (!game.private && game.isOpen()) {
			joiningGame = game;
			break;
		}
	}
	if (!joiningGame) {
		joiningGame = new Game(10);
	}
	joiningGame.addPlayer(socket, socket.player);
	return true;
};

//PUBLIC

module.exports = function(socket) {

	socket.on('lobby join', function(data, callback) {
		socket.player.leaveCurrentGame();
		if (!joinOngoingGame(socket)) {
			socket.join('lobby');
		}
	});

	socket.on('room create', function(data, callback) {
		var player = socket.player;
		player.leaveCurrentGame();
		var gameMaxSize = Utils.rangeCheck(data.size, 5, 10, 10);
		joiningGame = new Game(gameMaxSize, data.private);
		joiningGame.addPlayer(socket, player);
	});

	socket.on('room quickjoin', function(data, callback) {
		if (!joinOngoingGame(socket)) {
			var response = {};
			if (joinAvailableGame(socket)) {
				response.success = true;
			}
			callback(response);
		}
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
