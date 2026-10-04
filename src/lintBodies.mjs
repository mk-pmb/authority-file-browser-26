// -*- coding: utf-8, tab-width: 2 -*-

const EX = function lint(bodies) {
  EX.prep();
  bodies.forEach(EX.each);
  EX.done();
};


Object.assign(EX, {

  uniqKeys: [
    'title',
    'url',
  ],
  uniqFirstIndexes: null,


  prep() {
    EX.uniqFirstIndexes = new Map();
  },


  each(/* body, idx */) {
    const problems = [];
    return problems;
  },


  done() {
    EX.uniqFirstIndexes = null;
  },


});


export default EX;
