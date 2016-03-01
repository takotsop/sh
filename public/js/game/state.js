var CommonGame = require('common/game');

//PUBLIC

module.exports = {

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

	canVeto: function() {
		return this.enactedFascist >= CommonGame.FASCIST_POLICIES_REQUIRED - 1; //(TESTING ? 1 : CommonGame.FASCIST_POLICIES_REQUIRED - 1); //SAMPLE
	},

	localRole: function() {
		return this.localAllegiance == 0 ? 'Liberal' : (this.localAllegiance == 1 ? 'Fascist' : 'Hitler');
	},

	localParty: function() {
		return this.localAllegiance > 0 ? 'Fascist' : 'Liberal';
	},

};
