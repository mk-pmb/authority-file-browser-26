// -*- coding: utf-8, tab-width: 2 -*-
/* global window */

import plumbing from './namespaces/plumbingNS.mjs';
import renderBasicLayout from './dom/basicLayout.mjs';

const app = {
  plumbing,
};
window.afb25 = app;


async function init() {
  await Promise.all([
    renderBasicLayout(),
  ]);
  console.debug('AFB25 init completed.', app);
};





setTimeout(init, 1);

export default app;
