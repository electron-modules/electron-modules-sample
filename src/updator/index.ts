'use strict';

import semver from 'semver';
import ElectronUpdator from 'electron-updator';
import { version as ElectronUpdatorVersion } from 'electron-updator/package';

console.log('version: %s', ElectronUpdatorVersion);

const { MacUpdator, EventType } = ElectronUpdator;

// npm run ss
function getFeedUrl() {
  return 'http://localhost:8888/fixtures/data/asar1.json';
}

const currentVersion = '0.0.1';
const currentBuildNumber = 100;

module.exports = (app: any) => {
  // 1. 构造 options
  const options = {
    url: getFeedUrl(),
    logger: console, // logger
    productName: 'demo',
    responseFormatter: (res) => {
      console.log('updator >> responseFormatter', res);
      return res;
    },
    needUpdate: (res) => {
      return semver.lt(res.version, currentVersion)
        || res.project_version <= currentBuildNumber;
    },
  };
  // 2. 初始化 updator 实例
  const electronUpdator = new MacUpdator(options);
  // 3. 绑定全局事件
  electronUpdator.on(EventType.UPDATE_DOWNLOADED, (...args) => {
    console.log('updator >> %s, args: %j', EventType.UPDATE_DOWNLOADED, args);
  });
  electronUpdator.on(EventType.CHECKING_FOR_UPDATE, (...args) => {
    console.log('updator >> %s, args: %j', EventType.CHECKING_FOR_UPDATE, args);
  });
  electronUpdator.on(EventType.UPDATE_AVAILABLE, (...args) => {
    console.log('updator >> %s, args: %j', EventType.UPDATE_AVAILABLE, args);
  });
  electronUpdator.on(EventType.UPDATE_NOT_AVAILABLE, (...args) => {
    console.log('updator >> %s, args: %j', EventType.UPDATE_NOT_AVAILABLE, args);
  });
  electronUpdator.on(EventType.ERROR, (...args) => {
    console.log('updator >> %s, args: %j', EventType.ERROR, args);
  });
  electronUpdator.on(EventType.UPDATE_DOWNLOAD_PROGRESS, (...args) => {
    console.log('updator >> %s, args: %j', EventType.UPDATE_DOWNLOAD_PROGRESS, args);
  });
  app.electronUpdator = electronUpdator;
  setTimeout(() => {
    app.electronUpdator.checkForUpdates();
    // app.electronUpdator.downloadUpdate();
    // app.electronUpdator.quitAndInstall();
  }, 1000);
};
