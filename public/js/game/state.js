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

	localRole: function() {
		return this.localAllegiance == 0 ? 'Liberal' : (this.localAllegiance == 1 ? 'Fascist' : 'Hitler');
	},

	localParty: function() {
		return this.localAllegiance > 0 ? 'Fascist' : 'Liberal';
	},

};
