'use strict';

var Socket = require.main.require('./server/connect/io');

var allPlayers = {};

module.exports = {

	add: function(uid, socket) {
		socket.join('player' + uid);
		allPlayers[uid] = socket;
	},

	get: function(uid) {
		return allPlayers[uid];
	},

	emitTo: function(uid, name, data) {
		Socket.io().to('player' + uid).emit(name, data);
	},

};
