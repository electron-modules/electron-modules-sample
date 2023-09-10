'use strict';

module.exports = async function () {
  const config = {
    appId: 'electron.modules.sample',
    copyright: 'ElectronModules',
    productName: 'ElectronModules',
    asar: true,
    npmRebuild: false,
    directories: {
      output: 'dist/'
    },
    dmg: {
      'writeUpdateInfo': true
    }
  };  
  return config;
};
