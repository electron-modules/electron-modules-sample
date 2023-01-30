'use strict';

const path = require('path');
const createDMG = require('electron-installer-dmg');

const targetPath = path.resolve(__dirname, '..', 'fixtures');
const appPath = path.resolve(targetPath, 'demo.app');

async function main() {
  return await createDMG({
    appPath,
    out: targetPath,
    name: 'demo',
    overwrite: true,
  });
}

main()
  .then(res => {
    console.log('\ndmg path: %s\n', res.dmgPath);
  })
  .catch((e) => {
    console.error(e);
  });
