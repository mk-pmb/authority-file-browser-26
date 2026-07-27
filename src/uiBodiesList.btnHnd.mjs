// -*- coding: utf-8, tab-width: 2 -*-

import uiBodiesList from './uiBodiesList.mjs';


const win = globalThis;
const { app } = win;
const {
  jq,
} = win.lib;


const EX = {

  editBody(evt) {
    const li = jq(evt.currentTarget.closest('li'));
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
    uiBodiesList.appendBody(body);
    jq('#root')[0].reset();
    app.saveAnno();
  },


};


Object.assign(app, EX);

export default EX;
