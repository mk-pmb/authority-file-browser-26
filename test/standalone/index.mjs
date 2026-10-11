// -*- coding: utf-8, tab-width: 2 -*-

import '../../src/widget.mjs';
import hooks from '../../src/hooks.mjs';


function imp0rt(src) { return import(src); }

const win = globalThis;
const qry = win.lib.qrystr(win.location.search);

const EX = {
  hooks,
  qry,

  testName: /^(?:[\w\-]+(?:[\.\/]|$))+$/.exec(qry.t || '')?.[0],

  async start() {
    try { await imp0rt('../../cfg.@local/index.mjs'); } catch { ; }
    if (!EX.testName) { return console.error('Empty testName (?t=…)'); }
    const testImpl = (await import('./' + EX.testName + '.mjs')).default;
    if (testImpl.addHooks) { hooks.add(testImpl.addHooks); }
    EX.editorAnno = testImpl.editorAnno || null;
    await (testImpl?.onTestStart || Boolean)(EX);
    win.domRpcInit = {
      method: 'init',
      params: testImpl.rpcInitParams,
      hostSham: {
        requestHandlers: {
          readEditorAnno() { return EX.editorAnno; },
        },
      },
    };
    if (EX.editorAnno) {
      hooks.add('init', function onInitHook() {
        win.domRpcRequest('startEditing', null);
      });
    }
  },

};


win.standaloneTest = EX;
EX.start();
export default EX;
