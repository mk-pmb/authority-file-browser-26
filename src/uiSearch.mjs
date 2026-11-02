// -*- coding: utf-8, tab-width: 2 -*-

import catSelBtnApi from './catSelBtnApi.mjs';
import hooks from './hooks.mjs';
import insertJsonVarSlots from './insertJsonVarSlots.mjs';
import soonAfterEventFlood from './soonAfterEventFlood.mjs';


const win = globalThis;
const { app } = win;
const {
  jq,
  unicode,
} = win.lib;

const { mapValues } = win.lib.lodash;


function alwaysFalse() { return false; }


const EX = {
  previousUnmodifiedKeyword: null, /*
    This is about whether the user has actively modified the field text. */
  previouslySearchedKeyword: null, /*
    This is about what search results may be showing on screen right now. */

  autoSearchMinimumLength: 3,
  latestSearchAttempt: false,

  searchAttemptApi: {
    isLatest() { return (this === EX.latestSearchAttempt); },
  },

  getSearchKeywordClean() {
    let kw = jq('#title-input')[0].value;
    kw = kw.trim();
    return kw;
  },


  currentlyOpenCatalogId: false, // see also: cfg.initiallyOpenCatalogId



};


soonAfterEventFlood('searchKeywordIfChanged');

Object.assign(app, {

  searchKeywordIfChanged() {
    app.searchKeyword('ifChanged');
  },


  async searchKeyword(opt) {
    const kw = EX.getSearchKeywordClean();
    if (opt === 'ifChanged') {
      if (kw === EX.previousUnmodifiedKeyword) { return; }
      EX.previousUnmodifiedKeyword = kw;
      if (kw === EX.previouslySearchedKeyword) { return; }
      if (kw.length < EX.autoSearchMinimumLength) { return; }
    }
    EX.previouslySearchedKeyword = kw;
    const attempt = { now: Date.now(), ...EX.searchAttemptApi };
    EX.latestSearchAttempt = attempt;
    mapValues(app.cfg.catalogs, async function oneSrv(catSpec, catId) {
      const catSelBtn = app.getCatSelBtnByCatId(catId);
      // const jqCatSelBtn = jq(catSelBtn);
      const pane = catSelBtn.getResultsPane();
      pane.find('.status').html(unicode.hourglassWithFlowingSand);
      pane.find('.results-list').html('');

      catSelBtn.getLatestError = alwaysFalse;
      const ds = catSelBtn.dataset;
      delete ds.error;

      const dynParam = {
        kw,
        id: catId,
      };
      const bodyData = insertJsonVarSlots({ ...catSpec, ...dynParam }).body;
      const req = {
        url: catSpec.url,
        method: 'POST',
        headers: {
          'Accept': 'application/json;q=0.9, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(bodyData).toString(),
      };
      const eventCtx = {
        attempt,
        bodyData,
        catId,
        catSelBtn,
        dynParam,
        err: false,
        pane,
        replyList: false,
        replyMeta: false,
        req,
      };
      await catSelBtnApi.setResultsCount(eventCtx);
      hooks.run('catalogSearchBefore', 0, eventCtx);
      try {
        const rsp = await win.fetch(req.url, req);
        if (!rsp.ok) {
          const err = new Error('HTTP/' + rsp.status + ' ' + rsp.statusText);
          throw err;
        }
        const [meta, ...list] = await rsp.json();
        eventCtx.replyMeta = meta;
        eventCtx.replyList = list;
        console.info('Search success:', eventCtx);
        if (!attempt.isLatest()) { return; }
      } catch (caught) {
        eventCtx.err = caught;
        console.error('Error while searching', eventCtx);
        if (!attempt.isLatest()) { return; }
        catSelBtn.getLatestError = () => caught;
        const msg = String(caught);
        ds.error = msg;
      }
      await catSelBtnApi.setResultsCount(eventCtx);
      await app.rerenderSearchResultsForCatSelBtn(eventCtx);
      hooks.run((eventCtx.err
        ? 'catalogSearchFailed'
        : 'catalogSearchSuccess'
      ), 0, eventCtx);
      hooks.run('catalogSearchAfter', 0, eventCtx);
    });
  },


  openCatalogResultsByButton(evt) {
    app.openCatalogResultsById(evt?.currentTarget?.dataset?.catId);
  },


  openCatalogResultsById(catId) {
    if (Number.isInteger(catId)) {
      const key = String(Object.keys(app.cfg.catalogs)[catId] || '');
      return app.openCatalogResultsById(key);
    }
    jq('#catalogs > p').removeClass('open');
    const jqResults = jq('#search-results').html('');
    const catSelBtn = document.getElementById('searchCatBtn:' + catId);
    EX.currentlyOpenCatalogId = false;
    if (!catSelBtn) { return; }
    catSelBtn.classList.add('open');
    const pane = catSelBtn.getResultsPane();
    const eventCtx = { catId };
    if (!pane) {
      hooks.run('openCatalogResultsNoPane', 0, eventCtx);
      return;
    }
    jqResults.append(pane);
    EX.currentlyOpenCatalogId = catId;
    hooks.run('openCatalogResultsAfter', 0, eventCtx);
  },



});


EX.hooks = {

  editorFieldsLoaded(cleanBody) {
    EX.previousUnmodifiedKeyword = cleanBody.title;
  },

};
hooks.add(EX.hooks);





export default EX;
