'use strict';

var CommonConsts = require.main.require('./common/constants');

var SocketIO = require('socket.io');

var DB = require.main.require('./server/tools/db');

//PUBLIC

var io;

module.exports = {

	init: function(http) {
		DB.update('users', 'online_count > 0', {online_count: 0});

		DB.fetchAll('id, start_index, player_count, player_ids, player_names, history', 'games', 'state = 1 AND version = $1', [CommonConsts.COMPATIBLE_VERSION], function(games) {
			if (games.length > 0) {
				var Game = require.main.require('./server/play/game');
				games.forEach(function(gameData) {
					var game = new Game(gameData);
					game.start(true);
				});
			}
		});

		io = SocketIO(http);

		io.use(function(socket, next) {
			var query = socket.handshake.query;
			require('./signin')(socket, parseInt(query.uid), query.auth);

			next();
		});

		io.on('connection', function(socket) {
			require.main.require('./server/play/play')(socket);

			socket.on('disconnect', function() {
				var uid = socket.uid;
				if (uid) {
					DB.query('UPDATE users SET online_count = online_count - 1 WHERE id = '+uid+' AND online_count > 0', null);
				}
				if (socket.game) {
					socket.game.disconnect(socket);
				}
			});

		});
	},

	io: function() {
		return io;
	},

};
