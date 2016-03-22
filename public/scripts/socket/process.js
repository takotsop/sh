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
		if (action == 'peek') {
			Policies.returnPreviewed();
		} else {
			var target = Players.get(data.uid);
			if (action == 'investigate') {
				target.investigated = true;
				if (State.isLocalPresident()) {
					Players.displayAvatar(target, data.secret.party);
				}
				Chat.addAction('investigated ' + target.name, State.getPresident());
			} else if (action == 'special election') {
				State.specialPresidentIndex = target.index;
			} else if (action == 'bullet') {
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

Socket.on('action error', function(data) {
	window.alert('Unable to perform that last action: ' + data + '. Please try reloading the page and trying again.\n\nOtherwise, your game may be an in state where you can\'t continue. If so, please file a bug with the relevant information so I can get it fixed! You can do so via the "FEEDBACK" button in the game\'s menu. Thank you!');
});

//PUBLIC

module.exports = {

	history: processHistory,

};
