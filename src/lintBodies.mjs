// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const { voc } = win;
const {
  jq,
  makeUniqIdCounter,
  orderedMapExtended,
} = win.lib;


const EX = function lint() {
  const ctx = EX.prep();
  EX.checkUniqField(ctx, 'T', 'title');
  EX.checkUniqField(ctx, 'U', 'url');
  EX.done(ctx);
};


Object.assign(EX, {

  dupeAttrPrefix: 'data-dupe-',
  nextProblemId: makeUniqIdCounter(),


  prep() {
    EX.nextProblemId.reset(1);
    const ctx = {
      bodyLis: jq('#current-bodies-list > li').toArray(),
      checkDupe: orderedMapExtended.extraApi.setIfUndef.bind(new Map()),
      problemsList: Object.assign([], EX.problemsListApi),
    };
    ctx.bodyLis.forEach(function reset(bodyLi) {
      const prob = bodyLi.refs.problems[0];
      prob.innerText = '';
      prob.title = '';
    });
    return ctx;
  },


  problemsListApi: {

    add(errId, errMsg) {
      const problemsList = this;
      const liText = errId + ': ' + errMsg;
      if (!problemsList.includes(liText)) { problemsList.push(liText); }
      return { liText };
    },

    render() {
      const msgList = this;
      const area = jq('#problems-area');
      const arDs = area[0].dataset;
      arDs.nProblems = msgList.length;
      const domList = jq('#problems-list').html('');
      msgList.forEach(function add(msg) {
        const li = jq('<li>')[0];
        li.innerText = msg;
        li.innerHTML = li.innerHTML.replace(/^(\S+)/, '<span>$1</span>');
        domList.append(li);
      });
    },

  },


  checkUniqField(origCtx, complaintTypeLetter, uniqKey) {
    const dupeAttrName = EX.dupeAttrPrefix + uniqKey;
    const ctx = { ...origCtx, complaintTypeLetter, uniqKey };
    const fieldNameVoc = voc('field_name:' + uniqKey);
    const vocMissingField = voc('err_missing_field') + ' ' + fieldNameVoc;
    const vocDupeField = voc('err_dupeval_field') + ' ' + fieldNameVoc;
    ctx.bodyLis.forEach(function chk(bodyLi) {
      const val = bodyLi.bodyData[uniqKey];
      bodyLi.removeAttribute(dupeAttrName);
      if (!val) { return EX.complain(ctx, bodyLi, '0', vocMissingField); }
      const usedInLi = ctx.checkDupe(uniqKey + '=' + val, bodyLi);
      if (!usedInLi) { return; }
      let dupeGroupId = usedInLi.getAttribute(dupeAttrName);
      if (!dupeGroupId) {
        dupeGroupId = EX.nextProblemId();
        EX.complain(ctx, usedInLi, dupeGroupId, vocDupeField);
        usedInLi.setAttribute(dupeAttrName, dupeGroupId);
      }
      EX.complain(ctx, bodyLi, dupeGroupId, vocDupeField);
      bodyLi.setAttribute(dupeAttrName, dupeGroupId);
    });
  },


  complain(ctx, bodyLi, errIdSuff, errMsg) {
    const errId = ctx.complaintTypeLetter + errIdSuff;
    const { liText } = ctx.problemsList.add(errId, errMsg);
    const prob = bodyLi.refs.problems[0];
    prob.innerText += (prob.title && ', ') + errId;
    prob.title += (prob.title && '\n') + liText;
  },


  done(ctx) {
    ctx.problemsList.render();
  },


});


export default EX;
