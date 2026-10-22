// -*- coding: utf-8, tab-width: 2 -*-

const EX = function uiWeblink(href) {
  const link = [
    '<a>',
    '.weblink',
    '=rel=noreferrer noopener nofollow',
    '=target=_blank',
    '=href=' + EX.fixupHref(href),
    '=title=' + href,
  ];
  return link;
};


Object.assign(EX, {

  fixupHref(orig) {
    if (!orig) { return 'about:blank'; }
    return orig;
  },



});


export default EX;
