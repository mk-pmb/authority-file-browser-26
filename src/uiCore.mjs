// -*- coding: utf-8, tab-width: 2 -*-

import uiBodiesList from './uiBodiesList.mjs';

const win = globalThis;
const { app } = win;
const {
  getOwn,
  jq,
  jq80,
  unicode,
} = win.lib;

function voc(s) { return getOwn(voc, s, '❴⛶ ' + s + ' ⁇❵'); };

win.voc = voc;


const EX = {

  init() {
    jq80.skel(jq('body').html(''), '<div id="root">',
      '<div id="current-bodies-area">', [
        '<ol id="current-bodies-list">',
        '<p class="empty-list-hint">', ':' + voc('no_list_items'),
      ],
      '<form id="editor">', [
        '=method=get',
        '=action=invalid://nope/',
        ...EX.editorTextField('title'),
        ...EX.editorTextField('link'),
        '<input type="submit">', '=on-click=saveBody',
        '=value=' + unicode.floppyDisk,
      ],
    );
    jq('form').on('submit', () => false);
    jq('#title-input').attr('value', 'Beispiel');
    jq('#link-input').attr('value', 'https://de.wikipedia.org/wiki/Beispiel');
    EX.delegateEvent('click');
  },

  delegateEvent(evName) {
    jq('body').on(evName, '[on-' + evName + ']', function onclick(evt) {
      const hndName = evt.target.getAttribute('on-' + evName);
      if (!hndName) { return; }
      const hndFunc = getOwn(app, hndName);
      if (hndFunc) { return hndFunc(evt); }
      console.error('No such app method:', { evName, hndName }, evt.target);
    });
  },


  enterIdleStandby() {
    jq('#current-bodies-list').html('');
    jq('#editor')[0].reset();
    app.otherBodies = false;
    app.getAnno = false;
  },


  async startEditing() {
    EX.enterIdleStandby();
    const anno = await app.rpcAdapter.sendRequest('readEditorAnno');
    app.getAnno = () => anno;
    const flt = Object.entries(app.cfg.bodyFilter);
    app.otherBodies = [];
    [].concat(anno.body).forEach(function decide(body) {
      if (!body) { return; }
      const relevant = flt.every(([k, v]) => body[k] === v);
      if (relevant) { return uiBodiesList.appendBody(body); }
      app.otherBodies.push(body);
    });
  },


  editorTextField(key) {
    return ['<p>', [
      '<label>', '=for=' + key + '-input',
      ':' + voc('field_name:' + key),
      '<input type="text" size="30">',
      '#' + key + '-input',
    ]];
  },



};




Object.assign(app, {

  editBody(evt) {
    const li = jq(evt.target.closest('li'));
    jq('#title-input')[0].value = li.find('.title').text();
    jq('#link-input')[0].value = li.find('.weblink').attr('title');
    return li;
  },


  deleteBody(evt) {
    app.editBody(evt).remove();
    app.saveAnno();
  },


  saveBody() {
    const title = jq('#title-input')[0].value;
    const url = jq('#link-input')[0].value;
    const hasAny = (title || url);
    if (!hasAny) { return; }
    const body = { ...app.cfg.bodyFilter, 'dc:title': title, source: url };
    jq('#editor')[0].reset();
    uiBodiesList.appendBody(body);
    app.saveAnno();
  },


  async saveAnno() {
    const allBodies = [...app.otherBodies];
    jq('#current-bodies-list > li').each(function each(idx, rawLi) {
      const li = jq(rawLi);
      allBodies.push({
        ...app.cfg.bodyFilter,
        'dc:title': li.find('.title').text(),
        source: li.find('.weblink').attr('title'),
      });
    });
    await app.rpcAdapter.sendRequest('updateEditorAnno', { body: allBodies });
  },




});



export default EX;
