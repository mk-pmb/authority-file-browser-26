// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const { app } = win;
const {
  jq80,
} = win.lib;


function ores(x) { return String(x || ''); }



const EX = {

  renderOneSearchResultEntry(evt, srData, srIdx) {
    const ol = evt.pane.find('.results-list');
    const liData = {
      index: srIdx,
      title: ores(srData['dc:title']),
      url: ores(srData['dc:identifier']),
      descr: ores(srData['dc:description']),
    };
    const li = jq80.skel(ol, '<li>', [
      '=on-click=searchResultClicked',
      '<dl>', ['<dt>', ':' + liData.title, '<dd>', ':' + liData.descr],
    ]);
    Object.assign(li[0].dataset, liData);
    return li;
  },

};



Object.assign(app, {

  async rerenderSearchResultsForCatSelBtn(evt) {
    const list = evt.replyList;
    if (!list) { return console.error('E: No list data!', evt); }
    list.forEach(EX.renderOneSearchResultEntry.bind(null, evt));
  },


  searchResultClicked(evt) {
    const li = evt.currentTarget.closest('li');
    const ds = li.dataset;
    const body = { title: ds.title, url: ds.url };
    app.setEditorFieldsFromBody(body);
  },


});





// Object.assign(EX, {});
// export default EX;
