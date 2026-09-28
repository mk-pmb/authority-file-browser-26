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

function voc(s) { return getOwn(voc, s, '❴⛶ ' + s + ' ⁇❵'); };

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
        ...EX.editorTextField('link'),
        '<input type="button">', '=on-click=saveBody',
        '=value=' + unicode.floppyDisk,
      ],
    );
    form[0].action = 'invalid://nope/';
    form[0].onsubmit = () => false;
    jq('#title-input').attr('value', 'Beispiel');
    jq('#link-input').attr('value', 'https://de.wikipedia.org/wiki/Beispiel');
    EX.delegateEvent('click');
    EX.delegateEvent('keyup');
  },


  enterIdleStandby() {
    jq('#current-bodies-list').html('');
    jq('#root')[0].reset();
    app.otherBodies = false;
    app.getAnno = false;
  },


  async startEditing() {
    EX.hooks.enterIdleStandby();
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



};

hooks.add(EX.hooks);



Object.assign(app, {

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
