// -*- coding: utf-8, tab-width: 2 -*-

import jq80 from 'jq80-pmb';

import plumbing from '../namespaces/plumbingNS.mjs';

import bsUtil from './bootstrapUtil.mjs';


const EX = async function renderBasicLayout() {
  const container = jq80('body');
  container.html('');
  const queryBar = EX.renderQueryBar(container);
  plumbing({ basicLayout: {
    queryBar,
  } });
};


Object.assign(EX, {

  renderQueryBar(parent) {
    const qbar = jq80.skel(parent, '<div>', '#query-bar',
      '.sticky-top',
      '.p-' + bsUtil.defaultSmallPadding,
      '.bg-white',
      bsUtil.makeCard({ bgColorCls: 'light' }), [
        '$card',
        bsUtil.makeFormRow({ id: 'query-row' }), [
        ],
      ],
    );
    return qbar;
  },


});


export default EX;
