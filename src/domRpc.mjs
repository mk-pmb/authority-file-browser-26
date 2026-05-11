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
      return EX.serveRequest(ra.config, 'widget', method, params);
    },

    async sendRequest(method, params) {
      return EX.serveRequest(ra.hostSham, 'host', method, params);
    },
  };

  setTimeout(function init() {
    const ii = iframe.domRpcInit;
    delete iframe.domRpcInit;
    ra.hostSham = ii.hostSham;
    ra.serveRequest(ii.method, ii.params);
  }, 1);

  win.domRpcRequest = ra.serveRequest;
  return ra;
};


Object.assign(EX, {

  async serveRequest(cfg, sideName, mtd, par) {
    const hnd = (getOwn(cfg.requestHandlers, mtd)
      || cfg.fallbackRequestHandler);
    const details = { id: null };
    if (hnd) { return hnd(par, mtd, details); }
    console.error('RPC sham ' + sideName + ' method not found:', mtd, par);
  },


});


export default EX;
