'use strict';

const { contextBridge, ipcRenderer } = require('electron');
const sqlite3 = require('@journeyapps/sqlcipher').verbose();

let dbInstance;
function initDB(dbFilePath) {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(dbFilePath);
  }
  return dbInstance;
}

contextBridge.exposeInMainWorld('_electron_bridge', {
  ipcRenderer: {
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    on: (channel, ...args) => ipcRenderer.on(channel, ...args),
  },
  // browserWin -> renderer 进程执行 sqlite 操作
  sqlExec: async (operator, ...args) => {
    // 转为 Promise
    operator = operator || 'run';
    return new Promise((resolve, reject) => {
      if (dbInstance) {
        dbInstance.serialize(() => {
          dbInstance[operator](...args, (err, result) => {
            if (err) {
              reject(err);
            }
            // 确保写入后再 resolve
            resolve(result);
          });
        });
      } else {
        reject('dbInstance is not existed');
      }
    });
  },
  sqlConnect: async () => {
    // 初始化
    dbInstance = initDB('./src/local-storage/sqlite/test-renderer.db');

    return 'ok';
  },
  sqlClose: async () => {
    dbInstance?.close();
    return 'ok';
  },
});
