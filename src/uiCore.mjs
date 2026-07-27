// -*- coding: utf-8, tab-width: 2 -*-

import hooks from './hooks.mjs';

const win = globalThis;
const {
  getOwn,
  jq,
  jq80,
} = win.lib;

win.voc = function voc(s) { return getOwn(voc, s, '❴⛶ ' + s + ' ⁇❵'); };


const EX = {

  delegateEvent(evName) {
    jq('body').on(evName, '[on-' + evName + ']', function onclick(evt) {
      const hndName = evt.currentTarget.getAttribute('on-' + evName);
      if (!hndName) { return; }
      console.debug(evName, hndName, evt.currentTarget);
    });
  },

};


hooks.add({

  init() {
    jq80.skel(jq('body').html(''), '<div id="root">',
      '<section id="current-bodies-area">', [
      ]);
    EX.delegateEvent('click');
  },

  enterIdleStandby() {
  },

});



export default EX;
