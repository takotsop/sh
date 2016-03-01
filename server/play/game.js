var CommonGame = require.main.require('./common/game');

var DB = require.main.require('./server/tools/db');
var Utils = require.main.require('./server/tools/utils');
var SeedRandom = require('seedrandom');

var Player = require.main.require('./server/play/player');

//LOCAL

var MINIMUM_GAME_SIZE = Utils.TESTING ? 3 : 5;

var games = [];

var Game = function(size, private) {
	this.gid = Utils.uid();
	this.maxSize = size;
	this.private = private;

	this.players = [];
	this.playerState = {};
	this.history = [];

	this.generator = SeedRandom(this.gid);
	this.turn = {};
	this.enactedLiberal = 0;
	this.enactedFascist = 0;

	this.startIndex;
	this.playerCount;
	this.currentCount;
	this.policyDeck;
	this.hitlerUid;

	this.positionIndex;
	this.specialPresident;
	this.presidentIndex;
	this.electionTracker = 0;

	var game = this;
	games.push(this);

	DB.insert('games', {id: this.gid});

//PRIVATE

	this.random = function(max) {
		return Utils.rngInt(this.generator, max);
	};

	this.shuffle = function(array) {
		return Utils.randomize(this.generator, array);
	};

	this.shufflePolicyDeck = function() {
		this.policyDeck = [];

		var cardsRemaining = 17 - this.enactedFascist - this.enactedLiberal;
		var liberalsRemaining = 6 - this.enactedLiberal;
		for (var i = 0; i < cardsRemaining; ++i) {
			this.policyDeck[i] = i < liberalsRemaining ? CommonGame.LIBERAL : CommonGame.FASCIST;
		}
		this.policyDeck = this.shuffle(this.policyDeck);
	};

//POLICIES

	this.peekPolicies = function() {
		return this.policyDeck.slice(0, 3);
	};

	this.getTopPolicies = function(count) {
		if (!count) {
			count = 3;
		}
		var policies = this.policyDeck.splice(0, count);
		if (this.policyDeck.length < 3) {
			this.shufflePolicyDeck();
		}
		return policies;
	};

	this.getTopPolicy = function() {
		return this.getTopPolicies(1)[0];
	};

//LOBBY

	this.emit = function(name, data) {
		io.to(this.gid).emit(name, data);
	};

	this.emitAction = function(name, data, secret) {
		data.action = name;
		if (this.finished) {
			var roles = [];
			this.players.forEach(function(uid, index) {
				roles[index] = game.playerState[uid].allegiance;
			});
			data.roles = roles;
		}
		if (secret) {
			var target = Player.get(secret.target);
			target.emitToOthers('game action', data);
			data.secret = secret;
			target.emit('game action', data);
		} else {
			this.emit('game action', data);
		}
		return data;
	};

	this.gameData = function(perspectiveUid) {
		var sendHistory = this.history;
		var sendPlayers = [];
		var showFascists;
		if (perspectiveUid) {
			var perspectiveAllegiance = this.playerState[perspectiveUid].allegiance;
			showFascists = perspectiveAllegiance == 1 || (perspectiveAllegiance == 2 && this.playerCount <= 6);
		}
		this.players.forEach(function(uid, index) {
			var player = Player.get(uid);
			var playerData = {
				uid: uid,
				name: player.name,
				index: index,
			};
			if (perspectiveUid) {
				var playerAllegiance = game.playerState[uid].allegiance;
				if (perspectiveUid == uid || (showFascists && playerAllegiance > 0)) {
					playerData.allegiance = playerAllegiance;
				}
			}
			sendPlayers[index] = playerData;
		});
		return {
			gid: this.gid,
			started: this.started,
			maxSize: this.maxSize,
			startIndex: this.positionIndex,
			startTime: this.scheduledStart,

			players: sendPlayers,
			history: sendHistory,
			private: this.private,
		};
	};

	this.resetAutostart = function() {
		this.cancelAutostart();

		if (this.enoughToStart()) {
			var startDelay = Utils.TESTING ? 3 : 30;
			this.scheduledStart = Utils.now() + startDelay;

			this.autoTimer = setTimeout(function() {
				game.start();
			}, startDelay * 1000);
		}

		this.emit('lobby game data', this.gameData());
	};

	this.cancelAutostart = function() {
		if (this.autoTimer) {
			clearTimeout(this.autoTimer);
			this.autoTimer = null;
			this.scheduledStart = null;
		}
	};

	this.start = function(socket) {
		this.cancelAutostart();
		this.started = true;
		this.playerCount = this.players.length;
		this.currentCount = this.playerCount;
		this.startIndex = this.random(this.playerCount);
		this.positionIndex = this.startIndex;
		this.presidentIndex = this.positionIndex;
		this.shufflePolicyDeck();

		var playerIdData = this.players.join(',');
		DB.update('games', "id = '"+this.gid+"'", {state: 1, started_at: Utils.now(), start_index: this.startIndex, player_count: this.playerCount, player_ids: playerIdData});
		DB.updatePlayers(this.players, 'started');

		// Assign Fascists
		var facistsCount = Math.ceil(this.playerCount / 2) - 1;
		var fascistIndicies = [2];
		for (var i = 1; i < this.playerCount; ++i) {
			fascistIndicies[i] = i < facistsCount ? 1 : 0;
		}
		fascistIndicies = this.shuffle(fascistIndicies);
		this.players.forEach(function(puid, pidx) {
			var allegiance = fascistIndicies[pidx];
			game.playerState[puid].allegiance = allegiance;
			if (allegiance == 2) {
				game.hitlerUid = puid;
			}
		});

		// Emit
		this.players.forEach(function(puid) {
			var player = Player.get(puid);
			player.emitStartPerspective();
		});
	};

	this.getFascistPower = function() {
		return CommonGame.getFascistPower(this.enactedFascist, this.playerCount);
	};

//STATE

	this.advanceTurn = function() {
		if (this.finished) {
			return;
		}
		this.turn = {};
		if (this.specialPresident != null) {
			this.presidentIndex = this.specialPresident;
			this.specialPresident = null;
		} else {
			for (var attempts = 0; attempts < this.playerCount; ++attempts) {
				++this.positionIndex;
				if (this.positionIndex >= this.playerCount) {
					this.positionIndex = 0;
				}
				var puid = this.players[this.positionIndex];
				if (!this.playerState[puid].killed) {
					break;
				}
			}
			this.presidentIndex = this.positionIndex;
		}
		this.power = null;
	};

	this.failedElection = function() {
		++this.electionTracker;
		var forcedPolicy;
		if (this.electionTracker >= 3) {
			this.electionTracker = 0;
			this.presidentElect = null;
			this.chancellorElect = null;
			forcedPolicy = this.getTopPolicy();
			this.enactPolicy(forcedPolicy, false);
		}
		this.advanceTurn();
		return forcedPolicy;
	};

	this.finish = function(liberals, method) {
		if (!this.finished) {
			console.log('FIN', this.gid, liberals, method);

			var activePlayers = [];
			this.players.forEach(function(puid) {
				if (!game.playerState[puid].quit) {
					activePlayers.push(puid);
				}
			});
			DB.updatePlayers(activePlayers, 'finished');

			this.finished = true;
			DB.update('games', "id = '"+this.gid+"'", {state: 2, finished_at: Utils.now(), history: JSON.stringify(this.history), enacted_liberal: this.enactedLiberal, enacted_fascist: this.enactedFascist, liberal_victory: liberals, win_method: method});
			this.removeSelf();
		}
	};

	this.enactPolicy = function(policy, byVote) {
		var fascistPower;
		this.electionTracker = 0;
		if (policy == CommonGame.LIBERAL) {
			++this.enactedLiberal;
			if (this.enactedLiberal >= CommonGame.LIBERAL_POLICIES_REQUIRED) {
				this.finish(true, 'policy');
				return;
			}
		} else {
			++this.enactedFascist;
			if (this.enactedFascist >= CommonGame.FASCIST_POLICIES_REQUIRED) {
				this.finish(false, 'policy');
				return;
			}
			fascistPower = this.getFascistPower();
		}
		if (byVote) {
			if (fascistPower) {
				this.power = fascistPower;
			} else {
				this.advanceTurn();
			}
		}
		return fascistPower;
	};

//PLAYERS

	this.addPlayer = function(socket) {
		socket.leave('lobby');
		socket.join(this.gid);

		var player = socket.player;
		player.game = this;
		player.disconnected = false;

		var playerState = this.playerState[player.uid];
		if (!playerState) {
			var index = this.players.length;
			this.players[index] = player.uid;
			this.playerState[player.uid] = {index: index};
		} else {
			playerState.left = false;
		}

		if (this.started) {
			player.emitStartPerspective();
		} else if (this.isFull()) {
			this.start();
		} else {
			this.resetAutostart();
		}
	};

	this.kill = function(player, quitting) {
		var playerState = player.gameState();
		if (!playerState.killed) {
			if (quitting) {
				playerState.quit = true;
				DB.updatePlayers([player.uid], 'quit');
			}
			playerState.killed = true;
			this.currentCount -= 1;

			if (player.isHitler()) {
				this.finish(true, quitting ? 'hitler quit' : 'hitler');
			} else if (this.currentCount <= 2) {
				this.removeSelf();
			}
			return true;
		}
	};

	this.removeSelf = function() {
		this.cancelAutostart();

		var gid = this.gid;
		games = games.filter(function(g) {
			return g.gid != gid;
		});
		if (!this.finished) {
			DB.query("DELETE FROM games WHERE id = '"+gid+"'");
		}
	};

	this.disconnect = function(socket) {
		if (!this.started || this.finished) {
			this.remove(socket);
		} else {
			var player = socket.player;
			if (player) {
				player.disconnected = true;
			}
		}
	};

	this.remove = function(socket) {
		socket.leave(this.gid);

		var player = socket.player;
		var playerState = player.gameState();
		if (!playerState || playerState.left) {
			return false;
		}
		if (this.started) {
			playerState.left = true;
			player.kill(true);
		} else {
			this.players = this.players.filter(function(puid) {
				return puid != player.uid;
			});
			delete this.playerState[player.uid];
			if (this.players.length == 0) {
				this.removeSelf();
			} else {
				this.players.forEach(function(puid, pidx) {
					game.playerState[puid].index = pidx;
				});
			}
		}
		player.game = null;

		if (!this.started) {
			this.resetAutostart();
		}
		return true;
	};

//HELPERS

	this.isHitler = function(uid) {
		return uid == this.hitlerUid;
	};

	this.getPlayer = function(index) {
		return Player.get(this.players[index]);
	};

	this.enoughToStart = function() {
		return this.players.length >= MINIMUM_GAME_SIZE;
	};

	this.isFull = function() {
		return this.players.length >= this.maxSize;
	};

	this.isOpen = function() {
		return !this.started && !this.isFull();
	};

	this.activeCount = function() {
		var count = 0;
		this.players.forEach(function(puid) {
			var player = Player.get(puid);
			if (!player.disconnected) {
				++count;
			}
		});
		return count;
	};

	this.canVeto = function() {
		return this.enactedFascist >= (Utils.TESTING ? 1 : CommonGame.FASCIST_POLICIES_REQUIRED - 1);
	};

	return this;
};

Game.games = function(argument) {
	return games;
};

module.exports = Game;
