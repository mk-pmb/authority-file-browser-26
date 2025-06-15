// -*- coding: utf-8, tab-width: 2 -*-

import { jq80 } from '../../dist/deps.min.mjs';

function orf(x) { return x || false; }
function ores(x) { return x || ''; }


const EX = {

  defaultSmallPadding: 2,


  makeCard(origOpt) {
    const opt = {
      pad: EX.defaultSmallPadding,
      ...origOpt,
    };
    const card = jq80('<div class="card">');
    if (opt.id) { card.attr('id', opt.id); }
    if (opt.pad) { card.addClass('p-' + opt.pad); }
    const cce = jq80('<div class="card-content">').appendTo(card);
    card[0].contentContainerElement = cce[0];
    card.addClass('bg-' + (opt.bgColorCls || 'light'));
    return card;
  },


  makeFormRow(origOpt) {
    const opt = { ...origOpt };
    if (opt.id) { card.attr('id', opt.id); }
    const row = jq80('<div>').addClass(['d-flex', 'flex-row',
      'align-items-center',
      'align-items-stretch',
    ]);
    if (!opt.firstRow) { row.addClass('mt-' + EX.defaultSmallPadding); }
    return row;
  },



};


export default EX;
