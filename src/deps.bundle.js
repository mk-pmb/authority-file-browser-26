'use strict';
/* global window: true */
const { unicode, emoji } = require('unicode-emoji-2503-pmb');

module.exposeAsNamedExports = {
  emoji,
  getOwn: require('getown'),
  jq: window.jQuery,
  jq80: require('jq80-pmb'),
  unicode,
};
