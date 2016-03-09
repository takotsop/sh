'use strict';

var Player = require.main.require('./server/play/player');

//MANAGE

var chatAction = function(data, puid, game) {
	data.uid = puid;
	data = game.emitAction('chat', data);
	return data;
};

var quitAction = function(data, puid, game, socket) {
	var wasPresident = game.isPresident(puid);
	var wasChancellor = game.isChancellor(puid);
	var wasHitler = game.isHitler(puid);
	if (game.remove(socket)) {
		var advance;
		if (wasPresident) {
			advance = true;
		} else if (wasChancellor) {
			advance = !game.turn.chancellorAction;
		}
		if (advance) {
			game.advanceTurn();
		}
		return game.emitAction('abandoned', {uid: puid, hitler: wasHitler, advance: advance});
	}
};

//PLAY

var chancellorAction = function(data, puid, game) {
	if (game.turn.chancellor) {
		console.error(game.gid, 'Chancellor already chosen for ' + puid);
		return;
	}
	var cuid = data.uid;
	if (cuid == game.chancellorElect || (game.playerCount > 5 && cuid == game.presidentElect)) {
		console.error(game.gid, 'Chancellor selected involved in prior election', cuid, game.presidentElect, game.chancellorElect);
		return;
	}
	if (puid == cuid) {
		console.error(game.gid, 'Enchancell self', game.playerState(puid, 'index'), game.presidentIndex);
		return;
	}
	if (!game.isPresident(puid)) {
		console.error(game.gid, 'President selects chancellor', puid, cuid, '|', game.playerState(puid, 'index'), game.presidentIndex);
		return;
	}
	var targetState = game.playerState(cuid);
	if (!targetState || targetState.killed) {
		console.error(game.gid, 'Chancellee killed', targetState);
		return;
	}

	var chancellorData = {president: puid, chancellor: cuid};
	chancellorData = game.emitAction('chancellor chosen', chancellorData);
	game.turn.chancellor = cuid;
	return chancellorData;
};

var voteAction = function(data, puid, game) {
	if (game.turn.voted) {
		console.error(game.gid, 'Vote already complete');
		return;
	}
	if (game.playerState(puid, 'killed')) {
		return;
	}
	game.playerState(puid, 'vote', data.up);
	var doneVoting = true;
	game.players.forEach(function(puid) {
		var playerState = game.playerState(puid);
		if (!playerState.killed && playerState.vote == null) {
			doneVoting = false;
		}
	});
	if (doneVoting) {
		game.turn.voted = true;

		var supporters = [];
		var supportCount = 0;
		game.players.forEach(function(puid, idx) {
			var playerState = game.playerState(puid);
			supporters[idx] = playerState.vote;
			if (playerState.vote) {
				++supportCount;
			}
			delete playerState.vote;
		});
		var elected = supportCount > Math.floor(game.currentCount / 2);
		var forced, secret, isHitler;
		if (elected) {
			game.presidentElect = game.players[game.presidentIndex];
			game.chancellorElect = game.turn.chancellor;

			game.turn.policies = game.getTopPolicies();
			secret = {target: game.presidentElect, policies: game.turn.policies};

			if (game.enactedFascist >= 3 && game.isHitler(game.chancellorElect)) {
				isHitler = true;
				game.finish(false, 'hitler');
			}
		} else {
			forced = game.failedElection();
		}
		var voteData = {supporters: supporters, elected: elected, forced: forced, hitler: isHitler};
		voteData = game.emitAction('voted', voteData, secret);
		return voteData;
	}
};

var policyAction = function(data, puid, game) {
	if (game.isPresident(puid)) {
		if (game.turn.presidentDiscard != null) {
			if (data.veto != null) {
				if (game.turn.vetoRequested) {
					game.turn.vetoRequested = null;

					if (data.veto) {
						data.forced = game.failedElection();
						data = game.emitAction('vetoed', data);
					} else {
						var forcedIndex = game.turn.presidentDiscard == 0 ? 1 : 0;
						data.policy = game.turn.policies[forcedIndex];
						game.enactPolicy(data.policy, true);
						data = game.emitAction('veto overridden', data);
					}
					return data;
				}
			}
		} else {
			game.turn.presidentDiscard = data.policyIndex;
			delete game.turn.policies[data.policyIndex];
			var secret = {target: game.chancellorElect, policies: game.turn.policies};
			data = game.emitAction('discarded', data, secret);
			return data;
		}
	} else if (puid == game.turn.chancellor) {
		if (game.turn.presidentDiscard == null) {
			console.error(game.gid, 'President has not yet discarded a policy');
			return;
		}
		if (data.veto != null) {
			if (game.canVeto && !game.turn.vetoRequested) {
				game.turn.vetoRequested = true;
				game.turn.chancellorAction = true;
				data = game.emitAction('veto requested', data);
				return data;
			}
		} else {
			game.turn.chancellorAction = true;
			game.turn.presidentDiscard = null;

			var secret;
			var policy = game.turn.policies[data.policyIndex];
			var fascistPower = game.enactPolicy(policy, true);
			if (fascistPower && fascistPower.indexOf('peek') > -1) {
				secret = {target: game.presidentElect, peek: game.peekPolicies()};
			}
			data.policy = policy;
			data = game.emitAction('enacted', data, secret);
			return data;
		}
	} else {
		console.error(game.gid, 'Invalid policy action', puid, data);
	}
};

//POWERS

var powerAction = function(action, data, puid, game) {
	if (game.isPresident(puid) && game.power == action) {
		if (action.indexOf('veto') > -1) {
			data.canVeto = true;
			game.canVeto = true;
		}
		if (action.indexOf('peek') > -1) {
			data = game.emitAction('peeked', data);
		} else {
			if (puid == data.uid) {
				return;
			}
			var tuid = data.uid;
			if (action.indexOf('investigate') > -1) {
				if (game.playerState(tuid, 'investigated')) {
					return;
				}
				var targetParty = this.playerState(tuid, 'allegiance') == 0 ? 0 : 1;
				var secret = {target: game.presidentElect, party: targetParty};
				game.playerState(tuid, 'investigated', true);
				data = game.emitAction('investigated', data, secret);
			} else if (action.indexOf('election') > -1) {
				if (game.turn.chancellor == data.uid) {
					return;
				}
				game.specialPresident = game.playerState(tuid, 'index');
				data = game.emitAction('special election', data);
			} else if (action.indexOf('bullet') > -1) {
				var wasHitler = game.isHitler(tuid);
				if (!game.kill(tuid, false)) {
					return;
				}
				data.hitler = wasHitler;
				data = game.emitAction('killed', data);
			}
		}
		game.advanceTurn();
		return data;
	}
	console.error(game.gid, 'Invalid power', game.isPresident(puid), game.power, action);
};

//PUBLIC

module.exports = function(socket) {

	socket.on('game action', function(rawData) {
		var action = rawData.action;
		var game = socket.game;
		var puid = socket.uid;
		if (!game || game.playerState(puid) == null) {
			console.error('Socket action invalid game', puid, action, game);
			return;
		}
		var data = {action: action};
		var recording;
		if (action == 'quit') {
			recording = quitAction(data, puid, game, socket);
		} else if (action == 'chat') {
			data.msg = rawData.msg.substr(0, 255);
			recording = chatAction(data, puid, game);
		} else if (action == 'chancellor') {
			data.uid = rawData.uid;
			recording = chancellorAction(data, puid, game);
		} else if (action == 'vote') {
			data.up = rawData.up;
			recording = voteAction(data, puid, game);
		} else if (action == 'policy') {
			data.veto = rawData.veto;
			data.policyIndex = rawData.policyIndex;
			recording = policyAction(data, puid, game);
		} else {
			data.uid = rawData.uid;
			recording = powerAction(action, data, puid, game);
		}
		if (recording) {
			var historyIndex = game.history.length;
			recording.i = historyIndex;
			game.history[historyIndex] = recording;
		}
	});

	socket.on('typing', function(data) {
		socket.game.emitExcept(socket, 'typing', {uid: socket.uid, on: data.on});
	});

};
