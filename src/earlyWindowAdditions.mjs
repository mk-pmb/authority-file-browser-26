// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const {
  getOwn,
} = win.lib;


win.voc = function voc(s) { return getOwn(voc, s, '❴⛶ ' + s + ' ⁇❵'); };
