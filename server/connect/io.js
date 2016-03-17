'use strict';

var CommonConsts = require.main.require('./common/constants');

var SocketIO = require('socket.io');

var DB = require.main.require('./server/tools/db');

var io;

//PUBLIC

module.exports = {

	init: function(http) {

		// db

		DB.delete('games', 'state IS NULL');

		DB.update('users', 'online_count > 0', {online_count: 0});

		DB.fetchAll('id, start_index, player_count, player_ids, player_names, history', 'games', 'state = 1 AND compatible_version = $1', [CommonConsts.COMPATIBLE_VERSION], function(games) {
			if (games.length > 0) {
				var restoredCount = 0;
				var Game = require.main.require('./server/play/game');
				games.forEach(function(gameData) {
					var game = new Game(gameData);
					game.start();
					restoredCount += 1;
				});
				if (restoredCount > 0) {
					console.log('Restored ' + restoredCount + ' games from DB');
				}
			}
			console.log('\n');
		});

		// io

		io = SocketIO(http);

		io.use(function(socket, next) {
			var query = socket.handshake.query;
			if (query.v == undefined || query.v == CommonConsts.VERSION) {
				require('./signin')(socket, parseInt(query.uid), query.auth);
			} else {
				socket.emit('reload', {v: CommonConsts.VERSION});
			}
			next();
		});

		io.on('connection', function(socket) {
			require.main.require('./server/play/play')(socket);

			socket.on('disconnect', function() {
				var uid = socket.uid;
				if (uid) {
					DB.queryOne('UPDATE users SET online_count = online_count - 1 WHERE id = '+uid+' AND online_count > 0 RETURNING online_count', null, function(user) {
						if (user.online_count == 0) {
							require.main.require('./server/play/player').remove(uid);
						}
					});
				}
				if (socket.game) {
					socket.game.disconnect(socket);
				}
			});

		});
	},

	to: function(room) {
		return io.to(room);
	},

};
