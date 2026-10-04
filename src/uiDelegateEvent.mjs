// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const { app } = win;
const {
  getOwn,
  jq,
} = win.lib;


const EX = function uiDelegateEvent(evName) {
  // jQuery event names are case-insensitive.
  jq('body').on(evName, '[on-' + evName + ']', function evProxy(evt) {
    if (evt.key && evt.isComposing) { return; }
    const hndName = evt.currentTarget.getAttribute('on-' + evName);
    if (!hndName) { return; }
    const hndFunc = getOwn(app, hndName);
    if (hndFunc) { return hndFunc(evt); }
    console.error('No such app method:', { evName, hndName }, evt.currentTarget);
  });
};


export default EX;
