var Data = require('util/data');

var Cards = require('game/cards');
var Chat = require('game/chat');
var Game = require('game/game');
var Overlay = require('game/overlay');
var Players = require('game/players');
var Policies = require('game/policies');
var Process = require('game/process');
var State = require('game/state');

var App = require('ui/app');

//LOCAL

var getFascistPowers = function() {
	var fascistPowers = ['', '', '', '', '', ''];
	if (State.playerCount >= 7) {
		if (State.playerCount >= 9) {
			fascistPowers[0] = 'investigate';
		}
		fascistPowers[1] = 'investigate';
		fascistPowers[2] = 'election';
	} else {
		fascistPowers[2] = 'peek';
	}
	if (State.playerCount >= 4) {
		if (State.playerCount >= 5) {
			fascistPowers[3] = 'bullet';
		}
		fascistPowers[4] = State.playerCount >= 5 ? 'bullet veto' : 'veto';
	} else {
		fascistPowers[3] = 'bullet';
	}
	// fascistPowers[0] = 'bullet'; //SAMPLE
	return fascistPowers;
};

var startGame = function(data) {
	gameId = data.gid;
	App.showSection('game');

	State.initializedPlay = false;
	State.gameOver = false;
	State.positionIndex = data.startIndex;
	State.presidentIndex = State.positionIndex;
	State.chancellorIndex = null;
	State.players = data.players;
	State.playerCount = State.players.length;
	State.currentCount = State.playerCount;
	State.chatDisabled = false;

	// Election tracker
	State.presidentPower = null;
	State.specialPresidentIndex = null;
	State.presidentElect = 0;
	State.chancellorElect = 0;
	State.electionTracker = -1;
	Game.advanceElectionTracker();

	// Policy deck
	State.enactedFascist = 0;
	State.enactedLiberal = 0;
	Policies.shuffle();

	var fascistPlaceholders = $('#board-fascist .policy-placeholder');
	getFascistPowers().forEach(function(power, index) {
		var placeholder = fascistPlaceholders.eq(index);
		var description = '';
		if (power == 'peek') {
			description = 'President checks the top 3 policy cards';
		} else if (power == 'investigate') {
			description = 'President investigates a player\'s identity card';
		} else if (power == 'election') {
			description = 'President chooses the next presidential candidate';
		} else if (power.indexOf('bullet') > -1) {
			description = 'President kills a player';
		}
		if (power.indexOf('veto') > -1) {
			description = 'Veto power unlocked<br><br>' + description;
		}
		placeholder.data('power', power);
		placeholder.html('<div class="detail">' + description + '</div>');
	});

	// Display players
	var playerString = '<div class="player-section">';
	var centerIndex = Math.ceil(State.playerCount / 2);

	var floatIndex = 0;
	State.players.forEach(function(player, pidx) {
		player.index = pidx;

		var centerBreak = pidx == centerIndex;
		if (centerBreak) {
			playerString += '</div><div class="player-section bottom">';
		}
		var floatingLeft = floatIndex % 2 == 0;
		var floatClass = floatingLeft ? 'left' : 'right';
		if (centerBreak) {
			var evenRemaining = ((State.playerCount - pidx) % 2) == 0;
			if (floatingLeft) {
				if (!evenRemaining) {
					floatClass = 'right clear';
					++floatIndex;
				}
			} else {
				if (evenRemaining) {
					floatClass = 'left';
					++floatIndex;
				} else {
					floatClass += ' clear';
				}
			}
		}
		if (player.uid == Data.uid) {
			State.localPlayer = player;
			State.localIndex = pidx;
			floatClass += ' local';
		}
		playerString += '<div id="ps'+player.uid+'" class="player-slot '+floatClass+'" data-uid="'+player.uid+'"><div class="avatar image"><div class="vote" style="display:none;"></div></div><div class="contents"><div class="details"><h2>'+player.name+' ['+(pidx+1)+']</h2><span class="typing icon" style="display:none;">💬</span><span class="talking icon" style="display:none;">🎙</span></div><div class="chat"></div></div></div>';
		++floatIndex;
	});
	playerString += '</div>';

	$('#players').html(playerString);

	// Local player
	if (State.localPlayer) {
		State.localAllegiance = State.localPlayer.allegiance;
		$('#card-role .label').text(State.localRole());
		$('#card-party .label').text(State.localParty());
	} else {
		console.error('Local player not found');
	}

	State.players.forEach(function(player, pidx) {
		if (player.allegiance != null) {
			Players.displayAvatar(player, player.allegiance);
		}
	});

	Process.history(data.history);

	if (!State.initializedPlay) {
		Overlay.show('start');
		Game.playTurn();
		Cards.show('role');
	}
};

//PUBLIC

module.exports = {

	play: startGame,

};
