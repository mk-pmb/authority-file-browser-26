// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const {
  getOwn,
} = win.lib;

const EX = function insertJsonVarSlots(orig) {
  let data = orig;
  let limit = 5;
  let again = true;

  function ins(m, k) {
    again = true;
    let v = getOwn(data, m && k);
    if (v === '') { return ''; }
    if (v === undefined) { return ''; }
    if (v === null) { return ''; }
    v = JSON.stringify(v);
    if (v.startsWith('"')) { v = v.slice(1, -1); }
    return v;
  }

  while (again && (limit >= 1)) {
    limit -= 1;
    let json = JSON.stringify(data);
    again = false;
    json = json.replace(/\v<(\w+)>/g, ins);
    data = JSON.parse(json);
  }
  return data;
};


export default EX;
