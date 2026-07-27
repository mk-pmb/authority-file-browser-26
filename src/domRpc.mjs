// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const {
  getOwn,
} = win.lib;


const EX = function makeRpcAdapter() {
  let iframe = win;
  (function findParentWindow() {
    let parDoc;
    try { parDoc = win.parent.document; } catch { return; }
    if (parDoc === document) { return; }
    const allIframes = Array.from(parDoc.getElementsByTagName('iframe'));
    iframe = allIframes.find(ifr => (ifr.contentWindow === win));
  }());

  const ra = {
    config: {
      requestHandlers: {},
      fallbackRequestHandler: false,
    },

    async serveRequest(method, params) {
      return EX.serveRequestImpl(ra.config, 'widget', method, params);
    },

    async sendRequest(method, params) {
      return EX.serveRequestImpl(ra.hostSham, 'host', method, params);
    },
  };

  setTimeout(function init() {
    const ii = iframe.domRpcInit;
    if (!ii) { return setTimeout(init, 100); }
    ra.hostSham = ii.hostSham;
    ra.serveRequest(ii.method, ii.params);
  }, 1);

  win.domRpcRequest = ra.serveRequest;
  return ra;
};


Object.assign(EX, {

  sanitizeParams(orig) {
    if (orig === undefined) { return null; }
    let par = orig;
    // Resolve potential getters etc.:
    par = JSON.parse(JSON.stringify(par));
    return par;
  },


  async serveRequestImpl(cfg, side, method, origParams) {
    const params = EX.sanitizeParams(origParams);
    const hnd = (getOwn(cfg.requestHandlers, method)
      || cfg.fallbackRequestHandler);
    const trace = 'RPC sham ' + side;
    const details = { id: null, method, params };
    if (!hnd) { return console.error(trace, 'method not found:', method); }
    console.debug(trace, 'request:', method, params);
    try {
      const result = await hnd(params, details);
      console.debug(trace, 'result:', method, result);
      return result;
    } catch (err) {
      console.error(trace, 'failed:', method, err);
    }
  },


});


if (win.location.hostname === 'localhost') { win.parent.afb = win; }
export default EX;
