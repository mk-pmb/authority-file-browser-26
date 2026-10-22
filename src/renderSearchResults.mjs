// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const { app } = win;
const {
  jq,
} = win.lib;

Object.assign(app, {

  async rerenderSearchResultsForCatSelBtn(catId, rsp) {
    const { nFound } = rsp;
    const catSelBtn = app.getCatSelBtnByCatId(catId);
    const jqCatSelBtn = jq(catSelBtn);
    jqCatSelBtn.find('.n-results').text(nFound);
    const pane = jq(catSelBtn.getResultsPane());
    pane.find('.status').html();
    pane.find('.results-list').html('');
  },


});


// Object.assign(EX, {});
// export default EX;
