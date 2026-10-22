// -*- coding: utf-8, tab-width: 2 -*-

import hooks from './hooks.mjs';


const win = globalThis;
const { app, voc } = win;
const {
  jq,
  jq80,
} = win.lib;

const { mapValues } = win.lib.lodash;


function alwaysFalse() { return false; }


const EX = {

  catSelBtnSetCls(cls, on) {
    const btn = this;
    const bon = Boolean(on);
    btn.classList.toggle(cls, bon);
    btn.getResultsPane()[0].classList.toggle(cls, bon);
  },


};


Object.assign(app, {

  getCatSelBtnByCatId(catId) {
    const btn = document.getElementById('searchCatBtn:' + catId);
    if (!btn) { throw new Error('No selection button for catalog ' + catId); }
    return btn;
  },


  async rerenderCatalogsNow() {
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
        setCls: EX.catSelBtnSetCls,
      });
    });

    app.openCatalogResultsById(app.cfg.initiallyOpenCatalogId);
    jqCats.append(Array.from({ length: 8 }).map(
      (x, i) => '<p>dummy #' + (x || i)));
  },




});


hooks.add({
  startEditing() { app.rerenderCatalogsNow(); },
});
hooks.add(EX.hooks);



export default EX;
