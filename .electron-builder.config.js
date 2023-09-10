'use strict';

module.exports = async function () {
  const config = {
    appId: 'electron.modules.sample',
    copyright: 'ElectronModules',
    productName: 'ElectronModules',
    forceCodeSigning: false,
    asar: true,
    directories: {
      output: 'dist/'
    },
    linux: {
      target: 'deb',
    },
    nsis: {
      differentialPackage: false,
      publish: [
        {
          provider: 'github',
        },
      ],
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
      icon: './assets/icon.png',
    },
  };  
  return config;
};
