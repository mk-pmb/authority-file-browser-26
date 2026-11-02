// -*- coding: utf-8, tab-width: 2 -*-
/*

What this hooks lib does different from hookrunner25a-pmb:

* Calling hooks here is fire-and-forget. It always schedules the subscribers
  for the future, and thus will never block or abort the current block that
  fired the hook, even if a subscriber happens to be a regular (not async)
  function that immediately throws.
* Hook subscribers cannot interfere with each other.
* The `minExpectedAudience` guard helps prevent hook rename accidents.

*/

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
    if (Array.isArray(func)) {
      func.forEach(f => list.add(f));
    } else {
      list.add(func);
    }
    if (!had) { allHooks.set(evName, list); }
  },

  run(evName, minExpectedAudience, ...args) {
    const list = allHooks.get(evName);
    if (!Number.isInteger(minExpectedAudience)) {
      throw new Error('hooks.run requires argument minExpectedAudience');
    }
    const size = (+(list || false).size || 0);
    if (size < minExpectedAudience) {
      console.warn('Unexpectedly few listeners for hook', evName,
        size, '<', minExpectedAudience);
    }
    if (!size) { return 0; }
    // console.debug('Running hooks for', evName, 'n=', list.size);
    list.forEach(func => setTimeout(func, 1, ...args));
    return size;
  },

};


export default EX;
