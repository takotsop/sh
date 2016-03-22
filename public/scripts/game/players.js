'use strict';

require('styles/game/players');

var $ = require('jquery');

var CommonConsts = require('common/constants');

var App = require('ui/app');
var Cards = require('ui/cards');
var Chat = require('ui/chat');

var Action = require('socket/action');

var State = require('game/state');

//HELPERS

var getPlayer = function(uid) {
	for (var pidx in State.players) {
		var player = State.players[pidx];
		if (player.uid == uid) {
			return player;
		}
	}
	console.error('Unable to find player', uid);
};

var allegianceClass = function(allegiance) {
	var ac;
	if (allegiance == 0) {
		ac = CommonConsts.LIBERAL;
	} else {
		ac = CommonConsts.FASCIST;
		if (allegiance >= 2) {
			ac += ' hitler';
		}
	}
	return ac;
};

var displayAvatar = function(player, allegiance) {
	var allegianceClassName = allegianceClass(allegiance);
	player.allegiance = allegianceClassName;
	App.playerDiv(player, '.avatar').addClass(allegianceClassName);
};

var killPlayer = function(player, isFuehrer, quit) {
	if (!player.killed) {
		player.killed = true;
		App.playerDiv(player).removeClass('choose');
		App.playerDiv(player).addClass(State.gameOver ? 'quit' : 'killed');
		State.currentCount -= 1;

		if (!State.gameOver) {
			var Game = require('game/game');
			if (isFuehrer) {
				Game.end(true, quit ? 'hitler quit' : 'hitler');
			} else if (State.currentCount <= 2) {
				if (State.playerCount <= 3) {
					Game.end(false, quit ? 'quit' : 'killed');
				} else {
					Game.end(null, 'remaining');
				}
			}
		}
	}
};

var abandonedPlayer = function(data) {
	var player = getPlayer(data.uid);
	killPlayer(player, data.hitler, true);
	Chat.addAction(player, 'left the game');

	if (data.advance) {
		require('game/game').advanceTurn();
	}
};

//EVENTS

$('#players').on('click', '.player-slot.choose', function() {
	var targetUid = $(this).data('uid');
	if (State.presidentPower) {
		Action.emit(State.presidentPower, {uid: targetUid});
	} else {
		Action.emit('chancellor', {uid: targetUid});
	}
});

var chancellorChosen = function(data) {
	State.initializedPlay = true;
	$('.vote').hide();

	var president = getPlayer(data.president);
	var chancellor = getPlayer(data.chancellor);
	State.chancellorIndex = chancellor.index;

	$('.player-slot').removeClass('choose').removeClass('elect');
	App.playerDiv(president).addClass('elect');
	App.playerDiv(chancellor).addClass('elect');

	var directive, cards;
	if (State.localPlayer.killed) {
		directive = 'Waiting for vote';
		cards = null;
	} else {
		directive = 'Vote';
		cards = 'vote';
	}
	Chat.setDirective(directive + ' on President <strong>'+president.name+'</strong> and Chancellor <strong>'+chancellor.name+'</strong>');
	Cards.show(cards);
};

//PUBLIC

module.exports = {

	get: getPlayer,

	displayAvatar: displayAvatar,

	allegianceClass: allegianceClass,

	chancellorChosen: chancellorChosen,

	kill: killPlayer,

	abandoned: abandonedPlayer,

	revealRoles: function(roles) {
		roles.forEach(function(allegiance, index) {
			displayAvatar(State.players[index], allegiance);
		});
	},

};
