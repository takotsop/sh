'use strict';

var Utils = require.main.require('./server/tools/utils');

var Socket = require.main.require('./server/connect/io');

//EXPRESS

var express = require('express');
var app = express();
var http = require('http').createServer(app);

//SETUP

var portNumber = process.env.PORT || 8004;

app.use(express.static('public'));

Socket.init(http);

http.listen(portNumber);

if (Utils.TESTING) {
	console.log('Secret Hitler TEST SERVER on port ' + portNumber);
}
