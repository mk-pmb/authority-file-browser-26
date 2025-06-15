'use strict';

require('p-fatal');

const fsPr = require('fs/promises');

const esbr = require('esbrowserify-pmb');
const repoPath = require('absdir')(module, '..');
const splitOnce = require('split-string-or-buffer-once-pmb');

const EX = async function rebundle() {
  let code = await esbr({
    srcAbs: repoPath('src/deps.bundle.js'),
    verbosity: 1,
    minify: false,
  });
  [code] = splitOnce.last('\n//# sourceMappingURL=data:', code);

  (function splitExpose(rgx) {
    const [before, semi, origExpo, origDef, after] = code.split(rgx);
    const expo = origExpo.replace(/\./, '_');
    code = 'let ' + expo + '; ' + before + semi + expo + origDef + after;

    let [, tmp] = splitOnce('{', origDef);
    if (!tmp.includes('\n')) { tmp = tmp.replace(/,/g, '\n'); }
    code += '\n\nconst EX = ' + expo + ';\n';
    ('\n' + tmp).replace(/\n\s*(\w+):/g,
      (m, k) => { code += 'export const ' + k + ' = EX.' + k + ';\n'; });
    code += 'window.AFB25_BUNDLED_EXPORTS = EX;\n';
  }(/(;\s*)(module\.exposeAsNamedExports)(\s*=\s*\{[\s!-z]+)(?=\};)/g));

  await EX.saveFile('dist/deps.min.mjs', code);
  // await EX.saveFile('dist/deps.sourcemap.json', sourceMap);
  console.info('+OK Success.');
};


Object.assign(EX, {

  async saveFile(subPath, data) {
    console.log('Gonna save', data.length, 'bytes to', subPath);
    await fsPr.writeFile(repoPath(subPath), data);
  },



});



setTimeout(EX, 1);
module.exports = EX;
