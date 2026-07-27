// -*- coding: utf-8, tab-width: 2 -*-

import hooks from './hooks.mjs';

const win = globalThis;
const { app } = win;


const EX = function installEventFloodEndDetector(appMtdName, how) {
  if (!how) { return EX(appMtdName, true); }
  const cfgKeyPrefix = (how.cfgKeyPrefix || appMtdName);

  function now() {
    const impl = app[appMtdName];
    if (impl) { return impl(); }
    console.error('EventFloodEndDetector: App has no method named', appMtdName);
  }

  function soon() {
    if (soon.timer) { clearTimeout(soon.timer); }
    soon.timer = setTimeout(now, soon.delay);
  }

  soon.timer = null;

  function reconfigure() {
    let delay = (+app.cfg[cfgKeyPrefix + 'DelaySec'] || 0);
    if (delay < EX.minimumDelaySec) { delay = EX.defaultDelaySec; }
    soon.delay = delay * 1e3;
  }

  hooks.add('startEditing', reconfigure);
  app[appMtdName + 'Soon'] = soon;
  return soon;
};


Object.assign(EX, {

  defaultDelaySec: 0.2,
  minimumDelaySec: 0.01,

});


export default EX;
