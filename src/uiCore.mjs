// -*- coding: utf-8, tab-width: 2 -*-

import uiBodiesList from './uiBodiesList.mjs';

const win = globalThis;
const {
  getOwn,
  jq,
  jq80,
} = win.lib;

win.voc = function voc(s) { return getOwn(voc, s, '❴⛶ ' + s + ' ⁇❵'); };


const EX = {

  init() {
    jq80.skel(jq('body').html(''), '<div id="root">',
      '<div id="current-bodies-area">', [
      ]);
    EX.delegateEvent('click');
  },

  delegateEvent(evName) {
    jq('body').on(evName, '[on-' + evName + ']', function onclick(evt) {
      const hndName = evt.target.getAttribute('on-' + evName);
      if (!hndName) { return; }
      console.debug(evName, hndName, evt.target);
    });
  },

  enterIdleStandby() {
  },

  startEditing() {
    setTimeout(uiBodiesList.update, 1);
  },

};



export default EX;
