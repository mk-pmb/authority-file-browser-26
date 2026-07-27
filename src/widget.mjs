// -*- coding: utf-8, tab-width: 2 -*-

import makeRpcAdapter from './domRpc.mjs';
import uiCore from './uiCore.mjs';

import './voc.en.mjs';

const win = globalThis;
const { app } = win;

app.rpcAdapter = makeRpcAdapter();

app.afTagBodies = {};
app.otherBodies = [];
app.defaultMinimumBodyFilter = { type: 'SpecificResource' };

Object.assign(app.rpcAdapter.config.requestHandlers, {

  async init(par) {
    app.pluginName = par.pluginName;
    const { cfg } = app;
    Object.assign(cfg, par.config);
    cfg.displayLang = par.displayLang;
    cfg.bodyFilter = { ...app.defaultMinimumBodyFilter, ...cfg.bodyFilter };
    setTimeout(uiCore.init, 1);
  },

  async enterIdleStandby() {
    setTimeout(uiCore.enterIdleStandby, 1);
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
    setTimeout(uiCore.startEditing, 1);
    // Later, write back with: 'updateEditorAnno'
  },

});
















win.afb = win;
