'use strict';

var SocketIO = require('socket.io');

var DB = require.main.require('./server/tools/db');

//PUBLIC

var io;

module.exports = {

	init: function(http) {
		DB.update('users', 'online_count > 0', {online_count: 0});

		io = SocketIO(http);

		io.on('connection', function(socket) {
			var query = socket.handshake.query;

			require('./signin')(socket, parseInt(query.uid), query.auth);
			require.main.require('./server/play/play')(socket);

			socket.on('disconnect', function() {
				if (socket.uid) {
					DB.query('UPDATE users SET online_count = online_count - 1 WHERE id = '+socket.uid+' AND online_count > 0', null);
				}

				var player = socket.player;
				if (player) {
					var game = player.game;
					if (game) {
						game.disconnect(socket);
					} else {
						delete socket.player;
						socket.player = null;
					}
				}
			});

		});
	},

	io: function() {
		return io;
	},

};
