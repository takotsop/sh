'use strict';

var allPlayers = {};

var Player = function(socket, uid, name, oldPlayer) {
	this.uid = uid;
	this.name = name;

	if (oldPlayer) {
		this.game = oldPlayer.game;
	}

	allPlayers[uid] = this;

	// Emit

	this.emit = function(name, data) {
		socket.emit(name, data);
	};

	this.emitStartPerspective = function() {
		socket.emit('lobby game data', this.game.gameData(this.uid));
	};

	this.emitToOthers = function(name, data) {
		socket.broadcast.to(this.game.gid).emit(name, data);
	};

	this.emitAction = function(name, data) {
		return this.game.emitAction(name, data);
	};

	this.leaveCurrentGame = function() {
		if (this.game) {
			return this.game.disconnect(socket);
		}
	};

	// Play helpers

	this.equals = function(data) {
		return this.uid == data.uid;
	};

	this.getParty = function() {
		return this.gameState('allegiance') == 0 ? 0 : 1;
	};

	this.isPresident = function() {
		return this.gameState('index') == this.game.presidentIndex;
	};

	this.isChancellor = function() {
		return this.uid == this.game.turn.chancellor;
	};

	this.gameState = function(key, value) {
		return this.game.playerState(this.uid, key, value);
	};

	return this;
};

Player.get = function(uid) {
	return allPlayers[uid];
};

module.exports = Player;
