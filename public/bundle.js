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

	'use strict';

	__webpack_require__(1);

	__webpack_require__(5);

	__webpack_require__(45);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./main.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "/* Beige\t#F7E2C0 */\n/* Gold\t\t#FFD556 */\n/* GreyD\t#383633 */\n/* Liberal\t#78CAD7 #2E6C87 */\n/* Fascist\t#E3644F #9C0701 */\n\nhtml {\n\twidth: 100%;\n\theight: 100%;\n}\n\nbody {\n\twidth: 100%;\n\theight: 100%;\n\tmargin: 0;\n\tbackground-color: #eaeae5;\n\tfont-family: system-font, -webkit-system-font, 'Helvetica Neue', Helvetica, sans-serif;\n\n\tfont-weight: 300;\n\tcolor: #393734;\n}\n\na {\n\tcolor: #9C0701;\n\ttext-decoration: none;\n}\na:hover {\n\tcolor: #E3644F;\n\ttext-decoration: underline;\n}\n\n.clear {\n\tclear: both;\n\tmargin-left: 1px;\n}\n\nh1 {\n\tfont-size: 3em;\n}\n\nsection {\n\twidth: inherit;\n\theight: inherit;\n\toverflow: hidden;\n}\n\n.detail {\n\tfont-size: 0.8em;\n\tfont-style: italic;\n}\n\n.faint {\n\tcolor: #666;\n}\n\n.error, .input-error {\n\tcolor: #E3644F !important;\n}\n\nul {\n\tlist-style: none;\n\tpadding: 0;\n}\n\n/* FORMS */\n\ninput.full {\n\tdisplay: block;\n\tfont-family: inherit;\n\ttext-align: center;\n\tfont-size: 2em;\n\tfont-weight: 300;\n\tpadding: 8px 4px;\n\tmargin: auto;\n\twidth: 480px;\n\tmax-width: 100%;\n}\n\nbutton.large {\n\theight: 44px;\n\twidth: 480px;\n\tmax-width: 100%;\n\tmargin: 8px 0;\n\n\tfont-size: 1.3em;\n\tcolor: #393734;\n}\n\ninput {\n\tfont-family: inherit;\n}\n\ntextarea {\n\tbox-sizing: border-box;\n\tdisplay: block;\n\n\twidth: 420px;\n\theight: 128px;\n\tmax-width: 100%;\n\n\tmargin: 12px auto;\n\tfont-size: 1em;\n}\n\nselect {\n\tfont-size: 1em;\n}\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Config = __webpack_require__(6);
	var Data = __webpack_require__(7);

	var Socket = __webpack_require__(8);

	var Lobby = __webpack_require__(11);
	var Welcome = __webpack_require__(40);

	//SOCKET

	Socket.on('connect', function() {
		if (!Data.uid || !Data.auth) {
			Welcome.showSignin();
		}
	});

	Socket.on('disconnect', function() {
		if (Lobby.connectToStart(true)) {
			window.alert('Disconnected from server, please try joining a game again.');
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

	Socket.on('reload', function(data) {
		if (!Config.TESTING) {
			window.alert('Secret Hitler Online has been updated to v'+data.v+'! Automatically reloading the page to download the latest improvements and bug fixes.');
		}
		window.location.reload();
	});


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	//SETUP

	var pageLoad = window.location;

	var pathItems = pageLoad.pathname.split('/');

	//PUBLIC

	module.exports = {

		TESTING: pageLoad.hostname == 'localhost',

		pageAction: pathItems[1],

		pageTarget: pathItems[2],

	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Util = __webpack_require__(16);

	//PUBLIC

	module.exports = {

		uid: Util.storage('uid'),

		auth: Util.storage('auth'),

		username: null,

	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SocketIO = __webpack_require__(9);

	var CommonConsts = __webpack_require__(10);

	var Config = __webpack_require__(6);
	var Data = __webpack_require__(7);

	//LOCAL

	var params;
	if (Data.uid && Data.auth) {
		params = {query: 'uid=' + Data.uid + '&auth=' + Data.auth + '&v=' + CommonConsts.VERSION};
	}

	var socket = SocketIO(Config.TESTING ? 'http://localhost:8004' : 'https://secrethitler.online', params);

	//PUBLIC

	module.exports = socket;


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = io;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	var MAJOR_VERSION = 1;
	var MINOR_VERSION = 1;
	var PATCH_VERSION = 10;

	//PUBLIC

	module.exports = {

		VERSION: [MAJOR_VERSION, MINOR_VERSION, PATCH_VERSION].join('.'),
		COMPATIBLE_VERSION: [MAJOR_VERSION, MINOR_VERSION].join('.'),

		LIBERAL: 'liberal',
		FASCIST: 'fascist',
		NONE: 'none',

		FASCIST_POLICIES_REQUIRED: 6,
		LIBERAL_POLICIES_REQUIRED: 5,

	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(12);

	var $ = __webpack_require__(14);

	var CommonUtil = __webpack_require__(15);

	var Config = __webpack_require__(6);
	var Util = __webpack_require__(16);

	var Chat = __webpack_require__(17);

	var App = __webpack_require__(21);

	var Action = __webpack_require__(29);
	var Socket = __webpack_require__(8);

	var Welcome = __webpack_require__(40);

	var Start = __webpack_require__(44);
	var State = __webpack_require__(22);

	//TIMERS

	var countdownInterval, startTime, afkInterval;

	var clearCountdown = function() {
		if (countdownInterval) {
			clearTimeout(countdownInterval);
			countdownInterval = null;
		}
	};

	var updateCountdown = function() {
		var secondsRemaining = startTime - CommonUtil.now();
		if (secondsRemaining < 0) {
			clearCountdown();
		} else {
			$('#lobby-countdown').text('waiting ' + secondsRemaining + ' seconds...');
		}
	};

	var gameTimeout = function(enabled) {
		if (afkInterval) {
			clearInterval(afkInterval);
			afkInterval = null;
		}
		if (enabled && !State.started) {
			var waitDuration = Util.hidden('#lobby-wait-afk') ? 59 : 29;
			afkInterval = setTimeout(function() {
				if (Util.hidden('#lobby-wait')) {
					afkInterval = null;
					return;
				}
				if (Util.hidden('#lobby-wait-afk')) {
					$('#lobby-wait-afk').show();
					Socket.emit('lobby afk');
					gameTimeout(true);
				} else {
					$('#lobby-wait-afk').hide();
					connectToStart();
					window.alert('You\'ve been taken back to the main lobby due to inactivity.');
				}
			}, waitDuration * 1000);
		} else {
			$('#lobby-wait-afk').hide();
		}
	};

	//LOCAL

	var updateLobby = function(data) {
		if (data.started) {
			gameTimeout(false);
			Start.play(data);
			return;
		}
		showLobbySection('wait');

		clearCountdown();

		State.players = data.players;
		var lobbyPlayerCount = data.players.length;
		startTime = data.startTime;
		if (startTime) {
			updateCountdown();
			countdownInterval = setInterval(updateCountdown, 1000);
		} else {
			var playersNeeded = 5 - lobbyPlayerCount;
			$('#lobby-countdown').text('waiting for ' + playersNeeded + ' more...');
		}

		$('#lobby-player-summary').text(lobbyPlayerCount + ' of ' + data.maxSize);
		var nameList = '';
		data.players.forEach(function(player, index) {
			var floatClass = index % 2 == 0 ? 'left' : 'right';
			nameList += '<div class="player-slot '+floatClass+'"><h2>' + player.name + '</h2></div>';
		});
		$('#lobby-players').html(nameList);

		var privateGame = data.private == true;
		$('#lobby-privacy').toggle(privateGame);
		if (privateGame) {
			var gid = data.gid;
			$('#lobby-private-code').html('<a href="/join/'+gid+'" target="_blank">https://secrethitler.online/join/<strong>' + gid + '</strong></a>');
		}
	};

	var showLobbySection = function(subsection, forced) {
		if (!forced && !Util.hidden('#lobby-'+subsection)) {
			return;
		}

		$('#s-lobby > *').hide();
		$('#lobby-'+subsection).show();

		var isGameLobby = subsection == 'wait';
		Chat.toggle(isGameLobby);
		gameTimeout(isGameLobby);
	};

	var connectToStart = function(ifShowing) {
		if (ifShowing && (Util.hidden('#s-lobby') || !Util.hidden('#lobby-start'))) {
			return;
		}
		$('.chat-container').html('');

		showLobbySection('start', true);

		var connectData = {};
		if (Config.pageAction == 'join') {
			connectData.join = Config.pageTarget;
			Config.pageAction = null;
		}
		Socket.emit('lobby join', connectData);
		return true;
	};

	var showLobby = function() {
		State.gameOver = true;
		Chat.voiceDisconnect();
		App.showSection('lobby');
		connectToStart();
	};

	var quitGame = function() {
		Action.emit('quit', null, showLobby);
	};

	var joinGame = function(gid, failDestination) {
		showLobbySection('');
		Socket.emit('room join', {gid: gid}, function(response) {
			if (response.error) {
				window.alert('Unable to join game: ' + response.error);
			}
			showLobbySection(response.success ? 'wait' : failDestination);
		});
	};

	//EVENTS

	$('.lobby-leave').on('click', connectToStart);

	$('#lobby-button-quick-play').on('click', function() {
		showLobbySection('');
		Socket.emit('room quickjoin', null, function(response) {
			if (response.gid) {
				console.log('Quick rejoin', response);
			} else {
				showLobbySection(response.success ? 'wait' : 'start');
			}
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
			Config.manual = true;
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
		joinGame(gid, 'join-private');
	});

	$('#lobby-open-games').on('click', 'li', function() {
		joinGame($(this).data('gid'), 'start');
	});

	$('#lobby-wait-afk').on('click', function() {
		gameTimeout(false);
		gameTimeout(true);
	});

	//SOCKET

	Socket.on('lobby games stats', function(data) {
		if (data.games) {
			var hasGame = data.games.length > 0;
			$('#lobby-open-games').toggle(hasGame);
			$('#lobby-open-games-empty').toggle(!hasGame);

			$('#lobby-open-games').html(data.games.reduce(function(combined, game) {
				return combined + '<li data-gid="'+game.gid+'"><h4>'+game.size+'p Secret Hitler</h4><p>'+game.names+'</p></li>';
			}, ''));
		}
		if (data.players) {
			var onlineCount = data.players.online;
			var showsDetails = onlineCount > 1;
			$('#lobby-count-details').toggle(showsDetails);
			if (showsDetails) {
				$('#lobby-count-playing').text(data.players.playing);
				$('#lobby-count-lobby').text(data.players.lobby);
			}
			$('#lobby-count-online').text(Util.pluralize(onlineCount, 'player'));

		}
	});

	Socket.on('lobby game data', updateLobby);

	//WINDOW

	window.onbeforeunload = function() {
		if (!Config.TESTING && !State.gameOver) {
			return "You WILL NOT be removed from the game. If you'd like to leave permanently, please quit from the menu first so your fellow players know you will not return. Thank you!";
		}
	};

	window.onbeforeunload = function() {
		if (!Config.TESTING && !State.gameOver) {
			return "You WILL NOT be removed from the game. If you'd like to leave permanently, please quit from the menu first so your fellow players know you will not return. Thank you!";
		}
	};

	window.focus = function() {
		if (afkInterval) {
			gameTimeout(true);
		}
	};

	$(window.document).on('click', function() {
		if (afkInterval) {
			gameTimeout(true);
		}
	});

	$(window.document).on('keypress', function() {
		if (afkInterval) {
			gameTimeout(true);
		}
	});

	//PUBLIC

	module.exports = {

		show: showLobby,

		quitToLobby: quitGame,

		connectToStart: connectToStart,

	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(13);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./lobby.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./lobby.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "#s-lobby {\n\ttext-align: center;\n}\n\n#lobby-open-games li {\n\tmargin: 16px;\n\tpadding: 8px 0;\n\tbackground-color: #eee;\n}\n\n#lobby-open-games li:hover {\n\tbackground-color: rgba(156, 7, 1, 0.1);;\n\tcursor: pointer;\n}\n\n#lobby-wait-afk {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\tbackground-color: rgba(227, 100, 79, 0.95);\n\tz-index: 9001;\n}\n", ""]);

	// exports


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {

		now: function() {
			return Math.round(Date.now() * 0.001);
		},

		removeWhitespace: function(string) {
			return string.replace(/\s+/g, '');
		},

	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(14);

	var Config = __webpack_require__(6);

	//SETUP

	var storageAvailable = window.localStorage != null;
	if (storageAvailable) {
		try {
			var availableKey = 'storage_available';
			window.localStorage.setItem(availableKey, availableKey);
			window.localStorage.removeItem(availableKey);
		} catch (e) {
			storageAvailable = false;
			console.error(e);
			if (!Config.TESTING) {
				window.alert('Local storage unavailable! Your signin information cannot be retrieved, or saved for next time you open the page. You may have private browsing enabled, or set a storage quota that is too small for the site to function.');
			}
		}
	} else {
		console.error('Local storage undefined');
		window.alert('Local storage unavailable! Your signin information cannot be retrieved, or saved for next time you open the page. Please make sure you are running the latest version of your browser, or allow local storage if it is disabled.');
	}

	//PUBLIC

	module.exports = {

		pluralize: function(amount, countable) {
			if (amount != 1) {
				countable += 's';
			}
			return amount + ' ' + countable;
		},

		hidden: function(selector) {
			return $(selector).css('display') == 'none';
		},

		storage: function(key, value) {
			if (!storageAvailable) {
				return null; //TODO fallback
			}
			if (value === undefined) {
				return window.localStorage.getItem(key);
			}
			if (value === null) {
				window.localStorage.removeItem(key);
				return;
			}
			window.localStorage.setItem(key, value);
		},

	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(18);

	var $ = __webpack_require__(14);

	var SimpleWebRTC = __webpack_require__(20);

	var Data = __webpack_require__(7);

	var App = __webpack_require__(21);

	var Socket = __webpack_require__(8);

	var State = __webpack_require__(22);

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
		var player = __webpack_require__(23).get(data.uid);
		if (player) {
			var message = data.msg;
			var name = player.name;
			App.playerDiv(player, '.chat').text(message);
			var chatId = State.started ? 'overlay' : 'lobby';
			$('#chat-container-'+chatId).append('<p><strong>' + name + ': </strong>' + message + '</p>');
		}
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
			__webpack_require__(29).emit('chat', {msg: this.value});
			this.value = '';
			setChatState(false);
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
		if ($('#overlay').css('display') == 'none') {
			__webpack_require__(36).show('menu');
		} else {
			__webpack_require__(36).hide();
		}
	});

	//PUBLIC

	module.exports = {

		toggle: function(show) {
			$('#chat-box').toggle(show);
		},

		setDirective: setDirective,

		addMessage: addChatMessage,

		// Voice

		supportsVoice: supportsVoiceChat,

		voiceDisconnect: function() {
			if (webrtc) {
				webrtc.disconnect();
			}
		},

	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(19);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./chat.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./chat.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "#chat-box {\n\tposition: fixed;\n\tbottom: 0;\n\tleft: 0;\n\tright: 0;\n\theight: 44px;\n\twidth: 100vw;\n\tz-index: 9001;\n\toverflow: hidden;\n\tbackground-color: #393734;\n}\n\n#chat-box input {\n\tdisplay: inline-block;\n\tbox-sizing: border-box;\n\twidth: 100%;\n\theight: 100%;\n\ttext-align: center;\n\tfont-size: 1.4em;\n\tfont-weight: 300;\n\tborder-radius: 0;\n\tbackground-color: transparent;\n\n\tborder: none;\n\tcolor: #F7E2C0;\n}\n\n#game-mat, #lobby-wait, #chat-container-lobby { /*TODO remove extra*/\n\tpadding-bottom: 44px;\n}\n\n/* BUTTONS */\n\n.chat-button {\n\tposition: fixed;\n\tbottom: 0;\n\twidth: 44px;\n\theight: 44px;\n\tz-index: 9002;\n\tcolor: #fff;\n\tline-height: 44px;\n\ttext-align: center;\n\tcursor: pointer;\n\tfont-size: 2em;\n\n\tbackground-size: contain;\n\tbackground-position: center;\n}\n\n#voice-button {\n\tleft: 0;\n}\n#voice-button.muted {\n\topacity: 0.5;\n}\n\n#menu-button {\n\tright: 0;\n\tbackground-image: url(/images/menu.png);\n}\n\n.chat-container {\n\tposition: absolute;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\twidth: 640px;\n\tmax-width: 100%;\n\tmargin: auto;\n}\n", ""]);

	// exports


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = SimpleWebRTC;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(14);

	var Data = __webpack_require__(7);

	var State = __webpack_require__(22);

	//LOCAL

	var uidDiv = function(uid, query) {
		return $('#ps'+uid + (query ? ' '+query : ''));
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

		if (localPresident && purpose) {
			localDiv().removeClass('choose');
			if (purpose.indexOf('election') > -1) {
				if (State.playerCount > 5) {
					uidDiv(State.presidentElect).removeClass('choose');
				}
				uidDiv(State.chancellorElect).removeClass('choose');
			} else if (purpose.indexOf('investigate') > -1) {
				State.players.forEach(function(player) {
					if (player.investigated) {
						playerDiv(player).removeClass('choose');
					}
				});
			} else if (purpose.indexOf('bullet') > -1) {
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

		enablePlayerSelection: enablePlayerSelection,

	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {

		gameOver: true,

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


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(24);

	var $ = __webpack_require__(14);

	var CommonConsts = __webpack_require__(10);

	var App = __webpack_require__(21);
	var Cards = __webpack_require__(26);
	var Chat = __webpack_require__(17);

	var Action = __webpack_require__(29);

	var State = __webpack_require__(22);

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
			ac = CommonConsts.LIBERAL;
		} else {
			ac = CommonConsts.FASCIST;
			if (allegiance >= 2) {
				ac += ' hitler';
			}
		}
		return ac;
	};

	var displayAvatar = function(player, allegiance) {
		App.playerDiv(player, '.avatar').addClass(allegianceClass(allegiance));
	};

	var killPlayer = function(player, isFuehrer, quit) {
		if (!player.killed) {
			player.killed = true;
			App.playerDiv(player).removeClass('choose');
			App.playerDiv(player).addClass(State.gameOver ? 'quit' : 'killed');
			State.currentCount -= 1;

			if (!State.gameOver) {
				var Game = __webpack_require__(30);
				if (isFuehrer) {
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
			__webpack_require__(30).advanceTurn();
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(25);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./players.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./players.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "#players {\n\twidth: 100%;\n\tmin-height: 100%;\n\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: space-between;\n\n\toverflow-y: scroll;\n\t-webkit-overflow-scrolling: touch;\n}\n\n/* PLAYERS */\n\n.player-slot {\n\tdisplay: flex;\n\tbox-sizing: border-box;\n\twidth: 50%;\n\tpadding: 16px;\n\theight: 104px;\n}\n\n.player-slot.left {\n\tfloat: left;\n\ttext-align: left;\n}\n\n.player-slot.right {\n\tfloat: right;\n\tflex-direction: row-reverse;\n\ttext-align: right;\n}\n\n.player-slot.choose {\n\tborder: 1px dashed #FFD556;\n\tbackground-color: rgba(255,255,255, 0.5);\n\tcursor: pointer;\n}\n.player-slot.choose:hover {\n\tborder-style: solid;\n\tbackground-color: rgba(255,255,255, 0.25);\n}\n\n.player-slot.elect .avatar {\n\tbox-shadow: 0 0 32px #FFD556;\n}\n\n.player-slot .avatar {\n\tflex-shrink: 0;\n}\n.player-slot .contents {\n\tflex-grow: 1;\n\tdisplay: flex;\n\tflex-direction: column;\n}\n\n.player-slot .title {\n\tflex-shrink: 0;\n\tfloat: inherit;\n}\n.player-slot .chat {\n\tmargin: 4px 8px;\n\tfont-style: italic;\n\n\tdisplay: -webkit-box;\n\t-webkit-line-clamp: 2;\n\t-webkit-box-orient: vertical;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\tword-wrap: break-word;\n}\n\n.player-slot h2 {\n\tfont-weight: 300;\n\tmargin: 0 8px;\n\tdisplay: inline;\n\tfont-size: 1.4em;\n}\n\n.player-slot.killed {\n\topacity: 0.5;\n\tbackground-color: #E3644F;\n}\n\n.icon {\n\tdisplay: inline-block;\n\tline-height: 0;\n}\n.typing {\n\tfont-size: 1.3em;\n}\n.talking {\n\tfont-size: 1.7em;\n}\n\n.right .title {\n\tdisplay: flex;\n\tflex-direction: row-reverse;\n}\n\n/* AVATARS */\n\n.avatar {\n\tposition: relative;\n\tbox-sizing: border-box;\n\twidth: 80px;\n\theight: 80px;\n\tborder-radius: 50%;\n\tborder: 2px solid #F7E2C0;\n\n\tbackground-image: url(/images/unknown.png);\n\tbackground-size: cover;\n}\n\n.avatar .vote {\n\tposition: absolute;\n\tbottom: -2px;\n\tleft: 0;\n\tright: 0;\n\tborder: 1px solid #383633;\n\ttext-align: center;\n\tbackground-color: #F7E2C0;\n}\n\n@media (max-width: 719px) {\n\t.player-slot {\n\t\twidth: 100%;\n\t}\n}\n", ""]);

	// exports


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(27);

	var $ = __webpack_require__(14);

	var Action = __webpack_require__(29);

	var State = __webpack_require__(22);

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


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(28);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./cards.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./cards.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".card {\n\tborder-radius: 3px;\n\tbox-sizing: border-box;\n\toverflow: hidden;\n}\n\n#player-cards {\n\tposition: fixed;\n\tbottom: 44px;\n\tleft: 0;\n\tright: 0;\n\ttext-align: center;\n\tz-index: 900;\n}\n\n#player-cards .card {\n\tposition: relative;\n\tbottom: -96px;\n\tpadding-top: 24px;\n\tdisplay: inline-block;\n\twidth: 192px;\n\theight: 192px;\n\n\tmargin: 0 4px;\n\tborder: 1px dashed rgba(0,0,0, 0.1);\n\n\tmax-width: 45%;\n\tbackground-color: #F7E2C0;\n\tbox-shadow: 0 8px 16px rgba(0,0,0, 0.75);\n}\n\n#player-cards .description {\n\tfont-size: 0.75em;\n}\n\n#player-cards .policy {\n\twidth: 128px;\n\tfont-size: 1.4em;\n\tbackground-size: contain;\n}\ndiv.policy {\n\tborder-radius: 12%/9%;\n}\n\n#cards-vote .card, #player-cards .policy {\n\tcursor: pointer;\n}\n\n.card.selected {\n\tbottom: -46px !important;\n\tz-index: 9000;\n}\n\n#veto-request span {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\tmargin-top: 16px;\n}\n", ""]);

	// exports


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Socket = __webpack_require__(8);

	//LOCAL

	var emitAction = function(action, data, callback) {
		if (!data) {
			data = {};
		}
		data.action = action;
		Socket.emit('game action', data, callback);
	};

	//PUBLIC

	module.exports = {

		emit: emitAction,

	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(31);
	__webpack_require__(33);

	var $ = __webpack_require__(14);

	var CommonGame = __webpack_require__(35);

	var App = __webpack_require__(21);
	var Cards = __webpack_require__(26);
	var Chat = __webpack_require__(17);
	var Overlay = __webpack_require__(36);

	var State = __webpack_require__(22);
	var Policies = __webpack_require__(39);

	//FINISH

	var endGame = function(liberalWin, winMethod) {
		if (!State.gameOver) {
			State.started = false;
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
		App.enablePlayerSelection('special election');

		var directive;
		if (State.isLocalPresident()) {
			directive = 'Choose your Chancellor';
		} else {
			directive = 'Wait for <strong>'+president.name+'</strong> to choose their chancellor';
		}
		Cards.show(null);
		Chat.setDirective(directive);
	};

	var advanceTurn = function() {
		if (State.gameOver) {
			return;
		}
		if (State.specialPresidentIndex != null) {
			State.presidentIndex = State.specialPresidentIndex;
			State.specialPresidentIndex = null;
		} else {
			State.presidentIndex = CommonGame.getNextPresident(State.playerCount, State.players, State.positionIndex);
			State.positionIndex = State.presidentIndex;
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
				var president = State.getPresident();
				directive = 'Wait for President <strong>' + president.name + '</strong> to discard a policy';
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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(32);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./game.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./game.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "#s-game {\n\t-webkit-touch-callout: none;\n\t-webkit-user-select: none;\n\tuser-select: none;\n}\n\n#game-mat {\n\tposition: relative;\n\tbox-sizing: border-box;\n\theight: 100%;\n\tmin-height: 600px;\n\n\toverflow-y: scroll;\n\t-webkit-overflow-scrolling: touch;\n}\n\n#s-game.directive #game-mat {\n\tpadding-top: 44px;\n}\n\n/* DIRECTIVE */\n\n#directive {\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tz-index: 9001;\n\twidth: 100%;\n\tpadding: 0 4px;\n\tbox-sizing: border-box;\n\n\theight: 44px;\n\tline-height: 44px;\n\ttext-align: center;\n\tfont-weight: 400;\n\tfont-size: 1.3em;\n\n\tbackground-color: #393734;\n\tcolor: #F7E2C0;\n\ttext-shadow: 0 4px 16px black;\n\n\twhite-space: nowrap;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n}\n\n#s-game:not(.directive) #directive {\n\tdisplay: none;\n}\n\n/* PARTY */\n\n.fascist {\n\tcolor: #9C0701;\n\tbackground-color: #E3644F;\n\tborder-color: #9C0701 !important;\n}\n.fascist.danger {\n\tcolor: #E3644F;\n\tbackground-color: #9C0701;\n}\n\n.liberal {\n\tcolor: #2E6C87;\n\tbackground-color: #78CAD7;\n\tborder-color: #2E6C87 !important;\n}\n.liberal.danger {\n\tcolor: #73CBD9;\n\tbackground-color: #2E6C87;\n}\n\n.liberal.image {\n\tbackground-image: url(/images/liberal.png);\n}\n.fascist.image {\n\tbackground-image: url(/images/fascist.png);\n}\n.hitler.image {\n\tbackground-image: url(/images/hitler.png);\n}\n", ""]);

	// exports


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(34);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./board.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./board.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "#board-container {\n\tposition: absolute;\n\tz-index: -1;\n\tleft: 0;\n\tright: 0;\n\ttop: 0;\n\tbottom: 0;\n\tmargin: auto;\n\n\twidth: 720px;\n\tmax-width: 100vmin;\n\theight: 480px;\n\tmax-height: 67vmin;\n}\n\n#board {\n\twidth: 100%;\n\theight: 100%;\n\tbox-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);\n\tborder-radius: 4px;\n\toverflow: hidden;\n}\n\n.board-component {\n\tbox-sizing: border-box;\n\twidth: 100%;\n\theight: 33.34%;\n\tpadding: 8px 3px;\n\n\tdisplay: flex;\n\tflex-direction: row;\n\tjustify-content: space-around;\n\talign-items: stretch;\n}\n\n/* PLACEHOLDERS */\n\n.policy-placeholder {\n\tbox-sizing: border-box;\n\tposition: relative;\n\theight: 100%;\n\twidth: 15%;\n\tborder: 2px solid;\n\tpadding: 1%;\n\ttext-align: center;\n}\n\n.policy-placeholder .detail {\n\tposition: absolute;\n\tbottom: 6px;\n\tleft: 6px;\n\tright: 6px;\n}\n\n.policy-placeholder .policy {\n\twidth: 100%;\n\theight: 100%;\n\tbackground-size: contain;\n\tbackground-position: center;\n\tbox-sizing: border-box;\n\tborder: 1px solid;\n}\n\n.policy-placeholder.victory {\n\tbackground-size: contain;\n\tbackground-position: center;\n\tbackground-repeat: no-repeat;\n}\n\n.policy-placeholder.victory.liberal {\n\tbackground-image: url(/images/liberal-victory.png);\n}\n.policy-placeholder.victory.fascist {\n\tbackground-image: url(/images/fascist-victory.png);\n}\n\n/* POLICIES */\n\n#board-policy-piles .policy {\n\tbox-shadow: 2px -1px 4px rgba(0, 0, 0, 0.5);\n}\n\n#board-policy-piles {\n\tmargin: auto;\n\tjustify-content: center;\n\tpadding: 8px 4px;\n\tbackground-color: #9E927C;\n}\n\n.card-pile {\n\tbackground-color: #383633;\n\tpadding-bottom: 2%;\n}\n\n.pile-label {\n\tcolor: #F7E2C0;\n\tfont-size: 0.5em;\n\tfont-weight: 100;\n\tletter-spacing: 3px;\n\tposition: absolute;\n\tbottom: 1px;\n\tleft: 0;\n\tright: 0;\n}\n\n.pile-cards {\n\tfont-size: 3em;\n\tfont-weight: 200;\n\tbackground-color: #F7E2C0;\n\twidth: 100%;\n\theight: 100%;\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n}\n\n/* TRACKER */\n\n#election-tracker {\n\tposition: relative;\n\twidth: 50%;\n\tmargin: 0 16px;\n\n\tdisplay: flex;\n\tflex-direction: row;\n\tjustify-content: space-around;\n\talign-items: center;\n}\n\n.tracker-slot {\n\twidth: 72px;\n\theight: 72px;\n\tmax-width: 8vw;\n\tmax-height: 8vw;\n\n\tbox-sizing: border-box;\n/* \tmargin: 20px; */\n\tborder-radius: 50%;\n\tborder: 4px solid #62C2A0;\n}\n\n.tracker-slot.selected {\n\tbackground-color: #62C2A0;\n}\n\n#tracker-title, #tracker-description {\n\tposition: absolute;\n\tleft: 0;\n\tright: 0;\n\twidth: 100%;\n\ttext-align: center;\n}\n\n#tracker-title {\n\ttop: 0;\n\tfont-size: 1.4em;\n\tfont-weight: 100;\n\tletter-spacing: 0.15vw;\n}\n\n#tracker-description {\n\tbottom: 0;\n\tfont-size: 0.7em;\n}\n", ""]);

	// exports


/***/ },
/* 35 */
/***/ function(module, exports) {

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

		fascistsCount: function(gameSize) {
			return Math.ceil(gameSize / 2) - 1;
		},

	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(37);

	var $ = __webpack_require__(14);

	var CommonGame = __webpack_require__(35);

	var Cards = __webpack_require__(26);

	var Socket = __webpack_require__(8);

	var Util = __webpack_require__(16);

	var Players = __webpack_require__(23);
	var State = __webpack_require__(22);

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

			inner += '<h2><em>your secret role:</em></h2>';
			inner += '<div class="avatar image '+Players.allegianceClass(State.localAllegiance)+'"></div>';
			inner += '<h1>'+State.localRole()+'</h1>';
			var fascistsCount = CommonGame.fascistsCount(State.playerCount) - 1;
			var fascistsDescription = Util.pluralize(fascistsCount, 'Fascist') + ' + Hitler';
			inner += '<h4>'+State.playerCount+' players (' + fascistsDescription + ')</h4>';
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
					if (data.method == 'bullet') {
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
		$('#overlay .info').html(inner);
		$('#overlay .extras').html(extras);
	};

	$('#overlay').on('click', '#overlay-continue', function() {
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
			__webpack_require__(11).quitToLobby();
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
		var type = $('#i-feedback-type').val();
		if (!type) {
			window.alert('Please select a type of feedback to report and try again!');
			return;
		}
		var body = $('#i-feedback-body').val();
		if (body.length < 6) {
			window.alert('Please enter some feedback into the text area!');
			return;
		}
		Socket.emit('feedback', {type: type, body: body}, function(response) {
			if (response) {
				$('#i-feedback-type').val('default');
				$('#i-feedback-body').val('');
				showOverlaySection('menu');
				window.alert('Thank you! Your feedback has been recorded.');
			}
		});
	});

	//PUBLIC

	module.exports = {

		hide: hideOverlay,

		show: showOverlay,

	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(38);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./overlay.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./overlay.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "#overlay {\n\tposition: fixed;\n\ttop: 44px;\n\tleft: 0;\n\tright: 0;\n\tbottom: 44px;\n\tbackground: rgba(0, 0, 0, 0.5);\n\n\tcolor: #eaeae5;\n\ttext-align: center;\n\ttext-shadow: 0 2px 8px #393734;\n}\n\n#overlay h1 {\n\tfont-size: 4em;\n\tmargin-top: 0;\n}\n\n#overlay h2 {\n\tfont-size: 2em;\n\tfont-weight: 300;\n}\n\n#overlay h3 {\n\tfont-size: 1.6em;\n\tfont-weight: 500;\n}\n\n#overlay h4 {\n\tmargin-bottom: 8px;\n\ttext-transform: uppercase;\n\tletter-spacing: 0.2em;\n}\n\n#version {\n\tfont-size: 2em;\n\tfont-weight: 300;\n}\n\n/* MENU */\n\n#overlay .front {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\twidth: 640px;\n\tmax-width: 100%;\n\theight: 640px;\n\tmax-height: 100%;\n\tmargin: auto;\n\n\toverflow-y: scroll;\n\t-webkit-overflow-scrolling: touch;\n}\n\n#overlay-menu button {\n\ttext-transform: uppercase;\n\tletter-spacing: 0.1em;\n}\n\n#overlay .info h1 {\n\tcolor: #F7E2C0;\n}\n\n#game-mat.overlay {\n\t-webkit-filter: blur(25px);\n\tfilter: blur(25px);\n/* \tfilter: blur(20px); */\n\t-webkit-transition: 0.4s all linear;\n}\n\n.avatar {\n\tmargin: auto;\n\twidth: 72px !important;\n\theight: 72px !important;\n}\n\n/* TIPS */\n\n.tip {\n\tposition: absolute;\n\tfont-size: 1.5em;\n\tfont-weight: 200;\n\tfont-style: italic;\n\tcolor: #FFD556;\n}\n.tip.top {\n\ttop: 0;\n\tleft: 20%;\n}\n.tip.bottom {\n\tbottom: 0;\n\tleft: 8%;\n}\n.tip.bottom.right {\n\tbottom: 0;\n\tright: 14px;\n}\n", ""]);

	// exports


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(14);

	var CommonConsts = __webpack_require__(10);

	var App = __webpack_require__(21);
	var Cards = __webpack_require__(26);
	var Chat = __webpack_require__(17);

	var State = __webpack_require__(22);

	//LOCAL

	var enactPolicy = function(type) {
		var enacted;
		if (type == CommonConsts.LIBERAL) {
			enacted = ++State.enactedLiberal;
			if (State.enactedLiberal >= CommonConsts.LIBERAL_POLICIES_REQUIRED) {
				__webpack_require__(30).end(true, 'policies');
			}
		} else {
			enacted = ++State.enactedFascist;
			if (State.enactedFascist >= CommonConsts.FASCIST_POLICIES_REQUIRED) {
				__webpack_require__(30).end(false, 'policies');
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
				$(this).toggleClass(CommonConsts.LIBERAL, policyType == CommonConsts.LIBERAL);
				$(this).toggleClass(CommonConsts.FASCIST, policyType == CommonConsts.FASCIST);
			}
		});
	};

	var policyDiscarded = function(data) {
		var directive, cards;
		if (State.isLocalChancellor()) {
			updatePolicyChoices(data.secret.policies);
			directive = 'Select a policy to <strong>enact</strong>';
			if (State.canVeto) {
				directive += ', or request a <strong>veto</strong>';
			}
			cards = 'policy';
		} else {
			var chancellor = State.getChancellor();
			directive = 'Wait for Chancellor <strong>' + chancellor.name + '</strong> to enact a policy';
			cards = null;
		}
		Chat.setDirective(directive);
		Cards.show(cards);
		discardPolicyCards(1);
	};

	var policyEnacted = function(data) {
		var Game = __webpack_require__(30);

		discardPolicyCards(1);

		Cards.show(null);
		State.chatDisabled = false;
		Game.resetElectionTracker();
		var fascistPower = enactPolicy(data.policy);
		if (State.gameOver) {
			return;
		}
		checkRemainingPolicies();

		if (fascistPower) {
			State.presidentPower = fascistPower;
			if (fascistPower.indexOf('peek') > -1) {
				previewPolicies(data.secret);
			} else {
				var directive;
				if (fascistPower.indexOf('investigate') > -1) {
					if (State.isLocalPresident()) {
						directive = 'Choose a player to investigate their allegiance';
					} else {
						directive = 'Wait for the president to investigate a player';
					}
				} else if (fascistPower.indexOf('election') > -1) {
					if (State.isLocalPresident()) {
						directive = 'Select the presidential candidate for the special election';
					} else {
						directive = 'Wait for President to select the special election candidate';
					}
				} else if (fascistPower.indexOf('bullet') > -1) {
					if (State.isLocalPresident()) {
						directive = 'Choose a player to kill';
					} else {
						directive = 'Wait for President to kill a player';
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
		var chancellor = State.getChancellor();
		if (State.isLocalPresident()) {
			directive = 'Confirm or override Chancellor <strong>' + chancellor.name + '</strong>\'s veto request';
			cards = 'veto';
		} else {
			if (State.isLocalChancellor()) {
				var president = State.getPresident();
				directive = 'Awaiting confirmation from President <strong>' + president.name + '</strong>';
			} else {
				directive = 'Chancellor <strong>' + chancellor.name + '</strong> is requesting a veto, awaiting confirmation';
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
		drawPolicyCards(3);

		var cards, directive;
		if (State.isLocalPresident()) {
			updatePolicyChoices(secret.peek);
			cards = 'policy';
			directive = 'Peek at the next 3 policies. Click one to continue';
		} else {
			var president = State.getPresident();
			directive = 'Wait for President <strong>' + president.name + '</strong> to peek at the next 3 policies';
		}
		Chat.setDirective(directive);
		Cards.show(cards);
	};

	var shufflePolicyCards = function() {
		var deckSize = 17 - State.enactedFascist - State.enactedLiberal;
		$('#pile-draw .pile-cards').show().text(deckSize);
		$('#pile-discard .pile-cards').hide().text('0');
	};

	var checkRemainingPolicies = function() {
		var remainingPolicies = parseInt($('#pile-draw .pile-cards').text());
		if (remainingPolicies < 3) {
			shufflePolicyCards();
		}
	};

	var drawPolicyCards = function(count) {
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

		enacted: policyEnacted,

		updateChoices: updatePolicyChoices,

		discarded: policyDiscarded,

		vetoRequest: vetoRequest,

		returnPreviewed: function() {
			drawPolicyCards(-3);
		},

		draw: drawPolicyCards,

		vetoOverridden: vetoOverridden,

		checkRemaining: checkRemainingPolicies,

	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(41);

	var $ = __webpack_require__(14);

	var CommonValidate = __webpack_require__(43);

	var Config = __webpack_require__(6);
	var Data = __webpack_require__(7);
	var Util = __webpack_require__(16);

	var App = __webpack_require__(21);
	var Chat = __webpack_require__(17);

	var Socket = __webpack_require__(8);

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
		Util.storage('uid', null);
		Util.storage('auth', null);

		$('.input-error').hide();

		App.showSection('welcome');

		$('#s-signin-email').show();
		$('#s-signin-passkey').hide();
		$('#s-signin-username').hide();

		$('#i-signin-email').focus();

		if (Config.TESTING && (!Config.manual && Util.storage('manual') == null)) {
			setTimeout(function() {
				$('#start-playing').click();
				$('#guest-signin').click();
			}, 200);
		}

		$('#voice-unsupported').toggle(!Chat.supportsVoice());
	};

	var finishSignin = function(response) {
		$('.input-signin').blur();
		$('#welcome-signin').hide();

		Data.uid = response.id;
		Data.auth = response.auth_key;
		Util.storage('uid', Data.uid);
		Util.storage('auth', Data.auth);
	};

	var signinError = function(name, errorText) {
		var inputElement = $('#i-signin-'+name);
		var inputError = inputElement.next('.input-error');
		var hasError = errorText != null;
		inputError.toggle(hasError);

		if (hasError) {
			inputElement.focus();
			if (errorText !== true) {
				inputError.text(errorText + '. Please try again.');
			}
		}

		$('#s-signin-'+name).show();

		return hasError;
	};

	var checkSigninError = function(name, rawValue) {
		var processedValue = CommonValidate[name+'Process'](rawValue);
		if (processedValue != rawValue) {
			$('#i-signin-'+name).val(processedValue);
		}
		var errorText = CommonValidate[name](processedValue);
		return signinError(name, errorText);
	};

	//GUEST

	$('#guest-signin').on('click', function() {
		Socket.emit('guest signin', null, finishSignin);
	});

	//EMAIL

	var signinEmail = function(email) {
		email = email.trim();
		if (checkSigninError('email', email)) {
			return;
		}

		$('.sd-signin').hide();
		Socket.emit('signin email', {email: email}, function(response) {
			if (response.error) {
				signinError('email', response.error);
			} else {
				submittedEmail = response.email;
				if (submittedEmail) {
					$('.signin-email-address').text(submittedEmail);
				}
				if (response.register) {
					$('#s-signin-username').show();
					$('#i-signin-username').focus();
				} else if (response.signin) {
					$('#s-signin-passkey').show();
					$('#i-signin-passkey').focus();
				} else {
					$('#s-signin-email').show();
					$('#i-signin-email').focus();
				}
			}
		});
	};

	//PASSKEY

	var signinPasskey = function(passkey) {
		if (checkSigninError('passkey', passkey)) {
			return;
		}

		$('.sd-signin').hide();
		Socket.emit('signin passkey', {email: submittedEmail, pass: passkey}, function(response) {
			if (response.error) {
				signinError('passkey', response.error);
			} else {
				finishSignin(response);
			}
		});
	};

	//REGISTER

	var signinRegister = function(username) {
		username = CommonValidate.usernameProcess(username);
		$('#i-signin-username').val(username);

		if (checkSigninError('username', username)) {
			return;
		}

		$('.sd-signin').hide();
		Socket.emit('signin name', {email: submittedEmail, name: username}, function(response) {
			if (response.error) {
				signinError('username', response.error);
			} else {
				finishSignin(response);
			}
		});
	};

	//EVENTS

	$('#start-playing').on('click', function() {
		hideWelcomeSplash();
	});

	$('.signin-restart').on('click', function() {
		$('.sd-signin').hide();
		$('#s-signin-email').show();
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
			} else if (this.id == 'i-signin-username') {
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
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(42);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./welcome.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./welcome.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "#s-welcome {\n\ttext-align: center;\n\n\toverflow-y: scroll;\n\t-webkit-overflow-scrolling: touch;\n}\n\n#s-welcome h2 {\n\tfont-weight: 400;\n\tfont-size: 1.5em;\n}\n\n#s-welcome h3 {\n\tfont-weight: 300;\n\tfont-size: 1.2em;\n}\n\n/* SPLASH */\n\n#welcome-splash {\n\tmargin: auto;\n\tmargin-bottom: 64px;\n\tmax-width: 800px;\n}\n\n#welcome-splash h1 {\n\tfont-weight: 200;\n}\n\n#welcome-splash hr {\n\tmargin: 48px 0;\n}\n\n#welcome-splash .section {\n\tpadding: 0 16px;\n}\n\n.wordmark {\n\tmargin: auto;\n\tmax-width: 100%;\n}\n\n#voice-unsupported {\n\tmargin-bottom: 40px;\n}\n", ""]);

	// exports


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var CommonUtil = __webpack_require__(15);

	var preprocess = function(value) {
		return value.trim();
	};

	//PUBLIC

	module.exports = {

		// Email

		email: function(email) {
			if (email.length < 6) {
				return 'Invalid email address';
			}
			if (email.length > 254) {
				return 'Invalid email address';
			}
			var regexEmailSections = /\S+@\S+\.\S+/;
			if (!regexEmailSections.test(email)) {
				return 'Invalid email address';
			}
			var emailSplit = email.split('@');
			var emailLocal = emailSplit[0];
			if (!emailLocal || emailLocal.length > 64) {
				return 'Invalid email address';
			}
			var emailDomain = emailSplit[1];
			if (!emailDomain || emailDomain.length < 4) {
				return 'Invalid email address';
			}
		},

		emailProcess: function(value) {
			return preprocess(value);
		},

		// Passkey

		passkey: function(passkey) {
			if (passkey.length != 6) {
				return 'Invalid passkey, must be 6 digits';
			}
			var regexOnlyDigits = /^[0-9]+$/;
			if (!regexOnlyDigits.test(passkey)) {
				return 'Invalid passkey, must be 6 digits';
			}
		},

		passkeyProcess: function(value) {
			return preprocess(value);
		},

		// Username

		username: function(username) {
			if (username.length < 4) {
				return 'Username must be at least 4 characters';
			}
			if (username.length > 12) {
				return 'Username must be no more than 12 characters';
			}

			var regexLetters = /[A-Za-z]/g;
			if (!regexLetters.test(username)) {
				return 'Username must contain letters';
			}
			var regexOnlyLettersNumbersSpaces = /^[A-Za-z0-9 ]+$/;
			if (!regexOnlyLettersNumbersSpaces.test(username)) {
				return 'Username must only consist of letters, numbers, and up to one space';
			}

			var splitBySpaces = username.split(' ');
			if (splitBySpaces.length > 2) {
				return 'Username must not have more than one space';
			}

			var invalidStartStrings = ['guest', 'admin', 'hitler'];
			var lowercaseNowhitespaceUsername = CommonUtil.removeWhitespace(username.toLowerCase());
			for (var idx in invalidStartStrings) {
				var check = invalidStartStrings[idx];
				if (lowercaseNowhitespaceUsername.indexOf(check) === 0) {
					return 'Your username may not start with "'+check+'"';
				}
			}
		},

		usernameProcess: function(value) {
			return preprocess(value.replace(/\s\s+/g, ' '));
		},

	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(14);

	var CommonConsts = __webpack_require__(10);
	var CommonGame = __webpack_require__(35);

	var Data = __webpack_require__(7);

	var App = __webpack_require__(21);
	var Cards = __webpack_require__(26);
	var Overlay = __webpack_require__(36);

	var Process = __webpack_require__(45);

	var Game = __webpack_require__(30);
	var Players = __webpack_require__(23);
	var Policies = __webpack_require__(39);
	var State = __webpack_require__(22);

	//LOCAL

	var startGame = function(data) {
		$('.chat-container').html('');
		$('#chat-box').show();

		Data.gameId = data.gid;
		App.showSection('game');

		State.started = true;
		State.initializedPlay = false;
		State.gameOver = false;
		State.positionIndex = data.startIndex;
		State.presidentIndex = State.positionIndex;
		State.chancellorIndex = null;
		State.players = data.players;
		State.playerCount = State.players.length;
		State.currentCount = State.playerCount;
		State.chatDisabled = false;
		State.canVeto = false;

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
		for (var index = 0; index < CommonConsts.FASCIST_POLICIES_REQUIRED; ++index) {
			var fascistPower = CommonGame.getFascistPower(index + 1, State.playerCount);
			if (!fascistPower) {
				continue;
			}
			var placeholder = fascistPlaceholders.eq(index);
			var description = '';
			if (fascistPower.indexOf(' veto') > -1) {
				description = 'Veto power unlocked<br><br>';
			}
			if (fascistPower.indexOf('peek') > -1) {
				description += 'President checks the top 3 policy cards';
			} else if (fascistPower.indexOf('investigate') > -1) {
				description += 'President investigates a player\'s identity card';
			} else if (fascistPower.indexOf('election') > -1) {
				description += 'President chooses the next presidential candidate';
			} else if (fascistPower.indexOf('bullet') > -1) {
				description += 'President kills a player';
			}

			placeholder.data('power', fascistPower);
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
			var name = player.name + ' ['+(playerIndex+1)+']'; //TODO
			playerString += '<div id="ps'+player.uid+'" class="player-slot '+floatClass+'" data-uid="'+player.uid+'"><div class="avatar image"><div class="vote" style="display:none;"></div></div><div class="contents"><div class="title"><h2>'+name+'</h2><span class="typing icon" style="display:none;">💬</span><span class="talking icon" style="display:none;">🎙</span></div><div class="chat"></div></div></div>';
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
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Socket = __webpack_require__(8);

	var Cards = __webpack_require__(26);
	var Chat = __webpack_require__(17);

	var Game = __webpack_require__(30);
	var Players = __webpack_require__(23);
	var Policies = __webpack_require__(39);
	var State = __webpack_require__(22);

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
			Policies.vetoRequest(data);
		} else if (action == 'vetoed') {
			Game.failedGovernment(data.forced, 'Election vetoed');
		} else if (action == 'veto overridden') {
			Policies.vetoOverridden(data);
		} else {
			if (data.canVeto) {
				State.canVeto = true;
			}
			if (action == 'peek') {
				Policies.returnPreviewed();
			} else {
				var target = Players.get(data.uid);
				if (action == 'investigate') {
					target.investigated = true;
					if (State.isLocalPresident()) {
						Players.displayAvatar(target, data.secret.party);
					}
					Chat.addMessage({msg: 'investigated ' + target.name, uid: State.presidentElect});
				} else if (action == 'special election') {
					State.specialPresidentIndex = target.index;
				} else if (action == 'bullet') {
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

	Socket.on('action error', function(data) {
		window.alert('Unable to perform that last action: ' + data + '. Please try reloading the page and trying again.\n\nOtherwise, your game may be an in state where you can\'t continue. If so, please file a bug with the relevant information so I can get it fixed! You can do so via the "FEEDBACK" button in the game\'s menu. Thank you!');
	});

	//PUBLIC

	module.exports = {

		history: processHistory,

	};


/***/ }
/******/ ]);