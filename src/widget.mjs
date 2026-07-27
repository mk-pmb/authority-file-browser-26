// -*- coding: utf-8, tab-width: 2 -*-

import defaultAppConfig from './cfg.default.mjs';
import hooks from './hooks.mjs';
import makeRpcAdapter from './domRpc.mjs';

import './uiBodiesList.btnHnd.mjs';
import './uiBodiesList.mjs';
import './uiCore.mjs';
import './voc.en.mjs';

const win = globalThis;
const { app } = win;

app.rpcAdapter = makeRpcAdapter();

app.afTagBodies = {};
app.otherBodies = [];
app.defaultMinimumBodyFilter = { type: 'SpecificResource' };


Object.assign(app.rpcAdapter.config.requestHandlers, {

  async init(param) {
    app.pluginName = param.pluginName;
    const cfg = win.lib.mergeOptions(defaultAppConfig, app.cfg, param.config);
    app.cfg = cfg;
    cfg.displayLang = param.displayLang;
    cfg.bodyFilter = { ...app.defaultMinimumBodyFilter, ...cfg.bodyFilter };
    hooks.run('init', param);
  },


  async enterIdleStandby() {
    hooks.run('enterIdleStandby');
  },


  async startEditing() {
    hooks.run('startEditing');
  },

});
















win.afb = win;
