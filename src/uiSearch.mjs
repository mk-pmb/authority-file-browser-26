// -*- coding: utf-8, tab-width: 2 -*-

import hooks from './hooks.mjs';
import insertJsonVarSlots from './insertJsonVarSlots.mjs';
import soonAfterEventFlood from './soonAfterEventFlood.mjs';


const win = globalThis;
const { app, voc } = win;
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

  getSearchKeywordClean() {
    let kw = jq('#title-input')[0].value;
    kw = kw.trim();
    return kw;
  },


  currentlyOpenCatalogId: false,


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
    const attempt = { kw };
    EX.latestSearchAttempt = attempt;
    mapValues(app.cfg.catalogs, async function oneSrv(catSpec, catId) {
      const catSelBtn = app.getCatSelBtnByCatId(catId);
      const jqCatSelBtn = jq(catSelBtn);
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
      const req = {
        url: catSpec.url,
        type: 'POST',
        data: insertJsonVarSlots({ ...catSpec, ...dynParam }).body,
        dataType: 'json',
      };
      const eventCtx = {
        catSelBtn,
        dynParam,
        err: false,
        pane,
        req,
      };
      hooks.run('catalogSearchBefore', 0, eventCtx);
      try {
        const rsp = await jq80.ajaxPr(req);
        console.info('Search success:', dynParam, ...rsp);
        pane.find('.status').text('');
        jqCatSelBtn.find('.n-results').text(rsp.total);
        pane.find('.results-list').html('');
      } catch (caught) {
        eventCtx.err = caught;
        console.error('Error while searching', eventCtx);
        catSelBtn.getLatestError = () => caught;
        const msg = String(caught);
        ds.error = msg;
        pane.find('.status').text(voc('icon_fatal_error') + ' ' + msg);
        jqCatSelBtn.find('.n-results').text(unicode.stopSign);
      }
      catSelBtn.setCls('errorr', !!eventCtx.err);
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
