// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const { app, voc } = win;
const {
  unicode,
} = win.lib;


function num0(x) { return (+x || 0); }

const doNothing = Boolean;


const EX = {

  setResultsCount(evt) {
    const { catSelBtn, replyMeta: meta } = evt;
    const jqPane = catSelBtn.getResultsPane();
    const btnAndPane = jqPane.add(catSelBtn);
    /* In order for CSS animations to (re-)start, we need to remove the
      old classes, force the browser to notify its renderer about that
      removal, and only then (re-)add the appropriate class. */
    btnAndPane.removeClass([
      'empty',
      'error',
      'found',
      'maybe-more',
      'searching',
    ]);
    // Now query rendered geometry in order to force a CSS update:
    doNothing(catSelBtn.offsetWidth, jqPane[0].offsetWidth);

    const resultCountIndicator = catSelBtn.querySelector('.n-results');
    if (evt.err) {
      resultCountIndicator.innerText = unicode.stopSign;
      const msg = catSelBtn.dataset.error;
      jqPane.find('.status').text(voc('icon_fatal_error') + ' ' + msg);
      return btnAndPane.addClass('error').attr({ 'data-n-found': '-' });
    }
    if (!meta) {
      resultCountIndicator.innerText = unicode.hourglassWithFlowingSand;
      jqPane.find('.status').html('Searching&hellip;');
      return btnAndPane.addClass('searching').attr({ 'data-n-found': '?' });
    }
    const nGot = num0(evt?.replyList?.length);
    const offset = (+meta.nSkipped || 0);
    let { nFound } = meta;
    if (!Number.isInteger(nFound)) {
      nFound = (offset + nGot);
      if (nGot >= 1) { btnAndPane.addClass('maybe-more'); }
    }
    resultCountIndicator.innerText = nFound;
    jqPane.find('.status').html(nFound + ' results');
    return btnAndPane.addClass('found').attr({ 'data-n-found': nFound });
  },



};



Object.assign(app, {

  getCatSelBtnByCatId(catId) {
    const btn = document.getElementById('searchCatBtn:' + catId);
    if (!btn) { throw new Error('No selection button for catalog ' + catId); }
    return btn;
  },


});





export default EX;
