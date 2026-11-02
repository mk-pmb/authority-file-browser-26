// -*- coding: utf-8, tab-width: 2 -*-

import hooks from './hooks.mjs';
import uiBodiesList from './uiBodiesList.mjs';
import uiWebLink from './uiWebLink.mjs';


const win = globalThis;
const { app, voc } = win;
const {
  jq,
  jq80,
  unicode,
} = win.lib;


function ores(x) { return String(x || ''); }

function popDictStr(d, k) {
  const v = d[k];
  delete d[k]; // eslint-disable-line no-param-reassign
  return ores(v);
}


const EX = {

  entrySelectedCls: 'selected',


  renderOneSearchResultEntry(evt, srData, srIdx) {
    const ol = evt.pane.find('.results-list');
    const other = { ...srData };
    const liData = {
      index:  srIdx,
      title:  popDictStr(other, 'dc:title'),
      url:    popDictStr(other, 'dc:identifier'),
      descr:  popDictStr(other, 'dc:description'),
    };
    liData.other = JSON.stringify(other);
    const li = jq80.skel(ol, '<li>', [
      '=on-click=searchResultClicked',
      '<dl>', ['<dt>', ':' + liData.title, '<dd>', ':' + liData.descr],
    ]);
    Object.assign(li[0].dataset, liData);
    return li;
  },


  renderSearchResultPreview(li, setActive) {
    console.debug('renderSearchResultPreview', li, setActive);
    jq(li.parentNode.children).removeClass(EX.entrySelectedCls);
    const pane = jq(li.closest('.pane'));
    pane[0].classList.toggle('preview-open', setActive || false);
    const prvWrap = pane.find('.preview-wrapper').html('');
    if (!setActive) { return; }
    li.classList.add(EX.entrySelectedCls);
    const ds = li.dataset;
    const other = JSON.parse(ds.other);
    const emoji = other['ubhd:emoji'];
    jq80.skel(prvWrap, '<div>', '.preview', [
      '<div>', '.headline-box', [
        '<aside>', '.actionbar', [
          '<a class="add-to-list">', '=on-click=addItemFromCatalog',
          ':' + voc('icon_add_from_catalog'),
          '<a class="edit">', '=on-click=editItemFromCatalog',
          ':' + unicode.memo,
        ],
        '<span>', '.title', ':' + ds.title,
      ],
      '<div>', '.weblink-box', [
        '<span>', '.icon', ':' + unicode.link,
        ...uiWebLink(ds.url), ':' + ds.url,
      ],
      '<div>', '.unfloat',
      '<div>', '.details', [
        ...(emoji ? ['<aside>', '.illustration', [
          '<figure>', '.emoji', ':' + emoji,
        ]] : ''),
        '<span>', '.descr', ':' + ds.descr,
      ],
      '<div>', '.unfloat',
    ]);
    hooks.run('uiSearchResultPreviewRendered', 0);
  },


  findSelectedItemFromCatalog(evt) {
    const pane = jq(evt.currentTarget.closest('.pane'));
    const li = pane.find('ol.results-list > li.selected');
    if (li.length !== 1) { return false; }
    const ds = li[0].dataset;
    const body = { title: ds.title, url: ds.url };
    return { li, ds, body };
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
    const setActive = !li.classList.contains(EX.entrySelectedCls);
    EX.renderSearchResultPreview(li, setActive);
  },


  editItemFromCatalog(evt) {
    const { body } = EX.findSelectedItemFromCatalog(evt);
    app.setEditorFieldsFromBody(body);
    // return li; // for other functions that may want to use it.
  },


  addItemFromCatalog(evt) {
    const { body } = EX.findSelectedItemFromCatalog(evt);
    if (!body) { return; }
    uiBodiesList.addBody(body);
  },


});





// Object.assign(EX, {});
// export default EX;
