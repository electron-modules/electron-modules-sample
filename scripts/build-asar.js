'use strict';

const path = require('path');
const asar = require('@electron/asar');

const targetPath = path.resolve(__dirname, '..', 'fixtures');

const srcPath = path.join(targetPath, 'asar_dir');
const asarPath = path.join(targetPath, 'demo.asar');

async function main() {
  return await asar.createPackage(srcPath, asarPath);
}

main()
  .then(res => {
    console.log('\nasar path: %s\n', res.dmgPath);
  })
  .catch((e) => {
    console.error(e);
  });
