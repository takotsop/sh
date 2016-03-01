/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);

	__webpack_require__(21);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Data = __webpack_require__(2);

	var Socket = __webpack_require__(3);

	var Lobby = __webpack_require__(6);
	var Welcome = __webpack_require__(18);

	//SOCKET

	Socket.on('connect', function(data) {
		if (!Data.uid || !Data.auth) {
			Welcome.showSignin();
		}
	});

	Socket.on('auth', function(data) {
		Data.username = data.name;

		if (data.invalid) {
			Welcome.showSignin();
		} else {
			Lobby.show();
		}
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {

		uid: localStorage.getItem('uid'),

		auth: localStorage.getItem('auth'),

		username: null,

		// CONSTANTS

		FASCIST_POLICIES_REQUIRED: 6,

		LIBERAL_POLICIES_REQUIRED: 5,

		LIBERAL: 'liberal',

		FASCIST: 'fascist',

		NONE: 'none',

	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var IO = __webpack_require__(4);

	var Config = __webpack_require__(5);
	var Data = __webpack_require__(2);

	//LOCAL

	var params;
	if (Data.uid && Data.auth) {
		params = {query: 'uid=' + Data.uid + '&auth=' + Data.auth};
	}

	var socket = IO(Config.TESTING ? 'http://localhost:8004' : 'https://secrethitler.online', params);

	//PUBLIC

	module.exports = socket;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = io;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = {

		TESTING: document.location.hostname == 'localhost',

	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Config = __webpack_require__(5);
	var Util = __webpack_require__(7);

	var Chat = __webpack_require__(8);

	var App = __webpack_require__(10);

	var Action = __webpack_require__(14);
	var Socket = __webpack_require__(3);

	var Welcome = __webpack_require__(18);

	var Start = __webpack_require__(19);

	//LOCAL

	var countdownInterval, startTime;

	var clearCountdown = function() {
		if (countdownInterval) {
			clearTimeout(countdownInterval);
			countdownInterval = null;
		}
	};

	var updateCountdown = function() {
		var secondsRemaining = startTime - Util.timestamp();
		if (secondsRemaining < 0) {
			clearCountdown();
		} else {
			$('#lobby-countdown').text('waiting ' + secondsRemaining + ' seconds...');
		}
	};

	var updateLobby = function(data) {
		if (data.started) {
			Start.play(data);
			return;
		}
		showLobbySection('wait');

		clearCountdown();

		var lobbyPlayerCount = data.players.length;
		startTime = data.startTime;
		if (startTime) {
			updateCountdown();
			countdownInterval = setInterval(updateCountdown, 1000);
		} else {
			var playersNeeded = 5 - lobbyPlayerCount;
			$('#lobby-countdown').text(playersNeeded + ' more...');
		}

		$('#lobby-player-summary').text(lobbyPlayerCount + ' of ' + data.maxSize);
		var nameList = '';
		data.players.forEach(function(player, index) {
			floatClass = index % 2 == 0 ? 'left' : 'right';
			nameList += '<div class="player-slot '+floatClass+'"><h2>' + player.name + '</h2></div>';
		});
		$('#lobby-players').html(nameList);

		var privateGame = data.private == true;
		$('#lobby-privacy').toggle(privateGame);
		if (privateGame) {
			$('#lobby-private-code').text(data.gid);
		}
	};

	var showLobbySection = function(subsection) {
		$('#s-lobby > *').hide();
		$('#lobby-'+subsection).show();
	};

	var connectToLobby = function() {
		showLobbySection('start');

		Socket.emit('lobby join');
	};

	var showLobby = function() {
		gameOver = true;
		Chat.voiceDisconnect();
		App.showSection('lobby');
		connectToLobby();
	};

	var quitGame = function() {
		Action.emit('quit');
		showLobby();
	};

	//EVENTS

	$('.lobby-leave').on('click', connectToLobby);

	$('#lobby-button-quick-play').on('click', function() {
		showLobbySection('');
		Socket.emit('room quickjoin', null, function(response) {
			showLobbySection(response.success ? 'wait' : 'start');
		});
	});

	$('#lobby-button-create').on('click', function() {
		showLobbySection('create');
	});

	$('#lobby-button-join-private').on('click', function() {
		showLobbySection('join-private');
	});

	$('#lobby-button-signout').on('click', function() {
		var confirmed = window.confirm('Are you sure you want to sign out of your account?');
		if (confirmed) {
			Welcome.hideSplash();
			Welcome.showSignin();
		}
	});

	$('#lobby-create-confirm').on('click', function() {
		var createData = {
			size: $('#create-game-size').val(),
			private: $('#create-game-privacy').prop('checked'),
		};
		Socket.emit('room create', createData, function(response) {
			showLobbySection(response.success ? 'wait' : 'start');
		});
	});

	$('#lobby-submit-private').on('click', function() {
		var gid = $('#join-private-code').val();
		if (!gid) {
			window.alert('Please enter a valid private game code');
			return;
		}

		$('#join-private-code').val('');
		showLobbySection('');
		Socket.emit('room join private', {gid: gid}, function(response) {
			if (response.error) {
				window.alert('Unable to join game: ' + response.error);
			}
			showLobbySection(response.success ? 'wait' : 'join-private');
		});
	});

	//SOCKET

	Socket.on('lobby game data', updateLobby);

	window.onbeforeunload = function() {
		if (!Config.TESTING && !gameOver) {
			return "You WILL NOT be removed from the game. If you'd like to leave permanently, please quit from the menu first so your fellow players know you will not return. Thank you!";
		}
	};

	//PUBLIC

	module.exports = {

		show: showLobby,

		quitToLobby: quitGame,

	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {

		timestamp: function() {
			return Math.round(Date.now() * 0.001);
		},

	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var SimpleWebRTC = __webpack_require__(9);

	var Data = __webpack_require__(2);

	var App = __webpack_require__(10);

	var Socket = __webpack_require__(3);

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

	var addChatMessage = function(data) {
		var Players = __webpack_require__(12);
		var message = data.msg;
		var name = Players.get(data.uid).name;
		App.dataDiv(data, '.chat').text(message);
		$('#overlay-chat').append('<p><strong>' + name + ': </strong>' + message + '</p>');
	};

	var setChatState = function(state) {
		if (inputState !== state) {
			inputState = state;
			Socket.emit('typing', {on: inputState});
		}
	};

	//EVENTS

	$('#i-chat').on('input', function(event) {
		setChatState(this.value.length > 0);
	});

	$('#i-chat').on('keydown', function(event) {
		var key = event.which || event.keyCode || event.charCode;
		if (key == 13 && this.value.length > 1) {
			__webpack_require__(14).emit('chat', {msg: this.value});
			this.value = '';
			setChatState(false);
		}
	});

	Socket.on('typing', function(data) {
		App.dataDiv(data, '.typing').toggle(data.on);
	});

	//BUTTONS

	$('#voice-button').on('click', function() {
		if (!supportsVoiceChat()) {
			alert('Sorry, voice chat is not available through this browser. Please try using another, such as Google Chrome, if you\'d like to play with voice chat.');
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
				webrtc.joinRoom('s-h-'+gameId);
			});

			webrtc.on('remoteVolumeChange', function(peer, volume) {
				App.uidDiv(peer.nick, '.talking').toggle(volume > -50);
			});
		}
	});

	$('#menu-button').on('click', function() {
		if ($('#overlay').css('display') == 'none') {
			__webpack_require__(16).show('menu');
		} else {
			__webpack_require__(16).hide();
		}
	});

	//PUBLIC

	module.exports = {

		setDirective: setDirective,

		addMessage: addChatMessage,

		// VOICE

		supportsVoice: supportsVoiceChat,

		voiceDisconnect: function() {
			if (webrtc) {
				webrtc.disconnect();
			}
		},

	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = SimpleWebRTC;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Data = __webpack_require__(2);

	var State = __webpack_require__(11);

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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Data = __webpack_require__(2);

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
			return this.enactedFascist >= Data. FASCIST_POLICIES_REQUIRED - 1; //(TESTING ? 1 : Data.FASCIST_POLICIES_REQUIRED - 1); //SAMPLE
		},

		localRole: function() {
			return this.localAllegiance == 0 ? 'Liberal' : (this.localAllegiance == 1 ? 'Fascist' : 'Hitler');
		},

		localParty: function() {
			return this.localAllegiance > 0 ? 'Fascist' : 'Liberal';
		},

	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Data = __webpack_require__(2);

	var App = __webpack_require__(10);
	var Cards = __webpack_require__(13);
	var Chat = __webpack_require__(8);

	var Action = __webpack_require__(14);

	var State = __webpack_require__(11);


	//HELPERS

	var getPlayer = function(uid) {
		for (var pidx in State.players) {
			var player = State.players[pidx];
			if (player.uid == uid) {
				return player;
			}
		}
	};

	var allegianceClass = function(allegiance) {
		var ac;
		if (allegiance == 0) {
			ac = Data.LIBERAL;
		} else {
			ac = Data.FASCIST;
			if (allegiance == 2) {
				ac += ' hitler';
			}
		}
		return ac;
	};

	var displayAvatar = function(player, allegiance) {
		App.playerDiv(player, '.avatar').addClass(allegianceClass(allegiance));
	};

	var killPlayer = function(player, hitler, quit) {
		if (!player.killed) {
			player.killed = true;
			$('.player-slot').removeClass('choose');
			App.playerDiv(player).addClass(State.gameOver ? 'left' : 'killed');
			State.currentCount -= 1;

			if (!State.gameOver) {
				var Game = __webpack_require__(15);
				if (hitler) {
					Game.end(true, quit ? 'hitler quit' : 'hitler');
				} else if (State.currentCount <= 2) {
					if (State.playerCount <= 3) {
						Game.end(false, quit ? 'quit' : 'killed');
					} else {
						Game.end(null, 'remaining');
					}
				}
			}
		}
	};

	var abandonedPlayer = function(data) {
		var player = getPlayer(data.uid);
		killPlayer(player, data.hitler, true);
		Chat.addMessage({msg: 'left the game', uid: data.uid});

		if (data.advance) {
			__webpack_require__(15).advanceTurn();
		}
	};

	//EVENTS

	$('#players').on('click', '.player-slot.choose', function() {
		var targetUid = $(this).data('uid');
		if (State.presidentPower) {
			Action.emit(State.presidentPower, {uid: targetUid});
		} else {
			Action.emit('chancellor', {uid: targetUid});
		}
	});

	var chancellorChosen = function(data) {
		State.initializedPlay = true;
		$('.vote').hide();

		var president = getPlayer(data.president);
		var chancellor = getPlayer(data.chancellor);
		State.chancellorIndex = chancellor.index;

		$('.player-slot').removeClass('choose').removeClass('elect');
		App.playerDiv(president).addClass('elect');
		App.playerDiv(chancellor).addClass('elect');

		var directive, cards;
		if (State.localPlayer.killed) {
			directive = 'Waiting for vote';
			cards = null;
		} else {
			directive = 'Vote';
			cards = 'vote';
		}
		Chat.setDirective(directive + ' on President <strong>'+president.name+'</strong> and Chancellor <strong>'+chancellor.name+'</strong>');
		Cards.show(cards);
	};

	//PUBLIC

	module.exports = {

		get: getPlayer,

		displayAvatar: displayAvatar,

		allegianceClass: allegianceClass,

		chancellorChosen: chancellorChosen,

		kill: killPlayer,

		abandoned: abandonedPlayer,

		revealRoles: function(roles) {
			roles.forEach(function(allegiance, index) {
				displayAvatar(State.players[index], allegiance);
			});
		},

	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Action = __webpack_require__(14);

	var State = __webpack_require__(11);

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
			$('#veto-request').toggle(State.isLocalChancellor() && State.canVeto());
		}
	};

	//EVENTS

	$('#cards-vote').on('click', '.card', function() {
		$('#cards-vote .card').removeClass('selected');
		$(this).addClass('selected');

		Action.emit('vote', {up: this.id == 'card-ja'});
	});

	$('#cards-policy').on('click', '.card', function() {
		if (State.presidentPower == 'peek') {
			Action.emit('peek');
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


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var Socket = __webpack_require__(3);

	//LOCAL

	var emitAction = function(action, data) {
		if (!data) {
			data = {};
		}
		data.action = action;
		Socket.emit('game action', data);
	};

	//PUBLIC

	module.exports = {

		emit: emitAction,

	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var App = __webpack_require__(10);
	var Cards = __webpack_require__(13);
	var Chat = __webpack_require__(8);
	var Overlay = __webpack_require__(16);

	var State = __webpack_require__(11);
	var Policies = __webpack_require__(17);

	//FINISH

	var endGame = function(liberalWin, winMethod) {
		if (!State.gameOver) {
			State.gameOver = true;
			Chat.setDirective('GAME OVER');
			Overlay.show('victory', {liberals: liberalWin, method: winMethod});
		}
	};

	//TURNS

	var playTurn = function() {
		$('.player-slot').removeClass('elect');

		var president = State.getPresident();
		App.playerDiv(president).addClass('elect');
		App.enablePlayerSelection('election');

		var directive;
		if (State.isLocalPresident()) {
			directive = 'Choose your Chancellor';
		} else {
			directive = 'Waiting for '+president.name+' to choose their chancellor';
		}
		Cards.show(null);
		Chat.setDirective(directive);
	};

	var advanceTurn = function() {
		if (State.gameOver) {
			return;
		}
		if (State.specialPresidentIndex) {
			State.presidentIndex = State.specialPresidentIndex;
			State.specialPresidentIndex = null;
		} else {
			for (var attempts = 0; attempts < State.playerCount; ++attempts) { //TODO common
				++State.positionIndex;
				if (State.positionIndex >= State.playerCount) {
					State.positionIndex = 0;
				}
				var player = State.players[State.positionIndex];
				if (!player.killed) {
					break;
				}
			}
			State.presidentIndex = State.positionIndex;
		}

		State.presidentPower = null;
		State.chancellorIndex = null;

		playTurn();
	};

	//VOTES

	var updateElectionTracker = function() {
		$('.tracker-slot').removeClass('selected');
		$('.tracker-slot').eq(State.electionTracker).addClass('selected');
	};

	var resetElectionTracker = function() {
		State.electionTracker = 0;
		updateElectionTracker();
	};

	var advanceElectionTracker = function(forcedPolicy) {
		if (forcedPolicy) {
			State.presidentElect = 0;
			State.chancellorElect = 0;
			State.electionTracker = 0;
			Policies.enact(forcedPolicy);
			Policies.draw(1);
			Policies.checkRemaining();
		} else {
			++State.electionTracker;
		}
		updateElectionTracker();
	};

	var failedGovernment = function(forced, explanation) {
		advanceElectionTracker(forced);
		var directive = explanation + ', ';
		if (State.electionTracker == 0) {
			directive += '3 failed elections enacts the top policy on the deck D:';
		} else if (State.electionTracker == 2) {
			directive += 'one more and the top policy on the deck will be enacted!';
		} else {
			directive += 'advancing the election tracker and passing on the presidency';
		}
		Chat.setDirective(directive);
		advanceTurn();
	};

	var voteCompleted = function(data) {
		var directive, cards = null;
		var voteDivs = $('.player-slot .vote');
		data.supporters.forEach(function(support, index) {
			voteDivs.eq(index).show().text(support ? 'Ja!' : 'Nein!');
		});

		if (data.hitler) {
			endGame(false, 'hitler');
		} else if (data.elected) {
			State.presidentElect = State.getPresident().uid;
			State.chancellorElect = State.getChancellor().uid;

			State.chatDisabled = true;
			Policies.draw(3);

			if (State.isLocalPresident()) {
				Policies.updateChoices(data.secret.policies);
				cards = 'policy';
				directive = 'Choose a policy to <strong>discard</strong>';
			} else {
				directive = 'Wait for the president to discard a policy';
			}
			Chat.setDirective(directive);
		} else {
			failedGovernment(data.forced, 'Election does not pass');
		}
		Cards.show(cards);
	};

	//PUBLIC

	module.exports = {

		end: endGame,

		advanceTurn: advanceTurn,

		playTurn: playTurn,

		failedGovernment: failedGovernment,

		voteCompleted: voteCompleted,

		advanceElectionTracker: advanceElectionTracker,

		resetElectionTracker: resetElectionTracker,

	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var Cards = __webpack_require__(13);

	var Socket = __webpack_require__(3);

	var Players = __webpack_require__(12);
	var State = __webpack_require__(11);

	//LOCAL

	var hideOverlay = function() {
		$('#game-mat').removeClass('overlay');
		$('#overlay').fadeOut();
		Cards.hide('role');
	};

	var showOverlaySection = function(name) {
		$('#overlay .toggle-section').hide();
		$('#overlay-' + name).show();
	};

	var showOverlay = function(type, data) {
		setTimeout(function() {
			$('#game-mat').addClass('overlay');
		}, 0);
		$('#overlay').fadeIn();
		var showInfo = type != 'menu' && type != 'feedback';
		showOverlaySection(showInfo ? 'info' : type);

		var inner = '';
		var extras = '';

		// Start
		if (type == 'start') {
			extras += '<div class="tip top">game status ⤴︎</div>';
			extras += '<div class="tip bottom">⤹ chat box</div>';
			extras += '<div class="tip bottom right">menu⤵︎</div>';

			inner += '<h2><em>welcome to...</em></h2><h1>Secret Hitler</h1>';
			inner += '<h3>Your secret role this game is: <strong>'+State.localRole()+'</strong></h3>';
			inner += '<div class="avatar image '+Players.allegianceClass(State.localAllegiance)+'"></div>';
			inner += '<p>';

			inner += 'Your objective is to ';
			if (State.localAllegiance == 0) {
				inner += 'work together with the other Liberals and pass 5 Liberal policies, or assassinate Hitler with one of the Fascist bullet policies.';
			} else if (State.localAllegiance == 1) {
				inner += 'work together with the other Fascists to enact 6 Fascist policies, or elect Hitler as Chancellor <strong>after the third</strong> Fascist policy has been enacted.';
			} else {
				inner += 'discover the other Fascists, working together to enact 6 Fascist policies, or get yourself elected Chancellor <strong>after the third</strong> Fascist policy has been enacted.<br>As Hitler, you\'ll want to keep yourself out of suspicion to avoid being assassinated.';
			}
			inner += '</p><h3>Good luck!</h3>';

		// Game over
		} else if (type == 'victory') {
			var liberalVictory = data.liberals;
			if (liberalVictory === null) {
				inner += '<h1>Game Abandoned</h1>';
				inner += '<h3>Sorry, too many players quit the game to continue :(</h3>';
			} else {
				var winName = liberalVictory ? 'Liberal' : 'Fascist';
				inner += '<h1>'+winName+'s win!</h1>';
				inner += '<h3>';
				if (data.method == 'policies') {
					var winCount = liberalVictory ? State.enactedLiberal : State.enactedFascist;
					inner += winName+' enacted '+winCount+' '+winName+' policies';
				} else if (data.method == 'hitler') {
					if (liberalVictory) {
						inner += 'The Liberals successfully found and killed Hitler';
					} else {
						inner += 'The Fascists successfully elected Hitler as Chancellor after the third Fascist policy';
					}
				} else if (data.method == 'hitler quit') {
					inner += 'The Liberals successfully scared Hitler out of his Thumb Bunker (quit the game)';
				} else if (State.playerCount <= 3) {
					if (data.method == 'killed') {
						inner += 'Hitler successfully killed one of the two Liberal players';
					} else if (data.method == 'quit') {
						inner += 'A Liberal quit the game, leaving too few players remaining :(';
					}
					inner += '</h3><h3>';
					inner += '(special win condition for 3 player)';
				}
				inner += '</h3><p><hr></p><button class="menu-feedback large">give feedback</button>';
			}
		}

		inner += '<button id="overlay-continue" class="large" data-type="'+type+'">continue</button>';
		$('#overlay .detail').html(inner);
		$('#overlay .extras').html(extras);
	};

	$('#overlay').on('click', '#overlay-continue', function() {
		var type = $(this).data('type');
		hideOverlay();
	});

	//MENU

	$('#menu-issues').on('click', function() {
		window.open('https://github.com/kylecoburn/secret-hitler/issues', '_blank');
	});

	$('#overlay').on('click', '.menu-feedback', function() {
		showOverlaySection('feedback');
	});

	$('#menu-about').on('click', function() {
		showOverlaySection('about');
	});

	$('#menu-quit').on('click', function() {
		var confirmed = true;
		if (!State.gameOver) {
			confirmed = window.confirm('Are you sure you want to abandon this game?', 'Your fellow players will be sad, and you\'ll lose points :(');
		}
		if (confirmed) {
			__webpack_require__(6).quitToLobby();
		}
	});

	$('#menu-cancel').on('click', function() {
		hideOverlay();
	});

	//FEEDBACK

	$('.menu-back').on('click', function() {
		showOverlaySection('menu');
	});

	$('#feedback-submit').on('click', function() {
		console.log(this);
		var type = $('#i-feedback-type').val();
		if (!type) {
			alert('Please select a type of feedback to report and try again!');
			return;
		}
		var body = $('#i-feedback-body').val();
		if (body.length < 6) {
			alert('Please enter some feedback into the text area!');
			return;
		}
		Socket.emit('feedback', {type: type, body: body}, function(response) {
			if (response) {
				$('#i-feedback-type').val('default');
				$('#i-feedback-body').val('');
				showOverlaySection('menu');
				alert('Thank you! Your feedback has been recorded.');
			}
		});
	});

	//PUBLIC

	module.exports = {

		hide: hideOverlay,

		show: showOverlay,

	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Data = __webpack_require__(2);

	var App = __webpack_require__(10);
	var Cards = __webpack_require__(13);
	var Chat = __webpack_require__(8);

	var State = __webpack_require__(11);

	//LOCAL

	var enactPolicy = function(type) {
		var enacted;
		if (type == Data.LIBERAL) {
			enacted = ++State.enactedLiberal;
			if (State.enactedLiberal >= Data.LIBERAL_POLICIES_REQUIRED) {
				__webpack_require__(15).end(true, 'policies');
			}
		} else {
			enacted = ++State.enactedFascist;
			if (State.enactedFascist >= Data.FASCIST_POLICIES_REQUIRED) {
				__webpack_require__(15).end(false, 'policies');
			}
		}
		var slot = $('#board-'+type+' .policy-placeholder').eq(enacted - 1);
		slot.html('<div class="policy image '+type+'"></div');

		return slot.data('power');
	};

	var updatePolicyChoices = function(policies) {
		$('#cards-policy .card').each(function(index, card) {
			var policyType = policies[index];
			var hasPolicy = policyType != null;
			$(this).toggle(hasPolicy);
			if (hasPolicy) {
				$(this).toggleClass(Data.LIBERAL, policyType == Data.LIBERAL);
				$(this).toggleClass(Data.FASCIST, policyType == Data.FASCIST);
			}
		});
	};

	var policyDiscarded = function(data) {
		var directive, cards;
		if (State.isLocalChancellor()) {
			updatePolicyChoices(data.secret.policies);
			directive = 'Select a policy to <strong>enact</strong>';
			if (State.canVeto()) {
				directive += ', or request a <strong>veto</strong>';
			}
			cards = 'policy';
		} else {
			directive = 'Wait for the Chancellor to enact a policy';
			cards = null;
		}
		Chat.setDirective(directive);
		Cards.show(cards);
		discardPolicyCards(1);
	};

	var policyEnacted = function(data) {
		var Game = __webpack_require__(15);

		discardPolicyCards(1);

		Cards.show(null);
		State.chatDisabled = false;
		Game.resetElectionTracker();
		var fascistPower = enactPolicy(data.policy);
		State.presidentPower = fascistPower;
		if (State.gameOver) {
			return;
		}
		checkRemainingPolicies();

		if (fascistPower) {
			if (fascistPower.indexOf('veto') > -1) {
				fascistPower = presidentPower.replace(' veto', '');
			}
			if (fascistPower == 'peek') {
				previewPolicies(data.secret);
			} else {
				var directive;
				if (fascistPower == 'investigate') {
					if (State.isLocalPresident()) {
						directive = 'Choose a player to investigate their allegiance';
					} else {
						directive = 'Wait for the president to investigate a player';
					}
				} else if (fascistPower == 'election') {
					if (State.isLocalPresident()) {
						directive = 'Choose a presidential candidate for the next election';
					} else {
						directive = 'Wait for the president to choose the next presidential candidate';
					}
				} else if (fascistPower == 'bullet') {
					if (State.isLocalPresident()) {
						directive = 'Choose a player to kill';
					} else {
						directive = 'Wait for the president to kill a player';
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
		if (State.isLocalPresident()) {
			directive = 'Confirm or override the Chancellor\'s veto request';
			cards = 'veto';
		} else {
			if (State.isLocalChancellor()) {
				var president = State.getChancellor();
				directive = 'Awaiting confirmation from President ' + president.name;
			} else {
				var chancellor = State.getChancellor();
				directive = 'Chancellor ' + chancellor.name + ' is requesting a veto, awaiting confirmation';
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
		drawPolicyCards(3, true);

		var cards, directive;
		if (State.isLocalPresident()) {
			updatePolicyChoices(secret.peek);
			cards = 'policy';
			directive = 'Peek at the next 3 policies. Click one to continue';
		} else {
			directive = 'Wait for the president to peek at the next 3 policies';
		}
		Chat.setDirective(directive);
		Cards.show(cards);
	};

	var shufflePolicyCards = function() {
		var deckSize = 17 - State.enactedFascist - State.enactedLiberal;
		$('#pile-draw .pile-cards').show().text(deckSize);
		$('#pile-discard .pile-cards').hide().text('0');
	};

	var checkRemainingPolicies = function(count, preview) {
		var remainingPolicies = parseInt($('#pile-draw .pile-cards').text());
		if (remainingPolicies < 3) {
			shufflePolicyCards();
		}
	};

	var drawPolicyCards = function(count, preview) {
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

		updateChoices: updatePolicyChoices,

		discarded: policyDiscarded,

		enacted: policyEnacted,

		returnPreviewed: function() {
			drawPolicyCards(-3, true);
		},

		draw: drawPolicyCards,

		vetoOverridden: vetoOverridden,

		checkRemaining: checkRemainingPolicies,

	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Config = __webpack_require__(5);
	var Data = __webpack_require__(2);

	var App = __webpack_require__(10);
	var Chat = __webpack_require__(8);

	var Socket = __webpack_require__(3);

	//LOCAL

	var submittedEmail;

	//PUBLIC

	var hideWelcomeSplash = function() {
		$('#welcome-splash').hide();
		$('#welcome-signin').show();
	};

	var showSignin = function() {
		Data.uid = null;
		Data.auth = null;
		localStorage.removeItem('uid');
		localStorage.removeItem('auth');

		App.showSection('welcome');

		$('#signin-start').show();
		$('#signin-confirm').hide();
		$('#signin-register').hide();

		$('#i-signin-email').focus();

		if (Config.TESTING && localStorage.getItem('manual') == null) {
			setTimeout(function() {
				$('#start-playing').click();
				$('#guest-login').click();
			}, 100);
		}

		$('#voice-unsupported').toggle(!Chat.supportsVoice());
	};

	var finishSignin = function(response) {
		$('.input-signin').blur();
		$('#welcome-signin').hide();

		Data.uid = response.id;
		Data.auth = response.auth_key;
		localStorage.setItem('uid', Data.uid);
		localStorage.setItem('auth', Data.auth);
	};

	//GUEST

	$('#guest-login').on('click', function() {
		Socket.emit('guest login', null, finishSignin);
	});

	//EMAIL

	var signinEmail = function(email) {
		$('.sd-signin').hide();
		Socket.emit('signin email', {email: email}, function(response) {
			submittedEmail = response.email;
			if (submittedEmail) {
				$('.signin-email-address').text(submittedEmail);
			}
			if (response.register) {
				$('#signin-register').show();
				$('#i-signin-name').focus();
			} else if (response.signin) {
				$('#signin-confirm').show();
				$('#i-signin-passkey').focus();
			} else {
				$('#signin-start').show();
				$('#i-signin-email').focus();
			}
		});
	};

	//PASSKEY

	var signinPasskey = function(passkey) {
		if (passkey.length == 6 && /^[0-9]+$/.test(passkey)) {
			$('.sd-signin').hide();
			Socket.emit('signin passkey', {email: submittedEmail, pass: passkey}, function(response) {
				if (response.error) {
					$('#signin-confirm').show();
					$('#i-signin-passkey').focus();
				} else {
					finishSignin(response);
				}
			});
		} else {
			console.log('Invalid: ' + passkey);
		}
	};

	//REGISTER

	var signinRegister = function(username) {
		var nameLength = username.length;
		if (nameLength >= 4 && nameLength <= 12 && /^[a-z0-9]+$/i.test(username)) {
			$('.sd-signin').hide();
			Socket.emit('signin name', {email: submittedEmail, name: username}, function(response) {
				if (response.error) {
					$('#signin-register').show();
					$('#i-signin-name').focus();
				} else {
					finishSignin(response);
				}
			});
		} else {
			console.log('Invalid: ' + username);
		}
	};

	//EVENTS

	$('#start-playing').on('click', function() {
		hideWelcomeSplash();
	});

	$('.signin-restart').on('click', function() {
		$('.sd-signin').hide();
		$('#signin-start').show();
		$('#i-signin-email').focus();
	});

	$('#signin-start-form').on('submit', function(event) {
		event.preventDefault();

		var submitted = $('#i-signin-email').val();
		signinEmail(submitted);
	});

	$('input.input-signin').on('keypress', function(event) {
		var keyPressed = event.which || event.keyCode;
		if (keyPressed != 13) {
			return true;
		}
		if (!$(this).hasClass('error')) {
			var submitted = this.value;
			if (this.id == 'i-signin-email') {
				signinEmail(submitted);
			} else if (this.id == 'i-signin-passkey') {
				signinPasskey(submitted);
			} else if (this.id == 'i-signin-name') {
				signinRegister(submitted);
			}
		}
		return false;
	});

	//PUBLIC

	module.exports = {

		hideSplash: hideWelcomeSplash,

		showSignin: showSignin,

	};



/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var CommonGame = __webpack_require__(20);

	var Data = __webpack_require__(2);

	var App = __webpack_require__(10);
	var Cards = __webpack_require__(13);
	var Chat = __webpack_require__(8);
	var Overlay = __webpack_require__(16);

	var Process = __webpack_require__(21);

	var Game = __webpack_require__(15);
	var Players = __webpack_require__(12);
	var Policies = __webpack_require__(17);
	var State = __webpack_require__(11);

	//LOCAL

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
		for (var index = 0; index < Data.FASCIST_POLICIES_REQUIRED; ++index) {
			var power = CommonGame.getFascistPower(index + 1, State.playerCount);
			if (!power) {
				continue;
			}
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
		}

		// Display players
		var playerString = '<div class="player-section">';
		var centerIndex = Math.ceil(State.playerCount / 2);

		var floatIndex = 0;
		State.players.forEach(function(player) {
			var playerIndex = player.index;

			var centerBreak = playerIndex == centerIndex;
			if (centerBreak) {
				playerString += '</div><div class="player-section bottom">';
			}
			var floatingLeft = floatIndex % 2 == 0;
			var floatClass = floatingLeft ? 'left' : 'right';
			if (centerBreak) {
				var evenRemaining = ((State.playerCount - playerIndex) % 2) == 0;
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
				State.localIndex = playerIndex;
				floatClass += ' local';
			}
			playerString += '<div id="ps'+player.uid+'" class="player-slot '+floatClass+'" data-uid="'+player.uid+'"><div class="avatar image"><div class="vote" style="display:none;"></div></div><div class="contents"><div class="details"><h2>'+player.name+' ['+(playerIndex+1)+']</h2><span class="typing icon" style="display:none;">💬</span><span class="talking icon" style="display:none;">🎙</span></div><div class="chat"></div></div></div>';
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

		State.players.forEach(function(player) {
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


/***/ },
/* 20 */
/***/ function(module, exports) {

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
				return gameSize >= 4 ? 'bullet' : null;
			}
		},

	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Socket = __webpack_require__(3);

	var Cards = __webpack_require__(13);
	var Chat = __webpack_require__(8);

	var Game = __webpack_require__(15);
	var Players = __webpack_require__(12);
	var Policies = __webpack_require__(17);
	var State = __webpack_require__(11);

	//LOCAL

	var processAction = function(data, fastForward) {
		var action = data.action;
		if (action == 'abandoned') {
			Players.abandoned(data);
		} else if (action == 'chat') {
			Chat.addMessage(data);
		} else if (action == 'chancellor chosen') {
			Players.chancellorChosen(data);
		} else if (action == 'voted') {
			Game.voteCompleted(data);
		} else if (action == 'discarded') {
			Policies.discarded(data);
		} else if (action == 'enacted') {
			Policies.enacted(data);
		} else if (action == 'veto requested') {
			vetoRequest(data);
		} else if (action == 'vetoed') {
			Game.failedGovernment(data.forced, 'Election vetoed'); //TODO
		} else if (action == 'veto overridden') {
			Policies.vetoOverridden(data);
		} else {
			if (action == 'peeked') {
				Policies.returnPreviewed();
			} else {
				var target = Players.get(data.uid);
				if (action == 'investigated') {
					if (State.isLocalPresident()) {
						Players.displayAvatar(target, data.secret.party);
					}
					Chat.addMessage({msg: 'investigated ' + target.name, uid: State.presidentElect});
				} else if (action == 'special election') {
					State.specialPresidentIndex = target.index;
				} else if (action == 'killed') {
					Players.kill(target, data.hitler, false);
				}
			}
			Cards.show(null);
			Game.advanceTurn();
		}
		if (data.roles) {
			Players.revealRoles(data.roles);
		}
	};

	var processHistory = function(history) {
		history.forEach(function(action) {
			processAction(action, true);
		});
	};

	//SOCKET

	Socket.on('game action', processAction);

	//PUBLIC

	module.exports = {

		history: processHistory,

	};


/***/ }
/******/ ]);