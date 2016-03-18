'use strict';

var SocketIO = require('socket.io');

var io;

//PUBLIC

module.exports = {

	init: function(http) {
		io = SocketIO(http);
	},

	io: function() {
		return io;
	},

	to: function(room) {
		return io.to(room);
	},

};
