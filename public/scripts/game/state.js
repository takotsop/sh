'use strict';

var CommonGame = require('common/game');

module.exports = {

	finished: true,

	getPresident: function() {
		return this.players[this.presidentIndex];
	},

	getChancellor: function() {
		return this.players[this.chancellorIndex];
	},

	isLocalPresident: function() {
		return this.presidentIndex == this.localIndex;
	},

	isLocalChancellor: function() {
		return this.chancellorIndex == this.localIndex;
	},

	localRoleName: function() {
		return CommonGame.isLiberal(this.localRole) ? 'Liberal' : (CommonGame.isFuehrer(this.localRole) ? 'Hitler' : 'Fascist');
	},

	localPartyName: function() {
		return CommonGame.isLiberal(this.localRole) ? 'Liberal' : 'Fascist';
	},

	isLocal: function(player) {
		return this.localPlayer.uid == player.uid;
	},

};
