// -*- coding: utf-8, tab-width: 2 -*-
/* global window */

import plumbing from './namespaces/plumbingNS.mjs';
import renderBaseLayout from './dom/layout.base.mjs';

const app = {
  plumbing,
};
window.afb25 = app;


async function init() {
  await Promise.all([
    renderBaseLayout(),
  ]);
  console.debug('AFB25 init completed.', app);
};





setTimeout(init, 1);

export default app;
