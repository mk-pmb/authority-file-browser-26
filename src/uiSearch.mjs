// -*- coding: utf-8, tab-width: 2 -*-

import hooks from './hooks.mjs';
import insertJsonVarSlots from './insertJsonVarSlots.mjs';
import soonAfterEventFlood from './soonAfterEventFlood.mjs';


const win = globalThis;
const { app, voc } = win;
const {
  jq,
  jq80,
  unicode,
} = win.lib;

const { mapValues } = win.lib.lodash;


function alwaysFalse() { return false; }


function catSelBtnSetCls(cls, on) {
  const btn = this;
  const bon = Boolean(on);
  btn.classList.toggle(cls, bon);
  btn.getResultsPane()[0].classList.toggle(cls, bon);
}


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

  rerenderCatalogs() {
    const jqCats = jq('#catalogs').html('');
    jq('<p>').text(voc('catalogs_list_title')).appendTo(jqCats);
    mapValues(app.cfg.catalogs, function addCat(catSpec, catId) {
      const catSelBtn = jq80.skel(jqCats, '<p>', [
        '#searchCatBtn:' + catId,
        '=data-cat-id=' + catId,
        '=on-click=openCatalogResultsByButton',
        '<label>', [
          '<span>', '.icon', ':' + catSpec.uniIcon,
          '<span>', '.title', ':' + catSpec.title,
          '<span>', '.status', [
            '<span>', '.n-results', ':0',
          ],
        ],
      ])[0];
      const pane = jq80.skel(null, '<div>', '.pane', [
        '<p>', '.status',
        '<ol>', '.results-list',
      ]);
      Object.assign(catSelBtn, {
        getLatestError: alwaysFalse,
        getResultsPane() { return pane; },
        setCls: catSelBtnSetCls,
      });
    });

    app.openCatalogResultsById(app.cfg.initiallyOpenCatalogId);
    jqCats.append(Array.from({ length: 8 }).map(
      (x, i) => '<p>dummy #' + (x || i)));
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
      if (kw === EX.previousUnmodifiedKeyword) { return; }
      EX.previousUnmodifiedKeyword = kw;
      if (kw === EX.previouslySearchedKeyword) { return; }
      if (kw.length < EX.autoSearchMinimumLength) { return; }
    }
    EX.previouslySearchedKeyword = kw;
    const attempt = { kw };
    EX.latestSearchAttempt = attempt;
    mapValues(app.cfg.catalogs, async function oneSrv(catSpec, catId) {
      const catSelBtn = document.getElementById('searchCatBtn:' + catId);
      const jqCatSelBtn = jq(catSelBtn);
      const pane = catSelBtn.getResultsPane();
      pane.find('.status').html(unicode.hourglassWithFlowingSand);
      pane.find('.results-list').html('');

      catSelBtn.getLatestError = alwaysFalse;
      const ds = catSelBtn.dataset;
      delete ds.error;
      let err = false;

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
      console.debug('Search request for', dynParam, req);
      try {
        const rsp = await jq80.ajaxPr(req);
        console.info('Search success:', dynParam, ...rsp);
        pane.find('.status').text('');
        jqCatSelBtn.find('.n-results').text(rsp.total);
        pane.find('.results-list').html('');
      } catch (caught) {
        err = caught;
        console.error('Error while searching', dynParam, { err });
        catSelBtn.getLatestError = () => err;
        const msg = (err);
        ds.error = msg;
        pane.find('.status').text(voc('icon_fubar') + ' ' + msg);
        jqCatSelBtn.find('.n-results').text(unicode.stopSign);
      }
      catSelBtn.setCls('fubar', !!err);
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
    if (!pane) { return; }
    jqResults.append(pane);
    EX.currentlyOpenCatalogId = catId;
  },



});


EX.hooks = {

  editorFieldsLoaded(cleanBody) {
    EX.previousUnmodifiedKeyword = cleanBody.title;
  },

  // uiCoreDomReady: EX.rerenderCatalogs,
  startEditing: EX.rerenderCatalogs,

};


hooks.add(EX.hooks);





export default EX;
