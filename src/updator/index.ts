'use strict';

import crypto from 'crypto';
import ElectronUpdator from 'electron-updator';

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
    console.log(needRemind);
  });
  electronUpdator.on(EventType.CheckingForUpdate, (needRemind) => {
    console.log(needRemind);
  });
  app.electronUpdator.on(EventType.Error, (needRemind) => {
    console.log(needRemind);
  });
  electronUpdator.on(EventType.UpdateDownloadProgress, (data) => {
  });
  electronUpdator.on(EventType.UpdateNotAvailable, () => {
  });
  electronUpdator.on(EventType.UpdateClose, () => {
  });
  app.electronUpdator = electronUpdator;
};
