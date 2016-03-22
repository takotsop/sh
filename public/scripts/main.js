'use strict';

var $ = require('jquery');

var CommonConsts = require('common/constants');

//SETUP

require('styles/main');

require('lobby/connect');

require('socket/process');

$('.version-name').text(CommonConsts.VERSION);
