// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const { voc } = win;
const {
  jq80,
  unicode,
} = win.lib;


const EX = {

  appendBody(body) {
    const li = jq80.skel('#current-bodies-list', '<li>', '<p>', [
      '<span class="title">', '=on-click=editBody',
      '<span class="buttons">', [
        '<a class="weblink" target="_blank">',
        ':' + unicode.link,

        '<a class="edit">',
        '=on-click=editBody',
        ':' + unicode.memo,

        '<a class="delete">',
        '=on-click=deleteBody',
        ':' + unicode.wastebasket,
      ],
    ]);
    EX.setBodyData(li, body);
  },


  setBodyData(li, body) {
    const title = (body['dc:title'] || voc('empty_field'));
    const url = (body.source || '');
    li.find('.title').text(title);
    li.find('.weblink').attr({ href: url, title: url });
    return li;
  },





};


export default EX;
