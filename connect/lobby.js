var DB = require.main.require('./tools/db');
var Utils = require.main.require('./tools/utils');

var Game = require.main.require('./play/game');

//LOCAL

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
			if (game.isOpen()) {
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

	socket.on('room quickjoin', function(data, callback) {
		var response = {};
		if (joinAvailableGame(socket)) {
			socket.leave('lobby');
			response.success = true;
		}
		callback(response);
	});

	socket.on('feedback', function(data, callback) {
		DB.insert('feedback', {username: socket.player.name, report_type: data.type, feedback: data.body}, null, callback);
	});

};
