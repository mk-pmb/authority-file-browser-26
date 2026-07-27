// -*- coding: utf-8, tab-width: 2 -*-

import uiUtil from './uiUtil.mjs';

const win = globalThis;
const { app, voc } = win;
const {
  jq,
  jq80,
} = win.lib;


const EX = {

  update: uiUtil.renderInto(function renderBodiesList() {
    const bodies = app.afTagBodies;
    if (!bodies.length) {
      return '<div class="empty-list"><p voc="no_list_items">';
    }
    const accum = jq('<ol>');
    bodies.forEach(function add(body) {
      const title = (body['dc:title'] || voc('empty_field'));
      const url = (body.source || '');
      jq80.skel(accum, '<li>',
        '=data-body=' + JSON.stringify(body),
        '<span class="title">', '$title', ':' + title,
        '=on-click=editBody',
        '<span class="buttons">', [
          '<a class="weblink" target="_blank">', '$web',
          '=href=' + url,
          '=title=' + url,
        ],
      );
    });
    return accum;
  }, '#current-bodies-area'),


};


export default EX;
