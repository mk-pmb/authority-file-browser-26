// -*- coding: utf-8, tab-width: 2 -*-

import defaultAppConfig from './cfg.default.mjs';
import hooks from './hooks.mjs';
import makeRpcAdapter from './domRpc.mjs';

import './uiBodiesList.btnHnd.mjs';
import './uiBodiesList.mjs';
import './uiCore.mjs';
import './uiSearch.mjs';
import './voc.en.mjs';

const win = globalThis;
const { app } = win;

app.afTagBodies = {};
app.otherBodies = [];
app.defaultMinimumBodyFilter = { type: 'SpecificResource' };


app.lenientNaturalSortCollator = new Intl.Collator(undefined, {
  caseFirst: false,
  ignorePunctuation: true,
  numeric: true,
  sensitivity: 'base',
  usage: 'sort',
});


app.rpcAdapter = makeRpcAdapter();
Object.assign(app.rpcAdapter.config.requestHandlers, {

  async init(param) {
    app.pluginName = param.pluginName;
    const cfg = win.lib.mergeOptions(defaultAppConfig, app.cfg, param.config);
    app.cfg = cfg;
    cfg.displayLang = param.displayLang;
    cfg.bodyFilter = { ...app.defaultMinimumBodyFilter, ...cfg.bodyFilter };
    hooks.run('init', param);
  },


  async enterIdleStandby(param) {
    hooks.run('enterIdleStandby', param);
  },


  async startEditing(param) {
    hooks.run('startEditing', param);
  },

});
















win.afb = win;
