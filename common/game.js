module.exports = {

	getFascistPower: function(enactedFascist, gameSize) {
		if (enactedFascist == 1) {
			// return 'bullet'; //SAMPLE
			return gameSize >= 9 ? 'investigate' : null;
		}
		if (enactedFascist == 2) {
			return gameSize >= 7 ? 'investigate' : null;
		}
		if (enactedFascist == 3) {
			return gameSize >= 7 ? 'election' : 'peek';
		}
		if (enactedFascist == 4) {
			return gameSize != 4 ? 'bullet' : null;
		}
		if (enactedFascist == 5) {
			return gameSize >= 4 ? 'bullet veto' : null;
		}
	},

	getNextPresident: function(gameSize, players, startIndex, playerState) {
		for (var attempts = 0; attempts < gameSize; ++attempts) {
			++startIndex;
			if (startIndex >= gameSize) {
				startIndex = 0;
			}
			var player = players[startIndex];
			if (playerState) {
				player = playerState[player];
			}
			if (!player.killed) {
				break;
			}
		}
		return startIndex;
	},

};
