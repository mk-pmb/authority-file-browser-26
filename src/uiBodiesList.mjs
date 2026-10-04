// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const { app, voc } = win;
const {
  jq,
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
    const ul = added.parentNode;
    const cmp = app.lenientNaturalSortCollator;
    const before = Array.from(ul.children).find(function shouldRankAfter(li) {
      return (li !== added) && (cmp.compare(added.sortKey, li.sortKey) < 0);
    });
    if (before) { ul.insertBefore(added, before); }
    EX.listWasModified();
  },


  updateBodyFields(liMaybeRaw, body) {
    const li = (liMaybeRaw[0] || liMaybeRaw);
    li.bodyData = body;
    const { title, url, ...other } = body;
    li.sortKey = [title, url, JSON.stringify(other)].join('\n');
    li.refs.title.text(title || voc('empty_field'));
    li.refs.weblink.attr({ href: url, title: url });
  },


  listWasModified() {
    const ul = jq('#current-bodies-list')[0];
    EX.updateRanks(ul);
  },


  updateRanks(ul) {
    let li = ul.firstElementChild;
    if (!li) { return; }
    li.dataset.rankPrev = 'na';
    const natSort = app.lenientNaturalSortCollator;
    while (ul) {
      const nx = li.nextElementSibling;
      if (!nx) { break; }
      const s = natSort.compare(li.sortKey, nx.sortKey);
      let w = 'eq';
      if (s < 0) { w = 'ok'; }
      if (s > 0) { w = 'rv'; } // reverse
      li.dataset.rankNext = w;
      nx.dataset.rankPrev = w;
      li = nx;
    }
    li.dataset.rankNext = 'na';
  },


};


export default EX;
