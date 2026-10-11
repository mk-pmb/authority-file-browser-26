// -*- coding: utf-8, tab-width: 2 -*-

import editorAnno from '../fixtures/adamsapfel.mjs';

const win = globalThis;
const { app } = win;

const EX = {

  editorAnno,

  rpcInitParams: {
    hostType: 'ubhd-anno-frontend',
    pluginName: 'SemTags',
    displayLang: 'de',
    config: { bodyFilter: { purpose: 'classifying' } },
  },

  addHooks: {
    editorReadyForEditing() {
      app.searchKeyword();
    },
  },

};


export default EX;
