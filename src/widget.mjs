// -*- coding: utf-8, tab-width: 2 -*-

import makeRpcAdapter from './domRpc.mjs';
import uiCore from './uiCore.mjs';

const { app } = globalThis;

app.rpcAdapter = makeRpcAdapter();

Object.assign(app.rpcAdapter.config.requestHandlers, {

  async init(par) {
    app.pluginName = par.pluginName;
    Object.assign(app.cfg, par.config);
    app.cfg.displayLang = par.displayLang;
    uiCore.init();
  },

  async enterIdleStandby() {
    uiCore.enterIdleStandby();
  },

  async startEditing() {
    const anno = await app.rpcAdapter.sendRequest('readEditorAnno');
    app.bodies = anno.body;
    uiCore.startEditing();
    // Later, write back with: 'updateEditorAnno'
  },

});
