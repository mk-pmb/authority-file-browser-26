// -*- coding: utf-8, tab-width: 2 -*-

import makeRpcAdapter from './domRpc.mjs';
import hooks from './hooks.mjs';

import './voc.en.mjs';
import './uiCore.mjs';

import './uiBodiesList.mjs';

const win = globalThis;
const { app } = win;

app.rpcAdapter = makeRpcAdapter();

app.afTagBodies = {};
app.otherBodies = [];
app.defaultMinimumBodyFilter = { type: 'SpecificResource' };

Object.assign(app.rpcAdapter.config.requestHandlers, {

  async init(param) {
    app.pluginName = param.pluginName;
    const { cfg } = app;
    Object.assign(cfg, param.config);
    cfg.displayLang = param.displayLang;
    cfg.bodyFilter = { ...app.defaultMinimumBodyFilter, ...cfg.bodyFilter };
    hooks.run('init', param);
  },

  async enterIdleStandby() {
    hooks.run('enterIdleStandby');
  },

  async startEditing() {
    const anno = await app.rpcAdapter.sendRequest('readEditorAnno');
    app.getAnno = () => anno;
    app.afTagBodies = [];
    app.otherBodies = [];
    const flt = Object.entries(app.cfg.bodyFilter);
    [].concat(anno.body).forEach(function decide(body) {
      if (!body) { return; }
      const relevant = flt.every(([k, v]) => body[k] === v);
      (relevant ? app.afTagBodies : app.otherBodies).push(body);
    });
    hooks.run('startEditing');
    // Later, write back with: 'updateEditorAnno'
  },

});
















win.afb = win;
