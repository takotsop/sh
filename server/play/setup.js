'use strict';

var CommonConsts = require.main.require('./common/constants');

var DB = require.main.require('./server/tools/db');

var Socket = require.main.require('./server/connect/io');
var Signin = require.main.require('./server/connect/signin');

var Game = require.main.require('./server/play/game');
var Play = require.main.require('./server/play/play');
var Player = require.main.require('./server/play/player');

//DB

DB.delete('games', 'state IS NULL');

DB.update('users', 'online_count > 0', {online_count: 0});

DB.fetchAll('id, start_index, player_count, player_ids, player_names, history', 'games', 'state = 1 AND compatible_version = $1', [CommonConsts.COMPATIBLE_VERSION], function(games) {
	if (games.length > 0) {
		var restoredCount = 0;
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

//SOCKET

var io = Socket.io();

io.use(function(socket, next) {
	var query = socket.handshake.query;
	if (query.v === undefined || query.v == CommonConsts.VERSION) {
		Signin(socket, parseInt(query.uid), query.auth);
	} else {
		socket.emit('reload', {v: CommonConsts.VERSION});
	}
	next();
});

io.on('connection', function(socket) {
	Player(socket);

	socket.on('disconnect', function() {
		var uid = socket.uid;
		if (uid) {
			DB.queryOne('UPDATE users SET online_count = online_count - 1 WHERE id = '+uid+' AND online_count > 0 RETURNING online_count', null, function(user) {
				if (user.online_count == 0) {
					Player.remove(uid);
				}
			});
		}
		if (socket.game) {
			socket.game.disconnect(socket);
		}
	});

});
