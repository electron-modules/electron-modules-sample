'use strict';

module.exports = async function () {
  const config = {
    appId: 'electron.modules.sample',
    copyright: 'ElectronModules',
    productName: 'ElectronModules',
    forceCodeSigning: true,
    asar: true,
    npmRebuild: false,
    directories: {
      output: 'dist/'
    },
    linux: {
      target: 'deb',
    },
    dmg: {
      writeUpdateInfo: false,
    },
    mac: {
      target: [
        {
          target: 'dmg',
          arch: ['x64', 'arm64'],
        },
      ],
      publish: [
        {
          provider: 'github',
        },
      ],
    },
  };  
  return config;
};
