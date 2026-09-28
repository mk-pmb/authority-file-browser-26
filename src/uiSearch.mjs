// -*- coding: utf-8, tab-width: 2 -*-

import hooks from './hooks.mjs';
import insertJsonVarSlots from './insertJsonVarSlots.mjs';
import soonAfterEventFlood from './soonAfterEventFlood.mjs';


const win = globalThis;
const { app } = win;
const {
  jq,
} = win.lib;

const { mapValues } = win.lib.lodash;

const EX = {
  previouslySearchedKeyword: null,
  autoSearchMinimumLength: 3,
  latestSearchAttempt: false,

  getSearchKeywordClean() {
    let kw = jq('#title-input')[0].value;
    kw = kw.trim();
    return kw;
  },

};


soonAfterEventFlood('searchKeywordIfChanged');

Object.assign(app, {

  searchKeywordIfChanged() {
    app.searchKeyword('ifChanged');
  },

  async searchKeyword(opt) {
    const kw = EX.getSearchKeywordClean();
    if (opt === 'ifChanged') {
      if (kw === EX.previouslySearchedKeyword) { return; }
      if (kw.length < EX.autoSearchMinimumLength) { return; }
    }
    EX.previouslySearchedKeyword = kw;
    const attempt = { kw };
    EX.latestSearchAttempt = attempt;
    mapValues(app.cfg.searchServers, async function oneSrv(srvSpec, srvId) {
      const dynParam = {
        kw,
        id: srvId,
      };
      const req = {
        url: srvSpec.url,
        type: 'POST',
        data: insertJsonVarSlots({ ...srvSpec, ...dynParam }).body,
        dataType: 'json',
      };
      console.debug('Search request for', dynParam, req);
      try {
        const rsp = await jq.ajax(req);
        console.info('Search success:', dynParam, ...rsp);
      } catch (err) {
        console.error('Error while searching', dynParam, err);
      }
    });
  },



});


hooks.add(EX.hooks);



export default EX;
