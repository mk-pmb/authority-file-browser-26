// -*- coding: utf-8, tab-width: 2 -*-

import {
  jq80,
  unicode,
} from '../../dist/deps.min.mjs';

import plumbing from '../namespaces/plumbingNS.mjs';

import bsUtil from './util.bootstrap.mjs';



const EX = async function renderBasicLayout() {
  const container = jq80.skel(jq80('body').html(''), '<form>',
    '=method=get',
    '=action=nope://',
    EX.renderQueryBar(), ['$queryBar'],
  );
  plumbing({ container });
};


Object.assign(EX, {

  searchNowIcon: unicode.leftPointingMagnifyingGlass,


  renderQueryBar() {
    const qbar = jq80.skel(null, '<div>', '=id=query-bar',
      '.sticky-top',
      '.p-' + bsUtil.defaultSmallPadding,
      '.bg-white',
      bsUtil.makeCard({ bgColorCls: 'light', id: 'query-bar-card' }), [
        bsUtil.makeFormRow({ id: 'query-row', firstRow: true }), [
          '<input type="text">', ['$keywordInput',
            '.form-control',
            '.w-auto',
            '.flex-grow-1',
            '=placeholder=Keyword',
          ],
          '<input type="submit">', [
            '=value=' + EX.searchNowIcon,
            '=title=Search now',
            '.form-control',
            '.search-now-button',
            '.w-auto',
            '.mx-1',
            '.btn btn-outline-primary',
            '=aria-label=Search now (magnifying glass icon)',
          ],
        ],
        bsUtil.makeFormRow({ id: 'options-summary-row' }), [
          EX.makeTypeToSearchCard(),
        ],
      ],
    );
    return qbar;
  },


  makeTypeToSearchCard() {
    const forId = 'cfgTypeToSearch';
    const card = bsUtil.makeCard({ id: 'cfg-autosearch-card', pad: '' });
    jq80.skel(null, card, '.me-2', ['.p-1.px-2',
      '<div>', [
        '.form-check',
        '.form-switch',
        '.cfg-autosearch',
        '<label>', [
          '.form-check-label',
          '=for=' + forId,
          '=title=Search as you type',
          '<input type="checkbox" checked>', [
            '.form-check-input',
            '=id=' + forId,
            '<span>', [': ' + unicode.keyboard + '=' + EX.searchNowIcon],
          ],
        ],
      ],
    ]);
    return card;
  },


});


export default EX;
