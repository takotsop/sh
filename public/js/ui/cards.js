var Action = require('socket/action');

var State = require('game/state');

//LOCAL

var hideCards = function(hideName) {
	$('#cards-'+hideName).hide();
};

var showCards = function(showName) {
	$('#player-cards > *').hide();
	$('#cards-'+showName).show();

	if (showName == 'vote') {
		$('#cards-vote .card').removeClass('selected');
	} else if (showName == 'policy') {
		$('#veto-request').toggle(State.canVeto && State.isLocalChancellor());
	}
};

//EVENTS

$('#cards-vote').on('click', '.card', function() {
	$('#cards-vote .card').removeClass('selected');
	$(this).addClass('selected');

	Action.emit('vote', {up: this.id == 'card-ja'});
});

$('#cards-policy').on('click', '.card', function() {
	if (State.presidentPower && State.presidentPower.indexOf('peek') > -1) {
		Action.emit(State.presidentPower);
	} else {
		var data = {};
		if ($(this).data('veto')) {
			data.veto = $(this).data('veto') == true;
		} else {
			data.policyIndex = $(this).data('index');
		}
		Action.emit('policy', data);
	}
});

$('#cards-veto').on('click', '.card', function() {
	Action.emit('policy', {veto: $(this).data('veto') == true});
});

//PUBLIC

module.exports = {

	hide: hideCards,

	show: showCards,

};
