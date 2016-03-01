var Socket = require('socket/socket');

//LOCAL

var emitAction = function(action, data) {
	if (!data) {
		data = {};
	}
	data.action = action;
	Socket.emit('game action', data);
};

//PUBLIC

module.exports = {

	emit: emitAction,

};
