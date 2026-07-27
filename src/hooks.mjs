// -*- coding: utf-8, tab-width: 2 -*-

const allHooks = new Map();

const EX = {

  all() { return allHooks; },

  add(evName, func) {
    if (!func) {
      if (String(evName) === '[object Object]') {
        Object.entries(evName).forEach(([k, v]) => EX.add(k, v));
      }
      return;
    }

    const had = allHooks.get(evName);
    const list = (had || new Set());
    list.add(func);
    if (!had) { allHooks.set(evName, list); }
  },

  run(evName, ...args) {
    const list = allHooks.get(evName);
    if (!list) {
      console.warn('No listeners for hook', evName);
      return 0;
    }
    // console.debug('Running hooks for', evName, 'n=', list.size);
    list.forEach(func => setTimeout(func, 1, ...args));
    return list.size;
  },

};


export default EX;
