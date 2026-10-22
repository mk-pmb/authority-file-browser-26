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
};


Object.assign(app, {

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
      });
    });

    app.openCatalogResultsById(app.cfg.initiallyOpenCatalogId || 0);
    jqCats.append(Array.from({ length: 8 }).map(
      (x, i) => '<p>dummy #' + (x || i)));
  },




});


hooks.add({
  startEditing() { app.rerenderCatalogsNow(); },
});
hooks.add(EX.hooks);



export default EX;
