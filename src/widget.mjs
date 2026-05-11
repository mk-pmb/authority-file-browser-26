// -*- coding: utf-8, tab-width: 2 -*-

import makeRpcAdapter from './domRpc.mjs';
import uiCore from './uiCore.mjs';

const win = globalThis;
const { app } = win;

app.rpcAdapter = makeRpcAdapter();

Object.assign(app.rpcAdapter.config.requestHandlers, {

  async init(par) {
    app.pluginName = par.pluginName;
    const { cfg } = app;
    Object.assign(cfg, par.config);
    cfg.displayLang = par.displayLang;
    setTimeout(uiCore.init, 1);
  },

  async enterIdleStandby() {
    setTimeout(uiCore.enterIdleStandby, 1);
  },

  async startEditing() {
    const anno = await app.rpcAdapter.sendRequest('readEditorAnno');
    app.bodies = anno.body;
    setTimeout(uiCore.startEditing, 1);
    // Later, write back with: 'updateEditorAnno'
  },

});
















win.afb = win;
