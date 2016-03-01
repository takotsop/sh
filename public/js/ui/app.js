var Data = require('util/data');

var State = require('game/state');

//LOCAL

var uidDiv = function(uid, query) {
	return $('#ps'+uid + (query ? ' '+query :''));
};

var localDiv = function(query) {
	return uidDiv(Data.uid, query);
};

var playerDiv = function(player, query) {
	return uidDiv(player.uid, query);
};

var enablePlayerSelection = function(purpose) {
	var localPresident = State.isLocalPresident();
	$('#players .player-slot:not(.killed)').toggleClass('choose', localPresident);

	if (localPresident) {
		localDiv().removeClass('choose');
		if (purpose == 'election') {
			if (State.playerCount > 5) {
				uidDiv(State.presidentElect).removeClass('choose');
			}
			uidDiv(State.chancellorElect).removeClass('choose');
		} else if (purpose == 'investigate') {
			State.players.forEach(function(player) {
				if (player.investigated) {
					playerDiv(player).removeClass('choose');
				}
			});
		} else if (purpose == 'bullet') {
			State.players.forEach(function(player) {
				if (player.killed) {
					playerDiv(player).removeClass('choose');
				}
			});
		}
	}
};

//PUBLIC

module.exports = {

	showSection: function(section) {
		$('body > section').hide();
		$('#s-' + section).show();
	},

	uidDiv: uidDiv,

	playerDiv: playerDiv,

	dataDiv: function(data, query) {
		return playerDiv(data.uid, query);
	},

	enablePlayerSelection: enablePlayerSelection,

};
