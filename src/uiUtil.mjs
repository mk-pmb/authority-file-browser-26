// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const {
  jq,
  jq80,
} = win.lib;


const EX = {

  insertVocs(tgt) {
    jq(tgt).find('[voc]').each(function addVoc(idx, elem) {
      elem.append(jq80.mkTxt(win.voc(elem.getAttribute('voc'))));
      elem.removeAttribute('voc');
    });
  },

  renderInto(a, b) {
    if (a.call && b.substr) {
      const renderFunc = a;
      const dest = b;
      return () => EX.renderInto(dest, renderFunc());
    }
    const dest = jq(a);
    const html = jq(b || null)[0]?.outerHTML || '';
    if (dest[0].innerHTML === html) { return; }
    dest.html(html);
    EX.insertVocs(dest);
  },

};


export default EX;
