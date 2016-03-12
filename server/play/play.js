'use strict';

var Utils = require.main.require('./server/tools/utils');

//MANAGE

var chatAction = function(data, puid, game) {
	var lastMessage = game.playerState(puid, 'chatMessage');
	var lastMessageTime = game.playerState(puid, 'chatTime');
	var now = Utils.now();
	var message = data.msg;
	if (message != lastMessage && (!lastMessageTime || now - lastMessageTime > 1)) {
		game.playerState(puid, 'chatMessage', message);
		game.playerState(puid, 'chatTime', now);

		data.uid = puid;
		data = game.emitAction('chat', data);
		return data;	
	}
};

var quitAction = function(data, puid, game, callback) {
	var wasPresident = game.isPresident(puid);
	var wasChancellor = game.isChancellor(puid);
	var wasHitler = game.isHitler(puid);
	if (game.remove(null, puid)) {
		var advance;
		if (wasPresident) {
			advance = true;
		} else if (wasChancellor) {
			advance = !game.turn.chancellorAction;
		}
		if (advance) {
			game.advanceTurn();
		}
		if (callback) {
			callback();
		}
		return game.emitAction('abandoned', {uid: puid, hitler: wasHitler, advance: advance});
	}
};

//PLAY

var chancellorAction = function(data, puid, cuid, game) {
	if (game.turn.chancellor) {
		console.log(game.gid, 'Chancellor already chosen for ' + puid);
		return;
	}
	if (puid == cuid) {
		console.error(game.gid, 'Enchancell self', game.playerState(puid, 'index'), game.presidentIndex);
		return;
	}
	if (!game.isPresident(puid)) {
		console.error(game.gid, 'President selects chancellor', puid, game.turn.president, cuid);
		return;
	}
	if (cuid == game.chancellorElect || (game.playerCount > 5 && cuid == game.presidentElect)) {
		console.error(game.gid, 'Chancellor selected involved in prior election', cuid, game.presidentElect, game.chancellorElect);
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
		console.log(game.gid, 'Vote already complete');
		return;
	}
	var doneVoting = true;
	if (puid) {
		if (game.playerState(puid, 'killed')) {
			return;
		}
		game.playerState(puid, 'vote', data.up);

		game.players.forEach(function(puid) {
			var playerState = game.playerState(puid);
			if (!playerState.killed && playerState.vote == null) {
				doneVoting = false;
			}
		});
	}
	if (doneVoting) {
		game.turn.voted = true;

		var supporters = [];
		var supportCount = 0;
		if (puid) {
			game.players.forEach(function(uid, idx) {
				var playerState = game.playerState(uid);
				supporters[idx] = playerState.vote;
				if (playerState.vote) {
					++supportCount;
				}
				delete playerState.vote;
			});
		} else {
			data.supporters.forEach(function(supporting) {
				if (supporting) {
					++supportCount;
				}
			});
		}
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
	} else if (game.isChancellor(puid)) {
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
			console.error(game.gid, 'Veto not enabled', game.canVeto, game.turn.vetoRequested);
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
		console.error(game.gid, 'Invalid policy action', puid, game.turn.president, game.turn.chancellor, data);
	}
};

//POWERS

var powerAction = function(action, data, puid, tuid, game) {
	if (game.isPresident(puid) && game.power == action) {
		if (data.canVeto || action.indexOf('veto') > -1) {
			data.canVeto = true;
			game.canVeto = true;
		}
		if (action.indexOf('peek') > -1) {
			data = game.emitAction('peek', data);
		} else {
			if (puid == tuid) {
				console.error(game.gid, 'Self action', action, puid, tuid);
				return;
			}
			if (action.indexOf('investigate') > -1) {
				if (game.playerState(tuid, 'investigated')) {
					console.error(game.gid, 'Already investigated', puid, tuid);
					return;
				}
				var targetParty = game.playerState(tuid, 'allegiance') == 0 ? 0 : 1;
				var secret = {target: game.presidentElect, party: targetParty};
				game.playerState(tuid, 'investigated', true);
				data = game.emitAction('investigate', data, secret);
			} else if (action.indexOf('election') > -1) {
				if (game.isChancellor(data.uid)) {
					console.error(game.gid, 'Chancellor cannot become Special President', puid, tuid, game.turn.chancellor);
					return;
				}
				game.specialPresident = game.playerState(tuid, 'index');
				data = game.emitAction('special election', data);
			} else if (action.indexOf('bullet') > -1) {
				var wasHitler = game.isHitler(tuid);
				if (!game.kill(tuid, false)) {
					console.error(game.gid, 'Could not kill', puid, tuid, game.playerState(tuid));
					return;
				}
				data.hitler = wasHitler;
				data = game.emitAction('bullet', data);
			}
		}
		game.advanceTurn();
		return data;
	}
	console.error(game.gid, 'Invalid power', puid, tuid, game.turn.president, game.power, action);
};

//PUBLIC

var processAction = function(game, data) {
	var action = data.action;
	if (action == 'abandoned') {
		quitAction(data, data.uid, game);
	} else if (action == 'chat') {
		chatAction(data, data.uid, game);
	} else if (action == 'chancellor chosen') {
		chancellorAction(data, data.president, data.chancellor, game);
	} else if (action == 'voted') {
		voteAction(data, null, game);
	} else if (action == 'discarded') {
		policyAction(data, game.turn.president, game);
	} else if (action == 'enacted') {
		policyAction(data, game.turn.chancellor, game);
	} else if (action == 'veto requested') {
		policyAction(data, game.turn.chancellor, game);
	} else if (action == 'vetoed') {
		policyAction(data, game.turn.president, game);
	} else if (action == 'veto overridden') {
		policyAction(data, game.turn.president, game);
	} else {
		if (data.canVeto) {
			action += ' veto';
		}
		powerAction(action, data, game.turn.president, data.uid, game);
	}
};

var Play = function(socket) {

	socket.on('game action', function(rawData, callback) {
		var action = rawData.action;
		var game = socket.game;
		var puid = socket.uid;
		if (!game || game.playerState(puid) == null) {
			console.error('Socket action invalid game', puid, action, game);
			return;
		}
		var data = {action: action};
		var recording, saving = true;
		if (action == 'quit') {
			recording = quitAction(data, puid, game, callback);
		} else if (action == 'chat') {
			data.msg = rawData.msg.substr(0, 255);
			recording = chatAction(data, puid, game);
			saving = false;
		} else if (action == 'chancellor') {
			data.uid = rawData.uid;
			recording = chancellorAction(data, puid, data.uid, game);
		} else if (action == 'vote') {
			data.up = rawData.up;
			recording = voteAction(data, puid, game);
		} else if (action == 'policy') {
			data.veto = rawData.veto;
			data.policyIndex = rawData.policyIndex;
			recording = policyAction(data, puid, game);
		} else {
			data.uid = rawData.uid;
			recording = powerAction(action, data, puid, data.uid, game);
		}
		if (recording && game.started) {
			game.addToHistory(recording, saving);
		}
	});

	socket.on('typing', function(data) {
		socket.game.emitExcept(socket, 'typing', {uid: socket.uid, on: data.on});
	});

};

Play.process = function(game) {
	game.history.forEach(function(item) {
		processAction(game, item);
	});
};

module.exports = Play;
