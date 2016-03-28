'use strict';

var $ = require('jquery');

var CommonConsts = require('common/constants');

var App = require('ui/app');
var Cards = require('ui/cards');
var Chat = require('ui/chat');

var Util = require('util/util');

var State = require('game/state');

//LOCAL

var enactPolicy = function(type) {
	var enacted;
	if (type == CommonConsts.LIBERAL) {
		enacted = ++State.enactedLiberal;
		if (State.enactedLiberal >= CommonConsts.LIBERAL_POLICIES_REQUIRED) {
			require('game/game').end(true, 'policies');
		}
	} else {
		enacted = ++State.enactedFascist;
		if (State.enactedFascist >= CommonConsts.FASCIST_POLICIES_REQUIRED) {
			require('game/game').end(false, 'policies');
		}
	}
	var slot = $('#board-'+type+' .policy-placeholder').eq(enacted - 1);
	slot.html('<div class="policy image '+type+'"></div');

	if (!State.rewinding && type == CommonConsts.FASCIST && State.enactedFascist == 3) {
		//TODO inline alerts
		window.alert('The third Fascist policy has been enacted D:\n\nFrom now on, if Hitler is voted in as Chancellor, the Fascists win!');
	}

	return slot.data('power');
};

var updatePolicyChoices = function(policies) {
	$('#cards-policy .card').each(function(index, card) {
		var policyType = policies[index];
		var hasPolicy = policyType != null;
		$(this).toggle(hasPolicy);
		if (hasPolicy) {
			$(this).toggleClass(CommonConsts.LIBERAL, policyType == CommonConsts.LIBERAL);
			$(this).toggleClass(CommonConsts.FASCIST, policyType == CommonConsts.FASCIST);
		}
	});
};

var policyDiscarded = function(data) {
	var directive, cards;
	if (State.isLocalChancellor()) {
		updatePolicyChoices(data.secret.policies);
		directive = 'Select a policy to <strong>enact</strong>';
		if (State.canVeto) {
			directive += ', or request a <strong>veto</strong>';
		}
		cards = 'policy';
	} else {
		var chancellor = State.getChancellor();
		directive = 'Chancellor ' + Util.nameSpan(chancellor) + ' to enact a policy';
		cards = null;
	}
	Chat.setDirective(directive);
	Cards.show(cards);
	discardPolicyCards(1);
};

var policyEnacted = function(data) {
	var Game = require('game/game');

	discardPolicyCards(1);

	Cards.show(null);
	State.chatDisabled = false;
	Game.resetElectionTracker();

	var policyType = data.policy;
	Chat.addAction('President ' + Util.nameSpan(State.getPresident()) + ' and Chancellor ' + Util.nameSpan(State.getChancellor()) + ' enacted <strong class="player-name '+policyType+' danger">' + policyType + '</strong> policy');

	var fascistPower = enactPolicy(policyType);
	if (State.gameOver) {
		return;
	}
	checkRemainingPolicies();

	if (fascistPower) {
		State.presidentPower = fascistPower;
		if (fascistPower.indexOf('peek') > -1) {
			previewPolicies(data.secret);
		} else {
			var directive;
			if (fascistPower.indexOf('investigate') > -1) {
				if (State.isLocalPresident()) {
					directive = 'Choose a player to investigate their party';
				} else {
					directive = 'President ' + Util.nameSpan(State.getPresident()) + ' to investigate a player';
				}
			} else if (fascistPower.indexOf('election') > -1) {
				if (State.isLocalPresident()) {
					directive = 'Select a special election presidential candidate';
				} else {
					directive = 'President ' + Util.nameSpan(State.getPresident()) + ' to select the special election candidate';
				}
			} else if (fascistPower.indexOf('bullet') > -1) {
				if (State.isLocalPresident()) {
					directive = 'Choose a player to kill';
				} else {
					directive = 'President ' + Util.nameSpan(State.getPresident()) + ' to kill a player';
				}
			}
			Chat.setDirective(directive);
			App.enablePlayerSelection(fascistPower);
		}
	} else {
		Game.advanceTurn();
	}
};

//VETO

var vetoRequest = function(data) {
	var directive, cards;
	var chancellor = State.getChancellor();
	if (State.isLocalPresident()) {
		directive = 'Confirm or override Chancellor ' + Util.nameSpan(chancellor) + '\'s veto request';
		cards = 'veto';
	} else {
		if (State.isLocalChancellor()) {
			var president = State.getPresident();
			directive = 'Awaiting confirmation from President ' + Util.nameSpan(president.name);
		} else {
			directive = 'Chancellor ' + Util.nameSpan(chancellor.name) + ' is requesting a veto, awaiting confirmation';
		}
		cards = null;
	}
	Chat.setDirective(directive);
	Cards.show(cards);
};

var vetoOverridden = function(data) {
	Chat.setDirective('Veto overridden, enacting by force');
	policyEnacted(data);
};

//SELECTION

var previewPolicies = function(secret) {
	drawPolicyCards(3);

	var cards, directive;
	if (State.isLocalPresident()) {
		updatePolicyChoices(secret.peek);
		cards = 'policy';
		directive = 'Peek at the next 3 policies. Click one to continue';
	} else {
		var president = State.getPresident();
		directive = 'President ' + Util.nameSpan(president) + ' to peek at the next 3 policies';
	}
	Chat.setDirective(directive);
	Cards.show(cards);
};

var shufflePolicyCards = function() {
	var deckSize = 17 - State.enactedFascist - State.enactedLiberal;
	$('#pile-draw .pile-cards').show().text(deckSize);
	$('#pile-discard .pile-cards').hide().text('0');
};

var checkRemainingPolicies = function() {
	var remainingPolicies = parseInt($('#pile-draw .pile-cards').text());
	if (remainingPolicies < 3) {
		shufflePolicyCards();
	}
};

var drawPolicyCards = function(count) {
	var startCount = parseInt($('#pile-draw .pile-cards').text());
	$('#pile-draw .pile-cards').show().text(startCount - count);
};

var discardPolicyCards = function(count) {
	var startCount = parseInt($('#pile-discard .pile-cards').text());
	$('#pile-discard .pile-cards').show().text(startCount + count);
};

//PUBLIC

module.exports = {

	shuffle: shufflePolicyCards,

	enact: enactPolicy,

	enacted: policyEnacted,

	updateChoices: updatePolicyChoices,

	discarded: policyDiscarded,

	vetoRequest: vetoRequest,

	returnPreviewed: function() {
		drawPolicyCards(-3);
	},

	draw: drawPolicyCards,

	vetoOverridden: vetoOverridden,

	checkRemaining: checkRemainingPolicies,

};
