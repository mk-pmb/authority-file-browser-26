// -*- coding: utf-8, tab-width: 2 -*-

import uiBodiesList from './uiBodiesList.mjs';


const win = globalThis;
const { app } = win;
const {
  jq,
} = win.lib;


const EX = {

  editBody(evt) {
    const li = evt.currentTarget.closest('li');
    const body = li?.bodyData;
    if (!body) { return; }
    app.setEditorFieldsFromBody(body);
    return li; // for use in app.deleteBody
  },


  deleteBody(evt) {
    jq(app.editBody(evt)).remove();
    app.saveAnno();
  },


  saveBody() {
    const body = app.getEditorFieldsAsBody();
    if (!body) { return; }
    uiBodiesList.addBody(body);
    app.resetEditorFields();
    app.saveAnno();
  },


};


Object.assign(app, EX);

export default EX;
