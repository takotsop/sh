'use strict';

var SocketIO = require('socket.io');

var Config = require('util/config');
var Data = require('util/data');

//LOCAL

var params;
if (Data.uid && Data.auth) {
	params = {query: 'uid=' + Data.uid + '&auth=' + Data.auth};
}

var socket = SocketIO(Config.TESTING ? 'http://localhost:8004' : 'https://secrethitler.online', params);

//PUBLIC

module.exports = socket;
