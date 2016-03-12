'use strict';

var Socket = require.main.require('./server/connect/io');

var uniquePlayers = {};

module.exports = {

	add: function(uid, socket) {
		socket.join('player' + uid);
		uniquePlayers[uid] = socket;
	},

	all: function() {
		return uniquePlayers;
	},

	emitTo: function(uid, name, data) {
		Socket.io().to('player' + uid).emit(name, data);
	},

};
