// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const { app, voc } = win;
const {
  jq80,
  unicode,
} = win.lib;

const { mapValues } = win.lib.lodash;


const EX = {


  addAnnoModelBody(amb) {
    const bodyData = mapValues(app.editorBodyFieldsMap, ambKey => amb[ambKey]);
    EX.addBody(bodyData);
  },


  addBody(bodyData) {
    const added = jq80.skel('#current-bodies-list', '<li>', '<p>', [
      '<span class="title">', '$title', '=on-click=editBody',
      '<span class="buttons">', [
        '<a class="weblink" target="_blank">',
        '$weblink',
        ':' + unicode.link,

        '<a class="edit">',
        '=on-click=editBody',
        ':' + unicode.memo,

        '<a class="delete">',
        '=on-click=deleteBody',
        ':' + unicode.wastebasket,
      ],
    ])[0];
    EX.updateBodyFields(added, bodyData);
  },


  updateBodyFields(liMaybeRaw, body) {
    const li = (liMaybeRaw[0] || liMaybeRaw);
    li.bodyData = body;
    const { title, url, ...other } = body;
    li.sortKey = [title, url, JSON.stringify(other)].join('\n');
    li.refs.title.text(title || voc('empty_field'));
    li.refs.weblink.attr({ href: url, title: url });
  },


};


export default EX;
