// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const {
  getOwn,
} = win.lib;


const EX = function makeRpcAdapter() {
  const iframe = Array.from(win.parent.document.getElementsByTagName(
    'iframe')).find(ifr => (ifr.contentWindow === win));
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


win.parent.afb = win;
export default EX;
