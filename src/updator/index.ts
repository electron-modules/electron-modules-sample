'use strict';

import url from 'url';
import path from 'path';
import semver from 'semver';
import { ipcMain, dialog } from 'electron';
import ElectronUpdator from 'electron-updator';
import { version as ElectronUpdatorVersion } from 'electron-updator/package';

console.log('version: %s', ElectronUpdatorVersion);

const { MacUpdator, EventType } = ElectronUpdator;

let feedUrlTag = 'asar1';
const feedUrlsMap = {
  asar1: 'http://localhost:8888/fixtures/data/asar1.json',
  asar2: 'http://localhost:8888/fixtures/data/asar2.json',
  package1: 'http://localhost:8888/fixtures/data/package1.json'
};
// npm run ss
function getFeedUrl() {
  return feedUrlsMap[feedUrlTag];
}

const currentVersion = '0.0.2';
const currentBuildNumber = 2;

module.exports = (app: any) => {
  // 1. 构造 options
  const options = {
    url: getFeedUrl(),
    logger: console, // logger
    productName: 'demo',
    responseFormatter: (res) => {
      return res;
    },
    needUpdate: (res) => {
      console.log('local version', currentVersion);
      console.log('local project version', currentBuildNumber);
      console.log('remote version', res.version);
      console.log('remote project version', res.project_version);
      return semver.gt(res.version, currentVersion)
        || res.project_version > currentBuildNumber;
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

  ipcMain.on('updator:checkForUpdates:available', () => {
    feedUrlTag = 'asar1';
    app.electronUpdator.checkForUpdates('auto');
  });

  ipcMain.on('updator:checkForUpdates:notAvailable', () => {
    feedUrlTag = 'asar2';
    app.electronUpdator.checkForUpdates('auto');
  });

  ipcMain.on('updator:downloadUpdate', () => {
    app.electronUpdator.downloadUpdate();
  });

  ipcMain.on('updator:quitAndInstall', () => {
    app.electronUpdator.quitAndInstall();
  });

  const mainUrl = url.format({
    pathname: path.join(__dirname, 'renderer', 'main.html'),
    protocol: 'file:',
  });
  const loadingUrl = url.format({
    pathname: path.join(__dirname, 'renderer', 'loading.html'),
    protocol: 'file:',
  });

  const window = app.windowManager.create({
    name: 'updator',
    loadingView: {
      url: loadingUrl,
    },
    browserWindow: {
      width: 600,
      height: 480,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: true,
        webviewTag: true,
        preload: path.join(__dirname, 'renderer', 'preload.js'),
      },
    },
  });
  window.loadURL(mainUrl);
};
