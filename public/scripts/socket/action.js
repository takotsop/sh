'use strict';

var Socket = require('socket/socket');

//LOCAL

var emitAction = function(action, data, callback) {
	if (!data) {
		data = {};
	}
	data.action = action;
	Socket.emit('game action', data, callback);
};

//PUBLIC

module.exports = {

	emit: emitAction,

};
