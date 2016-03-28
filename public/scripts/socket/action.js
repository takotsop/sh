'use strict';

var Socket = require('socket/socket');

//LOCAL

var lastAction, actionTimeout = null;

var emitAction = function(action, data, callback) {
	if (action == lastAction && actionTimeout != null) {
		return false;
	}
	lastAction = action;
	actionTimeout = setTimeout(function() {
		actionTimeout = null;
	}, 500);

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
