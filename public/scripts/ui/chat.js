'use strict';

require('styles/ui/chat');

var $ = require('jquery');

var SimpleWebRTC = require('simplewebrtc');

var Data = require('util/data');
var Util = require('util/util');

var App = require('ui/app');

var Socket = require('socket/socket');

var State = require('game/state');

//LOCAL

var inputState;
var webrtc;

var supportsVoiceChat = function() {
	return window.RTCPeerConnection != null || window.mozRTCPeerConnection != null || window.webkitRTCPeerConnection != null;
};

//MESSAGES

var setDirective = function(directive) {
	$('#s-game').toggleClass('directive', directive != null);
	$('#directive').html(directive);
};

var insertMessage = function(player, message, isAction) {
	var prefix;
	if (player) {
		App.playerDiv(player, '.chat').html(message);

		var roleClass = player.roleClass || 'unknown';
		if (isAction) {
			prefix = '<p class="detail player-name '+roleClass+' danger">' + Util.nameSpan(player) + ' ';
		} else {
			prefix = '<p><strong class="player-name '+roleClass+' danger">' + player.name + ':</strong> ';
		}
	} else {
		prefix = '<p class="detail unknown">';
	}

	var messageHtml = prefix + message + '</p>';
	var chatId = State.started ? 'game' : 'lobby';
	var chatContainer = $('#chat-container-' + chatId);
	chatContainer.append(messageHtml);

	chatContainer.scrollTop(chatContainer.prop('scrollHeight'));
};

var addChatMessage = function(data) {
	var player = require('game/players').get(data.uid);
	if (player) {
		insertMessage(player, data.msg, false);
	}
};

var addChatAction = function(message, player) {
	insertMessage(player, message, true);
};

var setChatState = function(state) {
	if (inputState !== state) {
		inputState = state;
		Socket.emit('typing', {on: inputState});
	}
};

//EVENTS

$('#i-chat').on('input', function(event) {
	setChatState(this.value.trim().length > 0);
});

$('#i-chat').on('keydown', function(event) {
	var key = event.which || event.keyCode || event.charCode;
	if (key == 13) {
		var simplified = $(this.value).text().trim();
		if (simplified.length > 1) {
			require('socket/action').emit('chat', {msg: simplified});
			this.value = '';
			setChatState(false);
		}
	}
});

Socket.on('typing', function(data) {
	App.playerDiv(data, '.typing').toggle(data.on);
});

//BUTTONS

$('#voice-button').on('click', function() {
	if (!supportsVoiceChat()) {
		window.alert('Sorry, voice chat is not available through this browser. Please try using another, such as Google Chrome, if you\'d like to play with voice chat.');
		return;
	}
	if (webrtc) {
		$(this).toggleClass('muted');
		if ($(this).hasClass('muted')) {
			webrtc.mute();
		} else {
			webrtc.unmute();
		}
		return;
	}

	var voiceChatRequested = window.confirm('Would you like to enable voice chat? This requires you to approve microphone access, which allows you to talk with the other players in your game.\n\nThis feature is in beta, and is only supported in some browsers. Please report any issues you have with it. Thanks!');
	if (voiceChatRequested) {
		webrtc = new SimpleWebRTC({
			// url: '',
			autoRequestMedia: true,
			enableDataChannels: true,
			detectSpeakingEvents: true,
			media: {
				audio: true,
				video: false
			},
			nick: Data.uid,
		});

		webrtc.on('readyToCall', function() {
			webrtc.joinRoom('s-h-'+Data.gameId);
		});

		webrtc.on('remoteVolumeChange', function(peer, volume) {
			App.uidDiv(peer.nick, '.talking').toggle(volume > -50);
		});
	}
});

$('#menu-button').on('click', function() {
	if (Util.hidden('#overlay')) {
		require('ui/overlay').show('menu');
	} else {
		require('ui/overlay').hide();
	}
});

//PUBLIC

module.exports = {

	toggle: function(show) {
		$('#chat-box').toggle(show);
	},

	setDirective: setDirective,

	addMessage: addChatMessage,

	addAction: addChatAction,

	// Voice

	supportsVoice: supportsVoiceChat,

	voiceDisconnect: function() {
		if (webrtc) {
			webrtc.disconnect();
		}
	},

};
