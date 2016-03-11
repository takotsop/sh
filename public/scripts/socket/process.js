'use strict';

var Socket = require('socket/socket');

var Cards = require('ui/cards');
var Chat = require('ui/chat');

var Game = require('game/game');
var Players = require('game/players');
var Policies = require('game/policies');
var State = require('game/state');

//LOCAL

var processAction = function(data, fastForward) {
	var action = data.action;
	if (action == 'abandoned') {
		Players.abandoned(data);
	} else if (action == 'chat') {
		Chat.addMessage(data);
	} else if (action == 'chancellor chosen') {
		Players.chancellorChosen(data);
	} else if (action == 'voted') {
		Game.voteCompleted(data);
	} else if (action == 'discarded') {
		Policies.discarded(data);
	} else if (action == 'enacted') {
		Policies.enacted(data);
	} else if (action == 'veto requested') {
		Policies.vetoRequest(data);
	} else if (action == 'vetoed') {
		Game.failedGovernment(data.forced, 'Election vetoed');
	} else if (action == 'veto overridden') {
		Policies.vetoOverridden(data);
	} else {
		if (data.canVeto) {
			State.canVeto = true;
		}
		if (action == 'peeked') {
			Policies.returnPreviewed();
		} else {
			var target = Players.get(data.uid);
			if (action == 'investigated') {
				target.investigated = true;
				if (State.isLocalPresident()) {
					Players.displayAvatar(target, data.secret.party);
				}
				Chat.addMessage({msg: 'investigated ' + target.name, uid: State.presidentElect});
			} else if (action == 'special election') {
				State.specialPresidentIndex = target.index;
			} else if (action == 'killed') {
				Players.kill(target, data.hitler, false);
			}
		}
		Cards.show(null);
		Game.advanceTurn();
	}
	if (data.roles) {
		Players.revealRoles(data.roles);
	}
};

var processHistory = function(history) {
	history.forEach(function(action) {
		processAction(action, true);
	});
};

//SOCKET

Socket.on('game action', processAction);

//PUBLIC

module.exports = {

	history: processHistory,

};
