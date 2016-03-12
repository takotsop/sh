'use strict';

module.exports = {

	getFascistPower: function(enactedFascist, gameSize) {
		if (enactedFascist == 1) {
			// return 'investigate'; //SAMPLE
			return gameSize >= 9 ? 'investigate' : null;
		}
		if (enactedFascist == 2) {
			return gameSize >= 7 ? 'investigate' : null;
		}
		if (enactedFascist == 3) {
			return gameSize >= 7 ? 'special election' : 'peek';
		}
		if (enactedFascist == 4) {
			return gameSize != 4 ? 'bullet' : null;
		}
		if (enactedFascist == 5) {
			return gameSize >= 4 ? 'bullet veto' : null;
		}
	},

	getNextPresident: function(gameSize, players, startIndex, playersState) {
		for (var attempts = 0; attempts < gameSize; ++attempts) {
			++startIndex;
			if (startIndex >= gameSize) {
				startIndex = 0;
			}
			var player = players[startIndex];
			if (playersState) {
				player = playersState[player];
			}
			if (!player.killed) {
				break;
			}
		}
		return startIndex;
	},

};
