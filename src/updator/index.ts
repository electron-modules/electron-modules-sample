'use strict';

import crypto from 'crypto';
import ElectronUpdator from 'electron-updator';
import { version as ElectronUpdatorVersion } from 'electron-updator/package';

console.log('version: %s', ElectronUpdatorVersion);

const { MacUpdator, EventType } = ElectronUpdator;

module.exports = (app: any) => {
  // 1. 构造 options
  const verify = crypto.createVerify('SHA256');
  const options = {
    logger: console, // logger
    verify, // verify
    verifyPublicKey: '',
    requestFeedUrl: '',
    productName: '-',
    responseFormatter: (res) => {
      console.log(res);
    },
  };
  // 2. 初始化 updator 实例
  const electronUpdator = new MacUpdator(options);
  // 3. 绑定全局事件
  electronUpdator.on(EventType.UpdateDownloaded, (needRemind) => {
    console.log(EventType.UpdateDownloaded);
    console.log(needRemind);
  });
  electronUpdator.on(EventType.CheckingForUpdate, (needRemind) => {
    console.log(EventType.CheckingForUpdate);
    console.log(needRemind);
  });
  electronUpdator.on(EventType.Error, (needRemind) => {
    console.log(EventType.Error);
    console.log(needRemind);
  });
  electronUpdator.on(EventType.UpdateDownloadProgress, (data) => {
    console.log(EventType.UpdateDownloadProgress);
  });
  electronUpdator.on(EventType.UpdateNotAvailable, () => {
    console.log(EventType.UpdateNotAvailable);
  });
  electronUpdator.on(EventType.UpdateClose, () => {
    console.log(EventType.UpdateClose);
  });
  app.electronUpdator = electronUpdator;
};
