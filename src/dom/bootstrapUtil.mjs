// -*- coding: utf-8, tab-width: 2 -*-

import jq80 from 'jq80-pmb';

function orf(x) { return x || false; }
function ores(x) { return x || ''; }


const EX = {

  defaultSmallPadding: 2,


  makeCard(origOpt) {
    const opt = orf(origOpt);
    const card = jq80('<div class="card">');
    card.addClass('p-' + (opt.pad || EX.defaultSmallPadding));
    const cce = jq80('<div class="card-content">').appendTo(card);
    card.addClass('bg-' + (opt.bgColorCls || 'light'));
    card.contentContainerElement = cce;
    return card;
  },


  makeFormRow(origOpt) {
    const opt = orf(origOpt);
    const row = jq80('<div>').addClass(['d-flex', 'flex-row',
      'align-items-center',
      ores(opt.cls),
    ]);
    return row;
  },



};


export default EX;
