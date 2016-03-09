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
