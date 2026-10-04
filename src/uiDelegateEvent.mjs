// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const { app } = win;
const {
  getOwn,
  jq,
} = win.lib;


function gaon(tgt, ev, sub) {
  if (sub) { return gaon(tgt, ev + '-' + String(sub).toLowerCase()); }
  return tgt.getAttribute('on-' + ev);
}


const EX = function uiDelegateEvent(evName) {
  // jQuery event names are case-insensitive.
  jq('body').on(evName, '[on-' + evName + ']', function evProxy(evt) {
    const tgt = evt.currentTarget;
    if (!tgt) { return; }
    let hndName;
    if (evt.key) {
      if (evt.isComposing) { return; }
      // console.debug(evName, [evt.key, evt.keyCode, evt.code]);
      /* e.g. [' ', 32, 'Space'], ['Control', 17, 'ControlLeft'],
        ['Enter', 13, 'Enter'], ['Escape', 27, 'Escape']
        => code seems most specific. */
      hndName = (gaon(tgt, evName, evt.code) || gaon(tgt, evName, evt.key));
    }
    if (!hndName) { hndName = gaon(tgt, evName); }
    if (hndName === '-') { return false; }
    if (!hndName) { return; }
    const hndFunc = getOwn(app, hndName);
    if (hndFunc) { return hndFunc(evt); }
    console.error('No such app method:', { evName, hndName, tgt });
  });
};


export default EX;
