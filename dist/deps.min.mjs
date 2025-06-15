let module_exposeAsNamedExports; (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var hop = Object.prototype.hasOwnProperty;
function getown(o, p, d) { return (o && hop.call(o, p) ? o[p] : d); }
getown.voc = function (o, p) { return getown(o, p, p); };
module.exports = getown;

},{}],2:[function(require,module,exports){
/* -*- coding: UTF-8, tab-width: 2 -*- */
/* global window: true, define: true */
'use strict';
(function namespace() {
  const win = ((typeof window === 'object') && window) || false;

  function fail(e) { throw new Error(e); }
  function isStr(x, no) { return (((typeof x) === 'string') || no); }
  function ores(x) { return x || ''; }
  function orf(x) { return x || false; }

  // eslint-disable-next-line no-param-reassign
  function setProp(d, k, v) { d[k] = v; }

  const EX = function jq80(arg) {
    if (!arg) { return fail('jq80-pmb: Argument is required'); }
    const j = (arg.jquery ? arg :  EX.jq(arg));
    Object.assign(j, EX.elemApi);
    return j;
  };
  EX.jq = ((win && win.jQuery)
    || fail.bind(null, 'Replace [jq80-pmb].jq with an actual jQuery!'));

  function mkTxt(t) { return win.document.createTextNode(ores(t)); }

  Object.assign(EX, {

    setProp,
    mkTxt,


    cce(x) {
      const k = 'contentContainerElement';
      if (!x) { return false; }
      const c = x[k] || orf(x[0])[k];
      return (c && EX.jq(c)) || x;
    },


    skel(parent, rootTagSpec, ...topLevelTodo) {
      // This is an inferior remake of dom80-pmb's mighty `skel` function.
      const rootTag = EX(rootTagSpec);
      if (parent) { rootTag.appendTo(parent); }
      const ctx = rootTag[0];
      EX.skelDive(ctx, rootTag, topLevelTodo);
      return rootTag;
    },


    skelDive(origCtx, tag, todo) {
      const tr = 'jq80 skel: ';
      let ctx = origCtx;
      if (ctx === 0) { ctx = tag[0]; }
      todo.forEach(function eachTodoItem(task) {
        if (!task) { return; }
        if (task.appendTo) { return task.appendTo(tag); }
        if (Array.isArray(task)) {
          return EX.skelDive(ctx, EX.cce(tag.children().last()), task);
        }
        if (!isStr(task)) { fail(tr + 'Unsupported task: ' + task); }
        const c1 = task.slice(0, 1);
        const s1 = task.slice(1);
        if (c1 === '.') { return tag.addClass(s1.split(/\s|\./)); }
        if (c1 === '$') {
          if (!ctx.refs) { ctx.refs = {}; }
          ctx.refs[s1] = tag;
          return;
        }
        if (c1 === '=') {
          const [, k, eq, v] = s1.split(/^([ -;@-~]*)(=|$)/);
          return tag.attr(k, eq ? v : true);
        }
        if (c1 === ':') { return s1 && tag.append(EX.mkTxt(s1)); }
        if ((c1 === '<') && s1) { return EX(task).appendTo(tag); }
        fail(tr + 'Unsupported task: ' + task);
      });
      return tag;
    },


  });



  EX.elemApi = {
    cce() { return EX.cce(this); },
    refs() { return orf(this[0].refs); },
  };













  (function unifiedExport() {
    const d = ((typeof define === 'function') && define);
    const m = ((typeof module === 'object') && module);
    if (d && d.amd) { d(function f() { return EX; }); }
    if (m && m.exports) { m.exports = EX; }
    if (d || m) { return; }
    if (win) { win.jq80 = EX; }
  }());
}());

},{}],3:[function(require,module,exports){
/* -*- tab-width: 2 -*- */
'use strict';

const getOwn = require('getown');


function vari(v) { return String.fromCodePoint(0xFE00 + (v - 1)); } /*
  Unicode variation selectors 1..16 = U+FE00..U+FE0F.
  The subtraction in parens ensures Number type if v isn't. */

const u = {
  axe: '🪓',
  bamumLetterPhaseDYen: '𖤍',
  bamumLetterPhaseENgkaami: '𖦹',
  bomb: '💣',
  broom: '🧹',
  carpentrySaw: '🪚',
  chains: '⛓',
  chair: '🪑',
  cookie: '🍪',
  crossMark: '❌',
  electricLightBulb: '💡',
  fire: '🔥',
  fish: '🐟',
  floppyDisk: '💾',
  gear: '⚙',
  globeWithMeridians: '🌐',
  hammerAndWrench: '🛠',
  hourglassWithFlowingSand: '⏳',
  hundredPointsSymbol: '💯',
  javaneseLeftRerenggan: '꧁',
  javaneseRightRerenggan: '꧂',
  keyboard: '⌨',
  label: '🏷',
  leftPointingMagnifyingGlass: '🔍',
  link: '🔗',
  lock: '🔒',
  memo: '📝',
  multipleMusicalNotes: '🎶',
  nameBadge: '📛',
  noEntry: '⛔',
  noEntrySign: '🚫',
  northEastArrow: '↗',
  octagonalSign: '🛑',
  openLock: '🔓',
  partyPopper: '🎉',
  policeOfficer: '👮',
  railwayTrack: '🛤',
  rainbow: '🌈',
  rocket: '🚀',
  scales: '⚖',
  shield: '🛡',
  shootingStar: '🌠',
  shrug: '🤷',
  sparkles: '✨',
  stethoscope: '🩺',
  thumbsDownSign: '👎',
  thumbsUpSign: '👍',
  trophy: '🏆',
  warningSign: '⚠',
  wastebasket: '🗑',
  whiteHeavyCheckMark: '✅',
  wood: '🪵',
};

const emoji = {
  hammerAndWrench: u.hammerAndWrench + vari(16),
  pencil: u.memo,
  scalesOfJustice: u.scales + vari(16),
  unlock: u.openLock,
};


const customAdditionsAndPlaceholders = {
  chainsaw: u.carpentrySaw, // actual chainsaw isn't in yet :-(
  swirl: u.bamumLetterPhaseENgkaami,
  trash: u.wastebasket,
  wireframeAngel: u.bamumLetterPhaseDYen,
};


const EX = function loopkup(name) {
  const c = (getOwn(emoji, name) || getOwn(u, name)
    || getOwn(customAdditionsAndPlaceholders, name));
  if (c) { return c; }
  throw new Error('Attempt to use undefined emoji name: ' + name);
};

Object.assign(EX, {
  customAdditionsAndPlaceholders,
  emoji,
  unicode: u,
  vari,
});





module.exports = EX;

},{"getown":1}],4:[function(require,module,exports){
'use strict';

/* global window: true */
var _require = require('unicode-emoji-2503-pmb'),
  unicode = _require.unicode,
  emoji = _require.emoji;
module_exposeAsNamedExports = {
  emoji: emoji,
  getOwn: require('getown'),
  jq: window.jQuery,
  jq80: require('jq80-pmb'),
  unicode: unicode
};

},{"getown":1,"jq80-pmb":2,"unicode-emoji-2503-pmb":3}]},{},[4])

const EX = module_exposeAsNamedExports;
export const emoji = EX.emoji;
export const getOwn = EX.getOwn;
export const jq = EX.jq;
export const jq80 = EX.jq80;
export const unicode = EX.unicode;
window.AFB25_BUNDLED_EXPORTS = EX;
