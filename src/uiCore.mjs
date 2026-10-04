// -*- coding: utf-8, tab-width: 2 -*-

import hooks from './hooks.mjs';
import uiBodiesList from './uiBodiesList.mjs';

const win = globalThis;
const { app } = win;
const {
  getOwn,
  jq,
  jq80,
  unicode,
} = win.lib;
const { mapValues } = win.lib.lodash;

function voc(s) { return getOwn(voc, s, '❴⛶ ' + s + ' ⁇❵'); };

const ignoreParam = Boolean; // just for signaling intent to linters.

win.voc = voc;

const EX = {

  delegateEvent(evName) {
    // jQuery event names are case-insensitive.
    jq('body').on(evName, '[on-' + evName + ']', function evProxy(evt) {
      if (evt.key && evt.isComposing) { return; }
      const hndName = evt.currentTarget.getAttribute('on-' + evName);
      if (!hndName) { return; }
      const hndFunc = getOwn(app, hndName);
      if (hndFunc) { return hndFunc(evt); }
      console.error('No such app method:', { evName, hndName }, evt.currentTarget);
    });
  },


  editorTextField(key, buttons) {
    return ['<p>', [
      '<label>', '=for=' + key + '-input',
      ':' + voc('field_name:' + key),
      '<input type="text" size="30">',
      '#' + key + '-input',
      ...(buttons || []),
    ]];
  },


  syncEditorFieldsWithBody(load) {
    // If load is truthy, load into editor.
    let anyNonEmpty = false;
    const clean = mapValues(app.editorBodyFieldsMap, function copy(ambKey, k) {
      ignoreParam(ambKey);
      const el = jq('#' + k + '-input')[0];
      if (!el) { console.error('No editor field for ' + k); }
      const s = app.sanitizeEditorFieldText(load ? load[k] : el.value);
      if (s) { anyNonEmpty = true; }
      if (load) { el.value = s; }
      return s;
    });
    return anyNonEmpty && clean;
  },


};


EX.hooks = {

  init() {
    const form = jq80.skel(jq('body').html(''), '<form id="root" method=get>',
      '<section id="current-bodies-area">', [
        '<ul id="current-bodies-list">',
        '<p class="empty-list-hint">', ':' + voc('no_list_items'),
      ],
      '<section id="editor">', [
        ...EX.editorTextField('title', [
          '=on-keyup=searchKeywordIfChangedSoon',
          '<input type="button">', '=on-click=searchKeyword',
          '=value=' + unicode.leftPointingMagnifyingGlass,
        ]),
        ...EX.editorTextField('url'),
        '<input type="button">', '=on-click=saveBody',
        '=value=' + unicode.floppyDisk,
      ],
    );
    form[0].action = 'invalid://nope/';
    form[0].onsubmit = () => false;
    EX.delegateEvent('click');
    EX.delegateEvent('keyup');
  },


  enterIdleStandby() {
    jq('#current-bodies-list').html('');
    app.resetEditorFields();
    app.otherBodies = false;
    app.getAnno = false;
  },


  async startEditing() {
    EX.hooks.enterIdleStandby();
    const anno = await app.rpcAdapter.sendRequest('readEditorAnno');
    app.getAnno = () => anno;
    const flt = Object.entries(app.cfg.bodyFilter);
    app.otherBodies = [];
    [].concat(anno.body).forEach(function decide(annoModelBody) {
      if (!annoModelBody) { return; }
      const relevant = flt.every(([k, v]) => annoModelBody[k] === v);
      if (relevant) { return uiBodiesList.addAnnoModelBody(annoModelBody); }
      return app.otherBodies.push(annoModelBody);
    });
  },



};

hooks.add(EX.hooks);



Object.assign(app, {

  editorBodyFieldsMap: {
    // editor's internal name -> anno model field
    title: 'dc:title',
    url: 'source',
  },


  sanitizeEditorFieldText(orig) {
    let s = String(orig || '');
    s = s.trim();
    return s;
  },


  setEditorFieldsFromBody(body) {
    return EX.syncEditorFieldsWithBody(body || true);
  },


  resetEditorFields() {
    app.setEditorFieldsFromBody(app.cfg.editorFieldDefaults);
  },


  getEditorFieldsAsBody() {
    return EX.syncEditorFieldsWithBody(false);
  },


  async saveAnno() {
    const allBodies = [...app.otherBodies];
    jq('#current-bodies-list > li').each(function each(idx, rawLi) {
      const annoModelBody = { ...app.cfg.bodyFilter };
      mapValues(app.editorBodyFieldsMap, function copy(ambKey, bodyKey) {
        annoModelBody[ambKey] = rawLi.bodyData[bodyKey];
      });
      allBodies.push(annoModelBody);
    });
    await app.rpcAdapter.sendRequest('updateEditorAnno', { body: allBodies });
  },




});



export default EX;
